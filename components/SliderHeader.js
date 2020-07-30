import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { blue, grey } from "@material-ui/core/colors";

const primaryColor = blue[500];
const textLight = grey[500];

const useStyles = makeStyles({
  fontBold: {
    fontWeight: "bold",
  },
  primaryColor: {
    color: primaryColor,
  },
  upComingClassesHeaderContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  upComingClassesHeaderSide1: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
  },
  upComingClassesHeaderSide2: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
  },
  upComingClassesHeaderSideHeadingSmall: {
    fontSize: "0.8rem",
    color: textLight,
    marginTop: "0.5rem",
  },
});

const SliderHeader = ({ title, subTitle, linkRef, linkText, onClickLinkText }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.upComingClassesHeaderContainer}`}>
      <div className={`${classes.upComingClassesHeaderSide1}`}>
        <Typography variant="h5" className={`${classes.fontBold}`}>
          {title}
        </Typography>
        {subTitle && subTitle !== "" && (
          <Typography
            variant="h6"
            className={`${classes.upComingClassesHeaderSideHeadingSmall} ${classes.fontBold}`}
          >
            {subTitle}
          </Typography>
        )}
      </div>
      <div className={classes.upComingClassesHeaderSide2}>
        <Typography
          variant="h6"
          component="a"
          href={linkRef}
          className={`${classes.fontBold} ${classes.primaryColor}`}
          onClick={onClickLinkText ? onClickLinkText : null}
        >
          {linkText}
        </Typography>
      </div>
    </div>
  );
};

export default SliderHeader;
