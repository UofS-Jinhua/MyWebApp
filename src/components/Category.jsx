import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Category.css";
import { useCategory } from "../context/CategoryContext";
import { useSubCategory } from "../context/SubCategoryContext";

export default function Category({ c_id, c_name, contents }) {
  const { fetchCategories, deleteCategory, updateCategory } = useCategory();
  const { addSubCategory, fetchSubCategoriesByCategoryId, deleteSubCategory } =
    useSubCategory();

  const [curName, setCurName] = useState(c_name);
  const [cur_contents, set_cur_contents] = useState(contents || []);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function addContent() {
    try {
      await addSubCategory(c_id);
      const newContents = await fetchSubCategoriesByCategoryId(c_id);
      set_cur_contents(newContents);
    } catch (error) {
      console.error(
        "Error adding subcategory and fetching subcategories: ",
        error
      );
    }
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setCurName(c_name);
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    updateCategory(c_id, curName);
    setIsEditing(false);
  };

  const changeName = (e) => {
    setCurName(e.target.value);
  };

  const delContent = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteCategory(c_id);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const delSub = (sub_id) => {
    deleteSubCategory(sub_id);
    set_cur_contents(cur_contents.filter((content) => content.id !== sub_id));
  };

  const splittitle = (title) => {
    if (title.length > 20) {
      return title.slice(0, 16) + "...";
    } else {
      return title;
    }
  };

  return (
    <div className="category">
      {/* <h4>
          <Link to={`/${c_name}?id=${c_id}`}>{c_name}</Link>
          <button className="changename" onClick={changeName}>
            C
          </button>
        </h4> */}
      {isEditing ? (
        <div className="category-header">
          <input type="text" value={curName} onChange={changeName} />
          <button className="edit-save-button" onClick={handleSaveClick}>
            √
          </button>
          <button className="edit-back-button" onClick={handleCancelClick}>
            x
          </button>
        </div>
      ) : (
        <div className="category-header">
          <div className="category-name">
            <h4>
              <Link to={`/${curName}?id=${c_id}`}>{splittitle(curName)}</Link>
            </h4>
            <button
              className="edit-mode-button"
              onClick={handleEditClick}
            ></button>
          </div>

          <div className="category-buttons">
            <button className="add-button" onClick={addContent}>
              +
            </button>
            <button className="delete-button-cate" onClick={delContent}>
              -
            </button>
          </div>
        </div>
      )}

      <ul>
        {cur_contents.slice(0, 5).map((content, index) => (
          <li key={index}>
            <Link
              to={`/${c_name}/${content.name}?id=${c_id}&sub_id=${content.id}`}
            >
              {splittitle(content.name)}
            </Link>

            <button
              className="delete-button-cate"
              onClick={() => delSub(content.id)}
            >
              -
            </button>
          </li>
        ))}
        {cur_contents.length > 5 && (
          <li className="more-subcategories">...more</li>
        )}
      </ul>

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this category?</h3>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirmDelete}>
                Yes
              </button>
              <button className="cancel-button" onClick={handleCancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
