import React, { ReactNode } from "react";

export default function structuredFormatText (text: string): ReactNode  {
  return (
    <>
      {text.split("\n").map((line: string, index: number) => {
        if (line.startsWith("**")) {
          return (
            <h3 key={index} style={{ margin: "10px 0" }}>
              {line.replace(/\*\*/g, "")}
            </h3>
          );
        } else if (line.startsWith("* **")) {
          // Render as an H4 heading
          return (
            <h4 key={index} style={{ margin: "8px 0", color: "#2c3e50" }}>
              {line.replace(/\* \*\*/g, "").replace(/\*\*:$/, ":")}
            </h4>
          );
        } else if (line.startsWith("  * **")) {
          // Render as a paragraph with bold text for advantages/disadvantages
          return (
            <p
              key={index}
              style={{
                marginLeft: "20px",
                fontSize: "0.9rem",
                lineHeight: "1.5",
              }}
            >
              <strong>{line.match(/\*\*(.*?)\*\*/)?.[1]}:</strong>{" "}
              {line.replace(/.*?\*\*.*?\*\*: /, "")}
            </p>
          );
        } else {
          // Render as a regular paragraph
          return (
            <p key={index} style={{ marginTop: "10px", lineHeight: "1.6" }}>
              {line}
            </p>
          );
        }
      })}
    </>
  );
};
