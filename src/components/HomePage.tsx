import { Link } from "react-router";
import Navbar from "./Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Link to={"/login"}>Sign in</Link>
    </>
  );
}
