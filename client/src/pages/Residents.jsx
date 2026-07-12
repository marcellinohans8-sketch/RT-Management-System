import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { residentStatusLabel } from "../utils/format";

const storageUrl = "http://127.0.0.1:8000/storage";

function Residents() {
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResidents();
  }, []);

  const resetForm = () => {
    setEditingResident(null);
    setPreview(null);
    setErrorMessage("");
    setForm({
      full_name: "",
      ktp_number: "",
      resident_status: "permanent",
      phone_number: "",
      is_married: false,
      ktp_photo: null,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

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
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/residents", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchResidents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Data penghuni gagal disimpan.",
      );
    }
  };

  const handleEdit = (resident) => {
    setEditingResident(resident);
    setForm({
      full_name: resident.full_name,
      ktp_number: resident.ktp_number,
      resident_status: resident.resident_status,
      phone_number: resident.phone_number,
      is_married: Boolean(resident.is_married),
      ktp_photo: null,
    });
    setPreview(resident.ktp_photo ? `${storageUrl}/${resident.ktp_photo}` : null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus data penghuni ini?")) return;

    try {
      await api.delete(`/residents/${id}`);
      fetchResidents();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Data Penghuni</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola identitas warga tetap dan kontrak, termasuk foto KTP.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Penghuni
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="px-4 py-3 text-left">Nama Lengkap</th>
              <th className="px-4 text-left">Nomor KTP</th>
              <th className="px-4 text-center">Foto KTP</th>
              <th className="px-4 text-center">Status</th>
              <th className="px-4 text-center">Telepon</th>
              <th className="px-4 text-center">Pernikahan</th>
              <th className="px-4 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-4 font-medium text-slate-800">
                  {resident.full_name}
                </td>
                <td className="px-4 text-slate-600">{resident.ktp_number}</td>
                <td className="px-4 text-center">
                  {resident.ktp_photo ? (
                    <img
                      src={`${storageUrl}/${resident.ktp_photo}`}
                      alt={`KTP ${resident.full_name}`}
                      className="mx-auto h-12 w-20 rounded border object-cover"
                    />
                  ) : (
                    <span className="text-sm text-slate-400">Belum ada</span>
                  )}
                </td>
                <td className="px-4 text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      resident.resident_status === "permanent"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {residentStatusLabel[resident.resident_status]}
                  </span>
                </td>
                <td className="px-4 text-center">{resident.phone_number}</td>
                <td className="px-4 text-center">
                  {resident.is_married ? "Menikah" : "Belum menikah"}
                </td>
                <td className="px-4 text-center">
                  <button
                    onClick={() => handleEdit(resident)}
                    className="mr-4 font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(resident.id)}
                    className="font-medium text-red-600 hover:text-red-800"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {residents.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  Belum ada data penghuni.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingResident ? "Ubah Penghuni" : "Tambah Penghuni"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border p-2"
                    value={form.full_name}
                    onChange={(event) =>
                      setForm({ ...form, full_name: event.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Nomor KTP</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border p-2"
                    value={form.ktp_number}
                    onChange={(event) =>
                      setForm({ ...form, ktp_number: event.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Status Penghuni</label>
                  <select
                    className="w-full rounded-lg border p-2"
                    value={form.resident_status}
                    onChange={(event) =>
                      setForm({ ...form, resident_status: event.target.value })
                    }
                  >
                    <option value="permanent">Tetap</option>
                    <option value="contract">Kontrak</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block font-medium">Nomor Telepon</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border p-2"
                    value={form.phone_number}
                    onChange={(event) =>
                      setForm({ ...form, phone_number: event.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium">Foto KTP</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full rounded-lg border p-2"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setForm({ ...form, ktp_photo: file });
                    setPreview(file ? URL.createObjectURL(file) : preview);
                  }}
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview KTP"
                    className="mt-3 h-32 w-52 rounded-lg border object-cover"
                  />
                )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_married}
                  onChange={(event) =>
                    setForm({ ...form, is_married: event.target.checked })
                  }
                />
                <span>Sudah menikah</span>
              </label>

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
                  {editingResident ? "Simpan Perubahan" : "Simpan"}
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
