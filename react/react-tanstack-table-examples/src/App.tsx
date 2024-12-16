import "./App.css";
import { TableExample3 } from "./components/table-example-1/TableExample3";

import { TableExample1 } from "./components/TableExample1";
import { data1 } from "./data";
function App() {
  return (
    <>
    {/* <div className="bg-red-400">TEST</div> */}
      <TableExample3 data={data1} />
    </>
  );
}

export default App;
