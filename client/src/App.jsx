import { EthProvider } from "./contexts/EthContext";
import Router from "./components/layout/Router";

function App() {
  return (
    <EthProvider>
      {console.log("PROVIDER", EthProvider)}
      <Router />
    </EthProvider>
  );
}

export default App;
