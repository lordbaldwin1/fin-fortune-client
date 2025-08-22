import { Route, Routes } from "react-router";
import SignInPage from "./CreateAccount";
import Home from "./Home";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </div>
  )
}

export default App
