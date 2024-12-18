import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import config from "../config";

const CategoryContext = createContext();

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    axios
      .get(`${config.apiBaseUrl}/categories`)
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
        .post(`${config.apiBaseUrl}/categories`, newCategory)
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
      .delete(`${config.apiBaseUrl}/categories/${categoryId}`)
      .then((response) => {
        fetchCategories();
      })
      .catch((error) => {
        console.error("An error occured when deleting category: ", error);
      });
  };

  const updateCategory = (categoryId, newCategoryName) => {
    const newCategory = {
      name: newCategoryName,
    };
    axios
      .put(`${config.apiBaseUrl}/categories/${categoryId}`, newCategory)
      .then((response) => {
        fetchCategories();
      })
      .catch((error) => {
        console.error("An error occured when updating category: ", error);
      });
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        fetchCategories,
        addCategory,
        deleteCategory,
        updateCategory,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
