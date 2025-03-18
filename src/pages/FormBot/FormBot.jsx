import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWorkspaceDataForBot } from "../../services/workSpaceApi";
import styles from "./formBot.module.css";

export default function FormBot() {
  const { formId } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [formData, setFormData] = useState({});
  const [isFormFinished, setIsFormFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [collectedResponses, setCollectedResponses] = useState([]);
  const [labelMapping, setLabelMapping] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  const URL = "https://formbot-backend-c4c0.onrender.com/api";
  // const URL = "http://localhost:3000/api";

  useEffect(() => {
    // Increment views count on page load
    const incrementViews = async () => {
      try {
        await fetch(`${URL}/increment-views/${formId}`, { method: "GET" });
      } catch (error) {
        console.error("Error incrementing views count:", error);
      }
    };
    incrementViews();
  }, [formId]);

  const handleFirstInput = () => {
    // Increment starts count on first input
    if (!isStarted) {
      fetch(`${URL}/increment-starts/${formId}`, { method: "POST" }).catch(
        (error) => console.error("Error incrementing starts count:", error)
      );
      setIsStarted(true); // Ensure only the first interaction triggers this
    }
  };

  useEffect(() => {
    const loadWorkspaceData = async () => {
      setIsLoading(true);
      try {
        const workspaceData = await getWorkspaceDataForBot(formId);

        if (!workspaceData || !workspaceData.formElements) {
          throw new Error("Invalid workspace data or formElements not found.");
        }

        const formElements = workspaceData.formElements;
        const labelMap = {};
        let labelCounter = 1;

        formElements.forEach((field, index) => {
          if (field.type === "label") {
            labelMap[index] = `Label ${labelCounter++}`;
          }
        });

        setLabelMapping(labelMap);
        setFormFields(formElements);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching workspace data:", error.message);
        setIsLoading(false);
      }
    };

    loadWorkspaceData();
  }, [formId]);

  const handleInputSubmit = () => {
    const currentField = formFields[currentIndex];

    if (inputValue.trim() === "") return; // Prevent empty submissions

    if (currentField.type.startsWith("input")) {
      setFormData((prev) => ({
        ...prev,
        [currentField.content]: inputValue,
      }));

      // Handle rating display differently
      if (currentField.inputType === "rating") {
        setChatMessages((prev) => [
          ...prev,
          { type: "input", content: `${inputValue}/5` },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { type: "input", content: inputValue },
        ]);
      }

      setInputValue("");
    }

    if (currentIndex < formFields.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const time = new Date().toLocaleTimeString();
      const response = { time };

      formFields.forEach((field, index) => {
        if (field.type.startsWith("label")) {
          response[labelMapping[index]] = field.content;
        } else {
          response[field.content] =
            formData[field.content] ||
            (field.content === currentField.content ? inputValue : "");
        }
      });

      setCollectedResponses((prev) => [...prev, response]);
      setIsFormFinished(true);
    }
  };

  const handleFormSubmit = async () => {
    try {
      // If form ends with a label, we need to prepare the data differently
      let responsesToSubmit = collectedResponses;

      if (collectedResponses.length === 0) {
        const now = new Date();
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Use 24-hour format
        };
        const formattedDateTime = now.toLocaleString("en-US", options);
        const response = { time: formattedDateTime };

        formFields.forEach((field, index) => {
          if (field.type.startsWith("label")) {
            response[labelMapping[index]] = field.content;
          } else {
            response[field.content] = formData[field.content] || "";
          }
        });

        responsesToSubmit = [response];
      }

      await fetch(`${URL}/form/${formId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: responsesToSubmit }),
      });

      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error posting data to backend:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  useEffect(() => {
    const currentField = formFields[currentIndex];
    if (currentField) {
      if (currentField.type === "label" && currentField.labelType === "Image") {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "label-image",
            content: currentField.content,
          },
        ]);
        setTimeout(() => {
          // Check if this is the last element in the form
          if (currentIndex === formFields.length - 1) {
            setIsFormFinished(true);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 10);
      } else if (currentField.type === "label") {
        setChatMessages((prev) => [
          ...prev,
          {
            type: "label",
            content: currentField.content,
          },
        ]);
        setTimeout(() => {
          // Check if this is the last element in the form
          if (currentIndex === formFields.length - 1) {
            setIsFormFinished(true);
          } else {
            setCurrentIndex((prev) => prev + 1);
          }
        }, 10);
      }
    }
  }, [currentIndex, formFields]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading form...</p>
      </div>
    );
  }

  return (
    <div className={styles.formBotContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messagesList}>
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageWrapper} ${
                msg.type.startsWith("label")
                  ? styles.botMessage
                  : styles.userMessage
              }`}
            >
              {msg.type === "label-image" ? (
                <img
                  src={msg.content}
                  alt="Label Image"
                  className={styles.messageImage}
                />
              ) : (
                <div className={styles.messageBubble}>{msg.content}</div>
              )}
            </div>
          ))}
        </div>

        {!isFormFinished &&
          currentIndex < formFields.length &&
          formFields[currentIndex].type.startsWith("input") &&
          formFields[currentIndex].inputType !== "rating" && (
            <div className={styles.inputContainer}>
              <input
                type={formFields[currentIndex].inputType}
                placeholder={`Enter your ${formFields[currentIndex].inputType}`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={() => handleFirstInput()}
                onKeyPress={handleKeyPress}
                className={styles.inputField}
              />
              <button
                onClick={handleInputSubmit}
                className={styles.sendButton}
                aria-label="Send"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 12L20 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 7L20 12L15 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

        {!isFormFinished &&
          currentIndex < formFields.length &&
          formFields[currentIndex].type.startsWith("input") &&
          formFields[currentIndex].inputType === "rating" && (
            <div className={styles.ratingInputContainer}>
              <div className={styles.ratingButtons}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className={`${styles.ratingButton} ${
                      parseInt(inputValue) === rating
                        ? styles.ratingSelected
                        : ""
                    }`}
                    onClick={() => {
                      handleFirstInput();
                      setInputValue(rating.toString());
                    }}
                  >
                    {rating}
                  </button>
                ))}
              </div>
              <button
                onClick={handleInputSubmit}
                className={styles.submitRatingButton}
                disabled={!inputValue}
                aria-label="Submit Rating"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 6L19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
      </div>

      {isFormFinished && (
        <div className={styles.formCompletedContainer}>
          <div className={styles.completionMessage}>
            <h3>Thank you for completing the form!</h3>
            <p>Click the button below to submit your responses.</p>
          </div>
          <button
            onClick={handleFormSubmit}
            className={styles.submitFormButton}
          >
            Submit Form
          </button>
        </div>
      )}
    </div>
  );
}
