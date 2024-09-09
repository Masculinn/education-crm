import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import Chart from "chart.js/auto";
import { processStudentData } from "@/utils/assistants/processStudentData";
import viewAllStudents from "@/utils/db/adminQueries/viewAllStudents";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";

export const LineChart = () => {
  const chartRef = useRef();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [
      "Ocak",
      "Şubat",
      "Mart",
      "Nisan",
      "Mayıs",
      "Haziran",
      "Temmuz",
      "Ağustos",
      "Eylül",
      "Ekim",
      "Kasım",
      "Aralık",
    ],
    data: Array(12).fill(0),
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await viewAllStudents("created_at").finally(() =>
        setLoading(false)
      );
      if (data) {
        const processedData = processStudentData(data);
        setChartData(processedData);
      }
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef?.current?.getContext("2d");
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: "Kayıtlı Öğrenciler",
              data: chartData.data,
              borderColor: "rgba(45, 162, 235, 0.75)",
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Öğrencilerin Aylara Göre Dağılımı",
              color: "rgba(255 ,255 ,255, 0.75)",
              padding: {
                bottom: 28,
              },
              font: {
                size: 17,
              },
            },
            legend: {
              display: false,
              position: "bottom",
              labels: { color: "white" },
            },
            filler: { drawTime: "beforeDatasetDraw" },
          },
          scales: {
            y: {
              ticks: {
                color: "white",
              },
              grid: {
                color: "rgba(255,255,255,0.25)",
              },
            },
            x: {
              ticks: {
                color: "white",
              },
              grid: {
                color: "rgba(255,255,255,0.25)",
              },
            },
          },
        },
      });

      return () => chart.destroy();
    }
  }, [loading]);

  if (loading) {
    return <LoadingSkeleton isWidthFull mode={"table"} />;
  }

  return <canvas ref={chartRef} />;
};
