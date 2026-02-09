import { useEffect } from "react";
import { api } from "../lib/api";

const App = () => {
  useEffect(() => {
    const run = async () => {
      const res = await api.health.$get();
      const data = await res.json();

      console.log(data.ok);
    };

    run();
  }, []);
  return <div>App</div>;
};

export default App;
