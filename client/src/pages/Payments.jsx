import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  formatCurrency,
  houseStatusLabel,
  monthNames,
  paymentStatusLabel,
  residentStatusLabel,
} from "../utils/format";

const defaultPaymentForm = {
  resident_id: "",
  house_id: "",
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  period_type: "monthly",
  period_start_month: new Date().getMonth() + 1,
  period_end_month: new Date().getMonth() + 1,
  security_fee: 100000,
  cleaning_fee: 15000,
  total: 115000,
  status: "unpaid",
  paid_at: "",
  notes: "",
};

function Payments() {
  const [payments, setPayments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [houses, setHouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [form, setForm] = useState(defaultPaymentForm);
  const [billMonth, setBillMonth] = useState(new Date().getMonth() + 1);
  const [billYear, setBillYear] = useState(new Date().getFullYear());
  const [errorMessage, setErrorMessage] = useState("");

  const total = useMemo(
    () => Number(form.security_fee || 0) + Number(form.cleaning_fee || 0),
    [form.security_fee, form.cleaning_fee],
  );

  const fetchData = async () => {
    try {
      const [paymentRes, residentRes, houseRes] = await Promise.all([
        api.get("/payments"),
        api.get("/residents"),
        api.get("/houses"),
      ]);

      setPayments(paymentRes.data);
      setResidents(residentRes.data);
      setHouses(houseRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingPayment(null);
    setErrorMessage("");
    setForm(defaultPaymentForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const payload = {
      ...form,
      house_id: form.house_id || null,
      total,
      paid_at: form.status === "paid" ? form.paid_at : "",
    };

    try {
      if (editingPayment) {
        await api.put(`/payments/${editingPayment.id}`, payload);
      } else {
        await api.post("/payments", payload);
      }

      await fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Data pembayaran gagal disimpan.",
      );
    }
  };

  const handleGenerateBills = async () => {
    try {
      const { data } = await api.post("/payments/generate", {
        month: billMonth,
        year: billYear,
      });
      await fetchData();
      window.alert(`${data.message}. Tagihan baru: ${data.created}`);
    } catch (error) {
      window.alert(error.response?.data?.message || "Tagihan gagal dibuat.");
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setForm({
      resident_id: payment.resident_id,
      house_id: payment.house_id || "",
      month: payment.month,
      year: payment.year,
      period_type: payment.period_type || "monthly",
      period_start_month: payment.period_start_month || payment.month,
      period_end_month: payment.period_end_month || payment.month,
      security_fee: payment.security_fee,
      cleaning_fee: payment.cleaning_fee,
      total: payment.total,
      status: payment.status,
      paid_at: payment.paid_at || "",
      notes: payment.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data pembayaran ini?")) return;

    try {
      await api.delete(`/payments/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const applyStandardFees = (periodType, startMonth, endMonth) => {
    const months = Math.max(1, Number(endMonth) - Number(startMonth) + 1);
    return {
      security_fee: 100000,
      cleaning_fee: periodType === "annual" ? 15000 * months : 15000,
    };
  };

  const handlePeriodTypeChange = (periodType) => {
    const startMonth = periodType === "annual" ? 1 : Number(form.month);
    const endMonth = periodType === "annual" ? 12 : Number(form.month);
    setForm({
      ...form,
      period_type: periodType,
      period_start_month: startMonth,
      period_end_month: endMonth,
      ...applyStandardFees(periodType, startMonth, endMonth),
    });
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pembayaran Iuran</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catat iuran satpam Rp100.000 dan kebersihan Rp15.000 per bulan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-lg border px-3 py-2"
            value={billMonth}
            onChange={(event) => setBillMonth(Number(event.target.value))}
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-28 rounded-lg border px-3 py-2"
            value={billYear}
            onChange={(event) => setBillYear(Number(event.target.value))}
          />
          <button
            onClick={handleGenerateBills}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            Buat Tagihan Bulanan
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            + Catat Pembayaran
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="py-3 text-left">Penghuni</th>
              <th className="text-left">Rumah</th>
              <th>Periode</th>
              <th>Satpam</th>
              <th>Kebersihan</th>
              <th>Total</th>
              <th>Status</th>
              <th>Tanggal Bayar</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b text-sm">
                <td className="py-3">
                  <p className="font-medium">{payment.resident?.full_name}</p>
                  <p className="text-xs text-slate-500">
                    {residentStatusLabel[payment.resident?.resident_status]}
                  </p>
                </td>
                <td>
                  {payment.house ? (
                    <div>
                      <p className="font-medium">{payment.house.house_number}</p>
                      <p className="text-xs text-slate-500">
                        {houseStatusLabel[payment.house.status]}
                      </p>
                    </div>
                  ) : (
                    <span className="text-slate-400">Otomatis dari histori</span>
                  )}
                </td>
                <td className="text-center">
                  <p>
                    {monthNames[payment.month - 1]} {payment.year}
                  </p>
                  <p className="text-xs text-slate-500">
                    {payment.period_type === "annual"
                      ? `${monthNames[payment.period_start_month - 1]} - ${
                          monthNames[payment.period_end_month - 1]
                        }`
                      : "Bulanan"}
                  </p>
                </td>
                <td className="text-center">{formatCurrency(payment.security_fee)}</td>
                <td className="text-center">{formatCurrency(payment.cleaning_fee)}</td>
                <td className="text-center font-semibold">
                  {formatCurrency(payment.total)}
                </td>
                <td className="text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {paymentStatusLabel[payment.status]}
                  </span>
                </td>
                <td className="text-center">{payment.paid_at || "-"}</td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(payment)}
                    className="mr-4 font-medium text-blue-600"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="font-medium text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-400">
                  Belum ada data pembayaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingPayment ? "Ubah Pembayaran" : "Catat Pembayaran"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Penghuni</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.resident_id}
                    onChange={(event) =>
                      setForm({ ...form, resident_id: event.target.value })
                    }
                    required
                  >
                    <option value="">Pilih penghuni</option>
                    {residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.full_name} ({residentStatusLabel[resident.resident_status]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Rumah</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.house_id}
                    onChange={(event) =>
                      setForm({ ...form, house_id: event.target.value })
                    }
                  >
                    <option value="">Otomatis dari histori penghuni</option>
                    {houses.map((house) => (
                      <option key={house.id} value={house.id}>
                        {house.house_number} - {houseStatusLabel[house.status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium">Bulan Tagihan</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.month}
                    onChange={(event) => {
                      const month = Number(event.target.value);
                      setForm({
                        ...form,
                        month,
                        period_start_month:
                          form.period_type === "monthly" ? month : form.period_start_month,
                        period_end_month:
                          form.period_type === "monthly" ? month : form.period_end_month,
                      });
                    }}
                  >
                    {monthNames.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tahun</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border p-2"
                    value={form.year}
                    onChange={(event) => setForm({ ...form, year: event.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Jenis Periode</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.period_type}
                    onChange={(event) => handlePeriodTypeChange(event.target.value)}
                  >
                    <option value="monthly">Bulanan</option>
                    <option value="annual">Tahunan kebersihan</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Mulai Periode</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.period_start_month}
                    onChange={(event) => {
                      const startMonth = Number(event.target.value);
                      const endMonth = Math.max(startMonth, Number(form.period_end_month));
                      setForm({
                        ...form,
                        period_start_month: startMonth,
                        period_end_month: endMonth,
                        ...applyStandardFees(form.period_type, startMonth, endMonth),
                      });
                    }}
                  >
                    {monthNames.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Akhir Periode</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.period_end_month}
                    onChange={(event) => {
                      const endMonth = Number(event.target.value);
                      const startMonth = Math.min(Number(form.period_start_month), endMonth);
                      setForm({
                        ...form,
                        period_start_month: startMonth,
                        period_end_month: endMonth,
                        ...applyStandardFees(form.period_type, startMonth, endMonth),
                      });
                    }}
                  >
                    {monthNames.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block font-medium">Iuran Satpam</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border p-2"
                    value={form.security_fee}
                    onChange={(event) =>
                      setForm({ ...form, security_fee: event.target.value })
                    }
                    min="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Iuran Kebersihan</label>
                  <input
                    type="number"
                    className="w-full rounded-lg border p-2"
                    value={form.cleaning_fee}
                    onChange={(event) =>
                      setForm({ ...form, cleaning_fee: event.target.value })
                    }
                    min="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Total</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border bg-slate-100 p-2"
                    value={formatCurrency(total)}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Status</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value,
                        paid_at:
                          event.target.value === "paid"
                            ? form.paid_at || new Date().toISOString().slice(0, 10)
                            : "",
                      })
                    }
                  >
                    <option value="unpaid">Belum lunas</option>
                    <option value="paid">Lunas</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tanggal Bayar</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={form.paid_at}
                    onChange={(event) =>
                      setForm({ ...form, paid_at: event.target.value })
                    }
                    disabled={form.status !== "paid"}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium">Catatan</label>
                <textarea
                  rows="3"
                  className="w-full rounded-lg border p-2"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                />
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

export default Payments;
