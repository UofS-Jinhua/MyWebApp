import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Category from "./components/Category";
import SubCategory from "./components/SubCategory";

function App() {
  const categories = {
    "Job Related": ["Veeva", "Projects"],
    "Coding Related": ["Carrot", "Daikon"],
    Others: ["Apple", "Banana"],
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="categories-container">
              {Object.keys(categories).map((category) => (
                <Category
                  key={category}
                  c_name={category}
                  contents={categories[category]}
                />
              ))}
            </div>
          }
        />
        <Route path="/:category/:subCategory" element={<SubCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
