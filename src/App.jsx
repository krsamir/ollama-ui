import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Component from "./components/Index";
import "./App.css";
import "./components/index.css";

function Home() {
  return (
    <div>
      <Component />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
