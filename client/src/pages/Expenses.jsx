import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "other",
    description: "",
    amount: "",
    expense_date: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingExpense(null);

    setForm({
      title: "",
      category: "other",
      description: "",
      amount: "",
      expense_date: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, form);
      } else {
        await api.post("/expenses", form);
      }

      fetchExpenses();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setForm({
      title: expense.title,
      category: expense.category,
      description: expense.description || "",
      amount: expense.amount,
      expense_date: expense.expense_date,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Expenses</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Expense
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="py-3">{expense.title}</td>

                <td className="text-center">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {expense.category}
                  </span>
                </td>

                <td className="text-center">{expense.description || "-"}</td>

                <td className="text-center">
                  Rp {Number(expense.amount).toLocaleString("id-ID")}
                </td>

                <td className="text-center">{expense.expense_date}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Category</label>

                <select
                  className="w-full border rounded-lg p-2"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  <option value="security">Security</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="road">Road</option>
                  <option value="drainage">Drainage</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>

                <textarea
                  rows="3"
                  className="w-full border rounded-lg p-2"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Amount</label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Expense Date</label>

                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.expense_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expense_date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  {editingExpense ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Expenses;
