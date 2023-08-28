import React from "react";
import Form from "./components/Form";
import Data from "./pages/admin/Data";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/list" element={<Data />} />
      </Routes>
    </div>
  );
}

export default App;
