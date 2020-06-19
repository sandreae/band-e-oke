import React from "react";
const ReactMarkdown = require('react-markdown/with-html')
import text from "./text.md"

const divStyle = {
  margin: "20px",
  border: "5px solid black"
};

const HowToPage = () => (
  <div className="how-to" style={divStyle}>
    <ReactMarkdown escapeHtml={false} source={text} />
  </div>
);

export default HowToPage;
