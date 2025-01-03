import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWorkspaceDataForBot } from "../../services/workSpaceApi";
import styles from "./FormBot.module.css";

export default function FormBot() {
  const { formId } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [formData, setFormData] = useState({});
  const [isFormFinished, setIsFormFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState([]);
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
    // console.log(incrementViews);
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
        console.log("Workspace Data:", workspaceData);

        if (!workspaceData || !workspaceData.formElements) {
          throw new Error("Invalid workspace data or formElements not found.");
        }

        const formElements = workspaceData.formElements;
        const labelMap = {};
        let labelCounter = 1;
        console.log("formElements", formElements);

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

  const handleSubmit = async () => {
    const currentField = formFields[currentIndex];

    if (currentField.type.startsWith("input")) {
      setFormData((prev) => ({
        ...prev,
        [currentField.content]: inputValue,
      }));

      setChatMessages((prev) => [
        ...prev,
        { type: "input", content: inputValue },
      ]);

      setInputValue("");
    }

    if (currentIndex < formFields.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const time = new Date().toLocaleTimeString();
      const row = { time };

      formFields.forEach((field, index) => {
        if (field.type.startsWith("label")) {
          row[labelMapping[index]] = field.content;
        } else {
          row[field.content] =
            formData[field.content] ||
            (field.content === currentField.content ? inputValue : "");
        }
      });

      setTableData((prev) => [...prev, row]);
      console.log("Collected Data for Backend:", [...tableData, row]);
      try {
        // Post the collected data to the backend
        // const URL = "http://localhost:3000/api";

        await fetch(`${URL}/form/${formId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ responses: [row] }),
        });

        console.log("Data posted to backend successfully!");
      } catch (error) {
        console.error("Error posting data to backend:", error);
      }

      setIsFormFinished(true);

      setIsFormFinished(true);
    }
  };

  // useEffect(() => {
  //   const currentField = formFields[currentIndex];
  //   if (currentField && currentField.type === "label") {
  //     setChatMessages((prev) => [
  //       ...prev,
  //       {
  //         type: "label",
  //         content: currentField.content,
  //         labelType: currentField.labelType,
  //       },
  //     ]);
  //     setTimeout(() => {
  //       setCurrentIndex((prev) => prev + 1);
  //     }, 10);
  //   }
  // }, [currentIndex, formFields]);

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
          setCurrentIndex((prev) => prev + 1);
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
          setCurrentIndex((prev) => prev + 1);
        }, 10);
      }
    }
  }, [currentIndex, formFields]);

  // console.log("chatMessages", chatMessages);

  if (isLoading) {
    return (
      <div
        style={{
          maxWidth: "700px",
          margin: "50px auto",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Loading form...</p>
      </div>
    );
  }

  return (
    <div
      className={styles.formBotContainer}
      style={{
        // maxWidth: "700px",
        // margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div className={styles.chatContainer}>
        <div
          className={styles.a1}
          style={{ marginBottom: "20px", minHeight: "500px" }}
        >
          {/* {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.type === "label" ? "flex-start" : "flex-end",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.type === "label" ? "#e0e0e0" : "#007bff",
                  color: msg.type === "label" ? "#000" : "#fff",
                  textAlign: "left",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))} */}

          {chatMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: msg.type.startsWith("label")
                  ? "flex-start"
                  : "flex-end",
                marginBottom: "10px",
              }}
            >
              {msg.type === "label-image" ? (
                <img
                  src={msg.content}
                  alt="Label Image"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor:
                      msg.type === "label" ? "#e0e0e0" : "#007bff",
                    color: msg.type === "label" ? "#000" : "#fff",
                    textAlign: "left",
                  }}
                >
                  {msg.content}
                </div>
              )}
            </div>
          ))}
        </div>
        {!isFormFinished &&
          currentIndex < formFields.length &&
          formFields[currentIndex].type.startsWith("input") && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                // type={formFields[currentIndex].type.split("-")[1]}
                type={formFields[currentIndex].inputType}
                placeholder={`Enter your ${
                  // formFields[currentIndex].type.split("-")[1]?
                  formFields[currentIndex].inputType
                }`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onClick={() => handleFirstInput()}
                style={{
                  flex: "1",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
            </div>
          )}
      </div>

      {isFormFinished && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <h3>Collected Data:</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                  Time
                </th>
                {formFields.map((field, index) => (
                  <th
                    key={index}
                    style={{ border: "1px solid #ccc", padding: "8px" }}
                  >
                    {field.type.startsWith("label")
                      ? labelMapping[index]
                      : field.content}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{ border: "1px solid #ccc", padding: "8px" }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
