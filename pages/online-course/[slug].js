import React, { useState, useEffect, Fragment } from "react";
import { Typography, Chip, Button, Divider } from "@material-ui/core";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import { useSelector } from "react-redux";
import Loader from "@components/shared/loader";
import ShareButtons from "@components/ShareButtons";
import { blue, grey } from "@material-ui/core/colors";
import {
  // ArrowBackIos,
  FiberManualRecord,
  DateRange,
  Check,
  Reply,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { isEmpty, orderBy } from "lodash";
import { useRouter } from "next/router";
import Head from "next/head";
import { withApollo } from "@apolloX/apollo";
import { initializeApollo } from "@apolloX/apolloX";
import ClassesSlider from "@components/UpComingClasses/ClassesSlider";
import Perk from "@components/perk";
import gql from "graphql-tag";
import UpcomingClass from "@components/CourseDetails/upcomingClass";
import { enrollToCourse } from "@utils/API";

const useStyles = makeStyles((theme) => ({
  pageBody: {
    marginTop: 40,
    marginBottom: 80,
    maxWidth: 844,
    width: "80%",
    backgroundColor: "transparent",
    position: "relative",
  },
  liveClassTimerContainer: {
    position: "relative",
    width: "100%",
    height: "45vw",
    maxHeight: 410,
    marginBottom: 30,
  },
  liveClassTimerContainerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    borderRadius: 20,
  },
  freeCourseChip: {
    backgroundColor: "#000",
    color: "#fff",
    position: "absolute",
    bottom: 10,
    left: 10,
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  timerMainContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
    width: "100%",
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  timeContainer: {},
  timerContainerHeading: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    textShadow: "0 1px 1px rgba(0,0,0,.47)",
    marginBottom: 20,
  },
  timerContainer: {
    display: "flex",
    alignItems: "flex-start",
    fontSize: 32,
    color: "#fff",
    fontWeight: 700,
    letterSpacing: 2,
    background: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: "10px 28px",
  },
  time: {
    fontSize: 32,
    color: "#fff",
    width: 44,
    fontWeight: 700,
    letterSpacing: 2,
    textAlign: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  timeType: {
    display: "block",
    textAlign: "center",
    fontSize: 13.12,
    color: "#fff",
    fontWeight: 400,
  },
  classInfoContainer: {
    marginTop: 15,
  },
  classRoomName: {
    fontWeight: 700,
    fontSize: 24,
    color: "#000",
    textAlign: "left",
    marginBottom: 8,
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
      textAlign: "center",
    },
  },
  h2: {
    display: "flex",
    justifyContent: "flex-start",
    fontSize: 16,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 20,
    fontWeight: 500,
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
  classRoomNameArrow: {
    fontSize: "1.10em",
    paddingBottom: 4,
  },
  lectureName: {
    marginTop: 10,
    fontSize: 22,
    color: "#000",
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fontBold: {
    fontWeight: "bold",
  },
  startDateContainer: {
    marginTop: 10,
    fontSize: 14,
    color: "#000",
    display: "flex",
    alignItems: "center",
  },
  startDateIcon: {},
  startDate: {
    fontWeight: 500,
    fontSize: 14,
    letterSpacing: 0.5,
    marginLeft: 10,
  },
  shareWithFriends: {
    marginTop: 20,
    color: blue[400],
    textTransform: "uppercase",
  },
  classShareContainer: {},
  shareBtnContainer: {
    marginTop: 5,
  },
  goBackIconContainer: {
    position: "fixed",
    top: 110,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      left: "2.5%",
    },
    [theme.breakpoints.up("md")]: {
      display: "block",
      left: "5%",
    },
    [theme.breakpoints.up("lg")]: {
      display: "block",
      left: "15%",
    },
  },
  goBackIcon: {
    fontSize: "1.25rem",
    paddingLeft: 3,
  },
  subjectContainer: {
    flex: 1,
  },
  subjectMain: {
    display: "flex",
    justifyContent: "flex-start",
    fontSize: 16,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 20,
    fontWeight: 500,
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      justifyContent: "center",
    },
  },
  subscribersCountContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: grey[300],
    flex: 1,
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
  courseStatusChipsContainer: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  courseStatusChip: {
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 14,
    textTransform: "uppercase",
    color: "#a9a9a9",
    background: "hsla(0,0%,85%,0.3)",
    padding: "5px 10px",
    marginRight: 8,
  },
  courseStatusChipOrange: {
    color: "rgb(245, 166, 35)",
    backgroundColor: "rgba(245, 166, 35, 0.2)",
  },
  actionBtnContainer: {
    display: "flex",
    marginTop: 25,
  },
  actionBtn: {
    background: "hsla(0,0%,85%,0.2)",
    color: "rgba(0,0,0,0.3)",
    fontSize: 16,
    width: 195,
    height: 50,
    borderRadius: 50,
    boxShadow: "none",
    marginRight: 14,
    "&:hover, &:active, &:focus": {
      background: "hsla(0,0%,85%,0.2)",
      boxShadow: "none",
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: 12,
    },
  },
  actionBtnSuccess: {
    background: "#60b91f",
    color: "#fff",
    "&:hover, &:active, &:focus": {
      background: "#60b91f",
      boxShadow: "none",
    },
  },
  actionBtnIcon: {
    transform: "rotateY(180deg)",
  },
  divider: {
    height: 2,
    borderRadius: "3.725px",
    marginTop: 30,
    marginBottom: 25,
  },
  whatsIncludedContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
  whatsIncludedHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  whatsIncludedHeading: {
    color: "#000",
    fontWeight: 700,
    fontSize: 22,
    textAlign: "left",
  },
  sliderContainerStyles: {
    marginTop: 0,
  },
  perksListContainer: {
    marginBottom: 25,
    display: "flex",
    alignItems: "center",
    maxWidth: 844,
  },
  upComingClassesListContainer: {
    marginBottom: 25,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
}));

const onlineCourse = ({ initialApolloState }) => {
  const Router = useRouter();
  const classes = useStyles();
  const { query } = Router;
  const { slug } = query;
  const [dataSource, updateDataSource] = useState({});
  const [shareStatus, setShareStatus] = useState(false);
  const [thisWeekLecturesList, updateThisWeekLecturesList] = useState([]);
  //const { user } = useSelector((state) => state["USER"]);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [isLoading, setLoading] = useState(false);

  const LECTURE = gql`
  {
    findCourse(query:{_id: "${slug}"}){
      _id,
      name,
      price,
      description,
      subscribers,
      image_url,
      teacher{
        _id,
        name,
        phone,
        country
      },
      lectures{
        _id,
        name,
        description,
        duration,
        price,
        startTime,
        meetingID,
        keywords,
        image_url,
        meetingInfo
      },
      videos{
        name
      },
      tests{
        name,
        mcqs{
          name,
          options,
          answer,
          answer_index
        }
      }
      subject{
        name,
        classRoom{
          name
        }
      }
    }
  }
  `;

  const { error, data, fetchMore, networkStatus, client, loading } = useQuery(
    LECTURE,
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const updateThisWeekClasses = (snap) => {
    var curr = new Date();

    var firstday = curr.getTime();
    var lastday = firstday + 7 * 24 * 60 * 60 * 1000;

    const { lectures, subject, teacher } = snap;
    const updatedList = lectures
      .map((item) => ({
        ...item,
        subject,
        teacher,
        courseId: snap["_id"],
      }))
      .filter((item) => {
        const lectureTime = new Date(item["startTime"]).getTime();
        return firstday < lectureTime && lastday > lectureTime;
      });

    updateThisWeekLecturesList(updatedList);
  };
  console.log("data", initialApolloState);

  useEffect(() => {
    if (data) {
      const { findCourse } = data;
      if (findCourse && findCourse["length"]) {
        let updatedDataSource = { ...findCourse[0] };
        updatedDataSource["lectures"] = orderBy(
          updatedDataSource["lectures"],
          (lecture) => new Date(lecture["startTime"])
        );
        if (
          updatedDataSource["lectures"] &&
          updatedDataSource["lectures"]["length"]
        ) {
          const lastLectStartTime =
            updatedDataSource["lectures"][0]["startTime"];
          updatedDataSource["startedOn"] = moment(lastLectStartTime).format(
            "MMM DD"
          );
        }
        updateDataSource(updatedDataSource);
        if (
          updatedDataSource["lectures"] &&
          updatedDataSource["lectures"]["length"]
        ) {
          updateThisWeekClasses(updatedDataSource);
        }
      }
    }
  }, [data]);

  const EnrollToCourse = () => {
    if (isEmpty(user))
      Router.push({
        pathname: "/login",
        query: { returnto: `/online-course/${slug}` },
      });
    else
      enrollToCourse({
        id: dataSource["_id"],
        type: "course",
      }).then(({ ok, data, problem }) => {
        if (ok) {
          let updatedDataSource = { ...dataSource };
          updatedDataSource["subscribers"].push(user._id);
          updateDataSource(updatedDataSource);

          setNotifMessageType("success");
          setNotifMessage("Successfully Enrolled");
        } else {
          setNotifMessageType("error");
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
      });
  };

  return (
    <div className={"mainPageContainer"}>
      {!isEmpty(initialApolloState[`Course:${slug}`]) &&
      typeof initialApolloState[`Course:${slug}`]["name"] != undefined ? (
        <Head>
          <title>
            Online classes schedule for{" "}
            {initialApolloState[`Course:${slug}`]["name"]} | schoolX.pk
          </title>
          <script type="application/ld+json">
            {`{
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "${initialApolloState[`Course:${slug}`]["name"]}",
              "description": "${
                initialApolloState[`Course:${slug}`]["description"]
              }",
              "provider": {
                       "@type": "Organization",
                       "name": "University of Technology - Eureka",
                       "sameAs": "http://www.ut-eureka.edu"
                          }
               }`}
          </script>
          {/* <meta
            property="og:url"
            content={`https://www.schoolx.pk/lectureseries/view/${dataSource["_id"]}`}
          />
          <meta property="og:site_name" content="SchoolX" />

          <meta property="og:title" content={dataSource["name"]} />
          <meta property="og:image" content={dataSource["image_url"]} />
          <meta
            property="og:image:secure_url"
            content={dataSource["image_url"]}
          />
          <meta property="og:type" content="course" />
          <meta property="og:image:type" content="image" />
          <meta property="og:image:width" content="380" />
          <meta property="og:image:height" content="230" />
          <meta
            property="og:image:alt"
            content={`${
              dataSource["teacher"] != undefined
                ? dataSource["teacher"]["name"]
                : ""
            }`}
          />
          <meta property="courseCode" content="380" />
          <meta property="coursePrerequisites" content="380" />
          <meta property="educationalCredentialAwarded" content="380" />
          <meta property="hasCourseInstance" content="380" />
          <meta property="numberOfCredits" content="3" />
          <meta property="occupationalCredentialAwarded" content="380" /> */}
        </Head>
      ) : (
        <Head>
          <title>
            SchoolX, the leading online learning platform in Pakistan
          </title>
        </Head>
      )}
      {isLoading ? (
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
      ) : !isEmpty(dataSource) && typeof dataSource["name"] != undefined ? (
        <div
          className={`pageBodyContainer ${classes.pageBody}`}
          //vocab="http://schema.org/"
        >
          {/* <Fab
            size="small"
            color="primary"
            aria-label="back"
            className={classes.goBackIconContainer}
            onClick={() => Router.back()}
          >
            <ArrowBackIos className={classes.goBackIcon} />
          </Fab> */}

          {/* <meta property="courseMode" content="MOOC" />
          <meta property="courseMode" content="online" />
          <meta property="courseCode" content="380" />
          <meta property="coursePrerequisites" content="380" />
          <meta property="educationalCredentialAwarded" content="380" />
          <meta property="hasCourseInstance" content="380" />
          <meta property="numberOfCredits" content="3" />
          <meta property="occupationalCredentialAwarded" content="380" /> */}
          <div className={`${classes.liveClassTimerContainer}`}>
            <img
              src={
                dataSource && dataSource["image_url"]
                  ? dataSource["image_url"]
                  : "https://images.pexels.com/photos/4050319/pexels-photo-4050319.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=2&amp;h=650&amp;w=940"
              }
              alt="cover"
              className={classes.liveClassTimerContainerImage}
              itemProp="image"
            />
            {dataSource["price"] && dataSource["price"] !== "FREE" ? (
              <Chip
                label={`Rs. ${dataSource["price"]}`}
                className={classes.freeCourseChip}
                itemProp="price"
              />
            ) : (
              <Chip
                label="FREE"
                className={classes.freeCourseChip}
                itemProp="price"
              />
            )}
          </div>
          <div className={classes.courseStatusChipsContainer}>
            <Chip
              label="ONGOING"
              color="primary"
              className={`${classes.courseStatusChip} ${classes.courseStatusChipOrange}`}
              itemProp="price"
            />
            {dataSource["startedOn"] && (
              <Chip
                label={dataSource["startedOn"]}
                color="secondary"
                property="startDate"
                datatype="schema:date"
                className={`${classes.courseStatusChip} ml-2`}
              />
            )}
          </div>
          <div
            className={`${classes.classInfoContainer}`}
            //typeof="Course"
            // itemScope
            // itemType="http://schema.org/Course"
          >
            <Typography
              variant="h6"
              component="h1"
              className={`${classes.classRoomName}`}
              //property="name"
            >
              {dataSource["name"]}
            </Typography>
            <p property="description" style={{ display: "none" }}>
              {`Learn Cambridge ${dataSource["name"]} online on schoolx.pk. Get syllabus, past exams papers, past exam pater solutions & tips and tricks to improve your grade.
             Schoolx is a leading online learning platform in Pakistan providing online tuitions for Cambridge O Level, A Level, Matric, FSc and Entry exams for professional universities.`}
            </p>
            <Typography
              variant="h5"
              component="h2"
              className={`${classes.h2}`}
              //property="name"
            >
              {dataSource["subject"] ? dataSource["subject"]["name"] : ""}
              <FiberManualRecord className={`${classes.subjectDot}`} />
              {dataSource["teacher"] ? dataSource["teacher"]["name"] : ""}
              <FiberManualRecord className={`${classes.subjectDot}`} />{" "}
              {`${
                dataSource["subscribers"]
                  ? dataSource["subscribers"]["length"]
                  : ""
              } subscribers`}
            </Typography>
            {/* <div
                className={`${classes.subjectContainer}`}
                itemProp="aggregateRating"
                itemScope
                itemType="http://schema.org/AggregateRating"
              >
                <p className={`${classes.subjectMain}`}>
                  <span className={`${classes.subject}`} itemProp="subjectOf">
                    {dataSource["subject"] ? dataSource["subject"]["name"] : ""}
                  </span>
                  <FiberManualRecord className={`${classes.subjectDot}`} />

                  <span
                    className={`${classes.subjectTeacher}`}
                    property="instructor"
                    typeof="Person"
                  >
                    {dataSource["teacher"] ? dataSource["teacher"]["name"] : ""}
                  </span>
                  <FiberManualRecord className={`${classes.subjectDot}`} />

                  <span className={`${classes.subjectTeacher}`}>
                    {`${
                      dataSource["subscribers"]
                        ? dataSource["subscribers"]["length"]
                        : ""
                    } subscribers`}
                  </span>
                </p>
              </div>
               */}
            <div
              className={`${classes.startDateContainer}`}
              rel="hasCourseInstance"
              //typeof="CourseInstance"
            >
              <DateRange className={`${classes.startDateIcon}`} />
              {dataSource["startedOn"] ? (
                <Typography
                  component="p"
                  className={`${classes.startDate}`}
                  //property="startDate"
                  //datatype="schema:date"
                >
                  {`Started on ${dataSource["startedOn"]}`}
                </Typography>
              ) : (
                <Typography component="p" className={`${classes.startDate}`}>
                  Starting Soon
                </Typography>
              )}
            </div>
          </div>
          <div className={`${classes.actionBtnContainer}`}>
            <Button
              variant="contained"
              color="default"
              startIcon={<Reply className={`${classes.actionBtnIcon}`} />}
              className={`${classes.actionBtn}`}
              onClick={() => setShareStatus(!shareStatus)}
            >
              Share
            </Button>
            {/* <Button
              variant="contained"
              color="default"
              startIcon={
                isEmpty(user) ||
                (dataSource["subscribers"] &&
                  dataSource["subscribers"].indexOf(user["_id"]) ===
                    -1) ? null : (
                  <Check />
                )
              }
              className={`${classes.actionBtn} ${classes.actionBtnSuccess}`}
              onClick={EnrollToCourse}
            >
              {isEmpty(user) ||
              (dataSource["subscribers"] &&
                dataSource["subscribers"].indexOf(user["_id"])) === -1
                ? "Enroll"
                : "Subscribed"}
            </Button> */}
          </div>

          {shareStatus && (
            <>
              <Divider className={classes.divider} />

              <ShareButtons
                shareUrl={`https://schoolx.pk/online-class/${dataSource["_id"]}`}
                title={dataSource["name"]}
              />
            </>
          )}

          <Divider className={classes.divider} />

          <div className={`${classes.whatsIncludedContainer}`}>
            <div className={`${classes.whatsIncludedHeader}`}>
              <Typography
                variant="h5"
                component="h5"
                className={`${classes.whatsIncludedHeading}`}
              >
                Whats included
              </Typography>
            </div>
            <div className={`${classes.perksListContainer}`}>
              <Perk
                bgColor="rgb(231, 253, 223)"
                perkName="Post lecture practice"
                perkImg="https://image.flaticon.com/icons/svg/2904/2904843.svg"
                onClick={() => Router.push(`/tests/${dataSource["_id"]}`)}
              />
            </div>
          </div>

          <div className={`${classes.whatsIncludedContainer}`}>
            <div className={`${classes.whatsIncludedHeader}`}>
              <Typography
                variant="h5"
                component="h5"
                className={`${classes.whatsIncludedHeading}`}
              >
                This Week Classes
              </Typography>
            </div>
            <div className={`${classes.perksListContainer}`}>
              {thisWeekLecturesList["length"] ? (
                <ClassesSlider
                  lectures={thisWeekLecturesList}
                  sliderContainerStyles={classes.sliderContainerStyles}
                />
              ) : (
                <Typography component="p" className={`${classes.startDate}`}>
                  There is no class this week
                </Typography>
              )}
            </div>
          </div>

          <div className={`${classes.whatsIncludedContainer}`}>
            <div className={`${classes.whatsIncludedHeader}`}>
              <Typography
                variant="h5"
                component="h5"
                className={`${classes.whatsIncludedHeading}`}
              >
                Classes
              </Typography>
            </div>
            <div className={`${classes.upComingClassesListContainer}`}>
              {dataSource["lectures"] && dataSource["lectures"]["length"] ? (
                dataSource["lectures"]
                  .map((lecture, i) => {
                    const classTime = moment(lecture["startTime"]).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    );
                    const month = moment(lecture["startTime"]).format("MMMM");
                    const day = moment(lecture["startTime"]).format("D");

                    return (
                      <UpcomingClass
                        key={i}
                        onClick={() =>
                          Router.push(`/online-class/${lecture["_id"]}`)
                        }
                        data={{
                          month,
                          day,
                          className: lecture["name"],
                          classNumber: `Class ${i < 9 ? "0" + (i + 1) : i + 1}`,
                          classTime,
                          teacherName: dataSource["teacher"]["name"],
                        }}
                      />
                    );
                  })
                  .reverse()
              ) : (
                <Typography variant="h6" component="h6">
                  There are no lectures in this course yet.
                </Typography>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="d-flex"
        >
          <Typography variant="h6" component="h6">
            Details not found against this Course Id
          </Typography>
        </div>
      )}
    </div>
  );
};
export const getServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo();
  const query = gql`
  {
    findCourse(query:{_id: "${ctx.params.slug}"}){
      _id,
      name,
      price,
      description,
      subscribers,
      image_url,
      teacher{
        _id,
        name,
        phone,
        country
      },
      lectures{
        _id,
        name,
        description,
        duration,
        price,
        startTime,
        meetingID,
        keywords,
        image_url,
        meetingInfo
      },
      videos{
        name
      },
      tests{
        name,
        mcqs{
          name,
          options,
          answer,
          answer_index
        }
      }
      subject{
        name,
        classRoom{
          name
        }
      }
    }
  }
  `;
  await apolloClient.query({
    query,
    variables: {
      skip: 0,
      first: 10,
    },
  });
  const initialApolloState = apolloClient.cache.extract();
  console.log("serverSideDataAtOnline-Courses: ", initialApolloState);
  return {
    props: {
      initialApolloState,
    },
  };
};
//export default onlineCourse;
export default withApollo(onlineCourse);
