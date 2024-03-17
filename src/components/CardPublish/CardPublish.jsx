import React, { useEffect, useState } from "react";
// import Card from "../Card/Card";
import styles from "./CardPublish.module.css";
import axios from "axios";
import { BACKEND_URL } from "../../constants/baseurl";
import titlelogo from "../../assets/images/titlelogo.svg";
import { Link } from "react-router-dom";

function CardPublish() {
  const [data, setData] = useState([]);
  const taskId = window.location.pathname.split("/")[2];
  // const checkedTasks = data.Checklist.filter(task => task.isChecked).length; // Updated to use taskChecklist
  // const totalTasks = data.Checklist.length;
  const [date, setDate] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    axios
      .get(`${BACKEND_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Set the Authorization header with the token
        },
      })
      .then((response) => {
        setData(response.data);
        
      })

      .catch((error) => {
        console.error("API request failed", error);
      });
  }, [taskId]);

  useEffect(() => {
    setDate(new Date(data.dueDate).toLocaleDateString());
    // console.log(new Date(d.dueDate).toLocaleDateString());
  }, [data]);


  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "rgb(255, 0, 225)";
      case "Moderate":
        return "rgb(0, 200, 255)";
      case "Low":
        return "rgb(0, 255, 60)";
      default:
        return "gray";
    }
  };

  return (
    <div className={styles.CardContainer}>
      <div className={styles.cardHeader}>
        <img src={titlelogo} alt="logo" className={styles.titlelogo} />
        <p className={styles.dashboardTitle}> <Link to={'/dashboard'}>Pro Manage</Link></p>
      </div>
      <div className={styles.CardContent}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.priorityDiv}>
              <div
                className={styles.colorDiv}
                style={{ backgroundColor: getPriorityColor(data.priority) }}
              ></div>
              <div className={styles.priorityIndicator}>
                {data.priority} Priority
              </div>
            </div>
          </div>
          <div className={styles.title}>{data.title}</div>

          <div className={styles.checklist}>
            <div className={styles.checklist}>
              <div className={styles.checklistData}>
                Checklist (
                {data.checklist
                  ? data.checklist.filter((item) => item.isChecked).length
                  : 0}
                /{data.checklist ? data.checklist.length : 0})
              </div>
            </div>
          </div>
          <div className={styles.checklistInput}>
            {data.checklist &&
              data.checklist.map((item, index) => (
                <div key={index} className={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={item.isChecked}
                    className={styles.checkBox}
                    readOnly
                  />
                  <span>{item.text}</span>
                </div>
              ))}
          </div>
          <div className={styles.dueDate}>
            <div className={styles.dueDateText}>Due Date</div>
            <div className={styles.dateDiv}>{date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPublish;
