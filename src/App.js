import "./App.scss";
import { Route, Routes, useLocation } from "react-router-dom";
import Message from "./components/Message";
import Sent from "./components/Sent";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname == "/p/sent") {
      document.documentElement.style.background =
        "#EC1187 linear-gradient(to bottom right, #EC1187 0%, #FF8D10 100%)";
    }
  }, []);
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
