import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import BookPage from "./pages/Book";
import BookletPrint from "./pages/BookletPrint";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="" element={<MainPage />} />
          <Route path="/phoneme/:sound" element={<BookPage />} />
          <Route path="/booklet/:sound" element={<BookletPrint />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
