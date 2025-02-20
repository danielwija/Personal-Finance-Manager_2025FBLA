import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Divider } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import dayjs from "dayjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const SummaryPage = () => {
  const [view, setView] = useState("monthly"); // 'weekly' or 'monthly'
  const [data, setData] = useState({
    incomeCategories: [],
    expenseCategories: [],
    incomeValues: [],
    expenseValues: [],
    totalIncome: 0,
    totalExpense: 0,
  });

  const getFilteredData = (transactions, view) => {
    const now = dayjs();
    let startDate;

    if (view === "monthly") {
      // For monthly view, filter transactions from the start of the current month
      startDate = now.startOf("month");
    } else if (view === "weekly") {
      // For weekly view, filter transactions from the start of the current week
      startDate = now.startOf("week");
    }

    // Filter transactions based on the calculated start date
    return transactions.filter((transaction) => {
      const transactionDate = dayjs(transaction.date);
      return transactionDate.isAfter(startDate);
    });
  };

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:5000/api/transactions")
      .then((response) => response.json())
      .then((transactions) => {
        // Filter data based on selected view
        const filteredTransactions = getFilteredData(transactions, view);

        const incomeCategories = [];
        const expenseCategories = [];
        const incomeValues = [];
        const expenseValues = [];
        let totalIncome = 0;
        let totalExpense = 0;

        // Process filtered transactions
        filteredTransactions.forEach((transaction) => {
          if (transaction.type === "income") {
            totalIncome += transaction.amount;
            if (!incomeCategories.includes(transaction.category)) {
              incomeCategories.push(transaction.category);
              incomeValues.push(transaction.amount);
            } else {
              const index = incomeCategories.indexOf(transaction.category);
              incomeValues[index] += transaction.amount;
            }
          } else if (transaction.type === "expense") {
            totalExpense += transaction.amount;
            if (!expenseCategories.includes(transaction.category)) {
              expenseCategories.push(transaction.category);
              expenseValues.push(transaction.amount);
            } else {
              const index = expenseCategories.indexOf(transaction.category);
              expenseValues[index] += transaction.amount;
            }
          }
        });

        // Set the state with the fetched and processed data
        setData({
          incomeCategories,
          expenseCategories,
          incomeValues,
          expenseValues,
          totalIncome,
          totalExpense,
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [view]);

  const incomeChartData = {
    labels: data.incomeCategories,
    datasets: [
      {
        data: data.incomeValues,
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#2196f3",
          "#9c27b0",
          "#f44336",
        ], // Modify with distinct colors
      },
    ],
  };

  const expenseChartData = {
    labels: data.expenseCategories,
    datasets: [
      {
        data: data.expenseValues,
        backgroundColor: [
          "#f44336",
          "#9c27b0",
          "#2196f3",
          "#ff9800",
          "#4caf50",
        ], // Modify with distinct colors
      },
    ],
  };

  const savingsPercentage =
    ((data.totalIncome - data.totalExpense) / data.totalIncome) * 100;

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Weekly / Monthly View Buttons */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <Button
          variant="contained"
          onClick={() => setView("weekly")}
          style={{ marginRight: "10px" }}
        >
          Weekly View
        </Button>
        <Button variant="contained" onClick={() => setView("monthly")}>
          Monthly View
        </Button>
      </div>

      {/* Income and Expense Summary */}
      <div style={{ marginBottom: "40px" }}>
        <Card>
          <CardContent>
            <Typography variant="h5" align="center">
              Income and Expense Summary
            </Typography>
            <Typography variant="body1" align="center">
              Total Income: ${data.totalIncome}
            </Typography>
            <Typography variant="body1" align="center">
              Total Expense: ${data.totalExpense}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              style={{ color: savingsPercentage > 0 ? "green" : "red" }}
            >
              {savingsPercentage > 0
                ? `Savings: +${savingsPercentage.toFixed(2)}%`
                : `Overspending: ${Math.abs(savingsPercentage).toFixed(2)}%`}
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
          </CardContent>
        </Card>
      </div>

      {/* Income & Expense Pie Charts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "40px",
        }}
      >
        <div style={{ flex: 1, marginRight: "20px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Income Distribution
              </Typography>
              <Pie data={incomeChartData} />
            </CardContent>
          </Card>
        </div>

        <div style={{ flex: 1, marginLeft: "20px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Expense Distribution
              </Typography>
              <Pie data={expenseChartData} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Expense Breakdown */}
      <div style={{ marginTop: "40px" }}>
        <Card>
          <CardContent>
            <Typography variant="h6" align="center">
              Detailed Expense Breakdown
            </Typography>
            {data.expenseCategories.map((category, index) => (
              <Typography key={index} variant="body1" align="center">
                {category}: ${data.expenseValues[index]}
              </Typography>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryPage;
