/* ====== AI Generated Code ====== */

import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Divider } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import dayjs from "dayjs";

// Chart.js registration
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const API_URL = "http://localhost:5000/api/transactions";

const colors = [
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#2ecc71",
  "#34495e",
  "#16a085",
  "#27ae60",
];

const SummaryPage = () => {
  const [view, setView] = useState("monthly"); // Toggle between weekly and monthly views
  const [data, setData] = useState({
    income: {},
    expense: {},
    totalIncome: 0,
    totalExpense: 0,
  });
  const [recommendation, setRecommendation] = useState("");

  // Filter transactions based on selected view
  const getFilteredData = (transactions) => {
    const startDate = dayjs().startOf(view === "monthly" ? "month" : "week");
    return transactions.filter(({ date }) => dayjs(date).isAfter(startDate));
  };

  // Fetch and process transaction data
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((transactions) => {
        const filtered = getFilteredData(transactions);
        const categorizedData = { income: {}, expense: {} };
        let totalIncome = 0,
          totalExpense = 0;

        filtered.forEach(({ type, category, amount }) => {
          categorizedData[type][category] =
            (categorizedData[type][category] || 0) + amount;
          type === "income"
            ? (totalIncome += amount)
            : (totalExpense += amount);
        });

        setData({
          income: categorizedData.income,
          expense: categorizedData.expense,
          totalIncome,
          totalExpense,
        });
        setRecommendation(
          totalIncome > 0
            ? totalExpense > totalIncome
              ? "Your spending exceeds your income. Consider reducing expenses."
              : "You're managing your spending well. Keep it up!"
            : "No income data available."
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [view]);

  const createChartData = (categories, total) => ({
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: colors.slice(0, Object.keys(categories).length),
      },
    ],
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = ((value / total) * 100).toFixed(2);
            return `$${value} (${percentage}%)`;
          },
        },
      },
    },
  });

  const rankedExpenses = Object.entries(data.expense)
    .sort(([, a], [, b]) => b - a)
    .reduce(
      (acc, [category, amount], index) => ({
        labels: [...acc.labels, category],
        data: [...acc.data, amount],
        colors: [...acc.colors, colors[index % colors.length]],
      }),
      { labels: [], data: [], colors: [] }
    );

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      {/* View Selection */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {["weekly", "monthly"].map((v) => (
          <Button
            key={v}
            variant="contained"
            onClick={() => setView(v)}
            style={{ marginRight: "10px" }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)} View
          </Button>
        ))}
      </div>

      {/* Account Balance */}
      <Typography variant="h4" align="center" fontWeight="bold">
        Account Balance
      </Typography>
      <Typography variant="h2" align="center" color="primary">
        ${data.totalIncome - data.totalExpense}
      </Typography>

      {/* Summary & Recommendation */}
      {[
        {
          title: "Income and Expense Summary",
          content: `Total Income: $${data.totalIncome} | Total Expense: $${data.totalExpense}`,
        },
        { title: "Recommendation", content: recommendation },
      ].map(({ title, content }, i) => (
        <Card key={i} style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h6" align="center">
              {title}
            </Typography>
            <Divider style={{ margin: "10px 0" }} />
            <Typography variant="body1" align="center">
              {content}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          {
            title: "Income Distribution",
            data: createChartData(data.income, data.totalIncome),
          },
          {
            title: "Expense Distribution",
            data: createChartData(data.expense, data.totalExpense),
          },
        ].map(({ title, data }, i) => (
          <Card key={i} style={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" align="center">
                {title}
              </Typography>
              <Pie data={data} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Expense Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" align="center">
            Ranked Expense Breakdown
          </Typography>
          <Bar
            data={{
              labels: rankedExpenses.labels,
              datasets: [
                {
                  label: "Expense Amount",
                  data: rankedExpenses.data,
                  backgroundColor: rankedExpenses.colors,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { title: { display: true, text: "Category" } },
                y: { title: { display: true, text: "Expense Amount" } },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryPage;
