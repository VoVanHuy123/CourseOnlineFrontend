import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../services/api";
import api from "../services/api";

const useFetchApi = () => {
  const [loading, setLoading] = useState(false);

  const fetchApi = async ({ method = "GET", url, token, data = null, params = null }) => {
    setLoading(true);

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
