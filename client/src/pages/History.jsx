/* ====== AI Generated Code ====== */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import HistoryCSS from "./History.module.css";

function History() {
  const API_URL = "http://localhost:5000/api";
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpanded] = useState({});
  const [filters, setFilters] = useState({
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Fetch transactions on component mount
  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then((response) => response.json())
      .then((data) => setTransactions(data.filter((txn) => txn.amount > 0))) // Ensure only valid transactions
      .catch((error) => console.error("Error loading transactions:", error));
  }, []);

  // Delete a transaction after confirmation
  const deleteTransaction = (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete");
        setTransactions((prev) => prev.filter((txn) => txn.id !== id));
      })
      .catch((error) => console.error("Error deleting transaction:", error));
  };

  // Navigate to the update transaction page
  const updateTransaction = (transaction) => {
    navigate(`/input/update/${transaction.id}`, {
      state: { transactionData: transaction },
    });
  };

  // Toggle expanded state for transaction details
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Filter transactions based on search and filter criteria
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.category.toLowerCase().includes(searchText.toLowerCase()) ||
      txn.date.includes(searchText) ||
      txn.amount.toString().includes(searchText);

    const amountMatches =
      (!filters.minAmount || txn.amount >= parseFloat(filters.minAmount)) &&
      (!filters.maxAmount || txn.amount <= parseFloat(filters.maxAmount));

    const dateMatches =
      (!filters.startDate ||
        new Date(txn.date) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(txn.date) <= new Date(filters.endDate));

    return matchesSearch && amountMatches && dateMatches;
  });

  return (
    <main className="container py-4">
      <h1 className="mb-4 text-center">Transaction History</h1>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by date, category, amount..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Toggle Advanced Filters */}
      <button
        className="btn btn-link mb-3"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "More Filters"}
      </button>

      {/* Filters Section */}
      {showFilters && (
        <div className="mb-3">
          <div className="row">
            <div className="col">
              <label>Min Amount</label>
              <input
                type="number"
                className="form-control"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col">
              <label>Max Amount</label>
              <input
                type="number"
                className="form-control"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((txn) => (
            <div
              key={txn.id}
              className="card mb-2 shadow-lg rounded-3 border-light"
            >
              <div className="card-body p-3 d-flex justify-content-between align-items-center">
                {/* Transaction Date & Category */}
                <div className="d-flex w-75">
                  <p className="m-0 me-3">{txn.date}</p>
                  <p className="m-0">{txn.category}</p>
                </div>
                {/* Amount */}
                <span
                  className={
                    txn.type === "income" ? "text-success" : "text-danger"
                  }
                >
                  {txn.type === "income" ? `+${txn.amount}` : `-${txn.amount}`}
                </span>
                {/* Expand Button */}
                <button
                  className="btn btn-link text-muted ms-3"
                  onClick={() => toggleExpand(txn.id)}
                >
                  {expanded[txn.id] ? <Icon.ChevronUp /> : <Icon.ChevronDown />}
                </button>
              </div>

              {/* Expanded Details */}
              {expanded[txn.id] && (
                <div className="card-body">
                  <p>{txn.description || "No notes."}</p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => updateTransaction(txn)}
                    >
                      <Icon.Pencil /> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteTransaction(txn.id)}
                    >
                      <Icon.Trash /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center">No transactions found.</div>
        )}
      </div>
    </main>
  );
}

export default History;
