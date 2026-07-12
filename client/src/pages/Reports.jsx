import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Reports() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());

  const [report, setReport] = useState(null);

  const fetchReport = async () => {
    try {
      const { data } = await api.get(
        `/reports/monthly?month=${month}&year=${year}`,
      );

      setReport(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Monthly Report</h1>

        <div className="flex gap-3">
          <select
            className="border rounded-lg px-3 py-2"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border rounded-lg px-3 py-2 w-28"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Total Income</p>

              <h2 className="text-3xl font-bold text-green-600">
                Rp {Number(report.total_income).toLocaleString()}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Total Expense</p>

              <h2 className="text-3xl font-bold text-red-600">
                Rp {Number(report.total_expense).toLocaleString()}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-gray-500">Cash Balance</p>

              <h2
                className={`text-3xl font-bold ${
                  report.cash_balance >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                Rp {Number(report.cash_balance).toLocaleString()}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payments</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Resident</th>

                  <th>Status</th>

                  <th>Total</th>

                  <th>Paid At</th>
                </tr>
              </thead>

              <tbody>
                {report.payments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No Payments
                    </td>
                  </tr>
                ) : (
                  report.payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3">{payment.resident?.full_name}</td>

                      <td className="text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            payment.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>

                      <td className="text-center">
                        Rp {Number(payment.total).toLocaleString()}
                      </td>

                      <td className="text-center">{payment.paid_at ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Expenses</h2>

            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Description</th>

                  <th>Amount</th>

                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {report.expenses.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-400">
                      No Expenses
                    </td>
                  </tr>
                ) : (
                  report.expenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="py-3">{expense.description}</td>

                      <td className="text-center">
                        Rp {Number(expense.amount).toLocaleString()}
                      </td>

                      <td className="text-center">{expense.expense_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
}

export default Reports;
