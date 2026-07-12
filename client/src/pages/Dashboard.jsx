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
import { formatCurrency, shortMonthNames } from "../utils/format";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/dashboard");
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChart = async () => {
    try {
      const { data } = await api.get("/dashboard/chart");
      const result = shortMonthNames.map((month, index) => {
        const income = data.income.find((item) => item.month === index + 1);
        const expense = data.expense.find((item) => item.month === index + 1);

        return {
          month,
          pemasukan: income ? Number(income.total_income) : 0,
          pengeluaran: expense ? Number(expense.total_expense) : 0,
        };
      });

      setChartData(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
    fetchChart();
  }, []);

  if (!summary) {
    return (
      <Layout>
        <div className="mt-10 text-center text-xl font-semibold">
          Memuat dashboard...
        </div>
      </Layout>
    );
  }

  const cards = [
    { title: "Total Penghuni", value: summary.total_residents },
    { title: "Total Rumah", value: summary.total_houses },
    { title: "Rumah Dihuni", value: summary.occupied_houses },
    { title: "Rumah Tidak Dihuni", value: summary.vacant_houses },
    { title: "Total Pemasukan", value: formatCurrency(summary.total_income) },
    { title: "Total Pengeluaran", value: formatCurrency(summary.total_expense) },
    { title: "Saldo Kas", value: formatCurrency(summary.cash_balance) },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan administrasi iuran satpam, kebersihan, dan pengeluaran RT.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-lg bg-white p-5 shadow">
              <h2 className="text-sm text-slate-500">{card.title}</h2>
              <p className="mt-3 text-3xl font-bold text-slate-800">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">
              Pemasukan vs Pengeluaran Tahun Ini
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="pemasukan" fill="#16a34a" name="Pemasukan" />
                <Bar dataKey="pengeluaran" fill="#dc2626" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Tarif Iuran</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Satpam</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(100000)}</p>
                <p className="text-sm text-slate-500">per rumah per bulan</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Kebersihan</p>
                <p className="mt-1 text-2xl font-bold">{formatCurrency(15000)}</p>
                <p className="text-sm text-slate-500">per rumah per bulan</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-slate-500">Aturan Penagihan</p>
                <p className="mt-1 text-sm text-slate-700">
                  Penghuni tetap ditagih setiap bulan. Rumah kontrak ditagih saat ada
                  penghuni aktif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
