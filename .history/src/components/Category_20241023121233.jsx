export default function Category({ c_name, contents }) {
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
