import { Link } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState } from "react";
import { config } from "../config";

type Instruments = {
  symbol: string;
};

type Fortune = {
  fortune: string;
};

export default function HomePage() {
  const { user, loading } = useAuth();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL");
  const [error, setError] = useState<string>("");
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

  async function getFortune() {
    if (selectedSymbol.length === 0) {
      setError("I cannot make a fortune of nothing.");
      return;
    }

    try {
      const res = await fetch(`${config.BACKEND_API_URL}/fortunes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol: selectedSymbol }),
        credentials: "include",
      });
      if(res.ok) {
        const newFortune = (await res.json()) as Fortune;
        setFortune(newFortune.fortune);
        return;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <>
      <Navbar />
      <Link to={"/login"}>Sign in</Link>
      <button onClick={getFortune}>Unveil your fortune</button>
      {symbols.map((symbol) => {
        return <p key={symbol}>{symbol}</p>
      })}
      <p>{fortune}</p>
    </>
  );
}
