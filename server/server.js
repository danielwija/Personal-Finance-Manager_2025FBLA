/* ====== AI Generated Code ====== */

import express from "express";
import cors from "cors";
import fs from "fs";

const PORT = 5000;
const DATA_FILE = "./data.json";

const app = express();
app.use(express.json());
app.use(cors());

// Helper function to read data from the JSON file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (err) {
    // Return default data structure if file doesn't exist or on error
    return { incomeCat: [], expenseCat: [], transactions: [] };
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing to file", err);
  }
};

// Helper function to get the category name from categoryId
const getCategoryName = (categoryId, type) => {
  const data = readDataFromFile();
  let categoryList = type === "income" ? data.incomeCat : data.expenseCat;
  const category = categoryList.find((cat) => cat.id === categoryId);
  return category ? category.catName : "Uncategorized";
};

// API to get all transactions with category names
app.get("/api/transactions", (req, res) => {
  const data = readDataFromFile();

  const transactionsWithCategoryNames = data.transactions.map((txn) => ({
    ...txn,
    category: getCategoryName(txn.categoryId, txn.type),
  }));

  res.json(transactionsWithCategoryNames);
});

// API to get a specific transaction by its ID with category name
app.get("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const data = readDataFromFile();

  const transaction = data.transactions.find((txn) => txn.id == id);

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Add category name to the transaction response
  const transactionWithCategory = {
    ...transaction,
    category: getCategoryName(transaction.categoryId, transaction.type),
  };

  res.json(transactionWithCategory);
});

// API to add a new transaction
app.post("/api/transactions/add", (req, res) => {
  const data = readDataFromFile();

  const newTransaction = req.body;
  newTransaction["id"] = Date.now();

  // Ensure the transaction follows the correct structure
  const formattedTransaction = {
    id: newTransaction.id,
    type: newTransaction.txnType
      ? newTransaction.txnType.toLowerCase()
      : "expense", // default type if missing
    categoryId: newTransaction.txnCatId, // Use categoryId for reference
    amount: newTransaction.txnAmt,
    date: newTransaction.txnDate,
    description: newTransaction.txnNote || "No notes", // Default to 'No notes' if no description
  };

  data.transactions.push(formattedTransaction);
  writeDataToFile(data);

  res.status(201).json(formattedTransaction);
});

// API to delete a transaction by its ID
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const data = readDataFromFile();

  const index = data.transactions.findIndex((txn) => txn.id == id);
  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  const deletedTransaction = data.transactions.splice(index, 1);
  writeDataToFile(data);

  res.json(deletedTransaction);
});

// API to edit an existing transaction by its ID
app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  const data = readDataFromFile();

  const index = data.transactions.findIndex((txn) => txn.id == id);

  if (index === -1) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  // Merge existing transaction with updated fields and ensure it matches the correct format
  const updatedTransaction = {
    ...data.transactions[index],
    ...updatedFields,
    id: data.transactions[index].id,
  };

  // Ensure the updated transaction follows the correct structure
  const formattedTransaction = {
    id: updatedTransaction.id,
    type: updatedTransaction.txnType
      ? updatedTransaction.txnType.toLowerCase()
      : "expense", // default type if missing
    categoryId:
      updatedTransaction.txnCatId || data.transactions[index].categoryId, // Use categoryId for reference
    amount: updatedTransaction.txnAmt,
    date: updatedTransaction.txnDate,
    description: updatedTransaction.txnNote || "No notes", // Default to 'No notes' if no description
  };

  data.transactions[index] = formattedTransaction;
  writeDataToFile(data);

  res.status(200).json(formattedTransaction);
});

// API to get income categories
app.get("/api/income-categories", (req, res) => {
  const data = readDataFromFile();
  res.json(data.incomeCat);
});

// API to get expense categories
app.get("/api/expense-categories", (req, res) => {
  const data = readDataFromFile();
  res.json(data.expenseCat);
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
