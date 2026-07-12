import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  categoryLabel,
  formatCurrency,
  monthNames,
  paymentStatusLabel,
  shortMonthNames,
} from "../utils/format";

function Reports() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [yearlyReport, setYearlyReport] = useState([]);

  const fetchReports = async () => {
    try {
      const [monthlyRes, yearlyRes] = await Promise.all([
        api.get(`/reports/monthly?month=${month}&year=${year}`),
        api.get(`/reports/yearly?year=${year}`),
      ]);

      setMonthlyReport(monthlyRes.data);
      setYearlyReport(
        yearlyRes.data.months.map((item) => ({
          month: shortMonthNames[item.month - 1],
          pemasukan: Number(item.total_income),
          pengeluaran: Number(item.total_expense),
          saldo: Number(item.cash_balance),
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Laporan Kas RT</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pantau pemasukan, pengeluaran, piutang, dan saldo per bulan serta grafik 1 tahun.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-lg border px-3 py-2"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
          >
            {monthNames.map((monthName, index) => (
              <option key={monthName} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="w-28 rounded-lg border px-3 py-2"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
          />
          <button
            onClick={fetchReports}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Tampilkan
          </button>
        </div>
      </div>

      {monthlyReport && (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              label="Pemasukan Lunas"
              value={formatCurrency(monthlyReport.total_income)}
              color="text-green-700"
            />
            <SummaryCard
              label="Total Tagihan"
              value={formatCurrency(monthlyReport.total_receivable)}
              color="text-blue-700"
            />
            <SummaryCard
              label="Belum Lunas"
              value={formatCurrency(monthlyReport.total_unpaid)}
              color="text-amber-700"
            />
            <SummaryCard
              label="Pengeluaran"
              value={formatCurrency(monthlyReport.total_expense)}
              color="text-red-700"
            />
            <SummaryCard
              label="Saldo Bulan Ini"
              value={formatCurrency(monthlyReport.cash_balance)}
              color={monthlyReport.cash_balance >= 0 ? "text-slate-900" : "text-red-700"}
            />
          </div>

          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">
              Grafik Pemasukan dan Pengeluaran Tahun {year}
            </h2>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={yearlyReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="pemasukan" fill="#16a34a" name="Pemasukan" />
                <Bar dataKey="pengeluaran" fill="#dc2626" name="Pengeluaran" />
                <Bar dataKey="saldo" fill="#2563eb" name="Saldo" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">
                Detail Pemasukan {monthNames[month - 1]} {year}
              </h2>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b text-sm text-slate-500">
                    <th className="py-3 text-left">Penghuni</th>
                    <th>Rumah</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Tanggal Bayar</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.payments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        Belum ada pembayaran.
                      </td>
                    </tr>
                  ) : (
                    monthlyReport.payments.map((payment) => (
                      <tr key={payment.id} className="border-b text-sm">
                        <td className="py-3 font-medium">
                          {payment.resident?.full_name}
                        </td>
                        <td className="text-center">
                          {payment.house?.house_number || "-"}
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
                        <td className="text-center font-semibold">
                          {formatCurrency(payment.total)}
                        </td>
                        <td className="text-center">{payment.paid_at || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">
                Detail Pengeluaran {monthNames[month - 1]} {year}
              </h2>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b text-sm text-slate-500">
                    <th className="py-3 text-left">Judul</th>
                    <th>Kategori</th>
                    <th>Nominal</th>
                    <th>Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReport.expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400">
                        Belum ada pengeluaran.
                      </td>
                    </tr>
                  ) : (
                    monthlyReport.expenses.map((expense) => (
                      <tr key={expense.id} className="border-b text-sm">
                        <td className="py-3 font-medium">{expense.title}</td>
                        <td className="text-center">
                          {categoryLabel[expense.category]}
                        </td>
                        <td className="text-center font-semibold">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="text-center">{expense.expense_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default Reports;
