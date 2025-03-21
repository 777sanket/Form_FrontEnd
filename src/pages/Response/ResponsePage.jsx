import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  getFormResponses,
  getFormStatistics,
} from "../../services/responseApi";
import WorkSpaceNav from "../../components/WorkSpaceNav/WorkSpaceNav";
import styles from "./response.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResponsePage() {
  const { formId } = useParams();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allKeys, setAllKeys] = useState([]); // To store all unique keys across responses
  const [statistics, setStatistics] = useState({
    viewsCount: 0,
    startsCount: 0,
    completionCount: 0,
  }); // Statistics state.

  useEffect(() => {
    const loadResponses = async () => {
      setIsLoading(true);
      try {
        const responseData = await getFormResponses(formId);
        setResponses(responseData || []);

        // Only fetch statistics if we have responses
        if (responseData && responseData.length > 0) {
          const statsData = await getFormStatistics(formId);
          setStatistics(statsData);

          // Process keys
          const keys = new Set();
          responseData.forEach((response) => {
            Object.keys(response).forEach((key) => keys.add(key));
          });
          setAllKeys(Array.from(keys));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading responses:", error);
        setIsLoading(false);
      }
    };

    loadResponses();
  }, [formId]);

  if (isLoading) {
    return <div className={styles.loading}>Loading responses...</div>;
  }

  // Check if there are no responses
  const hasNoResponses = !responses || responses.length === 0;

  // Only calculate these values if we have responses
  let completionPercentage = 0;
  let chartData = null;

  if (!hasNoResponses) {
    // Calculate completion percentage
    completionPercentage =
      statistics.startsCount > 0
        ? parseFloat(
            (
              (statistics.completionCount / statistics.startsCount) *
              100
            ).toFixed(2)
          )
        : 0;

    // Pie chart data
    chartData = {
      datasets: [
        {
          data: [
            statistics.completionCount,
            statistics.startsCount - statistics.completionCount,
          ],
          backgroundColor: ["#3B82F6", "#909090"],
        },
      ],
    };
  }

  const options = {
    cutout: "70%",
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.responseContainer}>
      <div className={styles.workspaceNav}>
        <WorkSpaceNav />
      </div>

      {hasNoResponses ? (
        <div className={styles.noResponsesContainer}>
          <p className={styles.noResponsesText}>No Responses yet collected</p>
        </div>
      ) : (
        <>
          {/* Display Views and Starts Count */}
          <div className={styles.statisticsContainer}>
            <p>
              <strong>Views</strong> <br />
              {statistics.viewsCount}
            </p>
            <p>
              <strong>Starts</strong> <br />
              {statistics.startsCount}
            </p>
          </div>

          <div className={styles.responseTableContainer}>
            <div>
              <table className={styles.responseTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    {allKeys.map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {allKeys.map((key, keyIndex) => (
                        <td key={keyIndex}>
                          {key.startsWith("Label") &&
                          response[key] &&
                          response[key].startsWith("http") ? (
                            <img
                              src={response[key]}
                              alt="Label content"
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          ) : (
                            response[key] || "N/A"
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Completion Statistics and Pie Chart */}
          <div className={styles.completionContainer}>
            <div className={styles.chartContainer}>
              <Doughnut data={chartData} options={options} />
              <p>
                <strong>Completed</strong> <br />
                {completionPercentage}
              </p>
            </div>

            <p className={styles.completionText}>
              <div className={styles.completionText2}>
                <strong>Completion Rate</strong> <br />
                {completionPercentage}%
              </div>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
