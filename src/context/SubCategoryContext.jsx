import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import config from "../config";

const SubCategoryContext = createContext();

export const useSubCategory = () => useContext(SubCategoryContext);

export const SubCategoryProvider = ({ children }) => {
  const [subcategories, setSubCategories] = useState([]);

  // fetch all subcategories
  const fetchSubCategories = () => {
    axios
      .get(`${config.apiBaseUrl}/subcategories`)
      .then((response) => {
        setSubCategories(response.data);
      })
      .catch((error) => console.log(error));
  };

  // fetch subcategories by category id
  const fetchSubCategoriesByCategoryId = async (categoryId) => {
    var result = [];
    await axios
      .get(`${config.apiBaseUrl}/subcategories/${categoryId}`)
      .then((response) => {
        result = response.data;
      })
      .catch((error) => {
        console.error("Error fetching subcategories by category ID: ", error);
      });
    return result;
  };

  // add a new subcategory
  const addSubCategory = (categoryId) => {
    return new Promise((resolve, reject) => {
      const newSubCategoryName = prompt("Enter new SubCategory name:");
      if (newSubCategoryName && newSubCategoryName.trim() !== "") {
        const newSubCategory = {
          id: categoryId,
          name: newSubCategoryName.trim(),
        };
        axios
          .post(`${config.apiBaseUrl}/subcategories`, newSubCategory)
          .then((response) => {
            fetchSubCategories();
            resolve(response.data);
          })
          .catch((error) => {
            console.error("Error adding subcategory: ", error);
            reject(error);
          });
      } else {
        reject(new Error("Invalid subcategory name"));
      }
    });
  };

  const deleteSubCategory = (subCategoryId) => {
    axios
      .delete(`${config.apiBaseUrl}/subcategories/${subCategoryId}`)
      .then((response) => {
        fetchSubCategories();
      })
      .catch((error) => {
        console.error("An error occured when deleting subcategory: ", error);
      });
  };

  const findSubCategories_local = (categoryId) => {
    const result = subcategories.filter(
      (subcategory) => subcategory.category_id === categoryId
    );
    return result;
  };

  return (
    <SubCategoryContext.Provider
      value={{
        subcategories,
        fetchSubCategories,
        fetchSubCategoriesByCategoryId,
        addSubCategory,
        deleteSubCategory,
        findSubCategories_local,
      }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};
