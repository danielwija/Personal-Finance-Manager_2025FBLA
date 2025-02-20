// import * as Icon from "react-bootstrap-icons";
// import HistoryCSS from "./History.module.css";

// function History() {
//   return (
//     <main className={`${HistoryCSS.historyMain} flex-grow-1`}>
//       <div className="container py-5">
//         {/* Header */}
//         <div className="d-flex justify-content-center my-4">
//           <h1 id="balance" className={HistoryCSS.balanceHeader}>
//             Current Balance:{" "}
//             <span className={HistoryCSS.balanceAmount}>$1,234.56</span>
//           </h1>
//         </div>

//         {/* Search Section */}
//         <div className="form-group m-3">
//           <label htmlFor="search" className={HistoryCSS.searchLabel}>
//             Search and Filter:
//           </label>
//           <input
//             type="text"
//             id="search"
//             name="search"
//             className={`form-control ${HistoryCSS.searchInput}`}
//             placeholder="Search transactions"
//           />
//         </div>

//         {/* Transaction List */}
//         <ul className={`list-group mx-3 mt-3 ${HistoryCSS.transactionList}`}>
//           <li className={`list-group-item ${HistoryCSS.transactionItem}`}>
//             <div className="d-flex align-items-center w-100">
//               {/* Left: Date and Type */}
//               <div className={HistoryCSS.transactionDetails}>
//                 <Icon.PlusCircle className={HistoryCSS.transactionIcon} />
//                 <div>
//                   <p className={HistoryCSS.transactionDate}>2014-02-02</p>
//                   <span className={HistoryCSS.transactionType}>Investment</span>
//                 </div>
//               </div>

//               {/* Right: Amount */}
//               <div className={HistoryCSS.transactionAmount}>$1324</div>

//               {/* Separator */}
//               <div className={HistoryCSS.verticalSeparator}></div>

//               {/* Action Buttons */}
//               <div className={HistoryCSS.transactionActions}>
//                 <button
//                   type="button"
//                   className={`btn btn-link ${HistoryCSS.updateBtn}`}
//                   aria-label="Update transaction"
//                   onClick={() => console.log("Update clicked")}
//                 >
//                   Update
//                 </button>
//                 <button
//                   type="button"
//                   className={`btn btn-link ${HistoryCSS.deleteBtn}`}
//                   aria-label="Delete transaction"
//                   onClick={() => console.log("Delete clicked")}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </li>
//           {/* Add more transaction items here */}
//         </ul>
//       </div>
//     </main>
//   );
// }
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

  useEffect(() => {
    // Fetch transactions
    fetch(`${API_URL}/transactions`)
      .then((response) => response.json())
      .then((data) => setTransactions(data.filter((txn) => txn.amount > 0)))
      .catch((error) => console.error("Error loading transactions:", error));
  }, []);

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

  const updateTransaction = (transaction) => {
    navigate(`/input/update/${transaction.id}`, {
      state: {
        transactionData: {
          id: transaction.id,
          category: transaction.category,
          amount: transaction.amount,
          date: transaction.date,
          description: transaction.description,
          type: transaction.type,
        },
      },
    });
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by date, category, amount..."
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* More Filters Button */}
      <button
        className="btn btn-link mb-3"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "More Filters"}
      </button>

      {/* Advanced Filters */}
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
              <div className="card-body p-3">
                {/* Flexbox container for all items */}
                <div className="d-flex justify-content-between align-items-center">
                  {/* Transaction Date and Category - Left aligned */}
                  <div className="d-flex w-75">
                    <div className="transactionDate me-3">
                      <p className="m-0">{txn.date}</p>
                    </div>
                    <div className="transactionCategory">
                      <p className="m-0">{txn.category}</p>{" "}
                      {/* Use category directly */}
                    </div>
                  </div>

                  {/* Amount - Right aligned */}
                  <div className="transactionAmount ms-auto">
                    <span
                      className={
                        txn.type === "income" ? "text-success" : "text-danger"
                      }
                    >
                      {txn.type === "income"
                        ? `+${txn.amount}`
                        : `-${txn.amount}`}
                    </span>
                  </div>

                  {/* Expand Button - Aligned on the far right */}
                  <button
                    className="btn btn-link text-muted ms-3"
                    onClick={() => toggleExpand(txn.id)}
                  >
                    {expanded[txn.id] ? (
                      <Icon.ChevronUp />
                    ) : (
                      <Icon.ChevronDown />
                    )}
                  </button>
                </div>

                {/* Expanded details (hidden until clicked) */}
                {expanded[txn.id] && (
                  <div className="card-body">
                    <p className="transactionNotes">
                      {txn.description
                        ? txn.description.split("\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))
                        : "No notes."}
                    </p>
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
