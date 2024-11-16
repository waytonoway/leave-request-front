import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LeaveRequestForm from "./components/LeaveRequest/LeaveRequestForm";

const App = () => {
  return (
      <Router>
        <div>
          <h1>Leave Request Management Tool</h1>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-leave-request" element={<LeaveRequestForm />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;
