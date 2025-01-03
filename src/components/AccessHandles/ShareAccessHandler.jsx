import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { accessSharedDashboard } from "../../services/api";

const ShareAccessHandler = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  console.log("token", token);

  useEffect(() => {
    const handleAccess = async () => {
      try {
        const response = await accessSharedDashboard(token);
        console.log("response", response);
        if (response.status === 200) {
          alert("Access granted! Dashboard added to your account.");
          navigate("/dashboard");
        } else if (response.status === 401) {
          alert("Login and Paste Link Again.");
          navigate("/login");
        } else if (response.status === 400) {
          alert("Dashboard already exists in your account.");
          navigate("/login");
        } else {
          alert(response.data.message || "Failed to access dashboard.");
        }
      } catch (error) {
        console.error("Error accessing shared dashboard:", error);
        alert("An error occurred while accessing the shared dashboard.");
      }
    };

    handleAccess();
  }, [token, navigate]);

  return <div>Processing shared dashboard access...</div>;
};

export default ShareAccessHandler;
