import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TreeDrawPage from "./pages/TreeDrawPage";
import TreeViewPage from "./pages/TreeViewPage";
import DecorationPage from "./pages/DecorationPage";
import TreeEditPage from "./pages/TreeEditPage";
import EvaluationPage from "./pages/EvaluationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tree/new" element={<TreeDrawPage />} />
        <Route path="/tree/:uuid" element={<TreeViewPage />} />
        <Route path="/tree/:uuid/decorate" element={<DecorationPage />} />
        <Route path="/tree/:uuid/edit" element={<TreeEditPage />} />
        <Route path="/tree/:uuid/evaluate" element={<EvaluationPage />} />
      </Routes>
    </BrowserRouter>
  );
}
