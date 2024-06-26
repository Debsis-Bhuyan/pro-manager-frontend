import React, { useState, useEffect } from "react";
import styles from "./ToDoModal.module.css";
import axios from "axios";
import { BACKEND_URL } from "../../constants/baseurl";
import deleteIcon from "../../assets/images/delete.svg";
import addLogo from "../../assets/images/add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToDoModal = ({ isOpen, closeModal, onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedChecklist, setSelectedChecklist] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  // const [tasks, setTasks] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    setShowCalendar(true);
  };

  const handleAddChecklist = () => {
    setChecklist([...checklist, { text: "", isChecked: false }]);
  };

  const handleRemoveChecklist = (index) => {
    const updatedChecklist = [...checklist];
    const removedItem = updatedChecklist.splice(index, 1)[0];
    if (removedItem.isChecked) {
      setSelectedChecklist((prevCount) => prevCount - 1);
    }
    setChecklist(updatedChecklist);
  };

  const handleChecklistChange = (index, newText) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].text = newText;
    setChecklist(updatedChecklist);
    const selected = updatedChecklist.filter((item) => item.isChecked).length;
    setSelectedChecklist(selected);
  };

  const handleChecklistToggle = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].isChecked = !updatedChecklist[index].isChecked;
    setChecklist(updatedChecklist);
    const selected = updatedChecklist.filter((item) => item.isChecked).length;
    setSelectedChecklist(selected);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(`${BACKEND_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/tasks`,
        {
          title,
          priority,
          checklist,
          dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // toast.success("Todo created Successfully", {
      //   position: "top-right",
      //   autoClose: 1400,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
      setTitle("");
      setPriority("");
      setChecklist([]);
      setDueDate(new Date());
      alert("Task created succssfully");
      onTaskAdded();
      closeModal();
      setShowCalendar(false);
    } catch (error) {
      console.log(error);
      setShowCalendar(false);
    }
  };

  return (
    <>
      <div className={isOpen ? styles.modalOpen : styles.modalClosed}>
        <div className={styles.modalContent}>
          <div className={styles.topDiv}>
            <div className={styles.modalTitleDiv}>
              <p className={styles.modalTitle}>Title *</p>
              <input
                type="text"
                placeholder="Enter Task Title"
                className={styles.titleInput}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className={styles.priorityButtons}>
              <span className={styles.modalPriority}>Select Priority * </span>
              <button
                className={
                  priority === "High"
                    ? styles.selectedPriority
                    : styles.priorityBtn
                }
                onClick={() => setPriority("High")}
              >
                <div className={styles.colorDiv1}></div>
                High Priority
              </button>
              <button
                className={
                  priority === "Moderate"
                    ? styles.selectedPriority
                    : styles.priorityBtn
                }
                onClick={() => setPriority("Moderate")}
              >
                <div className={styles.colorDiv2}></div>
                Moderate Priority
              </button>
              <button
                className={
                  priority === "Low"
                    ? styles.selectedPriority
                    : styles.priorityBtn
                }
                onClick={() => setPriority("Low")}
              >
                <div className={styles.colorDiv3}></div>
                Low Priority
              </button>
            </div>
          </div>
          <div className={styles.checklistData}>
            <span className={styles.modalChecklist}>
              Checklist ({selectedChecklist}/{checklist.length})*
            </span>
            <div className={styles.checklistInput}>
              {checklist.map((item, index) => (
                <div key={index} className={styles.inputDiv}>
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    onChange={() => handleChecklistToggle(index)}
                    className={styles.checkBox}
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) =>
                      handleChecklistChange(index, e.target.value)
                    }
                    className={styles.inputBox}
                  />
                  <img
                    src={deleteIcon}
                    alt="delete icon"
                    onClick={() => handleRemoveChecklist(index)}
                    className={styles.deleteIconBox}
                  />
                </div>
              ))}
              <button className={styles.addButton} onClick={handleAddChecklist}>
                <img src={addLogo} alt="add logo" />
                <p className={styles.addNew}>Add New</p>
              </button>
            </div>
          </div>
          <div className={styles.buttonDiv}>
            <div onClick={handleClick} className={styles.dueDatebutton}>
              {!showCalendar ? (
                "Select Due Date"
              ) : (
                <DatePicker
                  showIcon
                  closeOnScroll={(e) => e.target === document}
                  selected={dueDate}
                  onChange={(date) => setDueDate(date)}
                  dateFormat={"dd-mm-yyyy"}
                />
              )}
            </div>
            <div className={styles.saveCancelBtn}>
              <button onClick={closeModal} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSave} className={styles.saveBtn}>
                Save
              </button>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default ToDoModal;
