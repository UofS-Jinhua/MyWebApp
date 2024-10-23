import { useState } from "react";

export default function Category({ c_name, contents }) {
  const [cur_contents, set_cur_contents] = useState(contents);
  return (
    <div>
      <h1>{c_name}</h1>
      <ul>
        {contents.map((content, index) => (
          <li key={index}>{content}</li>
        ))}
      </ul>
    </div>
  );
}
