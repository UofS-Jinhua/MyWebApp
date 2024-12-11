import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import { useSubCategory } from "../context/SubCategoryContext";
import config from "../config";

export default function SubCategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const { category, subCategory } = useParams();
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");

  // global context
  const { deleteSubCategory } = useSubCategory();
  // local state to store subsubcategories
  const [subsubcategories, setSubsubcategories] = useState([]);

  // fetch subsubcategories from the server
  useEffect(() => {
    if (subCategoryId) {
      axios
        .get(`${config.apiBaseUrl}/subsubcategories/${subCategoryId}`)
        .then((res) => {
          setSubsubcategories(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [subCategoryId]);

  // add a new subsubCategory
  function addContent() {
    const new_content = prompt("Enter new SubSubCategory:");
    if (new_content !== null && new_content.trim() !== "") {
      // create a new SubCategory object
      const newSubSubCategory = {
        category_id: categoryId,
        subcategory_id: subCategoryId,
        subsub_name: new_content.trim(),
      };
      // send a POST request to the server
      axios
        .post(`${config.apiBaseUrl}/subsubcategories`, newSubSubCategory)
        .then((response) => {
          // when successfully added a new SubSubCategory, update the contents list
          axios
            .get(`${config.apiBaseUrl}/subsubcategories/${subCategoryId}`)
            .then((res) => {
              setSubsubcategories(res.data);
            })
            .catch((err) => console.error(err));
        })
        .catch((error) => {
          console.error("An error occured when adding new subsubcate: ", error);
        });
    }
  }

  function delSubCate(subCateId) {
    deleteSubCategory(subCateId);
    navigate(`/${category}?id=${categoryId}`);
    window.location.reload();
  }

  function deleteSubSubCategory(subsubId) {
    axios
      .delete(`${config.apiBaseUrl}/subsubcategories/${subsubId}`)
      .then((res) => {
        const newSubSubCategories = subsubcategories.filter(
          (subsubcat) => subsubcat.id !== subsubId
        );
        setSubsubcategories(newSubSubCategories);
      })
      .catch((err) => console.error(err));
  }

  // main body of the component -------------------------------------------------
  return (
    <div>
      <Navbar />
      <div className="categories-directory">
        {/* <Breadcrumbs /> */}
        <button className="add-category-button" onClick={addContent}>
          New Content
        </button>
        <button
          className="del-category-button"
          onClick={() => delSubCate(subCategoryId)}
        >
          Delete
        </button>
      </div>

      {subsubcategories.length > 0 && (
        <div className="category-page-container">
          <ul>
            {subsubcategories.map((subsubcat) => (
              <li key={subsubcat.id}>
                <Link
                  to={`/${category}/${subCategory}/${subsubcat.name}?id=${categoryId}&sub_id=${subCategoryId}&subsub_id=${subsubcat.id}`}
                >
                  {subsubcat.name}
                </Link>

                <button onClick={() => deleteSubSubCategory(subsubcat.id)}>
                  {" "}
                  Delete{" "}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
