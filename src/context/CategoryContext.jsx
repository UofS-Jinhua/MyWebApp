import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    axios
      .get("http://localhost:3000/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.log(error));
  };

  const addCategory = () => {
    const newCategoryName = prompt("New Category Name：");
    if (newCategoryName && newCategoryName.trim() !== "") {
      const newCategory = {
        name: newCategoryName.trim(),
      };
      axios
        .post("http://localhost:3000/categories", newCategory)
        .then((response) => {
          fetchCategories();
        })
        .catch((error) => {
          console.error("Get Error when Post new category: ", error);
        });
    } else {
      alert("Missing Category name. Please try again.");
    }
  };

  const deleteCategory = (categoryId) => {
    axios
      .delete(`http://localhost:3000/categories/${categoryId}`)
      .then((response) => {
        fetchCategories();
      })
      .catch((error) => {
        console.error("An error occured when deleting category: ", error);
      });
  };

  return (
    <CategoryContext.Provider
      value={{ categories, fetchCategories, addCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};