import { useState } from "react";
// import PropTypes from "prop-types";

import closeModalIcon from "../../assets/closeModal-icon.png";
import dropModalIcon from "../../assets/dropModal-icon.png";
import styles from "./shareMod.module.css";
import { shareDashboard, generateShareLink } from "../../services/api";

export default function ShareMod({ closeModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(""); // Manage email input
  const [accessType, setAccessType] = useState("view"); // Default access is "view"
  const [generatedLink, setGeneratedLink] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleShare = async () => {
    try {
      const response = await shareDashboard(email, accessType);
      if (response.status === 200) {
        alert("Dashboard shared successfully!");
        closeModal();
      } else {
        alert(response.data.message || "Failed to share dashboard.");
      }
    } catch (error) {
      console.error("Error sharing dashboard:", error);
      alert("An error occurred while sharing the dashboard.");
    }
  };

  const handleGenerateLink = async () => {
    try {
      const response = await generateShareLink(accessType);
      if (response.status === 200) {
        setGeneratedLink(response.data.link);

        navigator.clipboard.writeText(response.data.link).then(() => {
          alert("Link copied to clipboard!");
        });
      } else {
        alert(response.data.message || "Failed to generate link.");
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("An error occurred while generating the share link.");
    }
  };

  return (
    <div className={styles.shareModContainer}>
      <div className={styles.closeIcon}>
        <img src={closeModalIcon} onClick={closeModal} alt="" />
      </div>
      <div className={styles.shareModContent}>
        <div className={styles.inviteContainer}>
          <div className={styles.accessContainer}>
            <div className={styles.inviteTxt}>Invite By Email</div>
            <div className={styles.dropDownContainer}>
              <div className={styles.menuHeading} onClick={toggleMenu}>
                {/* <div>Edit</div> */}
                {accessType.charAt(0).toUpperCase() + accessType.slice(1)}
                <span>
                  <img src={dropModalIcon} alt="" />
                </span>
              </div>
              <div
                className={styles.menuItem}
                style={{ display: isOpen ? "block" : "none" }}
              >
                <li onClick={() => setAccessType("edit")}> Edit</li>
                <li onClick={() => setAccessType("view")}>View </li>
              </div>
            </div>
          </div>
          <div className={styles.emailContainer}>
            <input
              type="email"
              placeholder="Enter email Id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className={styles.inviteBtn} onClick={handleShare}>
            Send Invite
          </button>
        </div>

        <div className={styles.linkContainer}>
          <div className={styles.linkTxt}>Invite By Link</div>
          <button className={styles.inviteBtn2} onClick={handleGenerateLink}>
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
