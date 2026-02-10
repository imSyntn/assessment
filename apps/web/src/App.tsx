import { useEffect } from "react";
import { api } from "../lib/api";
import { Button } from "@repo/ui/components/button";

const App = () => {
  useEffect(() => {
    const run = async () => {
      const res = await api.health.$get();
      const data = await res.json();

      console.log(data.ok);
    };

    run();
  }, []);
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "10px",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Button variant="default">Default Button</Button>
      <Button variant="destructive">Destructive Button</Button>
      <Button variant="outline">Outline Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="ghost">Ghost Button</Button>
    </div>
  );
};

export default App;
