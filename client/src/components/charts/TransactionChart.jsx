import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear"; // To get week number of the year

// Register chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Add weekOfYear plugin to dayjs
dayjs.extend(weekOfYear);

const TransactionChart = ({ transactions }) => {
  // Filter transactions by status "DELIVERED"
  const deliveredTransactions = transactions.filter(
    (transaction) => transaction.status === "delivered"
  );

  // Prepare chart data to show count of transactions per week
  const transactionCountsByWeek = deliveredTransactions.reduce(
    (counts, transaction) => {
      const week = dayjs(transaction.date).week(); // Get the week number
      counts[week] = (counts[week] || 0) + 1;
      return counts;
    },
    {}
  );

  const weekLabels = Object.keys(transactionCountsByWeek).sort(); // Sort week numbers
  const transactionData = weekLabels.map(
    (week) => transactionCountsByWeek[week]
  ); // Counts per week

  const chartData = {
    labels: weekLabels.map((week) => `Week ${week}`), // Weeks as labels
    datasets: [
      {
        label: "Transactions per Week",
        data: transactionData, // Transaction counts per week
        borderColor: "#36A2EB",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "#FF6384",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Transactions Distribution by Week",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Week Number",
        },
      },
      y: {
        title: {
          display: true,
          text: "Transaction Count",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default TransactionChart;
