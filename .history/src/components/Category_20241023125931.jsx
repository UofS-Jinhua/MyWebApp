import { useState } from "react";

export default function Category({ c_name, contents }) {
  const [cur_contents, set_cur_contents] = useState(contents);

  function addContent() {
    const new_content = prompt("Enter new content:");
    set_cur_contents([...cur_contents, new_content]);
  }

  return (
    <div className="category">
      <div className="category-header">
        <h1>{c_name}</h1>
        <button className="add-button" onClick={addContent}>
          +
        </button>
      </div>
      <ul>
        {cur_contents.map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ul>
    </div>
  );
}
