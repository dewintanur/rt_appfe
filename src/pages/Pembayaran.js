import { useEffect, useState } from "react";
import api from "../api";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

function Pembayaran() {
  const [penghuni, setPenghuni] = useState([]);
  const [history, setHistory] = useState([]);
  const [belum, setBelum] = useState([]);
  const [summary, setSummary] = useState([]);
  const [saldo, setSaldo] = useState(null);
  const [detail, setDetail] = useState(null);

  const [selectedBulan, setSelectedBulan] = useState("January");

  const [selectedPenghuni, setSelectedPenghuni] = useState("");
  const [jenis, setJenis] = useState("satpam");
  const [bulan, setBulan] = useState("January");
  const [durasi, setDurasi] = useState(1);

  const [msg, setMsg] = useState("");
  const [type, setType] = useState("");

  const bulanList = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // ================= LOAD =================
  const loadSaldo = () => {
    api.get("/saldo").then(res => setSaldo(res.data));
  };

  const loadDetail = () => {
    api.get(`/detail-bulanan/${selectedBulan}`)
      .then(res => setDetail(res.data));
  };

  const load = () => {
    api.get("/penghuni").then(res => setPenghuni(res.data));
    api.get("/pembayaran").then(res => setHistory(res.data));
    api.get("/belum-bayar").then(res => setBelum(res.data));

    api.get("/summary-full").then(res => {
      const pemasukan = res.data.pemasukan;
      const pengeluaran = res.data.pengeluaran;

      const merged = bulanList.map(b => {
        const masuk = pemasukan.find(x => x.bulan === b);
        const keluar = pengeluaran.find(x => x.bulan === b);

        return {
          bulan: b,
          pemasukan: masuk ? masuk.pemasukan : 0,
          pengeluaran: keluar ? keluar.pengeluaran : 0
        };
      });

      setSummary(merged);
    });
  };

  useEffect(() => {
    load();
    loadSaldo();
  }, []);

  // ================= ACTION =================
  const bayar = () => {
    if (!selectedPenghuni) {
      setType("error");
      setMsg("Pilih penghuni dulu");
      return;
    }

    api.post("/pembayaran", {
      penghuni_id: selectedPenghuni,
      bulan,
      tahun: new Date().getFullYear(),
      jenis,
      durasi
    })
    .then(() => {
      setType("success");
      setMsg("Pembayaran berhasil");
      load();
      loadSaldo();
    })
    .catch(err => {
      setType("error");
      setMsg(err.response?.data?.error || "Gagal bayar");
    });
  };

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka || 0);

  // ================= UI =================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Keuangan RT</h2>

      {/* ================= SALDO ================= */}
      {saldo && (
        <div style={styles.saldoCard}>
          <div>
            <div style={styles.label}>Pemasukan</div>
            <div style={styles.green}>Rp {formatRupiah(saldo.pemasukan)}</div>
          </div>

          <div>
            <div style={styles.label}>Pengeluaran</div>
            <div style={styles.red}>Rp {formatRupiah(saldo.pengeluaran)}</div>
          </div>

          <div>
            <div style={styles.label}>Saldo</div>
            <div style={styles.big}>Rp {formatRupiah(saldo.saldo)}</div>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      <div style={styles.card}>
        <h3>Input Pembayaran</h3>

        <select style={styles.input} onChange={(e) => setSelectedPenghuni(e.target.value)}>
          <option value="">Pilih Penghuni</option>
          {penghuni.map(p => (
            <option key={p.id} value={p.id}>
              {p.nama} ({p.status})
            </option>
          ))}
        </select>

        <select style={styles.input} onChange={(e) => setJenis(e.target.value)}>
          <option value="satpam">Satpam (100k)</option>
          <option value="kebersihan">Kebersihan (15k)</option>
        </select>

        <select style={styles.input} onChange={(e) => setBulan(e.target.value)}>
          {bulanList.map(b => <option key={b}>{b}</option>)}
        </select>

        <select style={styles.input} onChange={(e) => setDurasi(e.target.value)}>
          <option value={1}>1 Bulan</option>
          <option value={12}>1 Tahun</option>
        </select>

        <button style={styles.btn} onClick={bayar}>Bayar</button>

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

      {/* ================= BELUM BAYAR ================= */}
      <h3 style={styles.sectionTitle}>Belum Bayar</h3>
      <div style={styles.grid}>
        {belum.map(b => (
          <div key={b.id} style={styles.box}>
            <b>{b.nama}</b>
            <div style={styles.small}>{b.status}</div>
          </div>
        ))}
      </div>

      {/* ================= GRAFIK ================= */}
      <h3 style={styles.sectionTitle}>Grafik Keuangan</h3>
      <div style={styles.card}>
        <ResponsiveContainer height={300}>
          <LineChart data={summary}>
            <XAxis dataKey="bulan" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="pemasukan" stroke="#22c55e" strokeWidth={3}/>
            <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={3}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= DETAIL ================= */}
      <h3 style={styles.sectionTitle}>Detail Bulanan</h3>
      <div style={styles.card}>
        <select
          style={styles.input}
          value={selectedBulan}
          onChange={(e) => setSelectedBulan(e.target.value)}
        >
          {bulanList.map(b => <option key={b}>{b}</option>)}
        </select>

        <button style={styles.btn} onClick={loadDetail}>
          Lihat Detail
        </button>

        {detail && (
          <div style={{ marginTop: 15 }}>
            <h4>Pemasukan</h4>
            {detail.pemasukan.map((p, i) => (
              <div key={i} style={styles.listItem}>
                {p.penghuni?.nama} - Rp {formatRupiah(p.jumlah)}
              </div>
            ))}

            <h4 style={{ marginTop: 10 }}>Pengeluaran</h4>
            {detail.pengeluaran.map((p, i) => (
              <div key={i} style={styles.listItem}>
                {p.nama} - Rp {formatRupiah(p.jumlah)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= HISTORY ================= */}
      <h3 style={styles.sectionTitle}>History Transaksi</h3>

      <div style={styles.grid}>
        {history.map(h => (
          <div key={h.id} style={styles.historyCard}>
            <b>{h.penghuni?.nama}</b>
            <div style={styles.small}>{h.bulan} {h.tahun}</div>
            <div style={styles.small}>{h.jenis}</div>
            <div style={styles.money}>Rp {formatRupiah(h.jumlah)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pembayaran;

/* ================= STYLE ================= */

const styles = {
  container: {
    padding: 24,
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff"
  },

  title: {
    fontSize: 24,
    marginBottom: 20
  },

  saldoCard: {
    display: "flex",
    gap: 20,
    background: "#111827",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20
  },

  label: { fontSize: 12, opacity: 0.6 },
  green: { color: "#22c55e", fontWeight: "bold" },
  red: { color: "#ef4444", fontWeight: "bold" },
  big: { fontSize: 20, fontWeight: "bold" },

  card: {
    background: "#111827",
    padding: 20,
    borderRadius: 16,
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
    padding: 12,
    background: "#22c55e",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: "bold"
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 10
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 12
  },

  box: {
    background: "#111827",
    padding: 14,
    borderRadius: 12
  },

  historyCard: {
    background: "#111827",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #1f2937"
  },

  listItem: {
    background: "#1f2937",
    padding: 8,
    borderRadius: 6,
    marginTop: 5
  },

  small: {
    fontSize: 12,
    opacity: 0.7
  },

  money: {
    marginTop: 5,
    color: "#22c55e",
    fontWeight: "bold"
  }
};