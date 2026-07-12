import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Houses from "./pages/Houses";
import ResidentHistories from "./pages/ResidentHistories";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/residents" element={<Residents />} />
      <Route path="/houses" element={<Houses />} />
      <Route path="/resident-histories" element={<ResidentHistories />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}

export default App;
