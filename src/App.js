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
      <Route path="/:name/:number" element={<Message />} />
      <Route exact path="/p/sent" element={<Sent />} />
      <Route exact path="/p/terms" element={<Terms />} />
      <Route exact path="/p/privacy" element={<Privacy />} />
    </Routes>
  );
}

export default App;
