import { useEffect, useState } from "react";
import api from "../api";

function Rumah() {
  const [data, setData] = useState([]);
  const [penghuni, setPenghuni] = useState([]);
  const [nomor, setNomor] = useState("");

  const [selectedPenghuni, setSelectedPenghuni] = useState("");
  const [selectedRumah, setSelectedRumah] = useState("");

  const load = () => {
    api.get("/rumah").then(res => setData(res.data));
    api.get("/penghuni").then(res => setPenghuni(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const tambah = () => {
    if (!nomor) return alert("Isi nomor rumah");

    api.post("/rumah", { nomor, status: "kosong" })
      .then(() => {
        setNomor("");
        load();
      });
  };

  const assign = () => {
    if (!selectedPenghuni || !selectedRumah) {
      alert("Pilih semua dulu");
      return;
    }

    api.post("/assign", {
      penghuni_id: selectedPenghuni,
      rumah_id: selectedRumah
    })
    .then(res => {
      alert(res.data.message);
      load();
    })
    .catch(err => {
      alert(err.response?.data?.message || "Gagal assign");
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏠 Data Rumah</h2>

      {/* TAMBAH RUMAH */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nomor Rumah"
          value={nomor}
          onChange={(e) => setNomor(e.target.value)}
        />
        <button style={styles.btn} onClick={tambah}>
          Tambah
        </button>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {data.map(d => {
          const penghuniAktif = d.penghuni_aktif?.penghuni;

          return (
            <div key={d.id} style={styles.card}>

              {/* HEADER */}
              <div style={styles.header}>
                <h3> Rumah {d.nomor}</h3>

                <span style={{
                  ...styles.badge,
                  background: d.status === "dihuni"
                    ? "#22c55e"
                    : "#64748b"
                }}>
                  {d.status}
                </span>
              </div>

              {/* PENGHUNI AKTIF */}
              <div style={styles.activeBox}>
                <div style={styles.label}>👤 Penghuni Aktif</div>

                {penghuniAktif ? (
                  <>
                    <div style={styles.nama}>
                      {penghuniAktif.nama}
                    </div>

                    <div style={styles.small}>
                      Masuk: {d.penghuni_aktif?.tanggal_masuk?.slice(0,10)}
                    </div>

                    <span style={{
                      ...styles.smallBadge,
                      background:
                        penghuniAktif.status === "tetap"
                          ? "#2563eb"
                          : "#f59e0b"
                    }}>
                      {penghuniAktif.status}
                    </span>
                  </>
                ) : (
                  <span style={styles.kosong}>Kosong</span>
                )}
              </div>

              {/* HISTORY */}
              <div style={styles.box}>
                <div style={styles.label}>📜 History</div>

                {d.penghuni_history?.length > 0 ? (
                  d.penghuni_history.slice(-3).map((h, i) => (
                    <div key={i} style={styles.item}>
                      <b>{h.penghuni?.nama}</b>

                      <div style={styles.small}>
                        {h.tanggal_masuk?.slice(0,10)} → {h.tanggal_keluar ? h.tanggal_keluar.slice(0,10) : "-"}
                      </div>
                    </div>
                  ))
                ) : (
                  <span style={styles.kosong}>Belum ada</span>
                )}
              </div>

              {/* PEMBAYARAN */}
              <div style={styles.box}>
                <div style={styles.label}>💰 Pembayaran</div>

                {d.pembayarans?.length > 0 ? (
                  d.pembayarans.slice(-3).map((p, i) => (
                    <div key={i} style={styles.item}>
                      {p.bulan}

                      <span style={{
                        marginLeft: 6,
                        color: p.status === "lunas" ? "#22c55e" : "#ef4444",
                        fontWeight: "bold"
                      }}>
                        ({p.status})
                      </span>
                    </div>
                  ))
                ) : (
                  <span style={styles.kosong}>Belum ada</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ASSIGN */}
      <div style={styles.form}>
        <select
          style={styles.input}
          onChange={(e) => setSelectedPenghuni(e.target.value)}
        >
          <option value="">Pilih Penghuni</option>
          {penghuni.map(p => (
            <option key={p.id} value={p.id}>
              {p.nama} ({p.status})
            </option>
          ))}
        </select>

        <select
          style={styles.input}
          onChange={(e) => setSelectedRumah(e.target.value)}
        >
          <option value="">Pilih Rumah</option>
          {data.map(r => (
            <option key={r.id} value={r.id}>
              {r.nomor}
            </option>
          ))}
        </select>

        <button style={styles.btn} onClick={assign}>
          Assign
        </button>
      </div>
    </div>
  );
}

export default Rumah;


/* ================= STYLE ================= */

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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: 20
  },

  card: {
    background: "#111827",
    padding: 16,
    borderRadius: 14,
    border: "1px solid #1f2937",
    transition: "0.2s"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 11,
    color: "#fff"
  },

  activeBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    background: "#1f2937"
  },

  box: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    background: "#1f2937"
  },

  label: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4
  },

  nama: {
    fontWeight: "600"
  },

  item: {
    fontSize: 12,
    marginBottom: 6
  },

  small: {
    fontSize: 11,
    opacity: 0.6
  },

  kosong: {
    opacity: 0.5
  },

  smallBadge: {
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 10,
    color: "#fff",
    display: "inline-block",
    marginTop: 5
  },

  form: {
    display: "flex",
    gap: 10,
    marginTop: 20
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#1f2937",
    color: "#fff"
  },

  btn: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer"
  }
};