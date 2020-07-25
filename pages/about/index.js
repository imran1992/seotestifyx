import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import DataText from "@components/dummyData/about_data";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    backgroundColor: grey[50],
    display: "flex",
    padding: "1.25em 0",
    flexDirection: "column",
    minHeight: "calc(100vh - 121px)",
  },
  headingContianer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  heading: {
    textAlign: "center",
    margin: 0,
    padding: "1em 0 0 0",
    fontSize: "2.5em",
    fontWeight: "bold",
    color: "var(--schoolx-DarkPrimaryColor)",
  },
  contactStudentHelplineContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "2em",
    [theme.breakpoints.up("md")]: {
      maxWidth: "65%",
      margin: "0 auto",
    },
  },
  contactUsHeading: {
    fontWeight: "bold",
    color: "var(--schoolx-DarkPrimaryColor)",
    marginTop: "1.5em",
  },
  contactUsText: {
    fontWeight: 500,
    color: grey[900],
    fontSize: "1em",
  },
  contactUsTextBox: {
    border: "1px solid var(--schoolx-DarkPrimaryColor)",
    borderRadius: 10,
    padding: "1em",
    backgroundColor: "#ede7f6",
  },
}));

function AboutUs() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.headingContianer}>
        <Typography variant="h3" component="h3" className={classes.heading}>
          About Us
        </Typography>
      </div>
      <div className={classes.contactStudentHelplineContainer}>
        {DataText["startingParas"].map((para, i) => {
          if (i === 0) {
            return (
              <Typography component="p" className={classes.contactUsText}>
                {para}
              </Typography>
            );
          } else {
            return (
              <Typography
                component="p"
                className={`${classes.contactUsText} mt-3`}
              >
                {para}
              </Typography>
            );
          }
        })}
        <Typography
          variant="h6"
          component="h6"
          className={classes.contactUsHeading}
        >
          Why SchoolX
        </Typography>
        {DataText["whySchoolX"].map((item) => (
          <Typography
            component="p"
            className={`${classes.contactUsText} ${classes.contactUsTextBox} mt-3`}
          >
            {item}
          </Typography>
        ))}
        <Typography
          variant="h6"
          component="h6"
          className={classes.contactUsHeading}
        >
          Payments
        </Typography>
        {DataText["payments"].map((item) => (
          <Typography component="p" className={`${classes.contactUsText} mt-3`}>
            {item}
          </Typography>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
