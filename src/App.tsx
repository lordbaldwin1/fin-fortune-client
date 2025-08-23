import { Route, Routes } from "react-router";
import Home from "./components/HomePage";
import LoginPage from "./components/LoginPage";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
