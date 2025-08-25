import { Link, useNavigate } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../auth/useAuth";
import { useEffect, useState, type SetStateAction } from "react";
import { config } from "../config";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CheckIcon, ChevronsUpDownIcon, Info } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Instruments = {
  symbol: string;
};

type Fortune = {
  fortune: string;
  data: string;
};

export default function HomePage() {
  const { user } = useAuth();
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fortune, setFortune] = useState<Fortune>({
    fortune: "",
    data: "",
  });
  const [displayedFortune, setDisplayedFortune] = useState<string>("");
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetch(`${config.BACKEND_API_URL}/instruments`, {
        method: "GET",
        headers: {
          "Content-Type": "application.json",
        },
      });
      if (res.ok) {
        const data = (await res.json()) as Instruments[];
        setSymbols(data.map((instrument) => instrument.symbol));
      }
    })();
  }, []);

  useEffect(() => {
    if (!isRevealing) return;
    setDisplayedFortune("");
    setShowCard(true);
    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setDisplayedFortune(fortune.fortune.slice(0, index));
      if (index >= fortune.fortune.length) {
        window.clearInterval(intervalId);
        setIsRevealing(false);
      }
    }, 22);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [isRevealing, fortune]);

  async function getFortune() {
    setError("");
    if (selectedSymbol.length === 0) {
      setError("i cannot make a fortune of nothing.");
      return;
    }

    try {
      setIsLoading(true);
      setIsRevealing(false);
      setDisplayedFortune("");
      setShowCard(false);

      const res = await fetch(`${config.BACKEND_API_URL}/fortunes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol: selectedSymbol }),
        credentials: "include",
      });

      if (res.ok) {
        const newFortune = (await res.json()) as Fortune;
        setFortune(newFortune);
        setIsLoading(false);
        requestAnimationFrame(() => {
          setIsRevealing(true);
        });
        return;
      }

      if (res.status === 401) {
        const refreshRes = await fetch(
          `${config.BACKEND_API_URL}/users/refresh`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (!refreshRes.ok) {
          navigate("/login");
        }

        const res = await fetch(`${config.BACKEND_API_URL}/fortunes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol: selectedSymbol }),
          credentials: "include",
        });

        if (res.ok) {
          const newFortune = (await res.json()) as Fortune;
          setFortune(newFortune);
          setIsLoading(false);
          requestAnimationFrame(() => {
            setIsRevealing(true);
          });
          return;
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-foreground mb-3">
              the profit prophet
            </h1>
            <p className="text-muted-foreground">the thread of fate is spun, but how it is woven is yours to see.</p>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <SymbolCombobox
                symbols={symbols}
                selectedSymbol={selectedSymbol}
                setSelectedSymbol={setSelectedSymbol}
              />

              {user ? (
                <Button
                  onClick={getFortune}
                  size="lg"
                  className="px-8 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "loading..." : "reveal forbidden secrets"}
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      className="px-8 py-3 hover:cursor-not-allowed"
                    >
                      reveal forbidden secrets
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Link to={"/login"}>sign in to get your fortune.</Link>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            <div className="w-full">
              <div
                className={`px-8 py-8 rounded-lg border shadow-sm bg-background transition-opacity duration-300 ${
                  showCard ? "opacity-100" : "opacity-100"
                }`}
              >
                <div className="min-h-32 max-h-64 flex justify-center items-center overflow-y-auto whitespace-pre-wrap text-center text-xl leading-relaxed">
                  {isLoading ? (
                    <div className="text-muted-foreground text-lg flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : displayedFortune ? (
                    <div className="flex flex-col justify-center items-center gap-8">
                      <div>
                        {displayedFortune}
                        {isRevealing && (
                          <span className="ml-0.5 inline-block w-3 h-6 align-baseline bg-primary/70 animate-pulse" />
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="scale-80 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="[&_*]:font-sans">
                            <ReactMarkdown>{fortune.data}</ReactMarkdown>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-lg">
                      select a stock symbol to reveal your fortune
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  for entertainment only. this is not financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function SymbolCombobox({
  symbols,
  selectedSymbol,
  setSelectedSymbol,
}: {
  symbols: string[];
  selectedSymbol: string;
  setSelectedSymbol: React.Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedSymbol
            ? symbols.find((symbol) => symbol === selectedSymbol)
            : "select symbol..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="search symbol..." />
          <CommandList>
            <CommandEmpty>no symbol found.</CommandEmpty>
            <CommandGroup>
              {symbols.map((symbol) => (
                <CommandItem
                  key={symbol}
                  value={symbol}
                  onSelect={(currentValue) => {
                    setSelectedSymbol(
                      currentValue === selectedSymbol ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedSymbol === symbol ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {symbol}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
