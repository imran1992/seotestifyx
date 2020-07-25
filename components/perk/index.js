import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  perkContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 8.38,
    padding: 14,
    marginRight: 20,
    width: 105,
    cursor: 'pointer'
  },
  perkImageContainer: {
    height: 34,
    width: 34,
    marginBottom: 12,
  },
  perkImage: {
    height: "100%",
    maxWidth: "100%",
  },
  perkName: {
    fontSize: 14,
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
    margin: "auto 0",
  },
}));

const Perk = (props) => {
  const classes = useStyles();

  const { bgColor, perkName, perkImg, onClick } = props;

  return (
    <div
      className={`${classes.perkContainer}`}
      style={{ backgroundColor: bgColor }}
      onClick={onClick}
    >
      <div className={`${classes.perkImageContainer}`}>
        <img src={perkImg} alt="perk" className={`${classes.perkImage}`} />
      </div>
      <span className={`${classes.perkName}`}>{perkName}</span>
    </div>
  );
};

export default Perk;
