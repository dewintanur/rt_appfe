import { useState } from "react";
import Penghuni from "./pages/Penghuni";
import Rumah from "./pages/Rumah";
import Pembayaran from "./pages/Pembayaran";
import Dashboard from "./pages/Dashboard";
import Pengeluaran from "./pages/Pengeluaran";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "penghuni": return <Penghuni />;
      case "rumah": return <Rumah />;
      case "pembayaran": return <Pembayaran />;
      case "pengeluaran": return <Pengeluaran />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={styles.app}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>RT App</h2>

        <Menu label="Dashboard" active={page==="dashboard"} onClick={()=>setPage("dashboard")} />
        <Menu label="Penghuni" active={page==="penghuni"} onClick={()=>setPage("penghuni")} />
        <Menu label="Rumah" active={page==="rumah"} onClick={()=>setPage("rumah")} />
        <Menu label="Pembayaran" active={page==="pembayaran"} onClick={()=>setPage("pembayaran")} />
        <Menu label="Pengeluaran" active={page==="pengeluaran"} onClick={()=>setPage("pengeluaran")} />
      </div>

      {/* CONTENT */}
      <div style={styles.content}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;


/*  MENU COMPONENT */
function Menu({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.menu,
        background: active ? "#22c55e" : "transparent",
        color: active ? "#fff" : "#9ca3af"
      }}
    >
      {label}
    </div>
  );
}


/*  STYLE */
const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif"
  },

  sidebar: {
    width: 220,
    background: "#020617",
    padding: 20,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 10
  },

  logo: {
    marginBottom: 20
  },

  menu: {
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    transition: "0.2s"
  },

  content: {
    flex: 1,
    background: "#0f172a",
    padding: 20,
    overflow: "auto"
  }
};