import { useAuth } from "@/auth/useAuth";
import { useEffect, useState } from "react";
import { config } from "@/config";
import { Button } from "./ui/button";
import { Link } from "react-router";

type Fortune = {
  id: string;
  symbol: string;
  body: string;
  stockData: string | null;
  createdAt: Date;
  userId: string;
};
export default function PastFortunesPage() {
  const { user } = useAuth();
  const [fortunes, setFortunes] = useState<Fortune[]>([]);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const res = await fetch(`${config.BACKEND_API_URL}/fortunes/${user.id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        return (
          <div className="min-h-screen w-full flex items-center justify-center">
            <p>
              Your past fortunes are clouded, for even the servers stumble in
              their wisdom.
            </p>
            <Link to={"/"}>
              <Button variant={"link"}>Go home.</Button>
            </Link>
          </div>
        );
      }
      const fortunes = (await res.json()) as Fortune[];
      setFortunes(fortunes);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center">
        <p>Sign in and the veil of tomorrow will be lifted.</p>
        <Link to={"/login"}>
          <Button variant={"link"}>Click here before it is too late.</Button>
        </Link>
      </div>
    );
  }

  return (
    <main>
      <div className="min-h-screen w-full flex flex-col items-center justify-start mt-4">
        <h1 className="text-2xl">hello {user.email}</h1>
        <p className="text-muted-foreground mb-6">
          the gold once gained is gone, but the lesson remains.
        </p>
        <div>
          {fortunes.map((fortune) => (
            <div className="mb-8 border-b-4 p-2" key={fortune.id}>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold border-4 rounded-lg p-2">
                  {fortune.symbol}
                </p>
                <p>{new Date(fortune.createdAt).toDateString()}</p>
              </div>
              <p>{fortune.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
