import { useEffect, useState } from "react";
import api from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then(res => setData(res.data));
  }, []);

  if (!data) return <div style={styles.loading}>Loading...</div>;

  const chartData = data.summary;

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID").format(angka || 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Dashboard RT</h2>

      {/* CARD */}
      <div style={styles.grid3}>
        <div style={styles.card}>
          <div style={styles.label}>💰 Saldo</div>
          <h2>Rp {formatRupiah(data.saldo)}</h2>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>📈 Pemasukan</div>
          <h2>Rp {formatRupiah(data.total_pemasukan)}</h2>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>📉 Pengeluaran</div>
          <h2>Rp {formatRupiah(data.total_pengeluaran)}</h2>
        </div>
      </div>

      {/* GRAFIK */}
      <div style={styles.chartCard}>
        <h3>📊 Grafik Keuangan (1 Tahun)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bulan" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="pemasukan"
              stroke="#22c55e"
              strokeWidth={3}
            />

            <Line
              type="monotone"
              dataKey="pengeluaran"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* INFO */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <h4>🏠 Rumah</h4>
          <p>Dihuni: {data.rumah_dihuni}</p>
          <p>Kosong: {data.rumah_kosong}</p>
        </div>

        <div style={styles.card}>
          <h4>👥 Penghuni</h4>
          <p>Total: {data.total_penghuni}</p>
          <p>Tetap: {data.penghuni_tetap}</p>
          <p>Kontrak: {data.penghuni_kontrak}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

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

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: 16,
    marginBottom: 20
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 16,
    marginTop: 20
  },

  card: {
    background: "#111827",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
  },

  label: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 6
  },

  chartCard: {
    background: "#111827",
    padding: 20,
    borderRadius: 16,
    marginTop: 10
  },

  loading: {
    padding: 20,
    color: "#fff"
  }
};