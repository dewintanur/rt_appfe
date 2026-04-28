import { useEffect, useState } from "react";
import api from "../api";

function Pengeluaran() {
  const [data, setData] = useState([]);

  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tipe, setTipe] = useState("rutin");

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  const load = () => {
    api.get("/pengeluaran")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    load();
  }, []);

  const tambah = () => {
    if (!nama || !jumlah) {
      setType("error");
      setMsg("Isi semua field");
      return;
    }

    api.post("/pengeluaran", {
      nama,
      jumlah: Number(jumlah),
      tipe
    })
    .then(() => {
      setType("success");
      setMsg("Berhasil tambah");

      setNama("");
      setJumlah("");
      setTipe("rutin");

      load();
    })
    .catch((err) => {
      console.log(err.response);
      setType("error");
      setMsg("Gagal tambah");
    });
  };

  const hapus = (id) => {
    api.delete(`/pengeluaran/${id}`)
      .then(() => load());
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  const formatTanggal = (tgl) => {
    if (!tgl) return "-";
    return new Date(tgl).toLocaleDateString("id-ID");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Pengeluaran</h2>

      {/* FORM */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Nama Pengeluaran"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Jumlah"
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
        />

        <select
          style={styles.input}
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
        >
          <option value="rutin">Rutin</option>
          <option value="tambahan">Tambahan</option>
        </select>

        <button style={styles.btn} onClick={tambah}>
          Tambah
        </button>

        {msg && (
          <div style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 8,
            background: type === "success" ? "#16a34a" : "#dc2626"
          }}>
            {msg}
          </div>
        )}
      </div>

      {/* LIST */}
      <div style={styles.grid}>
        {data.map(d => (
          <div key={d.id} style={styles.box}>
            <b>{d.nama}</b>

            <div style={styles.meta}>
              {d.tipe}
            </div>

            {/* 🔥 TANGGAL */}
            <div style={styles.date}>
              📅 {formatTanggal(d.tanggal)}
            </div>

            <div style={styles.money}>
              Rp {formatRupiah(d.jumlah)}
            </div>

            <button style={styles.delete} onClick={() => hapus(d.id)}>
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pengeluaran;


/*  STYLE */
const styles = {
  container: {
    padding: 24,
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff"
  },

  title: {
    fontSize: 22,
    marginBottom: 20
  },

  card: {
    background: "#111827",
    padding: 20,
    borderRadius: 14,
    maxWidth: 400,
    marginBottom: 20
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    background: "#1f2937",
    border: "none",
    borderRadius: 8,
    color: "#fff"
  },

  btn: {
    width: "100%",
    padding: 10,
    background: "#22c55e",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 12
  },

  box: {
    background: "#111827",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #1f2937"
  },

  meta: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4
  },

  date: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4
  },

  money: {
    marginTop: 6,
    color: "#22c55e",
    fontWeight: "bold"
  },

  delete: {
    marginTop: 10,
    padding: 6,
    background: "#ef4444",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer"
  }
};