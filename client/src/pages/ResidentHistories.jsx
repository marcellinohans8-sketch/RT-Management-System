import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function ResidentHistories() {
  const [histories, setHistories] = useState([]);
  const [residents, setResidents] = useState([]);
  const [houses, setHouses] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);

  const [form, setForm] = useState({
    resident_id: "",
    house_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, residentRes, houseRes] = await Promise.all([
        api.get("/resident-histories"),
        api.get("/residents"),
        api.get("/houses"),
      ]);

      setHistories(historyRes.data);
      setResidents(residentRes.data);
      setHouses(houseRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingHistory(null);

    setForm({
      resident_id: "",
      house_id: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingHistory) {
        await api.put(`/resident-histories/${editingHistory.id}`, form);
      } else {
        await api.post("/resident-histories", form);
      }

      fetchData();

      resetForm();

      setShowModal(false);
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleEdit = (history) => {
    setEditingHistory(history);

    setForm({
      resident_id: history.resident_id,
      house_id: history.house_id,
      start_date: history.start_date,
      end_date: history.end_date || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resident history?")) return;

    try {
      await api.delete(`/resident-histories/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resident Histories</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add History
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Resident</th>
              <th>House</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {histories.map((history) => (
              <tr key={history.id} className="border-b">
                <td className="py-3">{history.resident.full_name}</td>

                <td className="text-center">{history.house.house_number}</td>

                <td className="text-center">{history.start_date}</td>

                <td className="text-center">{history.end_date || "-"}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(history)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(history.id)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold mb-5">
              {editingHistory ? "Edit History" : "Add History"}
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

              <div>
                <label className="block mb-1 font-medium">House</label>

                <select
                  className="w-full border rounded-lg p-2"
                  value={form.house_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      house_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select House</option>

                  {houses.map((house) => (
                    <option key={house.id} value={house.id}>
                      {house.house_number}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Start Date</label>

                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.start_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      start_date: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">End Date</label>

                <input
                  type="date"
                  className="w-full border rounded-lg p-2"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      end_date: e.target.value,
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
                  {editingHistory ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ResidentHistories;
