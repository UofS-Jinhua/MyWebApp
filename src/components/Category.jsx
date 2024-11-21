import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Category.css";

export default function Category({ c_id, c_name, contents }) {
  const [cur_contents, set_cur_contents] = useState(contents);

  function addContent() {
    const new_content = prompt("Enter new SubCategory:");
    if (new_content !== null && new_content.trim() !== "") {
      // create a new SubCategory object
      const newSubCategory = {
        id: c_id,
        name: new_content.trim(),
      };

      console.log(newSubCategory);

      // send a POST request to the server
      axios
        .post("http://localhost:3000/subcategories", newSubCategory)
        .then((response) => {
          // when successfully added a new SubCategory, update the contents list
          axios
            .get(`http://localhost:3000/subcategories/${c_id}`)
            .then((res) => {
              set_cur_contents(res.data);
            })
            .catch((err) => console.error(err));
        })
        .catch((error) => {
          console.error("An error occured when adding new subcate: ", error);
        });
    }
  }

  return (
    <div className="category">
      <div className="category-header">
        <h3>
          <Link to={`/${c_name}?id=${c_id}`}>{c_name}</Link>
        </h3>
        <button className="add-button" onClick={addContent}>
          +
        </button>
      </div>
      <ul>
        {cur_contents.slice(0, 5).map((content, index) => (
          <li key={index}>
            <Link
              to={`/${c_name}/${content.name}?id=${c_id}&sub_id=${content.id}`}
            >
              {content.name}
            </Link>
          </li>
        ))}
        {cur_contents.length > 5 && (
          <li className="more-subcategories">...more</li>
        )}
      </ul>
    </div>
  );
}
