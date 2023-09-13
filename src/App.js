import React from "react";
import Form from "./components/Form";
import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import MainAdmin from "./pages/admin/MainAdmin";
import LoginPage from "./pages/auth/LoginPage";
import StatusPage from "./pages/user/StatusPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/pages/*" element={<MainAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
