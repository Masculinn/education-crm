import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import viewAllStudents from "@/utils/db/adminQueries/viewAllStudents";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";

export const PieChart = () => {
  const [loading, setLoading] = useState(true);
  const chartRef = useRef();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await viewAllStudents("*").finally(() => setLoading(false));
      if (data) {
        setUsers(data);
      }
    };
    fetchStudents();
  }, []);
  const getUniversitiesData = (users) => {
    const universityCount = {};
    const universityStudents = {};

    users?.forEach((user) => {
      const uni = user.university;
      if (uni) {
        if (universityCount[uni]) {
          universityCount[uni]++;
          universityStudents[uni].push(user.name);
        } else {
          universityCount[uni] = 1;
          universityStudents[uni] = [user.name];
        }
      }
    });

    const labels = Object.keys(universityCount);
    const data = Object.values(universityCount);

    return { labels, data, universityStudents };
  };

  const { labels, data, universityStudents } = getUniversitiesData(users);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef?.current?.getContext("2d");
      const chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              label: "Öğrenci Sayısı",
              data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Okullara Göre Öğrenci Dağılımları",
              color: "rgba(255 ,255 ,255, 0.75)",
              padding: {
                bottom: 18,
              },
              font: {
                size: 18,
              },
            },
            legend: {
              display: true,
              position: "bottom",
              labels: { color: "white" },
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const university = labels[tooltipItem.dataIndex];
                  const students = universityStudents[university].join(", ");
                  return `${
                    data[tooltipItem.dataIndex]
                  } öğrenci(ler): ${students}`;
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      return () => chart.destroy();
    }
  }, [loading]);

  if (loading) {
    return <LoadingSkeleton isWidthFull mode={"table"} />;
  }
  return (
    <div style={{ width: "300px", height: "300px" }}>
      <canvas ref={chartRef} />
    </div>
  );
};
