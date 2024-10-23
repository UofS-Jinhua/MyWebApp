// import { useState } from "react";
import "./App.css";
import Category from "./components/Category";

function App() {
  return (
    <div>
      <Category
        c_name="Job Related"
        contents={["Veeva", "TikTalk", "Amazon"]}
      />
      <Category
        c_name="Coding Related"
        contents={["Carrot", "Daikon", "Eggplant"]}
      />

      <Category
        c_name="Food Related"
        contents={["Apple", "Banana", "Cherry"]}
      />
    </div>
  );
}

export default App;
