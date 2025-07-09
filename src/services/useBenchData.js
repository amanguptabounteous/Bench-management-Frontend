import { useEffect, useState } from "react";
import { fetchBenchDetails } from "../services/benchService";
import { useNavigate } from "react-router-dom";

export default function useBenchData() {
  const [benchData, setBenchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      fetchBenchDetails()
        .then((data) => {
          setBenchData(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          if (error.message.includes("401")) {
            localStorage.removeItem("token");
            navigate("/signin");
          }
        });
    }
  }, [navigate]);

  return { benchData, loading };
}