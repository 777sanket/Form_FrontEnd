import Bground from "../../components/Background/bg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import google from "../../assets/google.png";
import styles from "./login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res.status === 200) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const fontstyle = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    marginBottom: "5px",
  };
  return (
    <div className={styles.loginContainer}>
      <div className={styles.bgcommon}>
        <Bground />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.formMain}>
          <label htmlFor="" style={fontstyle}>
            Email
          </label>
          <input
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={styles.email}
            value={formData.email}
            name="email"
            placeholder="Enter Your Email"
            required
          />
          <label htmlFor="" style={fontstyle}>
            Password
          </label>
          <input
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
            name="password"
            className={styles.email}
            placeholder="************"
            required
          />
          <button type="submit" className={styles.logBtn}>
            Log In
          </button>
          <div
            style={{
              alignSelf: "center",
              fontFamily: "Poppins, sans-serif",
              marginBottom: "10px",
              fontSize: "12px",
            }}
          >
            OR
          </div>
          <button type="submit" className={styles.googleBtn} disabled={true}>
            <img src={google} alt="" />
            <span>Sign in with Google</span>
          </button>
          <div className={styles.signup}>
            Don&apos;t have an account? <Link to="/signup">Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
