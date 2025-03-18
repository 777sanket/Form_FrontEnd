import styles from "./deleteMod.module.css";
import Line from "../../assets/line.png";

export default function DeleteMod({ text, onDelete, closeDeleteModal }) {
  const handleDelete = () => {
    onDelete();
  };

  return (
    <div className={styles.deleteModContainer}>
      <div className={styles.text}>
        Are you sure you want to delete this {text} ?
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.actiontxt} onClick={handleDelete}>
          Done
        </div>
        <img src={Line} alt="" />
        <div className={styles.actiontxt} onClick={closeDeleteModal}>
          Cancel
        </div>
      </div>
    </div>
  );
}
