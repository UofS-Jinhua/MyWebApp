import { useParams } from "react-router-dom";
import Note from "./Note";

export default function SubCategory() {
  const { category, subCategory } = useParams();

  // 假设我们有一个笔记数据结构
  const notes = {
    "Job Related": {
      Veeva: ["Note 1", "Note 2"],
      Projects: ["Note 3", "Note 4"],
    },
    "Coding Related": {
      Carrot: ["Note 5", "Note 6"],
      Daikon: ["Note 7", "Note 8"],
    },
    Others: {
      Apple: ["Note 9", "Note 10"],
      Banana: ["Note 11", "Note 12"],
    },
  };

  const subCategoryNotes = notes[category][subCategory] || [];

  return (
    <div>
      <h2>
        {subCategory} in {category}
      </h2>
      <ul>
        {subCategoryNotes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
