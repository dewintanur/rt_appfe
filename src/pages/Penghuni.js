import { useEffect, useState } from "react";
import api from "../api";

function Penghuni() {
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    nama: "",
    no_telp: "",
    status: "tetap",
    is_menikah: false
  });

  const [foto, setFoto] = useState(null);
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);

  const load = () => {
    api.get("/penghuni").then(res => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setForm({
      nama: "",
      no_telp: "",
      status: "tetap",
      is_menikah: false
    });
    setFoto(null);
  };

  // ================= TAMBAH =================
  const tambah = () => {
    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("no_telp", form.no_telp);
    formData.append("status", form.status);
    formData.append("is_menikah", form.is_menikah ? 1 : 0);

    if (foto) formData.append("foto_ktp", foto);

    api.post("/penghuni", formData)
      .then(() => {
        setMsg("Berhasil tambah PENGHUNI!");
        resetForm();
        load();
      })
      .catch(() => setMsg("❌ Gagal tambah"));
  };

  // ================= EDIT =================
  const handleEdit = (d) => {
    setEditId(d.id);
    setForm({
      nama: d.nama,
      no_telp: d.no_telp,
      status: d.status,
      is_menikah: !!d.is_menikah
    });
  };

  // ================= UPDATE =================
  const update = () => {
    const formData = new FormData();
    formData.append("nama", form.nama);
    formData.append("no_telp", form.no_telp);
    formData.append("status", form.status);
    formData.append("is_menikah", form.is_menikah ? 1 : 0);

    if (foto) formData.append("foto_ktp", foto);

    api.post(`/penghuni/${editId}?_method=PUT`, formData)
      .then(() => {
        setMsg(" Berhasil update!");
        setEditId(null);
        resetForm();
        load();
      })
      .catch(() => setMsg("❌ Gagal update"));
  };

  // ================= DELETE =================
  const hapus = (id) => {
    if (!window.confirm("Yakin hapus?")) return;

    api.delete(`/penghuni/${id}`)
      .then(() => {
        setMsg(" Berhasil hapus");
        load();
      })
      .catch(() => setMsg("❌ Gagal hapus"));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Data Penghuni</h2>

      {/* ================= FORM ================= */}
      <div style={styles.cardForm}>
        <h3>{editId ? "Edit Penghuni" : "Tambah Penghuni"}</h3>

        <div style={styles.formWrapper}>

          {/* LEFT FORM */}
          <div style={styles.leftForm}>
            <input
              name="nama"
              placeholder="Nama Lengkap"
              value={form.nama}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              name="no_telp"
              placeholder="No Telepon"
              value={form.no_telp}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="tetap">Tetap</option>
              <option value="kontrak">Kontrak</option>
            </select>

            <label style={styles.checkbox}>
              <input
                type="checkbox"
                name="is_menikah"
                checked={form.is_menikah}
                onChange={handleChange}
              />
              Sudah Menikah
            </label>
          </div>

          {/* FOTO */}
          <div style={styles.fotoBox}>
            <p> Foto KTP</p>

            <img
              src={
                foto
                  ? URL.createObjectURL(foto)
                  : "https://via.placeholder.com/150"
              }
              style={styles.preview}
              alt="preview"
            />

            <label style={styles.upload}>
              Upload
              <input
                type="file"
                hidden
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* BUTTON */}
        <div style={{ marginTop: 20 }}>
          <button onClick={editId ? update : tambah} style={styles.btn}>
            {editId ? "Update" : "+ Tambah"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                resetForm();
              }}
              style={styles.cancel}
            >
              Cancel
            </button>
          )}
        </div>

        {msg && <div style={styles.alert(msg)}>{msg}</div>}
      </div>

      {/* ================= LIST ================= */}
      <div style={styles.grid}>
        {data.map((d) => (
          <div key={d.id} style={styles.card}>
            <img
              src={
                d.foto_ktp
                  ? `http://127.0.0.1:8000/storage/${d.foto_ktp}`
                  : "https://via.placeholder.com/150"
              }
              style={styles.img}
              alt="ktp"
            />

            <h4>{d.nama}</h4>

            <div style={styles.badge(d.status)}>
              {d.status}
            </div>

            <p style={styles.small}>{d.no_telp}</p>

            <p style={styles.menikah(d.is_menikah)}>
              {d.is_menikah ? " Menikah" : "Belum menikah"}
            </p>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => handleEdit(d)} style={styles.edit}>
                edit
              </button>
              <button onClick={() => hapus(d.id)} style={styles.delete}>
                hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Penghuni;



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

  cardForm: {
    background: "#111827",
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
  },

  formWrapper: {
    display: "flex",
    gap: 30,
    flexWrap: "wrap",
    alignItems: "flex-start"
  },

  leftForm: {
    flex: 2,
    minWidth: 300,
    maxWidth: 500
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    background: "#1f2937",
    border: "none",
    borderRadius: 10,
    color: "#fff"
  },

  checkbox: {
    fontSize: 14
  },

  fotoBox: {
    flex: 1,
    minWidth: 260,
    maxWidth: 320,
    background: "#1f2937",
    padding: 24,
    borderRadius: 16,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12
  },

  preview: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #22c55e"
  },

  upload: {
    background: "#22c55e",
    padding: 10,
    borderRadius: 10,
    cursor: "pointer"
  },

  btn: {
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer"
  },

  cancel: {
    marginLeft: 10,
    padding: 12,
    borderRadius: 12,
    background: "#ef4444",
    color: "#fff",
    border: "none"
  },

  alert: (msg) => ({
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: msg.includes("Berhasil") ? "#16a34a" : "#dc2626"
  }),

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 16
  },

  card: {
    background: "#111827",
    padding: 15,
    borderRadius: 16,
    textAlign: "center"
  },

  img: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    objectFit: "cover",
    marginBottom: 10
  },

  badge: (status) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    marginBottom: 6,
    background: status === "tetap" ? "#22c55e" : "#f59e0b"
  }),

  small: {
    fontSize: 12,
    opacity: 0.7
  },

  menikah: (val) => ({
    fontSize: 13,
    marginTop: 5,
    color: val ? "#22c55e" : "#94a3b8"
  }),

  edit: {
    marginRight: 5,
    background: "#facc15",
    border: "none",
    borderRadius: 6,
    padding: 6
  },

  delete: {
    background: "#ef4444",
    border: "none",
    borderRadius: 6,
    padding: 6,
    color: "#fff"
  }
};