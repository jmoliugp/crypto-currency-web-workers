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
import { useState } from "react";

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
  const [streamEnabled, setStreamEnabled] = useState(false);
  const toggle = () => setStreamEnabled((prev) => !prev);

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
            <Switch checked={streamEnabled} onCheckedChange={toggle} />
          </div>
          <div>
            <CryptoCurrency token={CryptoToken.Bitcoin} currency={68021} />
            <CryptoCurrency token={CryptoToken.Ethereum} currency={42552} />
            <CryptoCurrency token={CryptoToken.Litecoin} currency={6332} />
            <CryptoCurrency token={CryptoToken.Monero} currency={806} />
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
