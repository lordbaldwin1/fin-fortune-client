import { useState, type SetStateAction } from "react";
import { config } from "../config";
import type { User } from "../types/api";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuth } from "@/auth/useAuth";

export default function LoginPage() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const { user } = useAuth();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      {user ? (
        <>
          <h1 className="text-2xl font-semibold">You are already signed in!</h1>
          <Button variant={"link"}>
            Click here to have your fortune told.
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-semibold">
            {isSignIn ? "Sign in" : "Create an account"}
          </h1>

          {isSignIn ? (
            <LoginForm setIsSignIn={setIsSignIn} />
          ) : (
            <CreateAccountForm setIsSignIn={setIsSignIn} />
          )}
        </>
      )}
    </div>
  );
}

function LoginForm({
  setIsSignIn,
}: {
  setIsSignIn: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);

    if (!username || !password) {
      setError("You must enter a username and password");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError(
          "Invalid credentials. Please check your username and password."
        );
        return;
      }

      const userData = (await res.json()) as User;
      if (userData) {
        navigate("/");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
          {isLoading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            "Login"
          )}
        </Button>

        <Button
          variant="link"
          className="w-full text-sm"
          onClick={() => setIsSignIn(false)}
        >
          Don't have an account? Create one!
        </Button>
      </div>
    </div>
  );
}

function CreateAccountForm({
  setIsSignIn,
}: {
  setIsSignIn: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    setIsLoading(true);

    if (!username || !password) {
      setError("You must enter a username and password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_API_URL}/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create account");
        return;
      }

      setIsSignIn(true);
    } catch (err) {
      setError("Account creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Button
          onClick={handleCreateAccount}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin h-4 w-4" />
          ) : (
            "Create Account"
          )}
        </Button>

        <Button
          variant="link"
          className="w-full text-sm"
          onClick={() => setIsSignIn(true)}
        >
          Already have an account? Sign in.
        </Button>
      </div>
    </div>
  );
}
