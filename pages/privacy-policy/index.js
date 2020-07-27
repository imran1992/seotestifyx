import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { purple, grey } from "@material-ui/core/colors";
import {
  introduction,
  definitions,
  overview,
  notifications,
  infoWeCollect,
  accessingInfo,
  confidentiality,
  controlOfPass,
  cookies,
  disclaimer,
  disclosureOfInfo,
  disputes,
  externalLinks,
  howInfoCollected,
  otherInfoCollectors,
  questions,
  security,
  useOfInfo,
} from "@components/dummyData/privacyPolicy";

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: grey[50],
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3em 0",
    [theme["breakpoints"].down("sm")]: {
      paddingTop: "1.25em",
    },
  },
  mainHeading: {
    margin: 0,
    padding: 0,
    fontWeight: "bold",
    letterSpacing: 1,
    color: purple[500],
    fontSize: "2.75em",
    [theme["breakpoints"].down("sm")]: {
      fontSize: "1.75em",
    },
  },
  contentContainer: {
    width: "65%",
    marginTop: "2em",
    [theme["breakpoints"].down("sm")]: {
      width: "90%",
      margin: "0 auto",
    },
  },
  para: {
    color: grey[900],
    fontSize: "1.15em",
    fontWeight: 400,
    margin: 0,
    padding: 0,
    marginTop: "1em",
    [theme["breakpoints"].down("sm")]: {
      fontSize: "1em",
    },
  },
  listContainer: {
    listStyleType: "none",
    padding: 0,
  },
  ulListContainer: {
    listStyleType: "disc",
  },
  listHeading: {
    padding: 0,
    margin: 0,
    marginTop: "1em",
    fontSize: "2em",
    fontWeight: "bold",
    color: purple[600],
    maxWidth: "60%",
    [theme["breakpoints"].down("sm")]: {
      fontSize: "1.5em",
    },
  },
  listItem: {
    color: purple[900],
    fontSize: "1.15em",
    fontWeight: 400,
    margin: 0,
    padding: 0,
    marginTop: "0.75em",
    marginLeft: "1em",
    [theme["breakpoints"].down("sm")]: {
      fontSize: "0.875em",
    },
  },
  upperCase: {
    textTransform: "uppercase",
  },
  fontBold: {
    fontWeight: "bold",
  },
  mr1: {
    marginRight: 10,
  },
}));

const PrivacyPolicy = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h1 className={classes.mainHeading}>Privacy Policy</h1>
      <div className={classes.contentContainer}>
        {introduction.map((record) => (
          <p className={classes.para}>{record}</p>
        ))}
        <ol className={classes.listContainer}>
          <li>
            <h2 className={classes.listHeading}>{definitions["title"]}</h2>
            <ul
              className={`${classes.listContainer} ${classes.ulListContainer}`}
            >
              {definitions["list"].map((item) => (
                <li className={classes.listItem}>{item}</li>
              ))}
            </ul>
          </li>
          <li>
            <h2 className={classes.listHeading}>{overview["title"]}</h2>
            {overview["list"].map((item) => {
              if (typeof item === "object") {
                return (
                  <ul
                    className={`${classes.listContainer} ${classes.ulListContainer}`}
                  >
                    {item["list"].map((snap) => (
                      <li className={classes.listItem}>{snap}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p className={classes.para}>{item}</p>;
              }
            })}
          </li>
          <li>
            <h2 className={classes.listHeading}>{notifications["title"]}</h2>
            {notifications["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{infoWeCollect["title"]}</h2>
            {infoWeCollect["list"].map((item) => {
              if (typeof item === "object") {
                return (
                  <ul
                    className={`${classes.listContainer} ${classes.ulListContainer}`}
                  >
                    {item["list"].map((snap) => (
                      <li className={classes.listItem}>{snap}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p className={classes.para}>{item}</p>;
              }
            })}
          </li>
          <li>
            <h2 className={classes.listHeading}>{howInfoCollected["title"]}</h2>
            <ul
              className={`${classes.listContainer} ${classes.ulListContainer}`}
            >
              {howInfoCollected["list"].map((item) => (
                <li className={classes.listItem}>{item}</li>
              ))}
            </ul>
          </li>
          <li>
            <h2 className={classes.listHeading}>{cookies["title"]}</h2>
            <ul
              className={`${classes.listContainer} ${classes.ulListContainer}`}
            >
              {cookies["list"].map((item) => (
                <li className={classes.listItem}>{item}</li>
              ))}
            </ul>
          </li>
          <li>
            <h2 className={classes.listHeading}>{externalLinks["title"]}</h2>
            {externalLinks["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{useOfInfo["title"]}</h2>
            {useOfInfo["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{confidentiality["title"]}</h2>
            {confidentiality["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{disclosureOfInfo["title"]}</h2>
            {disclosureOfInfo["list"].map((item) => {
              if (typeof item === "object") {
                return (
                  <ul
                    className={`${classes.listContainer} ${classes.ulListContainer}`}
                  >
                    {item["list"].map((snap) => (
                      <li className={classes.listItem}>{snap}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p className={classes.para}>{item}</p>;
              }
            })}
          </li>
          <li>
            <h2 className={classes.listHeading}>{accessingInfo["title"]}</h2>
            {accessingInfo["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{controlOfPass["title"]}</h2>
            {controlOfPass["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>
              {otherInfoCollectors["title"]}
            </h2>
            {otherInfoCollectors["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{security["title"]}</h2>
            {security["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{disclaimer["title"]}</h2>
            {disclaimer["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{disputes["title"]}</h2>
            {disputes["list"].map((item) => {
              if (typeof item === "object") {
                return (
                  <ul
                    className={`${classes.listContainer} ${classes.ulListContainer}`}
                  >
                    {item["list"].map((snap) => (
                      <li className={classes.listItem}>{snap}</li>
                    ))}
                  </ul>
                );
              } else {
                return <p className={classes.para}>{item}</p>;
              }
            })}
          </li>
          <li>
            <h2 className={classes.listHeading}>{questions["title"]}</h2>
            {questions["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
