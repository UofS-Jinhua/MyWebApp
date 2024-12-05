import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  useParams,
  useLocation,
  Link,
  useNavigate,
} from "react-router-dom";

import { useCategory } from "../context/CategoryContext";
import { useSubCategory } from "../context/SubCategoryContext";

// import components
import Navbar from "../components/Navbar";

// import css styles
import "../App.css";
import "./CategoryPage.css";

export default function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");
  const navigate = useNavigate();

  // global context
  const { fetchCategories, deleteCategory } = useCategory();
  const { fetchSubCategoriesByCategoryId, addSubCategory, deleteSubCategory } =
    useSubCategory();

  // local state
  const [subcategories, setSubcategories] = useState([]);

  async function fetchData() {
    const currentSubcategories = await fetchSubCategoriesByCategoryId(
      categoryId
    );
    setSubcategories(currentSubcategories);
  }

  async function addContent() {
    try {
      await addSubCategory(categoryId);
      const newContents = await fetchSubCategoriesByCategoryId(categoryId);
      setSubcategories(newContents);
    } catch (error) {
      console.error(
        "Error adding subcategory and fetching subcategories: ",
        error
      );
    }
  }

  function delCate() {
    deleteCategory(categoryId);
    navigate("/");
  }

  function delSubCate(subCategoryId) {
    deleteSubCategory(subCategoryId);
    const newContents = subcategories.filter(
      (subcat) => subcat.id !== subCategoryId
    );
    setSubcategories(newContents);
  }

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  // useEffect(() => {
  //   if (location.state && location.state.deleted) {
  //     const deletedSubCategoryId = parseInt(location.state.subc_id);
  //     const newContents = subcategories.filter(
  //       (subcat) => subcat.id !== deletedSubCategoryId
  //     );
  //     setSubcategories(newContents);
  //   }
  // }, [location.state, categoryId]);

  // main body of the component -------------------------------------------------
  return (
    <div>
      <Navbar />
      <div className="categories-directory">
        <button className="add-category-button" onClick={addContent}>
          New SubCategory
        </button>
        <button className="del-category-button" onClick={delCate}>
          Delete
        </button>
      </div>

      {subcategories.length > 0 && (
        <div className="category-page-container">
          <ul>
            {subcategories.map((subcat) => (
              <li key={subcat.id}>
                <Link
                  to={`/${category}/${subcat.name}?id=${categoryId}&sub_id=${subcat.id}`}
                >
                  {subcat.name}
                </Link>

                <button onClick={() => delSubCate(subcat.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
