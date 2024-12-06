import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  Link,
} from "react-router-dom";

// import css styles
import "./App.css";

// import components
import Navbar from "./components/Navbar";
import Category from "./components/Category";

// import pages
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import SubSubCategoryPage from "./pages/SubSubCategoryPage";
import NotePage from "./pages/NotePage";
import SelectNote from "./pages/SelectNote";

import AllnotePage from "./pages/AllnotePage";

// import providers
import { CategoryProvider, useCategory } from "./context/CategoryContext";
import {
  SubCategoryProvider,
  useSubCategory,
} from "./context/SubCategoryContext";

function AppContent() {
  // global state:
  const { categories, addCategory, fetchCategories } = useCategory();
  const { fetchSubCategories, findSubCategories_local } = useSubCategory();

  // helper function to find subcategories of a category

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navbar />

              <div className="categories-directory">
                {/* <Breadcrumbs /> */}
                <button className="add-category-button" onClick={addCategory}>
                  New Category
                </button>
              </div>
              <div className="categories-container">
                {categories.map((category) => (
                  <Category
                    key={category.name + category.id}
                    c_id={category.id}
                    c_name={category.name}
                    contents={findSubCategories_local(category.id)}
                  />
                ))}
              </div>
            </div>
          }
        />
        <Route path="/:category" element={<CategoryPage />} />
        <Route path="/:category/:subCategory" element={<SubCategoryPage />} />
        <Route
          path="/:category/:subCategory/:subsubCategory"
          element={<SubSubCategoryPage />}
        />
        <Route
          path="/:category/:subCategory/:subsubCategory/:note"
          element={<NotePage />}
        />
        <Route path="/all-notes" element={<AllnotePage />} />
        <Route path="/search" element={<SelectNote />}></Route>
      </Routes>
    </Router>
  );
}
function App() {
  return (
    <CategoryProvider>
      <SubCategoryProvider>
        <AppContent />
      </SubCategoryProvider>
    </CategoryProvider>
  );
}

export default App;
