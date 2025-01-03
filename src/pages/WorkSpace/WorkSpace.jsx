import { useState } from "react";
import { useParams } from "react-router-dom";
import WorkSpaceNav from "../../components/WorkSpaceNav/WorkSpaceNav";
import {
  gifIcon,
  imgIcon,
  textIcon,
  videoIcon,
  inpTxtIcon,
  inpNumberIcon,
  inpDateIcon,
  inpPhoneIcon,
  inpMailIcon,
  inpRatingIcon,
  inpBtnIcon,
  startIcon,
  deleteIcon,
} from "../../utils/getWorkSpaceImg";
import { saveWorkspaceData, deleteBubble } from "../../services/workSpaceApi";

import styles from "./workSpace.module.css";

export default function WorkSpace() {
  const { formId } = useParams();
  const [bubbles, setBubbles] = useState([]); // Local state for bubbles
  const [inputCounters, setInputCounters] = useState({
    text: 1,
    number: 1,
    email: 1,
    phone: 1,
    date: 1,
    rating: 1,
  });
  const [fetchedBubbles, setFetchedBubbles] = useState([]);
  const [showFlow, setShowFlow] = useState(false); // Show flow or response view
  const [rerenderKey, setRerenderKey] = useState(0);

  const showFlowView = () => setShowFlow(true);

  // Add a new bubble
  const addBubble = (type, defaultContent) => {
    if (!showFlow) {
      // alert("Enable flow view to add bubbles!");
      return;
    }

    let content = defaultContent;
    if (type.startsWith("input-")) {
      const inputType = type.split("-")[1];
      content = `Input ${capitalize(inputType)} ${inputCounters[inputType]}`;
      setInputCounters((prevCounters) => ({
        ...prevCounters,
        [inputType]: prevCounters[inputType] + 1,
      }));
    }
    setBubbles((prevBubbles) => [
      ...prevBubbles,
      { id: Date.now(), type, content },
    ]);
  };

  const handleDeleteBubble = async (id) => {
    try {
      setBubbles((prevBubbles) => {
        // Check if the bubble exists in the list
        const bubbleToDelete = prevBubbles.find((bubble) => bubble.id === id);

        if (!bubbleToDelete) {
          console.warn("Bubble not found for deletion.");
          return prevBubbles;
        }

        // Handle backend deletion only for bubbles with a persisted ID
        if (
          typeof bubbleToDelete.id === "string" &&
          bubbleToDelete.id.length === 24
        ) {
          deleteBubble(formId, id).catch((error) =>
            console.error("Error deleting bubble from backend:", error)
          );
        }

        // Filter out the deleted bubble locally
        const filteredBubbles = prevBubbles.filter(
          (bubble) => bubble.id !== id
        );

        // If the deleted bubble is an input type, reduce the count
        if (bubbleToDelete.type.startsWith("input-")) {
          const inputType = bubbleToDelete.type.split("-")[1];
          setInputCounters((prevCounters) => ({
            ...prevCounters,
            [inputType]: prevCounters[inputType] - 1,
          }));
        }

        // Renumber bubbles of the same type locally
        const renumberedBubbles = filteredBubbles.reduce((acc, bubble) => {
          if (bubble.type.startsWith("input-")) {
            const inputType = bubble.type.split("-")[1]; // Extract input type (text, email, etc.)
            const sameTypeCount = acc.filter(
              (b) => b.type === bubble.type
            ).length; // Count of bubbles of the same type already added
            acc.push({
              ...bubble,
              content: `Input ${capitalize(inputType)} ${sameTypeCount + 1}`, // Renumber for the specific type
            });
          } else {
            acc.push(bubble); // No changes for non-input types
          }
          return acc;
        }, []);

        return renumberedBubbles;
      });
    } catch (error) {
      console.error("Error in handleDeleteBubble:", error);
    }
  };

  // Edit a bubble
  const handleEditBubble = (id, updatedContent) => {
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) =>
        bubble.id === id ? { ...bubble, content: updatedContent } : bubble
      )
    );
  };

  const handleSaveFlow = async () => {
    try {
      // Separate fetched bubbles and newly added bubbles
      const fetchedBubbleIds = new Set(
        fetchedBubbles.map((bubble) => bubble.id)
      );
      const newBubbles = bubbles.filter(
        (bubble) => !fetchedBubbleIds.has(bubble.id)
      );

      console.log("New bubbles to save:", newBubbles);

      // Transform new bubbles for saving
      const transformedBubbles = newBubbles.map((bubble) => {
        const [mainType, subType] = bubble.type.split("-");
        return {
          type: mainType,
          ...(mainType === "label" && {
            labelType: subType.charAt(0).toUpperCase() + subType.slice(1),
          }),
          ...(mainType === "input" && { inputType: subType }),
          content: bubble.content,
        };
      });

      console.log("Transformed bubbles to save:", transformedBubbles);

      if (transformedBubbles.length > 0) {
        const response = await saveWorkspaceData(formId, transformedBubbles);

        if (response?.status === "success") {
          console.log("New bubbles saved successfully!");

          // Add the newly saved bubbles to fetchedBubbles and clear newBubbles
          setFetchedBubbles((prev) => [...prev, ...newBubbles]);
          // setBubbles((prev) => [...fetchedBubbles, ...newBubbles]);
          setRerenderKey((prev) => prev + 1);
        }
      } else {
        console.log("No new bubbles to save.");
      }
    } catch (error) {
      console.error("Error saving workspace data:", error);
    }
  };

  const handleGenerateShareLink = () => {
    const frontendURL = window.location.origin; // Get the base URL
    const shareableLink = `${frontendURL}/form-bot/${formId}`;

    navigator.clipboard.writeText(shareableLink).then(() => {
      alert("Shareable link copied to clipboard!");
    });
  };

  // Capitalize first letter of a string
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  console.log("Bubble", bubbles);
  console.log(inputCounters);

  return (
    <div className={styles.workSpaceContainer}>
      <div className={styles.navContainer}>
        <WorkSpaceNav
          formId={formId}
          setBubbles={setBubbles}
          // bubbles={bubbles}
          handleSaveFlow={() => handleSaveFlow(bubbles)}
          showFlowView={showFlowView}
          handleGenerateShareLink={handleGenerateShareLink}
          setFetchedBubbles={setFetchedBubbles}
          key={rerenderKey}
        />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.formElementSelector}>
          <div className={styles.labelSelector}>
            <div className={styles.titleContainer}>Bubbles</div>
            <div className={styles.labelGrid}>
              <div
                onClick={() => addBubble("label-text", "Text")}
                style={{ cursor: "pointer" }}
              >
                <img src={textIcon} alt="Text" />
                <span>Text</span>
              </div>
              <div
                onClick={() => addBubble("label-image", "Image")}
                style={{ cursor: "pointer" }}
              >
                <img src={imgIcon} alt="Image" />
                <span>Image</span>
              </div>
              <div>
                <img src={videoIcon} alt="Video" />
                <span>Video</span>
              </div>
              <div>
                <img src={gifIcon} alt="GIF" />
                <span>GIF</span>
              </div>
            </div>
          </div>

          <div className={styles.inputSelector}>
            <div className={styles.titleContainer}>Inputs</div>
            <div className={styles.inputGrid}>
              <div onClick={() => addBubble("input-text")}>
                <img src={inpTxtIcon} alt="Text" />
                <span>Text</span>
              </div>
              <div onClick={() => addBubble("input-number")}>
                <img src={inpNumberIcon} alt="Number" />
                <span>Number</span>
              </div>
              <div onClick={() => addBubble("input-email")}>
                <img src={inpMailIcon} alt="Email" />
                <span>Email</span>
              </div>
              <div onClick={() => addBubble("input-phone")}>
                <img src={inpPhoneIcon} alt="Phone" />
                <span>Phone</span>
              </div>
              <div onClick={() => addBubble("input-date")}>
                <img src={inpDateIcon} alt="Date" />
                <span>Date</span>
              </div>
              <div onClick={() => addBubble("input-rating")}>
                <img src={inpRatingIcon} alt="Rating" />
                <span>Rating</span>
              </div>
              <div onClick={() => addBubble("input-button")}>
                <img src={inpBtnIcon} alt="Button" />
                <span>Buttons</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formBuildContainer}>
          <div className={styles.buildContainer}>
            <div className={styles.startHeader}>
              <img src={startIcon} alt="Start" />
              <span>Start</span>
            </div>

            {showFlow &&
              bubbles.map((bubble) => (
                <div key={bubble.id}>
                  {bubble.type === "label-text" && (
                    <div className={styles.bubbleBuilder}>
                      <button
                        className={styles.delImg}
                        onClick={() => handleDeleteBubble(bubble.id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                      <div className={styles.bubbleInp}>
                        {bubble.content || "Text"}
                        <input
                          type="text"
                          // value={bubble.content} // Render "Text" inside the field
                          onChange={(e) =>
                            handleEditBubble(bubble.id, e.target.value)
                          }
                          placeholder="Click Here to Edit"
                        />
                        <div style={{ fontSize: "12px", marginTop: "10px" }}>
                          Required Field
                        </div>
                      </div>
                    </div>
                  )}

                  {bubble.type === "label-image" && (
                    <div className={styles.bubbleBuilder}>
                      <button
                        className={styles.delImg}
                        onClick={() => handleDeleteBubble(bubble.id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                      <div className={styles.bubbleInp}>
                        {bubble.content || "Image"}
                        <input
                          type="text"
                          // value={bubble.content} // Render "Image" inside the field
                          onChange={(e) =>
                            handleEditBubble(bubble.id, e.target.value)
                          }
                          placeholder="Click to add link"
                        />
                      </div>
                    </div>
                  )}

                  {bubble.type.startsWith("input-") && (
                    <div className={styles.inpBuilder}>
                      <button
                        className={styles.inpDelImg}
                        onClick={() => handleDeleteBubble(bubble.id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                      <div className={styles.inpContent}>
                        {bubble.content}
                        <div>
                          Hint: User will input a {bubble.content} on this form
                        </div>
                      </div>
                    </div>
                  )}

                  {bubble.type === "inpbutton" && (
                    <div className={styles.inpButtonBuilder}>
                      <button
                        className={styles.buttonDelImg}
                        onClick={() => handleDeleteBubble(bubble.id)}
                      >
                        <img src={deleteIcon} alt="Delete" />
                      </button>
                      <div className={styles.buttonContent}>
                        Input Button<div></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
