import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./menu.module.css";
import { Link } from "react-router-dom";
import { logout } from "../../services/api";

export default function Menu({
  currentFolder,
  setCurrentFolder,
  setHighlightedFolder,
  sharedDashboards,
  switchDashboard,
  currentDashboardOwner,
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logout();
      if (res.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.success("Logged out successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // const handleBackClick = () => {
  //   if (currentFolder) {
  //     setCurrentFolder(null); // Reset to Main Directory
  //     setHighlightedFolder("");
  //   }
  // };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <ul className={styles.dropDown}>
        <div className={styles.menuHeading} onClick={toggleMenu}>
          <div>Workspace</div>
          <svg
            id="drop_Icon"
            className={`${
              isOpen ? styles.rotatedIcon : styles.rotatedIconRight
            }`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 5L5 1L9 5"
              stroke="currentColor"
              strokeOpacity="0.92"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          className={styles.menuItems}
          style={{ display: isOpen ? "block" : "none" }}
        >
          <li
            // onClick={() => switchDashboard("my")}
            // style={{ cursor: "pointer" }}
            onClick={() => {
              switchDashboard("my");
              setCurrentFolder(null); // Reset to Main Directory
              setHighlightedFolder(""); // Clear highlighted folder
            }}
            className={currentDashboardOwner === "my" ? styles.active : ""}
          >
            MY Dashboard
          </li>
          {/* <li
            style={{
              borderTop: "1px solid var(--border-color)",
              width: "97%",
            }}
          >
            shared Dasboard
          </li> */}
          {sharedDashboards.length > 0 &&
            sharedDashboards.map((shared, index) => (
              <li
                key={index}
                onClick={() => {
                  switchDashboard(shared.email);
                  setCurrentFolder(null); // Reset to Main Directory
                  setHighlightedFolder(""); // Clear highlighted folder
                }}
                className={
                  currentDashboardOwner === shared.email ? styles.active : ""
                }
                style={{
                  borderTop: "1px solid var(--border-color)",
                  width: "97%",
                }}
              >
                {shared.sharedName} &apos;s Dashboard
              </li>
            ))}
          {/* // ) : (
          //   <li className={styles.disabledMenuItem}>No Shared Dashboards</li>
          // )} */}
          <Link
            to="/settings"
            style={{ textDecoration: "none", color: "var(--menu-textColor)" }}
          >
            <li
              style={{
                borderTop: "1px solid var(--border-color)",
                borderBottom: "1px solid var(--border-color)",
                width: "97%",
              }}
            >
              Settings
            </li>
          </Link>
          <li onClick={handleLogout}>Logout</li>
        </div>
      </ul>
    </div>
  );
}
