"use client";

import { BarChartIcon, TrashIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useEffect, useRef, useState } from "react";
import { CryptoWorkConfigT, WorkerMessageT } from "@/workers/types";

enum CryptoToken {
  Bitcoin = "bitcoin",
  Ethereum = "ethereum",
  Monero = "monero",
  Litecoin = "litecoin",
}

interface CryptoCurrencyProps {
  token: CryptoToken;
  currency: number;
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function CryptoCurrency({ currency, token }: CryptoCurrencyProps) {
  return (
    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{capitalize(token)}</p>
        <p className="text-sm text-muted-foreground">{`$ ${currency}`}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const workerRef = useRef<Worker>();
  const [streamEnabled, setStreamEnabled] = useState(false);
  const [currencyMap, setCurrencyMap] = useState<Record<CryptoToken, number>>({
    [CryptoToken.Bitcoin]: 0,
    [CryptoToken.Ethereum]: 0,
    [CryptoToken.Litecoin]: 0,
    [CryptoToken.Monero]: 0,
  });

  useEffect(() => {
    workerRef.current = new Worker("/workers/crypto.js", {
      type: "module",
    });

    workerRef.current.onmessage = (event) => {
      setCurrencyMap((prev) => {
        const newState = { ...prev, ...event.data };
        return newState;
      });
    };

    workerRef.current.onerror = (error) => {
      console.error("Worker error: ", error);
    };

    return () => {
      if (!workerRef.current) return;

      workerRef.current.terminate();
    };
  }, []);

  const startWorker = () => {
    const workerMessage: WorkerMessageT<CryptoWorkConfigT> = {
      type: "init",
      payload: {
        data: {
          assets: Object.values(CryptoToken).join(","),
        },
      },
    };

    if (workerRef.current) workerRef.current.postMessage(workerMessage);
  };

  const stopWorker = () => {
    const workerMessage: WorkerMessageT<CryptoWorkConfigT> = {
      type: "stop",
    };

    if (workerRef.current) workerRef.current.postMessage(workerMessage);
  };

  const toggleSwitch = () =>
    setStreamEnabled((prevState) => {
      const isRunning = prevState;

      if (isRunning) stopWorker();
      if (!isRunning) startWorker();

      return !isRunning;
    });

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Card className={cn("w-[440px]")}>
        <CardHeader>
          <CardTitle>Crypto Currency</CardTitle>
          <CardDescription>
            {`This page uses a Web Worker to stream cryptocurrency prices from
            CoinCap.io.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className=" flex items-center space-x-4 rounded-md border p-4">
            <BarChartIcon />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Stream data</p>
              <p className="text-sm text-muted-foreground">
                {streamEnabled ? "On" : "Off"}
              </p>
            </div>
            <Switch checked={streamEnabled} onCheckedChange={toggleSwitch} />
          </div>
          <div>
            {Object.keys(currencyMap).map((key) => {
              return (
                <CryptoCurrency
                  key={key}
                  token={key as CryptoToken}
                  currency={currencyMap[key as CryptoToken]}
                />
              );
            })}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" className="w-full">
            <TrashIcon className="mr-2 h-4 w-4" /> Terminate worker
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
