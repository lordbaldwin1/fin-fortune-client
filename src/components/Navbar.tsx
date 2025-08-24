import { Link } from "react-router";
import { LoaderCircle, User } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { ModeToggle } from "./ui/ModeToggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  return (
    <div className="flex flex-row justify-between p-2">
      <h1 className="text-xl">Fortune Teller</h1>
      <div className="flex flex-row items-center">
        {loading ? (
          <div>
            <LoaderCircle className="animate-spin mr-4" />
          </div>
        ) : user ? (
          <div className="flex flex-row justify-end gap-3">
            <div className="flex flex-row gap-1">
              <User />
              <p>{user.email}</p>
            </div>
            <button onClick={logout}>Sign out</button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Link to={"/login"}>Sign in</Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
