import React, { useState, useEffect } from "react";
import Head from "next/head";
// import nextCookie from "next-cookies";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { grey, purple } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../../../lib/apollo";
import CoursesCard from "@components/Courses/CoursesCard";
import { isEmpty, uniqBy } from "lodash";
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
  tabsContainer: {
    display: "flex",
    // paddingTop: "2em",
  },
  tab: {
    minWidth: 150,
    textTransform: "uppercase",
    cursor: "pointer",
    position: "relative",
    // border: "1px solid red",
  },
  tabTitle: {
    padding: "0.75em 0",
    letterSpacing: 1,
    fontSize: "1em",
    color: grey[500],
    textAlign: "center",
  },
  activeTab: {
    color: grey[900],
  },
  activeTabBar: {
    height: 6,
    width: "50%",
    backgroundColor: purple[500],
    borderRadius: "10px 10px 0 0",
    margin: "0 auto",
  },
  coursesTagsContainer: {
    backgroundColor: grey[100],
    borderTop: `2px solid ${grey[300]}`,
    display: "flex",
    alignItems: "center",
    padding: "0.75em",
    overflow: "hidden",
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
  coursesCardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    padding: "2em 0",
    [theme["breakpoints"].down("sm")]: {
      justifyContent: "center",
    },
  },
  coursesCard: {
    marginBottom: "2em",
  },
}));

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
      itemScope={true}
      itemType="http://schema.org/DefinedTerm"
    >
      <p
        className={`${classes.coursesTagName} ${classes.activeCoursesTagName}`}
        itemProp="name"
      >
        {subject}
      </p>
    </div>
  );
};

const AllCourses = (props) => {
  const { isLiveClassesPage, cId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useSelector((state) => state["USER"]);
  const [coursesList, updateCoursesList] = useState([]);
  const [subjectsList, updateSubjectsList] = useState([]);
  const [activeSubjectFilter, updateActiveSubjectFilter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  let courseId = "";
  if (process["browser"]) {
    courseId = localStorage.getItem("courseId");
  }

  const getCourseId = () => {
    if (cId) {
      return cId;
    } else if (!isEmpty(user) && user["classRoom"]) {
      return user["classRoom"];
    } else if (courseId) {
      return courseId;
    } else {
      return "";
    }
  };

  const ALL_LECTURE_SERIES = gql`
    {
      findClassRoom(query: { _id: "${getCourseId()}" }) {
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
        list = courses;
        dispatch({ type: "GET_COURCES", payload: courses });
        updateCoursesList(courses);
      } else {
        list = data.findCourse;
        dispatch({ type: "GET_COURCES", payload: data.findCourse });
        updateCoursesList(data.findCourse);
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

  let filteredCoursesList = [...coursesList];

  if (activeTab === 1) {
    filteredCoursesList = filteredCoursesList.filter(
      (aCourse) =>
        aCourse["subscribers"] && aCourse["subscribers"].includes(user["_id"])
    );
  }

  if (activeSubjectFilter !== 0) {
    const selectedSubject = subjectsList[activeSubjectFilter - 1];
    filteredCoursesList = filteredCoursesList.filter(
      (aCourse) =>
        aCourse["subject"] &&
        aCourse["subject"]["name"].toLowerCase() ===
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
    <div className={isLiveClassesPage ? "" : "lectureMainPageContainer"}>
      <Head>
        <title>
          {activeTab === 0 ? "All Courses" : "Enrolled Courses"} | SchoolX, the
          leading online learning platform in Pakistan
        </title>
        <meta
          property="og:title"
          content={activeTab === 0 ? "All Courses" : "Enrolled Courses"}
        />
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
        className={isLiveClassesPage ? "" : "lecturePageBodyContainer"}
        // style={{ border: "1px solid red" }}
      >
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />

        {!isLiveClassesPage && (
          <div className={`${classes.headingContainer}`}>
            <Typography variant="h4" className={`${classes.fontBold}`}>
              Courses
            </Typography>
          </div>
        )}

        {!isEmpty(user) && (
          <div className={`${classes.tabsContainer}`}>
            <div className={`${classes.tab}`} onClick={() => setActiveTab(0)}>
              <Typography
                component="p"
                className={`${classes.tabTitle} ${
                  activeTab === 0 ? classes.activeTab : ""
                } ${classes.fontBold}`}
              >
                All Courses
              </Typography>
              {activeTab === 0 && <div className={classes.activeTabBar} />}
            </div>
            {!isEmpty(user) && (
              <div className={`${classes.tab}`} onClick={() => setActiveTab(1)}>
                <Typography
                  component="p"
                  className={`${classes.tabTitle} ${
                    activeTab === 1 ? classes.activeTab : ""
                  } ${classes.fontBold}`}
                >
                  Enrolled
                </Typography>
                {activeTab === 1 && <div className={classes.activeTabBar} />}
              </div>
            )}
          </div>
        )}

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
        ) : (
          <div className={classes.coursesCardsContainer}>
            {!isEmpty(filteredCoursesList) ? (
              filteredCoursesList.map((course, i) => (
                <div key={i} className={classes.coursesCard}>
                  <CoursesCard
                    key={course["_id"]}
                    isFree={
                      course["price"] && course["price"] !== "FREE"
                        ? false
                        : true
                    }
                    data={course}
                    user={user}
                    // enrollToCourse={enrollToCourse}
                  />
                </div>
              ))
            ) : (
              <div className={"alert alert-info w-100 my-3"} role="alert">
                There is no results based on your filters.
              </div>
            )}
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
