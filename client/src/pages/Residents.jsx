import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";

function Residents() {
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    ktp_number: "",
    resident_status: "permanent",
    phone_number: "",
    is_married: false,
    ktp_photo: null,
  });

  const fetchResidents = async () => {
    try {
      const { data } = await api.get("/residents");
      setResidents(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const resetForm = () => {
    setEditingResident(null);
    setPreview(null);

    setForm({
      full_name: "",
      ktp_number: "",
      resident_status: "permanent",
      phone_number: "",
      is_married: false,
      ktp_photo: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("full_name", form.full_name);
      formData.append("ktp_number", form.ktp_number);
      formData.append("resident_status", form.resident_status);
      formData.append("phone_number", form.phone_number);
      formData.append("is_married", form.is_married ? 1 : 0);

      if (form.ktp_photo) {
        formData.append("ktp_photo", form.ktp_photo);
      }

      if (editingResident) {
        formData.append("_method", "PUT");

        await api.post(`/residents/${editingResident.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/residents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
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
      ktp_photo: null,
    });

    if (resident.ktp_photo) {
      setPreview(`http://127.0.0.1:8000/storage/${resident.ktp_photo}`);
    } else {
      setPreview(null);
    }

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
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-center">KTP</th>
              <th className="text-center">Status</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Married</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">{resident.full_name}</td>

                <td className="text-center">
                  {resident.ktp_photo ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${resident.ktp_photo}`}
                      alt="KTP"
                      className="w-20 h-12 object-cover rounded border mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400">No Photo</span>
                  )}
                </td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      resident.resident_status === "permanent"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {resident.resident_status}
                  </span>
                </td>

                <td className="text-center">{resident.phone_number}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      resident.is_married
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {resident.is_married ? "Married" : "Single"}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    onClick={() => handleEdit(resident)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(resident.id)}
                    className="text-red-600 hover:text-red-800"
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
          <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
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

              <div>
                <label className="block mb-1 font-medium">KTP Photo</label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full border rounded-lg p-2"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    setForm({
                      ...form,
                      ktp_photo: file,
                    });

                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-52 mt-3 rounded-lg border"
                  />
                )}
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
