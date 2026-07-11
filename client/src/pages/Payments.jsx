import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const [form, setForm] = useState({
    resident_id: "",
    month: 1,
    year: new Date().getFullYear(),
    security_fee: 0,
    cleaning_fee: 0,
    total: 0,
    status: "unpaid",
    paid_at: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      total: Number(prev.security_fee || 0) + Number(prev.cleaning_fee || 0),
    }));
  }, [form.security_fee, form.cleaning_fee]);

  const fetchData = async () => {
    try {
      const [paymentRes, residentRes] = await Promise.all([
        api.get("/payments"),
        api.get("/residents"),
      ]);

      setPayments(paymentRes.data);
      setResidents(residentRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingPayment(null);

    setForm({
      resident_id: "",
      month: 1,
      year: new Date().getFullYear(),
      security_fee: 0,
      cleaning_fee: 0,
      total: 0,
      status: "unpaid",
      paid_at: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPayment) {
        await api.put(`/payments/${editingPayment.id}`, form);
      } else {
        await api.post("/payments", form);
      }

      fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);

    setForm({
      resident_id: payment.resident_id,
      month: payment.month,
      year: payment.year,
      security_fee: payment.security_fee,
      cleaning_fee: payment.cleaning_fee,
      total: payment.total,
      status: payment.status,
      paid_at: payment.paid_at || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
      await api.delete(`/payments/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Payment
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Resident</th>
              <th>Month</th>
              <th>Year</th>
              <th>Total</th>
              <th>Status</th>
              <th>Paid Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="py-3">{payment.resident.full_name}</td>

                <td className="text-center">{payment.month}</td>

                <td className="text-center">{payment.year}</td>

                <td className="text-center">
                  Rp {Number(payment.total).toLocaleString("id-ID")}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>

                <td className="text-center">{payment.paid_at || "-"}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(payment.id)}
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
              {editingPayment ? "Edit Payment" : "Add Payment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Resident</label>

                <select
                  className="w-full border rounded-lg p-2"
                  value={form.resident_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      resident_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select Resident</option>

                  {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                      {resident.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Month</label>

                  <select
                    className="w-full border rounded-lg p-2"
                    value={form.month}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        month: e.target.value,
                      })
                    }
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Year</label>

                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={form.year}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        year: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Security Fee</label>

                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={form.security_fee}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        security_fee: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Cleaning Fee</label>

                  <input
                    type="number"
                    className="w-full border rounded-lg p-2"
                    value={form.cleaning_fee}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cleaning_fee: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Total</label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-2 bg-gray-100"
                  value={form.total}
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>

                <select
                  className="w-full border rounded-lg p-2"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Paid Date</label>

                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.paid_at}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paid_at: e.target.value,
                    })
                  }
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
                  {editingPayment ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Payments;
