import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey, cyan } from "@material-ui/core/colors";
import Router from "next/router";
import {
  AccountCircle,
  AccessTime,
  FiberManualRecord,
  ArrowForwardIos,
} from "@material-ui/icons";
import moment from "moment";

const secodaryColor = cyan[500];
const textLight = grey[500];
// const textLighter = grey[200];
const borderColor = grey[400];

const useStyles = makeStyles((theme) => {
  const { breakpoints } = theme;

  return {
    root: {
      width: "375px",
      height: "250px",
      border: `1.25px solid ${borderColor}`,
      borderRadius: 7.5,
      borderTop: `5px solid ${secodaryColor}`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginRight: theme.spacing(3),
      [breakpoints.down("xs")]: {
        width: "75vw",
        height: "220px",
      },
    },
    fontBold: {
      fontWeight: "bold",
    },
    avatarContainer: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
    },
    avatar: {
      color: secodaryColor,
      fontSize: "7.5vh",
    },
    startTimerContainer: {
      display: "flex",
      padding: theme.spacing(1.5),
    },
    startTimer: {
      display: "flex",
      flex: 1,
    },
    timeContainer: {
      display: "flex",
      flex: 4,
    },
    time: {
      color: textLight,
      padding: 0,
      margin: 0,
    },
    timeIconContainer: {
      display: "flex",
      flex: 1,
    },
    timeIcon: {
      color: textLight,
    },
    cardTitleContainer: {
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
    },
    cardTitleMain: {},
    cardTitle: {
      fontSize: "1.25em",
    },
    subjectContainer: {
      marginTop: theme.spacing(1),
    },
    subjectMain: {
      padding: 0,
      margin: 0,
    },
    subject: {
      color: secodaryColor,
    },
    subjectDot: {
      fontSize: "1.5vh",
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      color: grey[300],
    },
    subjectTeacher: {
      color: textLight,
    },
    prepareForClassContainer: {
      backgroundColor: grey[200],
      display: "flex",
      borderBottomLeftRadius: 7.5,
      borderBottomRightRadius: 7.5,
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1.5),
      cursor: "pointer",
    },
    prepareForClassHeadingContainer: {
      flex: 1,
    },
    prepareForClassHeading: {
      color: secodaryColor,
    },
    prepareForClassIconContainer: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    prepareForClassIcon: {
      fontSize: "3vh",
      color: secodaryColor,
    },
  };
});

const ClassCard = (props) => {
  const classes = useStyles();

  const { data } = props;

  const { startTime, name, subject, teacher, _id } = data;

    console.log(data, "My Upcoming Lecture 0000000");
  //   console.log(new Date().toLocaleString(), "Current Date");
  //   console.log(new Date(startTime).toLocaleString(), "Date To Start");
  //   console.log(moment().to(startTime), "To Start");

  return (
    <div className={classes.root}>
      <div className={classes.startTimerContainer}>
        <div className={classes.startTimer}>
          <div className={classes.timeIconContainer}>
            <AccessTime className={classes.timeIcon} />
          </div>
          <div className={classes.timeContainer}>
            <p className={`${classes.time} ${classes.fontBold}`}>
              {moment().to(startTime)}
            </p>
          </div>
        </div>
        <div className={classes.avatarContainer}>
          <AccountCircle className={classes.avatar} />
        </div>
      </div>
      <div className={`${classes.cardTitleContainer}`}>
        <div className={`${classes.cardTitleMain}`}>
          <Typography
            variant="h5"
            noWrap
            className={`${classes.cardTitle} ${classes.fontBold}`}
          >
            {name}
          </Typography>
        </div>
        <div className={`${classes.subjectContainer}`}>
          <p className={`${classes.subjectMain}`}>
            <span className={`${classes.subject} ${classes.fontBold}`}>
              {subject && subject["name"]}
            </span>
            <FiberManualRecord className={`${classes.subjectDot}`} />
            <span className={`${classes.subjectTeacher}`}>
              {teacher && (teacher["fullName"] || teacher["name"])}
            </span>
          </p>
        </div>
      </div>
      {
        props.forTeacher ? <div
          className={`${classes.prepareForClassContainer}`}
          onClick={() =>Router.push(`/online-class/live/${_id}`)}
        >
          <div className={`${classes.prepareForClassHeadingContainer}`}>
            <p
              className={`${classes.prepareForClassHeading} ${classes.subjectMain} ${classes.fontBold}`}
            >
              Start Class
          </p>
          </div>
          <div className={`${classes.prepareForClassIconContainer}`}>
            <ArrowForwardIos className={`${classes.prepareForClassIcon}`} />
          </div>
        </div> :

          <div
            className={`${classes.prepareForClassContainer}`}
            onClick={() => Router.push(`/online-class/${data["_id"]}`)}
          >
            <div className={`${classes.prepareForClassHeadingContainer}`}>
              <p
                className={`${classes.prepareForClassHeading} ${classes.subjectMain} ${classes.fontBold}`}
              >
                Prepare for class
        </p>
            </div>
            <div className={`${classes.prepareForClassIconContainer}`}>
              <ArrowForwardIos className={`${classes.prepareForClassIcon}`} />
            </div>
          </div>
      }

    </div>
  );
};

export default ClassCard;
