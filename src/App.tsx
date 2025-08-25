import { Route, Routes } from "react-router";
import Home from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PastFortunesPage from "./components/PastFortunesPage";
import Navbar from "./components/Navbar";


function App() {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/fortunes" element={<PastFortunesPage />} />
      </Routes>
    </div>
  )
}

export default App
