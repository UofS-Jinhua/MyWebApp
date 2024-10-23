import { useState } from "react";
import { Link } from "react-router-dom";

export default function Category({ c_name, contents }) {
  const [cur_contents, set_cur_contents] = useState(contents);

  function addContent() {
    const new_content = prompt("Enter new content:");
    if (new_content !== null && new_content.trim() !== "") {
      set_cur_contents([...cur_contents, new_content.trim()]);
    }
  }

  return (
    <div className="category">
      <div className="category-header">
        <h3>{c_name}</h3>
        <button className="add-button" onClick={addContent}>
          +
        </button>
      </div>
      <ul>
        {cur_contents.map((content, index) => (
          <li>
            {" "}
            <Link to={`/${c_name}/${content}`}>{content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}