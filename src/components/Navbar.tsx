import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";
import { useAuth } from "../auth/useAuth";

export default function Navbar() {
  const { user, loading, logout} = useAuth();
  console.log(user);
  return (
    <div className="bg-black text-white">
      {loading ? (
        <LoaderCircle className="animate-spin" />
      ) : user ? (
        <>
          <p>{user.email}</p>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <Link to={"/login"}>Sign in</Link>
      )}
    </div>
  );
}
