import "./App.css";
import FormPanel from "./components/FormPanel";
import AIPanel from "./components/AI/AIPanel";
import RiskPanel from "./components/RiskPanel";

export default function App() {
  return (
    <div className="app-container">
      <FormPanel />
      <AIPanel />
    </div>
  );
}