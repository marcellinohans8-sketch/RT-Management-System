import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { categoryLabel, formatCurrency } from "../utils/format";

const emptyExpenseForm = {
  title: "",
  category: "other",
  description: "",
  amount: "",
  expense_date: "",
};

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [form, setForm] = useState(emptyExpenseForm);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get("/expenses");
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses();
  }, []);

  const resetForm = () => {
    setEditingExpense(null);
    setErrorMessage("");
    setForm(emptyExpenseForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, form);
      } else {
        await api.post("/expenses", form);
      }

      await fetchExpenses();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Data pengeluaran gagal disimpan.",
      );
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
    if (!window.confirm("Hapus data pengeluaran ini?")) return;

    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pengeluaran Kas</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catat biaya rutin dan non-rutin seperti gaji satpam, token listrik, jalan,
            dan selokan.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Pengeluaran
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="py-3 text-left">Judul</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Nominal</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="py-3 font-medium">{expense.title}</td>
                <td className="text-center">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {categoryLabel[expense.category]}
                  </span>
                </td>
                <td className="text-center text-slate-600">
                  {expense.description || "-"}
                </td>
                <td className="text-center font-semibold">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="text-center">{expense.expense_date}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="mr-4 font-medium text-blue-600"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="font-medium text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {expenses.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Belum ada data pengeluaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingExpense ? "Ubah Pengeluaran" : "Tambah Pengeluaran"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Judul</label>
                <input
                  type="text"
                  className="w-full rounded-lg border p-2"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Kategori</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  <option value="security">Satpam</option>
                  <option value="cleaning">Kebersihan</option>
                  <option value="road">Perbaikan jalan</option>
                  <option value="drainage">Perbaikan selokan</option>
                  <option value="maintenance">Pemeliharaan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">Deskripsi</label>
                <textarea
                  rows="3"
                  className="w-full rounded-lg border p-2"
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Nominal</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border p-2"
                    value={form.amount}
                    onChange={(event) =>
                      setForm({ ...form, amount: event.target.value })
                    }
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tanggal</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={form.expense_date}
                    onChange={(event) =>
                      setForm({ ...form, expense_date: event.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="rounded-lg border px-4 py-2 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
                >
                  Simpan
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
