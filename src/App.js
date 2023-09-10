import React from "react";
import Form from "./components/Form";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import MainAdmin from "./pages/admin/MainAdmin";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NotFoundPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/pages/*" element={<MainAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
