import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { register } from "../../services/api";
import { Link } from "react-router-dom";
import google from "../../assets/google.png";
import Bground from "../../components/Background/bg";
import styles from "./signUp.module.css";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("enter same  password in both fields");
      return;
    }

    const dataToSend = { ...formData };
    delete dataToSend.confirmPassword;

    try {
      setError("");
      const res = await register(dataToSend);
      if (res.status === 200) {
        // alert("User created successfully");
        toast.success("User created successfully");
        navigate("/login");
      } else if (res.status === 400) {
        toast.error("User already exist");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  const fontstyle = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    marginBottom: "5px",
  };

  const fontstyle2 = {
    fontFamily: "Poppins, sans-serif",
    fontSize: "14px",
    marginBottom: "5px",
    color: error ? "#FF272780" : "#ffffff",
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.bgcommon}>
        <Bground />
      </div>
      <div className={styles.formContainer}>
        <form onSubmit={handleRegister} className={styles.formMain}>
          <label htmlFor="" style={fontstyle}>
            Username
          </label>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            value={formData.name}
            name="name"
            className={styles.inpField}
            placeholder="Enter Your Username"
          />
          <label htmlFor="" style={fontstyle}>
            Email
          </label>
          <input
            type="email"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            value={formData.email}
            name="email"
            className={styles.inpField}
            placeholder="Enter Your Email"
          />
          <label htmlFor="" style={fontstyle}>
            Password
          </label>
          <input
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            value={formData.password}
            name="password"
            className={styles.inpField}
            placeholder="************"
          />
          <label htmlFor="" style={fontstyle2}>
            Confirm Password
          </label>
          <input
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.name]: e.target.value })
            }
            value={formData.confirmPassword}
            name="confirmPassword"
            className={error ? styles.confirmPassErr : styles.confirmPass}
            placeholder="************"
          />
          <div className={styles.error}>
            {error && <div style={{ color: "#522224" }}>{error}</div>}
          </div>
          {/* {error && <div className={styles.error}>{error}</div>} */}
          <button type="submit" className={styles.signInBtn}>
            Sing Up
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
            <span>Sign Up with Google</span>
          </button>
          <div className={styles.log_in}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
