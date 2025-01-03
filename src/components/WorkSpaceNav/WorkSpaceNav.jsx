import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getWorkspaceData, editFormName } from "../../services/workSpaceApi";
import ThemeChanger from "../ThemeChanger/ThemeChanger";

import closeBtn from "../../assets/closeModal-icon.png";

import styles from "./workSpaceNav.module.css";
// import { set } from "mongoose";

export default function WorkSpaceNav({
  formId,
  setBubbles,
  showFlowView,
  handleSaveFlow,
  handleGenerateShareLink,
  setFetchedBubbles,
}) {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location
  const isResponsePage = location.pathname.includes("/response");

  const [activeButton, setActiveButton] = useState(null);
  const [formName, setFormName] = useState(""); // State for form name
  const [isEditing, setIsEditing] = useState(false); // State to track editing
  const [isSaveDisabled, setIsSaveDisabled] = useState(false); // Disable save button

  const handleClick = (buttonId) => {
    setActiveButton(buttonId);

    if (buttonId === 1) {
      showFlowView(); // Trigger fetching flow data
      handleFetchFlow(); // Trigger fetching flow data
    } else if (buttonId === 2) {
      setBubbles([]); // Clear bubbles when switching to response view
      console.log("Response view selected."); // Placeholder for response-related logic
      navigate(`/response/${formId}`); // Redirect to response page
    }
  };

  const handleFetchFlow = async () => {
    try {
      const workspaceData = await getWorkspaceData(formId);
      console.log("Workspace data:", workspaceData);

      // Transform backend data into frontend format
      const transformedBubbles = workspaceData.formElements.map((element) => ({
        id: element._id, // Map `_id` to `id`
        type:
          element.type === "input"
            ? `input-${element.inputType}` // Convert inputType to input-*
            : `label-${element.labelType.toLowerCase()}`, // Convert labelType to label-*
        content: element.content, // Retain content
      }));
      setFetchedBubbles(transformedBubbles); // Update state
      setBubbles(transformedBubbles); // Update state
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  // Edit form name
  const handleFormNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleFormNameSubmit = async () => {
    if (isEditing) {
      try {
        await editFormName(formId, formName);
        alert("Form name updated successfully!");
      } catch (error) {
        console.error("Error updating form name:", error);
        alert("Failed to update form name.");
      } finally {
        setIsEditing(false); // Exit editing mode after submission
      }
    }
  };

  const handleSaveClick = async () => {
    setIsSaveDisabled(true); // Disable save button
    await handleSaveFlow(); // Perform save operation
  };

  return (
    <div className={styles.wSpaceNavContainer}>
      {!isResponsePage && (
        <input
          type="text"
          className={styles.formNamefield}
          placeholder="Enter Form Name"
          value={formName}
          onChange={handleFormNameChange}
          onFocus={() => setIsEditing(true)} // Set editing mode when focused
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFormNameSubmit(); // Update on Enter key
            }
          }}
        />
      )}

      <div className={styles.controlBtns}>
        <button
          className={`button ${
            activeButton === 1 ? styles.active1 : styles.flowBtn
          }`}
          onClick={() => handleClick(1)}
        >
          Flow
        </button>
        <button
          className={`button ${
            activeButton === 2 ? styles.active2 : styles.respBtn
          }`}
          onClick={() => handleClick(2)}
        >
          Response
        </button>
      </div>

      <div className={styles.themeChanger}>
        <ThemeChanger />
      </div>

      <button
        className={
          isSaveDisabled ? styles.shareButton : styles.shareButtonInctive
        }
        onClick={handleGenerateShareLink}
        disabled={!isSaveDisabled}
      >
        Share
      </button>
      <button
        className={
          isSaveDisabled ? styles.saveButtonInactive : styles.saveButton
        }
        onClick={handleSaveClick}
        disabled={isSaveDisabled}
      >
        Save
      </button>

      <div className={styles.imgContainer}>
        <Link to="/dashboard">
          <img src={closeBtn} alt="close" className={styles.closeBtn} />
        </Link>
      </div>
    </div>
  );
}
