import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = ({ transactions }) => {
  // Filter transactions by status "DELIVERED"
  const deliveredTransactions = transactions.filter(
    (transaction) => transaction.status === "delivered"
  );

  // Prepare chart data to show a count of transactions by product_name
  const productCounts = deliveredTransactions.reduce((counts, transaction) => {
    transaction.products.forEach((product) => {
      counts[product.product_name] = (counts[product.product_name] || 0) + 1;
    });
    return counts;
  }, {});

  const productLabels = Object.keys(productCounts); // product_names as labels
  const productData = Object.values(productCounts); // counts of each product

  const chartData = {
    labels: productLabels.map((name) => `Product Name: ${name}`), // Display product_name as label
    datasets: [
      {
        label: "Transactions by Product",
        data: productData,
        backgroundColor: [
          // "#FFCE56",
          // "#36A2EB",
          // "#FF6384",
          // "#4BC0C0",
          // "#9966FF",
          // "#FF9F40",
          "#F1F1F1",
          "#F1F1F1",
          "#F1F1F1",
          "#F1F1F1",
          "#F1F1F1",
          "#F1F1F1",
        ],
        borderColor: ["#000000"],
        hoverBackgroundColor: [
          "#FFCE56",
          "#36A2EB",
          "#FF6384",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "Transactions Distribution by Product",
      },
    },
  };

  return <Pie data={chartData} options={chartOptions} />;
};

export default TransactionChart;
