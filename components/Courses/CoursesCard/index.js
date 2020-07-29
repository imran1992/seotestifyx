import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { grey, blue, green } from "@material-ui/core/colors";
import Router from "next/router";
import moment from "moment";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Chip,
} from "@material-ui/core";

import { FiberManualRecord, Star } from "@material-ui/icons";

const primaryColor = blue[500];
const secodaryColor = green[500];
const textLight = grey[500];
const greyLighter = grey[100];
const borderColor = grey[400];

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
    width: 300,
    height: 390,
    marginRight: theme.spacing(3),
    border: `1.25px solid ${borderColor}`,
    borderRadius: 15,
    boxShadow: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "75vw",
      height: 360,
    },
  },
  media: {
    height: 180,
    position: "relative",
    borderRadius: "15px 15px 0 0",
    [theme.breakpoints.down("xs")]: {
      backgroundPosition: "top",
      height: 150,
    },
  },
  fontBold: {
    fontWeight: "bold",
  },
  cardContentContainer: {
    paddingTop: "1em",
    paddingBottom: 0,
    margin: 0,
    height: 140,
    display: "flex",
    flexDirection: "column",
    // border: '1px solid red'
    // justifyContent: "space-between",
  },
  cardActionsContainerStyle: {
    backgroundColor: greyLighter,
    justifyContent: "center",
  },
  cardActionBtn: {
    color: secodaryColor,
    fontSize: "1.1em",
    backgroundColor: "transparent",
    "&:hover, &:focus, &:active": {
      backgroundColor: "transparent",
    },
  },
  cardTitle: {
    fontSize: "1em",
    flex: 1,
    minHeight: 40,
    margin: 0,
    // border: '1px solid red'
  },
  subjectContainer: {
    flex: 1,
    minHeight: 40,
    // border: '1px solid red'
  },
  subjectMain: {
    padding: 0,
    margin: 0,
    color: textLight,
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    fontSize: "0.875em",
  },
  subscribersCountContainer: {
    // marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: textLight,
    flex: 1,
    // border: '1px solid red'
  },
  subscribersCount: {
    padding: 0,
    margin: 0,
    // fontSize: '1em'
  },
  coursePrice: {
    padding: 0,
    margin: 0,
    fontSize: "1.18em",
    color: primaryColor,
  },
  rating: {},
  ratingStar: {
    fontSize: "0.75em",
    marginLeft: theme.spacing(0.5),
  },
  subject: {
    textTransform: "uppercase",
  },
  subjectDot: {
    fontSize: "0.5em",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  subjectTeacher: {},
  freeCourseChip: {
    backgroundColor: "#000",
    color: "#fff",
    position: "absolute",
    bottom: 0,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  startingDateContainer: {
    margin: "0.3em 0",
    display: "flex",
    alignItems: "center",
  },
  startingDate: {
    padding: 0,
    margin: 0,
    fontSize: "1em",
    color: textLight,
    marginRight: "0.5em",
  },
  courseStatusChip: {
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.875em",
    textTransform: "uppercase",
    color: "#a9a9a9",
    height: 25,
    background: "hsla(0,0%,85%,0.3)",
  },
  courseStatusChipOrange: {
    color: "rgb(245, 166, 35)",
    backgroundColor: "rgba(245, 166, 35, 0.2)",
  },
}));

const CoursesCard = (props) => {
  const { user, data, isFree, enrollToCourse } = props;
  const {
    _id,
    name,
    subject,
    subscribers,
    teacher,
    price,
    image_url,
    description,
  } = data;

  console.log(data, "data list sdfdf");

  const classes = useStyles();
  const isUserEnrolled = user && subscribers && subscribers.includes(user._id);
  let startedOn = "N/A";
  let isStarted = false;

  if (data["lectures"] && data["lectures"]["length"]) {
    const lastLectStartTime = data["lectures"][0]["startTime"];
    startedOn = moment(lastLectStartTime).format("MMM DD");
    const currentTime = new Date().getTime();
    const startedTime = new Date(lastLectStartTime).getTime();
    isStarted = currentTime >= startedTime;
  }

  return (
    <Card
      className={classes.root}
      onClick={() => {
        if (isUserEnrolled) Router.push(`/online-course/${_id}`);
      }}
    >
      <div
        onClick={() => Router.push(`/online-course/${_id}`)}
        //typeof="CourseInstance"
        itemScope
        //itemType="http://schema.org/Course"
      >
        <CardMedia
          className={classes.media}
          image={image_url}
          title="Contemplative Reptile"
          children={
            isFree && <Chip label="FREE" className={classes.freeCourseChip} />
          }
          itemProp="image"
        />
        <CardContent className={classes.cardContentContainer}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={`${classes.cardTitle} ${classes.fontBold}`}
            property="name"
          >
            {name}
          </Typography>
          <span style={{ display:'none' }} property="description">
            {description}
          </span>
          <div rel="hasCourseInstance" typeof="CourseInstance">
            <meta property="courseMode" content="MOOC" />
            <meta property="courseMode" content="online" />
          </div>
          <div
            className={`${classes.subjectContainer}`}
            itemProp="aggregateRating"
            itemScope
            //itemType="http://schema.org/AggregateRating"
          >
            <p className={`${classes.subjectMain}`}>
              <span className={`${classes.rating}`} itemProp="ratingValue">
                {teacher && teacher["rating"] ? teacher["rating"] : 5}
              </span>
              <Star className={`${classes.ratingStar}`} />

              <FiberManualRecord className={`${classes.subjectDot}`} />
              <span className={`${classes.subject}`} itemProp="subjectOf">
                {subject && subject["name"]}
              </span>

              <FiberManualRecord className={`${classes.subjectDot}`} />
              <span
                className={`${classes.subjectTeacher}`}
                property="instructor"
                typeof="Person"
              >
                <span property="name">
                  {teacher && (teacher["name"] || teacher["fullName"])}
                </span>
              </span>
            </p>
          </div>
          <div
            className={`${classes.startingDateContainer}`}
            itemProp="aggregateRating"
            itemScope
            //itemType="http://schema.org/AggregateRating"
          >
            {/* {isStarted ? (
              <Chip
                label="ONGOING"
                color="primary"
                className={`${classes.courseStatusChip} ${classes.courseStatusChipOrange}`}
                itemProp="price"
              />
            ) : (
              <>
                <h5 className={`${classes.startingDate} ${classes.fontBold}`}>
                  Starting On:
                </h5>
                <p className={`${classes.startingDate}`}>{startedOn}</p>
              </>
            )} */}
          </div>
          <div className={`${classes.subscribersCountContainer}`}>
            <p className={`${classes.subscribersCount}`}>
              {subscribers ? subscribers.length : 0} subscribers
            </p>
            <p
              className={`${classes.coursePrice} ${classes.fontBold}`}
              property="price"
            >
              {`Rs. ${price}`}
            </p>
          </div>
        </CardContent>
      </div>
      <CardActions className={classes.cardActionsContainerStyle}>
        <Button
          size="small"
          color="default"
          disableFocusRipple={true}
          disableRipple={true}
          className={`${classes.cardActionBtn} ${classes.fontBold}`}
          disabled={isUserEnrolled}
          onClick={() => enrollToCourse(data["_id"])}
        >
          {isUserEnrolled ? "Enrolled" : "Enroll For Free Trial"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default CoursesCard;
