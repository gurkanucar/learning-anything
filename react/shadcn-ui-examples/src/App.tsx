import "./App.css";
import { CardDemo } from "./components/custom/CardDemo";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <CardDemo />
      </div>
    </>
  );
}

export default App;
