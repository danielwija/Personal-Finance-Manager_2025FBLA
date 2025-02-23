/* ====== AI Assisting Code ====== */
/* I write most of the code and logic, but still use AI to do minor improvements. */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InputCSS from "./Input.module.css";
import moment from "moment";

const PORT = 5000;
const API_URL = `http://localhost:${PORT}/`;

const Input = ({ incomeCat = [], expenseCat = [] }) => {
  const { mode, id } = useParams();
  const [txnDate, setTxnDate] = useState(moment().format("YYYY-MM-DD"));
  const [txnType, setTxnType] = useState("INCOME");
  const [txnAmt, setTxnAmt] = useState(""); // Start with an empty string
  const [txnCatId, setTxnCatId] = useState(0);
  const [txnNote, setTxnNote] = useState("");
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    if (mode === "update" && id) {
      const fetchUrl = `${API_URL}api/transactions/${id}`;
      fetch(fetchUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch, status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setTransactionData(data);
            setTxnDate(data.date);
            setTxnType(data.type.toUpperCase());
            setTxnAmt(data.amount.toString());
            setTxnNote(data.description);

            if (data.type === "income") {
              const incomeCategory = incomeCat.find(
                (cat) => cat.catName === data.category
              );
              setTxnCatId(incomeCategory ? incomeCategory.id : 0);
            } else if (data.type === "expense") {
              const expenseCategory = expenseCat.find(
                (cat) => cat.catName === data.category
              );
              setTxnCatId(expenseCategory ? expenseCategory.id : 0);
            }
          }
        })
        .catch((error) => console.error("Error fetching transaction:", error));
    }
  }, [mode, id, incomeCat, expenseCat]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (txnCatId === 0) {
      alert("Please select a category!");
      return;
    }

    let txnCatName;
    if (txnType === "INCOME") {
      txnCatName = incomeCat.find((obj) => obj.id === txnCatId)?.catName;
    } else {
      txnCatName = expenseCat.find((obj) => obj.id === txnCatId)?.catName;
    }

    const transactionData = {
      txnDate,
      txnType,
      txnAmt: Number(txnAmt), // Ensure it's a number before sending
      txnCatId,
      txnCatName,
      txnNote,
    };

    const method = mode === "update" ? "PUT" : "POST";
    const endpoint =
      mode === "update" ? `api/transactions/${id}` : "api/transactions/add";

    fetch(API_URL + endpoint, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then(() => {
        alert(
          mode === "update"
            ? "Transaction updated successfully!"
            : "Transaction added successfully!"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save transaction.");
      });
  };

  const handleTxnAmt = (iTxnAmt) => {
    if (iTxnAmt === "") {
      setTxnAmt(""); // Allow empty input
      return;
    }

    let x = Number(iTxnAmt);
    if (isNaN(x) || x < 0) {
      alert("Amount must be a positive number");
    } else {
      setTxnAmt(iTxnAmt); // Keep user's input without forcing a default 0
    }
  };

  const handleTxnCatId = (iTxnCatId) => {
    let x = Number(iTxnCatId);
    const validCategory =
      txnType === "INCOME"
        ? incomeCat.some((cat) => cat.id === x)
        : expenseCat.some((cat) => cat.id === x);

    if (validCategory) {
      setTxnCatId(x);
    } else {
      alert("Please select a valid category!");
    }
  };

  useEffect(() => {
    setTxnCatId(0);
  }, [txnType]);

  if (mode === "update" && !transactionData) {
    return <p>Loading...</p>;
  }

  return (
    <main className={InputCSS.mainContainer}>
      <div className="container">
        <div className={InputCSS.cardContainer}>
          <form onSubmit={handleSubmit}>
            <div className={InputCSS.formGroup}>
              <label htmlFor="txn_date" className={InputCSS.formLabel}>
                Date
              </label>
              <input
                type="date"
                className={InputCSS.formInput}
                id="txn_date"
                value={txnDate}
                onChange={(e) =>
                  setTxnDate(moment(e.target.value).format("YYYY-MM-DD"))
                }
                required
              />
            </div>

            <div className={InputCSS.formGroup}>
              <label className={InputCSS.formLabel}>Type</label>
              <div className={InputCSS.txnTypeContainer}>
                <button
                  type="button"
                  className={`${InputCSS.txnButton} ${
                    txnType === "INCOME" ? InputCSS.active : ""
                  }`}
                  onClick={() => setTxnType("INCOME")}
                >
                  Income
                </button>
                <button
                  type="button"
                  className={`${InputCSS.txnButton} ${
                    txnType === "EXPENSE" ? InputCSS.active : ""
                  }`}
                  onClick={() => setTxnType("EXPENSE")}
                >
                  Expense
                </button>
              </div>
            </div>

            <div className={InputCSS.inlineGroup}>
              <div className={InputCSS.formGroup}>
                <label htmlFor="txn_amt" className={InputCSS.formLabel}>
                  Amount
                </label>
                <input
                  type="number"
                  step="0.1"
                  className={InputCSS.formInput}
                  id="txn_amt"
                  value={txnAmt}
                  onChange={(e) => handleTxnAmt(e.target.value)}
                  required
                  placeholder="$0.0"
                />
              </div>

              <div className={InputCSS.formGroup}>
                <label htmlFor="txn_cat" className={InputCSS.formLabel}>
                  Category
                </label>
                <select
                  className={InputCSS.formSelect}
                  id="txn_cat"
                  value={txnCatId}
                  onChange={(e) => handleTxnCatId(e.target.value)}
                  required
                >
                  <option value="0" disabled>
                    Choose Category
                  </option>
                  {txnType === "INCOME"
                    ? incomeCat.map((x) => (
                        <option value={x.id} key={x.id}>
                          {x.catName}
                        </option>
                      ))
                    : expenseCat.map((x) => (
                        <option value={x.id} key={x.id}>
                          {x.catName}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div className={InputCSS.formGroup}>
              <label htmlFor="txn_note" className={InputCSS.formLabel}>
                Notes
              </label>
              <textarea
                className={InputCSS.formTextarea}
                id="txn_note"
                placeholder="Add details (optional)"
                value={txnNote}
                onChange={(e) => setTxnNote(e.target.value)}
              ></textarea>
            </div>

            <div className="text-end">
              <button
                className={`${InputCSS.addButton} ${
                  mode === "update" ? InputCSS.updateButton : ""
                }`}
              >
                {mode === "update" ? "Update Record" : "Add Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Input;
