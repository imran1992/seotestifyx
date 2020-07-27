import React, { useState, useEffect } from "react";
import Head from "next/head";
// import nextCookie from "next-cookies";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { ArrowForwardIos, FiberManualRecord } from "@material-ui/icons";
import { grey, purple } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../../../lib/apollo";
import { isEmpty, uniqBy, orderBy, filter } from "lodash";
import Slider from "react-slick";
import Loader from "@components/shared/loader";
import Notif from "@components/Notif";
import Router from "next/router";

const useStyles = makeStyles((theme) => ({
  headingContainer: {
    width: "100%",
    // border: "1px solid red",
  },
  fontBold: {
    fontWeight: "bold",
  },
  coursesTagsContainer: {
    backgroundColor: grey[100],
    borderTop: `2px solid ${grey[300]}`,
    display: "flex",
    alignItems: "center",
    padding: "0.75em",
    overflow: "hidden",
    marginTop: "2em",
  },
  coursesTag: {
    backgroundColor: "#fff",
    border: `1.25px solid ${grey[300]}`,
    borderRadius: 25,
    padding: "0.35em 1.5em",
    cursor: "pointer",
  },
  activeCoursesTag: {
    backgroundColor: purple[50],
    border: `1.25px solid ${purple[500]}`,
  },
  coursesTagName: {
    padding: 0,
    margin: 0,
    fontSize: "1em",
    color: grey[500],
    letterSpacing: 0.5,
    fontWeight: 500,
    textAlign: "center",
  },
  activeCoursesTagName: {
    color: purple[500],
  },
  classSlideContainer: {
    display: "flex",
    alignItems: "center",
    padding: "1.5em 0",
    borderBottom: `1.25px solid ${grey[300]}`,
    cursor: "pointer",
    [theme["breakpoints"].down("xs")]: {
      flexDirection: "column",
    },
  },
  classSlideImageContainer: {
    width: 158,
    height: 82,
    borderRadius: 7.5,
    backgroundColor: purple[100],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  classSlideInfoContainer: {
    marginLeft: "2em",
    flex: 4,
  },
  classSlideImage: {},
  classSlideTitle: {
    fontSize: 12,
    color: grey[400],
    fontWeight: 400,
  },
  classSlideHeading: {
    color: "#000",
    fontSize: 18,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: "0.25em 0",
  },
  classSlideTimeInfo: {
    fontSize: 14,
    color: grey[400],
    fontWeight: 400,
  },
  classSlideArrowContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  classSlideArrow: {
    fontSize: "1em",
    color: grey[500],
    [theme["breakpoints"].down("xs")]: {
      display: "none",
    },
  },
  subjectDot: {
    fontSize: "1.25vh",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    color: grey[300],
  },
  classDayContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "0px 0.75em",
  },
  classStartMonth: {
    color: purple[500],
    fontWeight: "bold",
    textAlign: "center",
    fontSize: "1em",
  },
}));

const UpcomingClassSlide = (props) => {
  const classes = useStyles();
  const { lectureData } = props;

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(lectureData["startTime"]);

  const startDate = `${date.toLocaleDateString(
    "en-US",
    options
  )} ${date.toLocaleTimeString("en-US")}`;

  return (
    <div
      className={classes.classSlideContainer}
      onClick={() => Router.push(`/online-courses/view/${lectureData["_id"]}`)}
      vocab="http://schema.org/"
      typeof="Course"
    >
      <Head>
        <title>
          Upcoming Classes | SchoolX, the leading online learning platform in
          Pakistan
        </title>
        <meta property="og:title" content="Upcoming Classes" />
        <meta
          property="og:description"
          content="SCHOOLX | leading online social learning platform in Pakistan"
        />
        <meta property="og:image" content="/images/logoN.png" />
        <meta property="og:image:secure_url" content="/images/logoN.png" />
        <meta property="og:image" content="image/jpeg" />
        <meta property="og:image:width" content="202" />
        <meta property="og:image:height" content="42" />
        <meta
          property="og:image:alt"
          content="SchoolX | Online Learning Platform"
        />
      </Head>
      <div className={classes.classSlideImageContainer} typeof="CourseInstance">
        <div className={classes.classDayContainer}>
          <Typography
            component="p"
            className={classes.classStartMonth}
            property="startDate"
          >
            {startDate}
          </Typography>
        </div>
      </div>
      <div className={classes.classSlideInfoContainer} typeof="CourseInstance">
        <Typography
          component="p"
          className={classes.classSlideTitle}
          property="name"
        >
          {lectureData["subject"] ? lectureData["subject"]["name"] : ""}
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          className={classes.classSlideHeading}
          property="name"
        >
          {lectureData["name"]}
        </Typography>
        <Typography
          component="p"
          className={classes.classSlideTimeInfo}
          property="instructor"
          typeof="Person"
        >
          {startDate}
          <FiberManualRecord className={`${classes.subjectDot}`} />
          {(lectureData["teacher"] && lectureData["teacher"]["name"]) ||
            lectureData["teacher"]["fullName"]}
        </Typography>
      </div>
      <div className={classes.classSlideArrowContainer}>
        <ArrowForwardIos className={classes.classSlideArrow} />
      </div>
    </div>
  );
};

const SubjectSlide = (props) => {
  const classes = useStyles();
  const { subject, index, isActive, onClick } = props;

  return (
    <div
      key={index}
      className={`${classes.coursesTag} ${
        isActive ? classes.activeCoursesTag : ""
      }`}
      style={{ marginRight: 10 }}
      onClick={onClick}
    >
      <p
        className={`${classes.coursesTagName} ${classes.activeCoursesTagName}`}
      >
        {subject}
      </p>
    </div>
  );
};

const AllCourses = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state["USER"]);
  const [lecturesList, updateLecturesList] = useState([]);
  const [subjectsList, updateSubjectsList] = useState([]);
  const [activeSubjectFilter, updateActiveSubjectFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  let courseId = "";
  if (process["browser"]) {
    courseId = localStorage.getItem("courseId");
  }

  const ALL_LECTURE_SERIES = gql`
    {
      findClassRoom(query: { _id: "${
        !isEmpty(user) && user["classRoom"] ? user["classRoom"] : courseId
      }" }) {
        _id
        name
        category
        description
        courses {
          _id
          name
          price
          description
          subscribers
          image_url 
          teacher {
            _id
            name
            phone
            country
          }
          lectures {
            _id
            name
            description
            duration
            price
            startTime
            meetingID
            keywords
            image_url
            meetingInfo
          }
          
          tests {
            name
          }
          subject {
            name
          }
        }
      }
    }
  `;

  const { error, data, fetchMore, networkStatus, client } = useQuery(
    ALL_LECTURE_SERIES,
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (error) {
      setNotifMessageType("error");
      setNotifMessage("Sorry! Something went wrong!");
      Router.push("/");
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      let list = [];
      if (data["findClassRoom"] && data["findClassRoom"]["length"]) {
        const { courses } = data["findClassRoom"][0];
        dispatch({ type: "GET_COURCES", payload: courses });

        const myClasses = orderBy(
          filter(courses, (found) => found.subscribers.includes(user._id)),
          (object) => new Date(object.startTime),
          ["asc"]
        );

        let myLectures = [];
        let myUpComingLectures = [];

        myClasses.map((cls) => {
          const { _id, subject, teacher } = cls;
          // console.log(cls, "cls");
          cls["lectures"].map((lecture) => {
            if (lecture["meetingInfo"]["running"][0] === "true") {
              // liveLectures.push({ ...lecture, subject, teacher, courseId: _id });
            } else {
              myLectures.push({ ...lecture, subject, teacher, courseId: _id });
            }
          });
        });

        myLectures.map((lecture) => {
          const { startTime } = lecture;
          const staringAt = new Date(startTime).getTime();
          const currentTime = new Date().getTime();
          const isClassOver = staringAt - currentTime < 0;

          if (!isClassOver) myUpComingLectures.push(lecture);
        });

        list = myUpComingLectures;
        updateLecturesList(myUpComingLectures);
      } else {
        list = data.findCourse;
        dispatch({ type: "GET_COURCES", payload: data.findCourse });
        updateLecturesList(data.findCourse);
      }

      if (list && list["length"]) {
        let subjects = [];
        list.map((course, i) => {
          if (course["subject"]) {
            subjects.push({ key: i + 1, name: course["subject"]["name"] });
          }
        });
        updateSubjectsList(uniqBy(subjects, "name".toLowerCase()));
      }

      setLoading(false);
    } else if (error) {
      setNotifMessageType("error");
      setNotifMessage(error.message);
      setLoading(false);
    }
  }, [data]);

  let filteredLecturesList = [...lecturesList];

  if (activeSubjectFilter !== 0) {
    const selectedSubject = subjectsList[activeSubjectFilter - 1];
    filteredLecturesList = filteredLecturesList.filter(
      (aLecture) =>
        aLecture["subject"] &&
        aLecture["subject"]["name"].toLowerCase() ===
          selectedSubject["name"].toLowerCase()
    );
  }

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    arrows: false,
    variableWidth: true,
  };

  return (
    <div className={"lectureMainPageContainer"}>
      <Head>
        <title>
          Upcoming Classes | SchoolX, the leading online learning platform in
          Pakistan
        </title>
        <meta property="og:title" content="Upcoming Classes" />
        <meta
          property="og:description"
          content="SCHOOLX | leading online social learning platform in Pakistan"
        />
        <meta property="og:image" content="/images/logoN.png" />
        <meta property="og:image:secure_url" content="/images/logoN.png" />
        <meta property="og:image" content="image/jpeg" />
        <meta property="og:image:width" content="202" />
        <meta property="og:image:height" content="42" />
        <meta
          property="og:image:alt"
          content="SchoolX | Online Learning Platform"
        />
      </Head>

      <div
        className={"lecturePageBodyContainer"}
        // style={{ border: "1px solid red" }}
      >
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />

        <div className={`${classes.headingContainer}`}>
          <Typography variant="h4" className={`${classes.fontBold}`}>
            Upcoming Classes
          </Typography>
        </div>

        <div className={classes.coursesTagsContainer}>
          <Slider {...settings}>
            <SubjectSlide
              index={0}
              subject="All"
              isActive={activeSubjectFilter === 0}
              onClick={() => updateActiveSubjectFilter(0)}
            />
            {subjectsList.map((subject, i) => (
              <SubjectSlide
                index={i + 1}
                subject={subject["name"]}
                isActive={activeSubjectFilter === i + 1}
                onClick={() => updateActiveSubjectFilter(i + 1)}
              />
            ))}
          </Slider>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Loader showOnlyLoader={true} />
          </div>
        ) : !isEmpty(filteredLecturesList) ? (
          <div style={{ marginBottom: 30 }}>
            {filteredLecturesList.map((lecture, i) => (
              <UpcomingClassSlide key={i} lectureData={lecture} />
            ))}
          </div>
        ) : (
          <div className={"alert alert-info w-100 my-3"} role="alert">
            There is no results based on your filters.
          </div>
        )}
      </div>
    </div>
  );
};

// AllCourses.getInitialProps = async (ctx) => {
//   const { Authorization } = nextCookie(ctx);
//   if (ctx.req && !Authorization) {
//     ctx.res.writeHead(302, { Location: "/login" }).end();
//   } else if (!Authorization) {
//     document.location.pathname = "/login";
//   } else return { Authorization };
// };

export default withApollo(AllCourses);
