import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/axios";
import {
  formatCurrency,
  houseStatusLabel,
  monthNames,
  paymentStatusLabel,
  residentStatusLabel,
} from "../utils/format";

const emptyHouseForm = {
  house_number: "",
  address: "",
  status: "vacant",
  notes: "",
};

const emptyOccupantForm = {
  resident_id: "",
  house_id: "",
  start_date: "",
  end_date: "",
};

function Houses() {
  const [houses, setHouses] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showHouseModal, setShowHouseModal] = useState(false);
  const [showOccupantModal, setShowOccupantModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState(null);
  const [editingHistory, setEditingHistory] = useState(null);
  const [houseForm, setHouseForm] = useState(emptyHouseForm);
  const [occupantForm, setOccupantForm] = useState(emptyOccupantForm);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchData = async () => {
    try {
      const [houseRes, residentRes] = await Promise.all([
        api.get("/houses"),
        api.get("/residents"),
      ]);
      setHouses(houseRes.data);
      setResidents(residentRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const resetHouseForm = () => {
    setEditingHouse(null);
    setHouseForm(emptyHouseForm);
    setErrorMessage("");
  };

  const resetOccupantForm = () => {
    setEditingHistory(null);
    setOccupantForm(emptyOccupantForm);
    setErrorMessage("");
  };

  const handleHouseSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (editingHouse) {
        await api.put(`/houses/${editingHouse.id}`, houseForm);
      } else {
        await api.post("/houses", houseForm);
      }

      await fetchData();
      setShowHouseModal(false);
      resetHouseForm();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Data rumah gagal disimpan.");
    }
  };

  const handleOccupantSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      if (editingHistory) {
        await api.put(`/resident-histories/${editingHistory.id}`, occupantForm);
      } else {
        await api.post("/resident-histories", occupantForm);
      }

      await fetchData();
      setShowOccupantModal(false);
      resetOccupantForm();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Data penghuni rumah gagal disimpan.",
      );
    }
  };

  const handleEditHouse = (house) => {
    setEditingHouse(house);
    setHouseForm({
      house_number: house.house_number,
      address: house.address,
      status: house.status,
      notes: house.notes || "",
    });
    setShowHouseModal(true);
  };

  const handleAddOccupant = (house) => {
    resetOccupantForm();
    setOccupantForm({
      ...emptyOccupantForm,
      house_id: house.id,
      start_date: new Date().toISOString().slice(0, 10),
    });
    setShowOccupantModal(true);
  };

  const handleEditOccupant = (history) => {
    setEditingHistory(history);
    setOccupantForm({
      resident_id: history.resident_id,
      house_id: history.house_id,
      start_date: history.start_date,
      end_date: history.end_date || "",
    });
    setShowOccupantModal(true);
  };

  const handleDeleteHouse = async (id) => {
    if (!window.confirm("Hapus rumah beserta histori terkait?")) return;

    try {
      await api.delete(`/houses/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const activeResidents = (house) =>
    house.resident_histories?.filter((history) => !history.end_date) || [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Data Rumah</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola 20 rumah, status hunian, penghuni aktif, histori hunian, dan tagihan.
          </p>
        </div>

        <button
          onClick={() => {
            resetHouseForm();
            setShowHouseModal(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Tambah Rumah
        </button>
      </div>

      <div className="grid gap-5">
        {houses.map((house) => {
          const occupants = activeResidents(house);

          return (
            <div key={house.id} className="rounded-lg bg-white p-5 shadow">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      Rumah {house.house_number}
                    </h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        house.status === "occupied"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {houseStatusLabel[house.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-600">{house.address}</p>
                  {house.notes && (
                    <p className="mt-1 text-sm text-slate-500">{house.notes}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddOccupant(house)}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    + Penghuni Rumah
                  </button>
                  <button
                    onClick={() => handleEditHouse(house)}
                    className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-100"
                  >
                    Ubah Rumah
                  </button>
                  <button
                    onClick={() => handleDeleteHouse(house.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-5 xl:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Penghuni Aktif</h3>
                  {occupants.length === 0 ? (
                    <p className="text-sm text-slate-400">Rumah sedang tidak dihuni.</p>
                  ) : (
                    <div className="space-y-3">
                      {occupants.map((history) => (
                        <div key={history.id} className="rounded-lg bg-slate-50 p-3">
                          <p className="font-medium">{history.resident?.full_name}</p>
                          <p className="text-sm text-slate-500">
                            {residentStatusLabel[history.resident?.resident_status]} sejak{" "}
                            {history.start_date}
                          </p>
                          <button
                            onClick={() => handleEditOccupant(history)}
                            className="mt-2 text-sm font-medium text-blue-600"
                          >
                            Ubah hunian
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Histori Hunian</h3>
                  <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                    {(house.resident_histories || []).length === 0 ? (
                      <p className="text-sm text-slate-400">Belum ada histori.</p>
                    ) : (
                      house.resident_histories.map((history) => (
                        <div key={history.id} className="text-sm">
                          <div className="flex justify-between gap-3">
                            <span className="font-medium">
                              {history.resident?.full_name}
                            </span>
                            <button
                              onClick={() => handleEditOccupant(history)}
                              className="text-blue-600"
                            >
                              Ubah
                            </button>
                          </div>
                          <p className="text-slate-500">
                            {history.start_date} - {history.end_date || "Sekarang"}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Histori Pembayaran</h3>
                  <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                    {(house.payments || []).length === 0 ? (
                      <p className="text-sm text-slate-400">Belum ada tagihan.</p>
                    ) : (
                      house.payments.slice(0, 8).map((payment) => (
                        <div key={payment.id} className="text-sm">
                          <div className="flex justify-between gap-3">
                            <span>
                              {monthNames[payment.month - 1]} {payment.year}
                            </span>
                            <span
                              className={
                                payment.status === "paid"
                                  ? "font-medium text-green-700"
                                  : "font-medium text-amber-700"
                              }
                            >
                              {paymentStatusLabel[payment.status]}
                            </span>
                          </div>
                          <p className="text-slate-500">
                            {payment.resident?.full_name} - {formatCurrency(payment.total)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showHouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingHouse ? "Ubah Rumah" : "Tambah Rumah"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleHouseSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Nomor Rumah</label>
                <input
                  type="text"
                  className="w-full rounded-lg border p-2"
                  value={houseForm.house_number}
                  onChange={(event) =>
                    setHouseForm({ ...houseForm, house_number: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Alamat</label>
                <textarea
                  className="w-full rounded-lg border p-2"
                  rows="3"
                  value={houseForm.address}
                  onChange={(event) =>
                    setHouseForm({ ...houseForm, address: event.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Status Rumah</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={houseForm.status}
                  onChange={(event) =>
                    setHouseForm({ ...houseForm, status: event.target.value })
                  }
                >
                  <option value="occupied">Dihuni</option>
                  <option value="vacant">Tidak dihuni</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">Catatan</label>
                <textarea
                  className="w-full rounded-lg border p-2"
                  rows="3"
                  value={houseForm.notes}
                  onChange={(event) =>
                    setHouseForm({ ...houseForm, notes: event.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowHouseModal(false);
                    resetHouseForm();
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

      {showOccupantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-bold">
              {editingHistory ? "Ubah Penghuni Rumah" : "Tambah Penghuni Rumah"}
            </h2>

            {errorMessage && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleOccupantSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Rumah</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={occupantForm.house_id}
                  onChange={(event) =>
                    setOccupantForm({ ...occupantForm, house_id: event.target.value })
                  }
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

              <div>
                <label className="mb-1 block font-medium">Penghuni</label>
                <select
                  className="w-full rounded-lg border p-2"
                  value={occupantForm.resident_id}
                  onChange={(event) =>
                    setOccupantForm({ ...occupantForm, resident_id: event.target.value })
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={occupantForm.start_date}
                    onChange={(event) =>
                      setOccupantForm({ ...occupantForm, start_date: event.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block font-medium">Tanggal Selesai</label>
                  <input
                    type="date"
                    className="w-full rounded-lg border p-2"
                    value={occupantForm.end_date}
                    onChange={(event) =>
                      setOccupantForm({ ...occupantForm, end_date: event.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOccupantModal(false);
                    resetOccupantForm();
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

export default Houses;
