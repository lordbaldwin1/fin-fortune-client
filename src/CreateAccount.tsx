import { useState, type SetStateAction } from "react";
import { config } from "./config";
import type { CreateUserRequest, LoginResponse } from "./types/api";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function SignInPage() {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl">{isSignIn ? "Sign in" : "Create an account"}</h1>
      {isSignIn ? (
        <LoginPortal setIsSignIn={setIsSignIn} />
      ) : (
        <CreateAccountPortal setIsSignIn={setIsSignIn} />
      )}
    </div>
  );
}

function CreateAccountPortal({
  setIsSignIn,
}: {
  setIsSignIn: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function createAccount() {
    setIsLoading(true);
    console.log(username, password);
    if (username.length === 0 || password.length === 0) {
      setError("You must enter an username and password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const params: CreateUserRequest = {
        email: username,
        password: password,
      };
      const res = await fetch(`${config.BACKEND_API_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create user");
        return;
      }
      setIsSignIn(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error occurred, try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="gap-2">
        {error.length > 0 && <p className="text-red-400">{error}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <LoginInput
          updateState={setUsername}
          placeholder="Enter your username"
          value={username}
          type="text"
        />
        <LoginInput
          updateState={setPassword}
          placeholder="Enter your password"
          value={password}
          type="password"
        />
        <LoginInput
          updateState={setConfirmPassword}
          placeholder="Confirm your password"
          value={confirmPassword}
          type="password"
        />
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-200 hover:bg-blue-300 rounded-md gap-2 p-2"
          onClick={createAccount}
        >
          {isLoading ? (
            <span className="flex justify-center items-center w-full">
              <LoaderCircle className="animate-spin" />
            </span>
          ) : (
            "Create Account"
          )}
        </button>
        <button
          className="text-sm rounded-md"
          onClick={() => setIsSignIn(true)}
        >
          Already have an account? Sign in.
        </button>
      </div>
    </>
  );
}

function LoginPortal({
  setIsSignIn,
}: {
  setIsSignIn: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  async function loginToAccount() {
    if (username.length === 0 || password.length === 0) {
      setError("You must enter an username and password");
      return;
    }

    try {
      const params: CreateUserRequest = {
        email: username,
        password: password,
      };
      const res = await fetch(`${config.BACKEND_API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await res.json() as LoginResponse;
      if (!data.token) {
        setError("No access token returned from server");
        return;
      }
      localStorage.setItem("accessToken", data.token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Unknown error occurred. Try again later.");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className="gap-2">
        {error.length > 0 && <p className="text-red-400">{error}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <LoginInput
          updateState={setUsername}
          placeholder="Enter your username"
          value={username}
          type="text"
        />
        <LoginInput
          updateState={setPassword}
          placeholder="Enter your password"
          value={password}
          type="password"
        />
      </div>
      <div className="flex flex-col gap-2">
      <button
          className="bg-blue-200 hover:bg-blue-300 rounded-md gap-2 p-2"
          onClick={loginToAccount}
        >
          {isLoading ? (
            <span className="flex justify-center items-center w-full">
              <LoaderCircle className="animate-spin" />
            </span>
          ) : (
            "Login"
          )}
        </button>
        <button
          className="text-sm rounded-md"
          onClick={() => setIsSignIn(false)}
        >
          Don't have an account? Create one!
        </button>
      </div>
    </>
  );
}

function LoginInput({
  updateState,
  placeholder,
  value,
  type,
}: {
  updateState: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  value: string;
  type: "text" | "password";
}) {
  return (
    <input
      className="bg-gray-200 p-1 text-sm outline-1 rounded-md"
      placeholder={placeholder}
      onChange={(e) => updateState(e.target.value)}
      type={type}
      value={value}
    />
  );
}
