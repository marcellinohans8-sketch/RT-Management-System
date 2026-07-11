import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Residents() {
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    ktp_number: "",
    resident_status: "permanent",
    phone_number: "",
    is_married: false,
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const { data } = await api.get("/residents");
      setResidents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingResident(null);

    setForm({
      full_name: "",
      ktp_number: "",
      resident_status: "permanent",
      phone_number: "",
      is_married: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingResident) {
        await api.put(`/residents/${editingResident.id}`, form);
      } else {
        await api.post("/residents", form);
      }

      fetchResidents();

      setShowModal(false);

      resetForm();
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);

    setForm({
      full_name: resident.full_name,
      ktp_number: resident.ktp_number,
      resident_status: resident.resident_status,
      phone_number: resident.phone_number,
      is_married: resident.is_married,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resident?",
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/residents/${id}`);
      fetchResidents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Residents</h1>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Resident
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Name</th>
              <th className="text-center">Status</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Married</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id} className="border-b">
                <td className="py-3">{resident.full_name}</td>

                <td className="text-center">{resident.resident_status}</td>

                <td className="text-center">{resident.phone_number}</td>

                <td className="text-center">
                  {resident.is_married ? "Yes" : "No"}
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(resident)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(resident.id)}
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
              {editingResident ? "Edit Resident" : "Add Resident"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      full_name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">KTP Number</label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={form.ktp_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ktp_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Status</label>

                <select
                  className="w-full border rounded-lg p-2"
                  value={form.resident_status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      resident_status: e.target.value,
                    })
                  }
                >
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone Number</label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone_number: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_married"
                  type="checkbox"
                  checked={form.is_married}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      is_married: e.target.checked,
                    })
                  }
                />

                <label htmlFor="is_married">Married</label>
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
                  {editingResident ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Residents;
