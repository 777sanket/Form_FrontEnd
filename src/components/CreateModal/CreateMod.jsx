import { useState } from "react";
import styles from "./createMod.module.css";
import Line from "../../assets/line.png";

export default function CreateMod({ text, onCreate, closeCreateModal }) {
  const [inputValue, setInputValue] = useState("");

  const handleDone = () => {
    if (inputValue.trim()) {
      onCreate(inputValue.trim());
      setInputValue(""); // Clear input after creation
    }
  };

  return (
    <div className={styles.createModContainer}>
      <div className={styles.text}>Create New {text}</div>
      <input
        type="text"
        placeholder={`Enter ${text} Name`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleDone()}
      />
      <div className={styles.btnContainer}>
        <div className={styles.actiontxt} onClick={handleDone}>
          Done
        </div>
        <img src={Line} alt="" />
        <div className={styles.actiontxt} onClick={closeCreateModal}>
          Cancel
        </div>
      </div>
    </div>
  );
}
