import React from "react";
import { Link } from "react-router-dom";

const divStyle = {
  margin: "20px",
  border: "5px solid black"
};

const HomePage = () => (
  <div className="home-page flex" style={divStyle}>
    <div><h1>Band-e-oke</h1></div>
    <div className="how-to-link-wrapper"><Link to="/how-to">How to...</Link></div>
  </div>
);

export default HomePage;
