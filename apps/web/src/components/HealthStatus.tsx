import { Badge } from "@repo/ui/components";
import { honoClient } from "../../lib/api";
import { Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

const GettingHealth = () => {
  return (
    <Badge variant="secondary">
      <Loader2Icon className="h-8 w-8 animate-spin" />
      Checking health
    </Badge>
  );
};
const HealthUp = () => {
  return (
    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-500">
      All good
    </Badge>
  );
};
const HealthDown = () => {
  return (
    <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 border-destructive">
      Something is wrong
    </Badge>
  );
};

export const HealthStatus = () => {
  const [status, setStatus] = useState<"loading" | "up" | "down">("loading");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await (honoClient as any).health.$get();

        if (!res.ok) throw new Error("not ok");

        const data = await res.json();

        setStatus(data.ok ? "up" : "down");
      } catch {
        setStatus("down");
      }
    };

    checkHealth();
  }, []);

  if (status === "loading") return <GettingHealth />;
  if (status === "up") return <HealthUp />;
  return <HealthDown />;
};
