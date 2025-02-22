import { useState, useEffect } from "react";
import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import Input from "./pages/Input";
import History from "./pages/History";
import Summary from "./pages/Summary";
import NotFound from "./pages/NotFound";

function App() {
  const [incomeCat, setIncomeCat] = useState([]);
  const [expenseCat, setExpenseCat] = useState([]);

  useEffect(() => {
    async function fetchIncomeCategories() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/income-categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch income categories");
        }
        const data = await response.json();
        setIncomeCat(data);
      } catch (err) {
        console.error("Error fetching income categories:", err);
      }
    }
    fetchIncomeCategories();
  }, []);

  // Fetch expense categories
  useEffect(() => {
    async function fetchExpenseCategories() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/expense-categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch expense categories");
        }
        const data = await response.json();
        setExpenseCat(data);
      } catch (err) {
        console.error("Error fetching expense categories:", err);
      }
    }
    fetchExpenseCategories();
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/input/add" replace />} />
        <Route path="input" element={<Navigate to="/input/add" replace />} />
        <Route
          path="input/add"
          element={<Input incomeCat={incomeCat} expenseCat={expenseCat} />}
        />
        <Route
          path="input/:mode/:id"
          element={<Input incomeCat={incomeCat} expenseCat={expenseCat} />}
        />
        <Route path="history" element={<History />} />
        <Route path="summary" element={<Summary />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <div>
      {incomeCat.length === 0 || expenseCat.length === 0 ? (
        <div>Loading...</div>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
