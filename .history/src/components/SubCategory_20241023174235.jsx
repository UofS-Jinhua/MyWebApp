import { useParams } from "react-router-dom";
import Note from "./Note";

export default function SubCategory() {
  const { category, subCategory } = useParams();

  // 假设我们有一个笔记数据结构
  const notes = {
    "Job Related": {
      Veeva: [{ text: "Note 1" }, { image: "Note 2" }, { file: "Note 3" }],
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
          <Note note={note} index={index} />
        ))}
      </ul>
    </div>
  );
}
