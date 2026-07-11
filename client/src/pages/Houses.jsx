import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Houses() {
  const [houses, setHouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);

  const [form, setForm] = useState({
    house_number: "",
    address: "",
    status: "vacant",
    notes: "",
  });

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const { data } = await api.get("/houses");
      setHouses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingHouse(null);

    setForm({
      house_number: "",
      address: "",
      status: "vacant",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingHouse) {
        await api.put(`/houses/${editingHouse.id}`, form);
      } else {
        await api.post("/houses", form);
      }

      fetchHouses();

      setShowModal(false);

      resetForm();
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleEdit = (house) => {
    setEditingHouse(house);

    setForm({
      house_number: house.house_number,
      address: house.address,
      status: house.status,
      notes: house.notes || "",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this house?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/houses/${id}`);
      fetchHouses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Houses</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add House
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">House</th>
              <th className="text-left">Address</th>
              <th className="text-center">Status</th>
              <th className="text-left">Notes</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {houses.map((house) => (
              <tr key={house.id} className="border-b">
                <td className="py-3">{house.house_number}</td>

                <td>{house.address}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      house.status === "occupied"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {house.status}
                  </span>
                </td>

                <td>{house.notes || "-"}</td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(house)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(house.id)}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-5">
              {editingHouse ? "Edit House" : "Add House"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">House Number</label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={form.house_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      house_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Address</label>

                <textarea
                  className="w-full border rounded-lg p-2"
                  rows="3"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  required
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
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Notes</label>

                <textarea
                  className="w-full border rounded-lg p-2"
                  rows="3"
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
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
                  {editingHouse ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Houses;
