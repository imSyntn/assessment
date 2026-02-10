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
    <div>
      <Button variant="destructive">hey</Button>
    </div>
  );
};

export default App;
