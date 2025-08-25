import { Link } from "react-router";
import { LoaderCircle, LogOut, User } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { ModeToggle } from "./ui/ModeToggle";
import { Button } from "./ui/button";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  return (
    <div className="flex flex-row justify-between items-center p-2">
      <div className="flex flex-row items-center gap-4">
        <Link to={`/fortunes`} className="text-muted-foreground hover:text-foreground hover:scale-101">past fortunes</Link>
        <Link to={`/`} className="text-muted-foreground hover:text-foreground hover:scale-101">future fortunes</Link>
      </div>
      <div className="flex flex-row items-center">
        {loading ? (
          <div>
            <LoaderCircle className="animate-spin mr-4" />
          </div>
        ) : user ? (
          <div className="flex flex-row items-center justify-end gap-3">
            <div className="flex flex-row gap-1">
              <User />
              <p>{user.email}</p>
            </div>
            <Button variant={"link"} size={"icon"} className="hover:scale-110" onClick={logout}>
              <LogOut className="hover:scale-110" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button className="hover:scale-110" variant={"link"} size={"icon"}>
              <Link to={"/login"}>
                <User />
              </Link>
            </Button>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
