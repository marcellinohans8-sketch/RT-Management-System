import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import { residentStatusLabel } from "../utils/format";

const emptyForm = {
  resident_id: "",
  house_id: "",
  start_date: "",
  end_date: "",
};

function ResidentHistories() {
  const [histories, setHistories] = useState([]);
  const [residents, setResidents] = useState([]);
  const [houses, setHouses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingHistory(null);
    setErrorMessage("");
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (editingHistory) {
        await api.put(`/resident-histories/${editingHistory.id}`, form);
      } else {
        await api.post("/resident-histories", form);
      }

      await fetchData();
      resetForm();
      setShowModal(false);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Riwayat hunian gagal disimpan.",
      );
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
    if (!window.confirm("Hapus riwayat hunian ini?")) return;

    try {
      await api.delete(`/resident-histories/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Riwayat Hunian</h1>
          <p className="mt-1 text-sm text-slate-500">
            Catatan historis penghuni pada setiap rumah.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Riwayat
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-6 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="py-3 text-left">Penghuni</th>
              <th>Rumah</th>
              <th>Tanggal Masuk</th>
              <th>Tanggal Keluar</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {histories.map((history) => (
              <tr key={history.id} className="border-b">
                <td className="py-3">
                  <p className="font-medium">{history.resident?.full_name}</p>
                  <p className="text-xs text-slate-500">
                    {residentStatusLabel[history.resident?.resident_status]}
                  </p>
                </td>
                <td className="text-center">{history.house?.house_number}</td>
                <td className="text-center">{history.start_date}</td>
                <td className="text-center">{history.end_date || "-"}</td>
                <td className="text-center">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      history.end_date
                        ? "bg-slate-100 text-slate-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {history.end_date ? "Selesai" : "Aktif"}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => handleEdit(history)}
                    className="mr-4 font-medium text-blue-600"
                  >
                    Ubah
                  </button>
                  <button
                    onClick={() => handleDelete(history.id)}
                    className="font-medium text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {histories.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  Belum ada riwayat hunian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingHistory ? "Ubah Riwayat Hunian" : "Tambah Riwayat Hunian"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  onChange={(event) => setForm({ ...form, house_id: event.target.value })}
                  required
                >
                  <option value="">Pilih rumah</option>
                  {houses.map((house) => (
                    <option key={house.id} value={house.id}>
                      {house.house_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Tanggal Masuk</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={form.start_date}
                    onChange={(event) =>
                      setForm({ ...form, start_date: event.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tanggal Keluar</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={form.end_date}
                    onChange={(event) =>
                      setForm({ ...form, end_date: event.target.value })
                    }
                  />
                </div>
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

export default ResidentHistories;
