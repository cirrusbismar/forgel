import { APITester } from "./APITester";

import "./index.css";
import "react-diff-view/style/index.css";

export function App() {
  return (
    <div className="container mx-auto p-8 relative z-10">
      <APITester />
    </div>
  );
}

export default App;
