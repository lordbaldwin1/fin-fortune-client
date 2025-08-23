import { Link } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import { config } from "../config";

type Instruments = {
  symbol: string;
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [fortune, setFortune] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch(`${config.BACKEND_API_URL}/instruments`, {
        method: "GET",
        headers: {
          "Content-Type": "application.json",
        },
      });
      if (res.ok) {
        const data = (await res.json()) as Instruments[]
        setSymbols(data.map((instrument) => instrument.symbol));
      }
    })();
  }, [])

  return (
    <>
      <Navbar />
      <Link to={"/login"}>Sign in</Link>
      <button>Unveil your fortune</button>
      {symbols.map((symbol) => {
        return <p key={symbol}>{symbol}</p>
      })}
    </>
  );
}
