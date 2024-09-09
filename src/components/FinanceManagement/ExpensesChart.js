import { useLayoutEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import { Button } from "@nextui-org/react";
import React from "react";

const ExpensesChart = React.memo(({ mode, data }) => {
  const ref = useRef(null);
  const [modal, setModal] = useState(false);
  const chartInstance = useRef(null);

  useLayoutEffect(() => {
    const { current } = ref;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = current.getContext("2d");
    const isBarChart = modal;
    const isProfitMode = mode === "profits";

    chartInstance.current = new Chart(ctx, {
      type: isBarChart ? "bar" : "line",
      data: {
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
        datasets: [
          {
            label: "Birim €",
            data: data,
            backgroundColor: isBarChart
              ? [
                  "rgba(255, 99, 132, 0.65)",
                  "rgba(54, 162, 235, 0.65)",
                  "rgba(255, 206, 86, 0.65)",
                  "rgba(75, 192, 192, 0.65)",
                  "rgba(153, 102, 255, 0.65)",
                  "rgba(255, 159, 64, 0.65)",
                  "rgba(255, 99, 132, 0.65)",
                  "rgba(54, 162, 235, 0.65)",
                  "rgba(255, 206, 86, 0.65)",
                  "rgba(75, 192, 192, 0.65)",
                  "rgba(153, 102, 255, 0.65)",
                  "rgba(255, 159, 64, 0.65)",
                ]
              : "transparent",
            borderColor: isBarChart
              ? "rgba(0, 0, 0, 0.1)"
              : isProfitMode
              ? "rgba(88, 214, 141, 1)"
              : "rgba(255, 56, 56, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          colors: {
            enabled: true,
          },
          filler: {
            drawTime: "beforeDatasetDraw",
          },
          title: {
            display: true,
            text: `${isProfitMode ? "Gelir Tablosu (€)" : "Gider Tablosu (€)"}`,
            color: `${
              isProfitMode ? "rgba(88, 214, 141, 1)" : "rgba(255, 56, 56, 1)"
            }`,
            position: "top",
            padding: {
              bottom: 12,
            },
            font: {
              size: 18,
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "white",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.2)",
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [modal, data, mode]);

  const handleModalChange = () => {
    setModal((prev) => !prev);
  };

  return (
    <div className="w-full h-auto">
      <canvas ref={ref} />
      <Button
        color="success"
        variant="flat"
        size="sm"
        className="dark"
        onPress={handleModalChange}
      >
        Grafik Modelini Değiştir
      </Button>
    </div>
  );
});

export default ExpensesChart;
