// import { useState } from "react";
import "./App.css";
import Category from "./components/Category";
import SubCategory from "./components/SubCategory";

function App() {
  return (
    <div className="categories-container">
      <Category
        c_name="Job Related"
        contents={["Veeva", "TikTalk", "Amazon"]}
      />
      <Category
        c_name="Coding Related"
        contents={["Carrot", "Daikon", "Eggplant"]}
      />

      <Category c_name="Others" contents={["Apple", "Banana", "Cherry"]} />
    </div>
  );
}

export default App;
