import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchChart();
  }, []);

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

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];

      const result = months.map((month, index) => {
        const income = data.income.find((item) => item.month === index + 1);

        const expense = data.expense.find((item) => item.month === index + 1);

        return {
          month,
          income: income ? Number(income.total_income) : 0,
          expense: expense ? Number(expense.total_expense) : 0,
        };
      });

      setChartData(result);
    } catch (error) {
      console.error(error);
    }
  };

  if (!summary) {
    return (
      <Layout>
        <div className="text-center text-xl font-semibold mt-10">
          Loading Dashboard...
        </div>
      </Layout>
    );
  }

  const cards = [
    {
      title: "Total Residents",
      value: summary.total_residents,
    },
    {
      title: "Total Houses",
      value: summary.total_houses,
    },
    {
      title: "Occupied Houses",
      value: summary.occupied_houses,
    },
    {
      title: "Vacant Houses",
      value: summary.vacant_houses,
    },
    {
      title: "Total Income",
      value: `Rp ${Number(summary.total_income).toLocaleString("id-ID")}`,
    },
    {
      title: "Total Expense",
      value: `Rp ${Number(summary.total_expense).toLocaleString("id-ID")}`,
    },
    {
      title: "Cash Balance",
      value: `Rp ${Number(summary.cash_balance).toLocaleString("id-ID")}`,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <p className="text-gray-500 mt-1">RT Management System Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <h2 className="text-gray-500 text-sm">{card.title}</h2>

              <p className="text-3xl font-bold mt-3 text-slate-800">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-5">Income vs Expense</h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="income" fill="#22c55e" name="Income" />

              <Bar dataKey="expense" fill="#ef4444" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
