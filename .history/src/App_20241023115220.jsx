import { useState } from "react";
import "./App.css";

function App() {
  const categories = {
    JobRelated: [],
    Daily: [],
    Technical: [],
  };

  const [notes, setNotes] = useState(categories);

  return <></>;
}

export default App;
