import axios from "axios";
import { useContext, useState } from "react";
import { BASE_URL } from "../services/api";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const useFetchApi = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext); // lấy token từ context

  const fetchApi = async ({
    method = "GET",
    url,
    token = null,
    data = null,
    params = null,
  }) => {
    setLoading(true);

    const headers = {
      Authorization: `Bearer ${token || localStorage.getItem("token")}`,
    };

    // Nếu là FormData thì KHÔNG gán Content‑Type
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    } else {
      headers["Content-Type"] = "multipart/form-data";
    }

    let response = {
      status: null,
      data: null,
      error: null,
    };

    try {
      const config = {
        method,
        url,
        data,
        params,
        headers,
        //     headers:{
        //   Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        // }
      };
      // console.log("API Request Config:", config);
      const res = await api(config);
      // console.log("API Response:", res);

      response.status = res.status;
      response.data = res.data;
    } catch (err) {
      console.error("API Error:", err);
      console.error("API Error Response:", err.response);
      response.status = err.response?.status || 500;
      response.error = err.response?.data || err.message;
    } finally {
      setLoading(false);
    }

    return response;
  };

  return { fetchApi, loading };
};

export default useFetchApi;
