import React from "react";

const pages = new Array(18).fill(null);

const LOader = ({ showOnlyLoader, size }) => {
  const onlyLoader = (
    <div className={`myLoader ${size === "small" ? "loaderSmall" : ""}`}>
      <div className="inner">
        <div className="left"></div>
        <div className="middle"></div>
        <div className="right"></div>
      </div>
      <ul>
        {pages.map((page, i) => {
          return <li key={i}></li>;
        })}
      </ul>
    </div>
  );

  if (showOnlyLoader) return onlyLoader;
  else return <div className="loader">{onlyLoader}</div>;
};
export default LOader;
