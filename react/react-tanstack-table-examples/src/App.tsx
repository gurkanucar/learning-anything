import "./App.css";

import { TableExample1 } from "./components/TableExample1";
import { data1 } from "./data";
function App() {
  return (
    <>
    {/* <div className="bg-red-400">TEST</div> */}
      <TableExample1 data={data1} />
    </>
  );
}

export default App;
