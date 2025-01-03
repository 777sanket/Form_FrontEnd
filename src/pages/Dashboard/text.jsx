import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getWorkspaceData } from "../../services/workSpaceApi"; // Import your API service

export default function FormBot() {
  const { formName } = useParams(); // Get form name from URL params
  const [formFields, setFormFields] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [formData, setFormData] = useState({});
  const [isFormFinished, setIsFormFinished] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [labelMapping, setLabelMapping] = useState({});

  // Fetch workspace data based on formName
  useEffect(() => {
    const loadWorkspaceData = async () => {
      try {
        const workspaceData = await getWorkspaceData(formName);
        const form = workspaceData.forms.find((f) => f.name === formName);

        if (!form) {
          throw new Error(`Form with name "${formName}" not found.`);
        }

        const formElements = form.formElements;

        // Create mapping for labels with sequential numbers
        const labelMap = {};
        let labelCounter = 1;
        formElements.forEach((field, index) => {
          if (field.type === "label") {
            labelMap[index] = `Label ${labelCounter++}`;
          }
        });

        setLabelMapping(labelMap);
        setFormFields(formElements);
      } catch (error) {
        console.error("Error fetching workspace data:", error);
      }
    };
    loadWorkspaceData();
  }, [formName]);

  const handleSubmit = () => {
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
        if (field.type === "label") {
          row[labelMapping[index]] = field.content;
        } else {
          row[field.content] =
            formData[field.content] ||
            (field.content === currentField.content ? inputValue : "");
        }
      });

      setTableData((prev) => [...prev, row]);
      console.log("Collected Data for Backend:", [...tableData, row]);

      setIsFormFinished(true);
    }
  };

  useEffect(() => {
    const currentField = formFields[currentIndex];
    if (currentField && currentField.type === "label") {
      setChatMessages((prev) => [
        ...prev,
        { type: "label", content: currentField.content },
      ]);
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 10);
    }
  }, [currentIndex, formFields]);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "50px auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ marginBottom: "20px", minHeight: "300px" }}>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.type === "label" ? "flex-start" : "flex-end",
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
        ))}
      </div>

      {!isFormFinished &&
        currentIndex < formFields.length &&
        formFields[currentIndex].type.startsWith("input") && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type={formFields[currentIndex].inputType}
              placeholder={`Enter your ${formFields[currentIndex].inputType}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
                    {field.type === "label"
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
