import "./App.css";
import Navbar from "./components/custom/Navbar";
import { HomePage } from "./pages/home/HomePage";
import { useApplicationConfigStore } from "./store/applicationConfigStore";

import { Toaster } from "@/components/ui/sonner";
function App() {
  const { themeMode } = useApplicationConfigStore();
  return (
    <div>
      <Navbar/>
      <Toaster richColors theme={themeMode} />
    </div>
  );
}

export default App;
