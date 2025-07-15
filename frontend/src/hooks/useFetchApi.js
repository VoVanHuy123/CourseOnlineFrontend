import axios from "axios";
import { useContext, useState } from "react";
import { BASE_URL } from "../services/api";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const useFetchApi = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useContext(AuthContext); // lấy token từ context

  const fetchApi = async ({ method = "GET", url, token=null, data = null, params = null, }) => {
    setLoading(true);

    const headers = {
      Authorization: `Bearer ${token || localStorage.getItem("token")}`,
    };

    // Nếu là FormData thì KHÔNG gán Content‑Type
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
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
      }
      const res = await api(config)
        

      response.status = res.status;
      response.data = res.data;
    } catch (err) {
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
