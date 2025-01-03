import styles from "./shareBtn.module.css";

export default function ShareBtn({ openModal, isDisabled }) {
  return (
    <div className={styles.shareBtnContainer}>
      <button
        onClick={openModal}
        disabled={isDisabled} // Disable button when modal is open
        style={{
          backgroundColor: isDisabled ? "#ccc" : "#4CAF50",
          cursor: isDisabled ? "not-allowed" : "pointer",
        }}
      >
        Share
      </button>
    </div>
  );
}
