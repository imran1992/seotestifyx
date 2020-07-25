import React from "react";
import {
  introduction,
  general,
  servicesAndTablet,
  registration,
  eligibility,
  security,
  licenseAndAccess,
  communications,
  payment,
  userObligations,
  copyRight,
  disclaimer,
  indemnification,
  termination,
  hostingOfThirdParty,
  disputes,
  privacy,
  counselling,
  provisions,
  contactUs,
} from "@components/dummyData/termOfService";
import { makeStyles } from "@material-ui/core/styles";
import { purple, grey } from "@material-ui/core/colors";

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
      margin: '0 auto'
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
  colorBlack: {
    color: grey[900],
  },
  mr1: {
    marginRight: 10,
  },
  ml2: {
    marginLeft: 20,
  },
}));

const TermOfService = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <h1 className={classes.mainHeading}>Terms of Service</h1>
      <div className={classes.contentContainer}>
        {introduction.map((record) => (
          <p className={classes.para}>{record}</p>
        ))}
        <ol className={classes.listContainer}>
          <li>
            <h2 className={classes.listHeading}>{general["title"]}</h2>
            {general["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>
              {servicesAndTablet["title"]}
            </h2>
            {servicesAndTablet["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{registration["title"]}</h2>
            {registration["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{eligibility["title"]}</h2>
            {eligibility["list"].map((item) => (
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
            <h2 className={classes.listHeading}>{licenseAndAccess["title"]}</h2>
            {licenseAndAccess["list"].map((item) => {
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
            <h2 className={classes.listHeading}>{communications["title"]}</h2>
            {communications["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{payment["title"]}</h2>
            {payment["list"].map((item) => {
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
            <h2 className={classes.listHeading}>{userObligations["title"]}</h2>
            {userObligations["list"].map((item) => {
              if (typeof item === "object") {
                return (
                  <ul
                    className={`${classes.listContainer} ${classes.ulListContainer}`}
                  >
                    {item["list"].map((snap) => {
                      if (typeof snap === "object") {
                        return (
                          <ul
                            className={`${classes.listContainer} ${classes.ulListContainer} ${classes.ml2}`}
                          >
                            {snap["list"].map((x) => (
                              <li
                                className={`${classes.listItem} ${classes.colorBlack}`}
                              >
                                {x}
                              </li>
                            ))}
                          </ul>
                        );
                      } else {
                        return <li className={classes.listItem}>{snap}</li>;
                      }
                    })}
                  </ul>
                );
              } else {
                return <p className={classes.para}>{item}</p>;
              }
            })}
          </li>
          <li>
            <h2 className={classes.listHeading}>{copyRight["title"]}</h2>
            {copyRight["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{disclaimer["title"]}</h2>
            {disclaimer["list"].map((item) => {
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
            <h2 className={classes.listHeading}>{indemnification["title"]}</h2>
            {indemnification["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{termination["title"]}</h2>
            {termination["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>
              {hostingOfThirdParty["title"]}
            </h2>
            {hostingOfThirdParty["list"].map((item) => (
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
            <h2 className={classes.listHeading}>{privacy["title"]}</h2>
            {privacy["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{counselling["title"]}</h2>
            {counselling["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{provisions["title"]}</h2>
            {provisions["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
          <li>
            <h2 className={classes.listHeading}>{contactUs["title"]}</h2>
            {contactUs["list"].map((item) => (
              <p className={classes.para}>{item}</p>
            ))}
          </li>
        </ol>
      </div>
    </div>
  );
};

export default TermOfService;
