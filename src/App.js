import "./App.scss";
import { Route, Routes } from "react-router-dom";
import Message from "./components/Message";
import Sent from "./components/Sent";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";

function App() {
  return (
    <Routes>
      <Route path="/:name" element={<Message />} />
      <Route path="/p/sent" element={<Sent />} />
      <Route path="/p/terms" element={<Terms />} />
      <Route path="/p/privacy" element={<Privacy />} />
    </Routes>
  );
}

export default App;
