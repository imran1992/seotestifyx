import React from "react";
import Link from "next/link";
import { makeStyles, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 992,
      lg: 1200,
      xl: 1480,
    },
  },
});

const useStyles = makeStyles(() => ({
  footerContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "var(--schoolx-DarkPrimaryColor)",
    display: "flex",
    padding: "1.25em 15vw",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  footerCRContainer: {
    // border: "1px solid red",
    // flex: 1,
    minWidth: 150,
    marginRight: 10,
    // display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      flexDirection: "column",
    },
  },
  footerNavContainer: {
    // border: "1px solid red",
    flex: 5,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0.75em",
      flexWrap: "wrap",
    },
  },
  socialLinksContainer: {
    // border: "1px solid red",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      marginTop: "1.5em",
    },
  },
  copyRightText: {
    padding: 0,
    margin: 0,
    color: "var(--schoolx-LightPrimaryColor)",
    fontWeight: 500,
    letterSpacing: 0.5,
  },
  dividerVertical: {
    borderRight: "2px solid var(--schoolx-LightPrimaryColor)",
    height: "80%",
    margin: "0 1em",
    [theme.breakpoints.down("sm")]: {
      margin: "1em 0 0 0",
      width: "100%",
      borderRight: "none",
      borderBottom: "2px solid var(--schoolx-LightPrimaryColor)",
    },
  },
  pageLink: {
    color: "var(--schoolx-LightPrimaryColor) !important",
    "&:hover": {
      textDecoration: "underline !important",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px !important",
      width: "50%",
      padding: 7.5,
      textAlign: "center",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  socialLink: {},
}));

const Footer = React.forwardRef((props, ref) => {
  const classes = useStyles();

  return (
    <footer ref={ref} className={classes.footerContainer}>
      <div className={classes.footerCRContainer}>
        <p className={classes.copyRightText} style={{borderRight: '2px solid'}}>© 2020 SCHOOLX</p>
        {/* <div className={classes.dividerVertical} /> */}
      </div>
      <div className={classes.footerNavContainer}>
        <Link href="/contact-us">
          <a className={`${classes.copyRightText} ${classes.pageLink}`}>
            Contact Us
          </a>
        </Link>
        <Link href="/about">
          <a className={`${classes.copyRightText} ${classes.pageLink} ml-4`}>
            About Us
          </a>
        </Link>
        <Link href="/terms-of-service">
          <a className={`${classes.copyRightText} ${classes.pageLink} ml-4`}>
            Terms of Service
          </a>
        </Link>
        <Link href="/privacy-policy">
          <a className={`${classes.copyRightText} ${classes.pageLink} ml-4`}>
            Privacy Policy
          </a>
        </Link>
      </div>
      <div className={classes.socialLinksContainer}>
        <a
          href="https://www.facebook.com/schoolxpk"
          target="_blank"
          className={`${classes.socialLink}`}
        >
          <i className="fa fa-facebook fa-lg white-text" />
        </a>
        <a
          href="https://instagram.com/schoolxacademy?igshid=1i5sc0z99ebt8"
          target="_blank"
          className={`${classes.socialLink} ml-4`}
        >
          <i className="fa fa-instagram fa-lg white-text" />
        </a>
        <a
          href="https://www.linkedin.com/company/schoolxpk/"
          target="_blank"
          className={`${classes.socialLink} ml-4`}
        >
          <i className="fa fa-linkedin fa-lg white-text" />
        </a>
      </div>
    </footer>
  );
});

export default Footer;
