import { Color } from "../styles/Color";

export function GetHighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) {
  // Split on highlight term and include term into parts, ignore case
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === highlight.toLowerCase()
              ? { backgroundColor: Color.Warning, borderRadius: "0.3rem" }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
}
