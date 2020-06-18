import React from "react";
const ReactMarkdown = require('react-markdown')
import text from "./text.md"

const divStyle = {
  margin: "20px",
  border: "5px solid black"
};

const HowToPage = () => (
  <div className="" style={divStyle}>
    <ReactMarkdown source={text} />
  </div>
);

export default HowToPage;
