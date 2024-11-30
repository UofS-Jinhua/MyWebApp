import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

// import components
import Navbar from "../components/Navbar";
import Breadcrumbs from "../components/Breadcrumbs";

export default function SubCategoryPage() {
  const { category, subCategory } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("id");
  const subCategoryId = queryParams.get("sub_id");
  const [subsubcategories, setSubsubcategories] = useState([]);

  // fetch subsubcategories from the server
  useEffect(() => {
    if (subCategoryId) {
      axios
        .get(`http://localhost:3000/subsubcategories/${subCategoryId}`)
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

      // console.log(newSubSubCategory);

      // send a POST request to the server
      axios
        .post("http://localhost:3000/subsubcategories", newSubSubCategory)
        .then((response) => {
          // when successfully added a new SubSubCategory, update the contents list
          axios
            .get(`http://localhost:3000/subsubcategories/${subCategoryId}`)
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

  // main body of the component -------------------------------------------------
  return (
    <div>
      <Navbar />
      <div className="categories-directory">
        {/* <Breadcrumbs /> */}
        <button className="add-category-button" onClick={addContent}>
          New Content
        </button>
      </div>

      <div className="category-page-container">
        <ul>
          {subsubcategories.map((subsubcat) => (
            <li key={subsubcat.id}>
              <Link
                to={`/${category}/${subCategory}/${subsubcat.name}?id=${categoryId}&sub_id=${subCategoryId}&subsub_id=${subsubcat.id}`}
              >
                {subsubcat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
