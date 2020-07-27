import React, { useState } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import DataText from "@components/dummyData/contact_us_data";

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
    padding: "1em 0",
    fontSize: "2.5em",
    fontWeight: "bold",
  },
  contactContianer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      width: "70%",
      margin: "0 auto",
    },
  },
  contactSourcesContianer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "2px 2px 12px #ccc",
    marginBottom: "2em",
    width: "90%",
    [theme.breakpoints.up("md")]: {
      maxWidth: "35%",
      height: 420,
      marginRight: "2em",
    },
  },
  contactUsFormContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "2px 2px 12px #ccc",
    marginBottom: "2em",
    [theme.breakpoints.up("md")]: {
      maxWidth: "65%",
    },
  },
  contactStudentHelplineContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "2em",
  },
  businessEnquiryContainer: {
    display: "flex",
    flexDirection: "column",
    padding: "2em",
  },
  addressContianer: {
    display: "flex",
    flexDirection: "column",
    padding: "2em",
  },
  contactUsHeading: {
    fontWeight: "bold",
    color: "var(--schoolx-DarkPrimaryColor)",
  },
  contactUsText: {
    fontWeight: 500,
    color: grey[600],
  },
  contactUsFormHeading: {
    padding: "1em 2em 0.5em 2em",
    textAlign: "center",
    fontWeight: "bold",
    color: "var(--schoolx-DarkPrimaryColor)",
    borderBottom: "1px solid var(--schoolx-LightPrimaryColor)",
    width: "95%",
    margin: "0 auto",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
    margin: "0 auto",
    padding: "2em 0",
  },
  formField: {
    marginTop: "1.5em",
    borderBottom: `1px solid #7b1fa2`,
    "&:hover": {
      borderBottom: `1px solid #7b1fa2 !important`,
    },
  },
  formInputUnderline: {
    "&:after": {
      borderBottom: `2px solid #7b1fa2`,
    },
  },
  formInputLabel: {
    color: "#7b1fa2",
  },
  formInputLabelFocused: {
    color: "#7b1fa2 !important",
  },
  btn: {
    backgroundColor: "#7b1fa2",
    "&:hover, &:active, &:focus": {
      backgroundColor: "#7b1fa2",
    },
    marginTop: "1em",
    width: "35%",
    alignSelf: "center",
  },
}));

function ContactUs() {
  const classes = useStyles();
  const [data, setData] = useState({ email: "", name: "", message: "" });

  return (
    <div className={classes.container}>
      <div className={classes.headingContianer}>
        <Typography variant="h3" component="h3" className={classes.heading}>
          Contact Us
        </Typography>
      </div>
      <div className={classes.contactContianer}>
        <div className={classes.contactSourcesContianer}>
          <div className={classes.contactStudentHelplineContainer}>
            <Typography
              variant="h6"
              component="h6"
              className={classes.contactUsHeading}
            >
              Helpline
            </Typography>
            <Typography component="p" className={classes.contactUsText}>
              {DataText["helpline"]}
            </Typography>
          </div>
          <div className={classes.businessEnquiryContainer}>
            <Typography
              variant="h6"
              component="h6"
              className={classes.contactUsHeading}
            >
              Enquiry
            </Typography>
            <Typography component="p" className={classes.contactUsText}>
              {DataText["enquiry"]}
            </Typography>
          </div>
          <div className={classes.addressContianer}>
            <Typography
              variant="h6"
              component="h6"
              className={classes.contactUsHeading}
            >
              Address
            </Typography>
            <Typography component="address" className={classes.contactUsText}>
              {DataText["address"]}
            </Typography>
          </div>
        </div>
        <div className={classes.contactUsFormContainer}>
          <Typography
            variant="h6"
            component="h6"
            className={classes.contactUsFormHeading}
          >
            Send Message
          </Typography>
          <form className={classes.formContainer}>
            <TextField
              required
              label="Email"
              value={data["email"]}
              className={classes.formField}
              InputLabelProps={{
                className: classes.formInputLabel,
                classes: { focused: classes.formInputLabelFocused },
              }}
              InputProps={{
                classes: { underline: classes.formInputUnderline },
              }}
              onChange={(ev) => setData({ ...data, email: ev.target.value })}
            />
            <TextField
              required
              label="Name"
              value={data["name"]}
              className={classes.formField}
              InputLabelProps={{
                className: classes.formInputLabel,
                classes: { focused: classes.formInputLabelFocused },
              }}
              InputProps={{
                classes: { underline: classes.formInputUnderline },
              }}
              onChange={(ev) => setData({ ...data, name: ev.target.value })}
            />
            <TextField
              label="Message"
              multiline
              rows={3}
              value={data["message"]}
              className={classes.formField}
              InputLabelProps={{
                className: classes.formInputLabel,
                classes: { focused: classes.formInputLabelFocused },
              }}
              InputProps={{
                classes: { underline: classes.formInputUnderline },
              }}
              onChange={(ev) => setData({ ...data, message: ev.target.value })}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.btn}
              onClick={() => {
                console.log(data["email"], data["name"], data["message"]);
              }}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
