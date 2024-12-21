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
import Breadcrumbs from "../components/Breadcrumbs";

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
  const {
    fetchSubCategoriesByCategoryId,
    addSubCategory,
    deleteSubCategory,
    updateSubCategory,
  } = useSubCategory();

  // local state
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcatName, setNewSubcatName] = useState([]);
  const [openEdit, setOpenEdit] = useState([]);

  async function fetchData() {
    const currentSubcategories = await fetchSubCategoriesByCategoryId(
      categoryId
    );
    setSubcategories(currentSubcategories);
    setNewSubcatName(currentSubcategories);
    setOpenEdit(currentSubcategories.map((subcat) => false));
  }

  async function addContent() {
    try {
      await addSubCategory(categoryId);
      const newContents = await fetchSubCategoriesByCategoryId(categoryId);
      setSubcategories(newContents);
      setNewSubcatName(newContents);
      setOpenEdit(newContents.map((subcat) => false));
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

  function splittitle(title) {
    if (title.length > 20) {
      return title.slice(0, 20) + "...";
    } else {
      return title;
    }
  }

  useEffect(() => {
    fetchData();
  }, [categoryId]);

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
            {subcategories.map((subcat, index) => (
              <li key={subcat.id}>
                {openEdit[index] ? (
                  <div>
                    <div className="edit-subcategory">
                      <input
                        type="text"
                        value={newSubcatName[index].name}
                        onChange={(e) =>
                          setNewSubcatName((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, name: e.target.value }
                                : item
                            )
                          )
                        }
                      />
                      <button
                        className="delete-button-subcate"
                        onClick={() => {
                          updateSubCategory(
                            subcat.id,
                            newSubcatName[index].name
                          );
                          setOpenEdit((prev) =>
                            prev.map((edit, i) => (i === index ? false : edit))
                          );
                        }}
                      >
                        √
                      </button>
                      <button
                        className="delete-button-subcate"
                        onClick={() => {
                          setOpenEdit((prev) =>
                            prev.map((edit, i) => (i === index ? false : edit))
                          );
                          setNewSubcatName((prev) =>
                            prev.map((item, i) =>
                              i === index
                                ? { ...item, name: subcat.name }
                                : item
                            )
                          );
                        }}
                      >
                        x
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="edit-subcategory">
                      <Link
                        to={`/${category}/${newSubcatName[index].name}?id=${categoryId}&sub_id=${subcat.id}`}
                      >
                        {splittitle(newSubcatName[index].name)}
                      </Link>
                      <button
                        className="edit-mode-button-subcate"
                        onClick={() =>
                          setOpenEdit((prev) =>
                            prev.map((edit, i) => (i === index ? true : edit))
                          )
                        }
                      ></button>
                    </div>
                  </div>
                )}
                {openEdit[index] === false && (
                  <button
                    className="delete-button-subcate"
                    onClick={() => delSubCate(subcat.id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
