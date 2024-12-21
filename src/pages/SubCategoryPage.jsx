import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";

// import css styles
// import "./SubCategoryPage.css";

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
  const [newSubsubcatName, setNewSubsubcatName] = useState([]);
  const [openEdit, setOpenEdit] = useState([]);

  // fetch subsubcategories from the server
  useEffect(() => {
    if (subCategoryId) {
      axios
        .get(`${config.apiBaseUrl}/subsubcategories/${subCategoryId}`)
        .then((res) => {
          setSubsubcategories(res.data);
          setNewSubsubcatName(res.data);
          setOpenEdit(res.data.map((subsubcat) => false));
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
              setNewSubsubcatName(res.data);
              setOpenEdit(res.data.map((subsubcat) => false));
            })
            .catch((err) => console.error(err));
        })
        .catch((error) => {
          console.error("An error occured when adding new subsubcate: ", error);
        });
    }
  }

  function updateSubSubCategory(subsubId, newSubsubName) {
    const newSubSubCategory = {
      name: newSubsubName,
    };
    axios
      .put(
        `${config.apiBaseUrl}/subsubcategories/${subsubId}`,
        newSubSubCategory
      )
      .then((response) => {
        setSubsubcategories((prev) =>
          prev.map((subsub) =>
            subsub.id === subsubId ? { ...subsub, name: newSubsubName } : subsub
          )
        );
      })
      .catch((error) => {
        console.error("An error occured when updating subsubcate: ", error);
      });
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

  function splittitle(title) {
    if (title.length > 20) {
      return title.slice(0, 20) + "...";
    } else {
      return title;
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
            {subsubcategories.map((subsubcat, index) => (
              <li key={subsubcat.id}>
                {openEdit[index] ? (
                  <div>
                    <input
                      type="text"
                      value={newSubsubcatName[index].name}
                      onChange={(e) => {
                        setNewSubsubcatName((prev) =>
                          prev.map((value, i) =>
                            i === index
                              ? { ...value, name: e.target.value }
                              : value
                          )
                        );
                      }}
                    />
                    <button
                      className="delete-button-subcate"
                      onClick={() => {
                        updateSubSubCategory(
                          subsubcat.id,
                          newSubsubcatName[index].name
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
                        setNewSubsubcatName((prev) =>
                          prev.map((value, i) =>
                            i === index
                              ? { ...value, name: subsubcat.name }
                              : value
                          )
                        );
                      }}
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <div className="edit-subcategory">
                    <Link
                      to={`/${category}/${subCategory}/${subsubcat.name}?id=${categoryId}&sub_id=${subCategoryId}&subsub_id=${subsubcat.id}`}
                    >
                      {splittitle(subsubcat.name)}
                    </Link>
                    <button
                      className="edit-mode-button-subcate"
                      onClick={() => {
                        const newOpenEdit = openEdit.map((value, i) =>
                          i === index ? true : value
                        );
                        setOpenEdit(newOpenEdit);
                      }}
                    ></button>
                  </div>
                )}

                {openEdit[index] === false && (
                  <button
                    className="delete-button-subcate"
                    onClick={() => deleteSubSubCategory(subsubcat.id)}
                  >
                    {" "}
                    Delete{" "}
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
