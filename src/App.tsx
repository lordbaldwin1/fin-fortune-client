import { Route, Routes } from "react-router";
import Home from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PastFortunesPage from "./components/PastFortunesPage";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/fortunes" element={<PastFortunesPage />} />
      </Routes>
    </div>
  )
}

export default App
