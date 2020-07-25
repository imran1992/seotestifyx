import React, { useState } from "react";
import { Typography, Button, Chip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey, cyan } from "@material-ui/core/colors";
import { FiberManualRecord } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Dialog from "@components/Dialog";
const secodaryColor = cyan[500];
const textLight = grey[500];
const textLighter = grey[200];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "60vw",
    height: "220px",
    border: `1px solid ${textLighter}`,
    borderRadius: 7.5,
    borderTop: `5px solid var(--schoolx-DefaultPrimaryColor)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginRight: theme.spacing(3),
    background: "linear-gradient(35deg, #b066fe 30%, #63e2ff 90%)",
    padding: "1.5em 2em",
    [theme.breakpoints.down("xs")]: {
      width: "75vw",
      height: "220px",
      padding: "1.5em 1em",
    },
    cursor:'pointer'
  },
  fontBold: {
    fontWeight: "bold",
  },
  cardTitleContainer: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
  cardTitleMain: {},
  cardTitle: {
    fontSize: "1.75em",
    color: "#fff",
    [theme.breakpoints.down("xs")]: {
      fontSize: "1.25rem",
    },
  },
  subjectContainer: {
    marginTop: theme.spacing(1),
  },
  subjectMain: {
    padding: 0,
    margin: 0,
  },
  subject: {},
  subjectDot: {
    fontSize: "1.5vh",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: "#fff",
  },
  subjectTeacher: {},
  joinNowBtnContainer: {},
  joinNowBtn: {
    borderRadius: 25,
    backgroundColor: "#311b92",
    "&:hover, &:active, &:focus": {
      backgroundColor: "#1a237e",
    },
  },
  liveClassIndicatorContainer: {},
  liveClassIndicator: {
    textTransform: "uppercase",
    letterSpacing: 1,
    padding: "0.5em !important",
  },
}));

const LiveClassesCard = (props) => {
  const classes = useStyles();
  const Router = useRouter();
  const { user } = useSelector((state) => state["USER"]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const { data } = props;
  console.log(data, " ");
  const { _id, name, subject, teacher, subscribers,courseId } = data;

  console.log(data, "My Upcoming Lecture");
  //   console.log(new Date().toLocaleString(), "Current Date");
  //   console.log(new Date(startTime).toLocaleString(), "Date To Start");
  //   console.log(moment().to(startTime), "To Start");


  const enrollAndJoin = () =>{
    console.log(subscribers, 'subscribers subscribers',user);
    if(subscribers.includes(user._id)){
      Router.push(`/online-class/live/${_id}`);
    }else{
      props.enrollToCourse(courseId)
      setTimeout(() => {
        Router.push(`/online-class/live/${_id}`);
      }, 2000);
    }
  }

  const joinCourse = () => {
      Router.push(`/online-class/live/${_id}`);
  };

  return (
    <div className={classes.root} onClick={joinCourse}>
      <div className={classes.liveClassIndicatorContainer}>
        <Chip
          label="Live"
          color="secondary"
          className={`${classes.liveClassIndicator} ${classes.fontBold}`}
        />
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
            <span className={`${classes.subjectTeacher} ${classes.fontBold}`}>
              {teacher["fullName"] || teacher["name"]}
            </span>
            <FiberManualRecord className={`${classes.subjectDot}`} />
            <span className={`${classes.subject} ${classes.fontBold}`}>
              {subject["name"]}
            </span>
          </p>
        </div>
      </div>
      <div className={classes.joinNowBtnContainer}>
        <Button
          variant="contained"
          size="large"
          color="primary"
          className={classes.joinNowBtn}
          // onClick={enrollAndJoin}
          onClick={joinCourse}
        >
          Join Now
        </Button>
      </div>

      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={enrollAndJoin}
        dialogMessage={"You are not Enrolled in this course, do you want to proceed by subscribing the course"}
      />
    </div>
  );
};

export default LiveClassesCard;
