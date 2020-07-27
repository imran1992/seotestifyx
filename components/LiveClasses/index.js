import React, { useState, useEffect } from "react";
import { Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import ClassesSlider from "@components/UpComingClasses/ClassesSlider";
import CoursesSlider from "@components/Courses/CoursesSlider";
import LiveClassesSlider from "@components/LiveClasses/LiveClassesSlider";
import SliderHeader from "@components/SliderHeader";
import nextCookie from "next-cookies";
import { isEmpty, orderBy, filter } from "lodash";
import { useSelector } from "react-redux";
import Loader from "@components/shared/loader";
import AllCourses from "../../pages/lectures/courses";

const primaryColor = blue[500];

const useStyles = makeStyles((theme) => {
  return {
    root: {},
    fontBold: {
      fontWeight: "bold",
    },
    primaryColor: {
      color: primaryColor,
    },
    title: {
      // textAlign: "center",
    },
    divider: {
      height: "7.5px",
      borderRadius: "3.725px",
      marginTop: "2em",
      marginBottom: "1em",
    },
  };
});

const liveClasses = (props) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state["USER"]);
  const [contentLoader, setContentLoader] = useState(true);

  const { lectures, enrollToCourse, courseId, clName } = props;

  let subLectures = [];

  if (lectures && lectures.length > 0) {
    for (let lec of lectures) {
      let index = lectures.findIndex((lec) =>
        lec.subscribers.includes(user._id)
      );
      if (index > -1) {
        subLectures = [...subLectures, ...lectures[index].lectures];
      }
    }
  }

  let myUpComingLectures = [];
  let myLectures = [];
  let liveLectures = [];

  if (lectures && lectures.length > 0) {
    const myClasses = orderBy(
      lectures,
      (object) => new Date(object.startTime),
      ["asc"]
    );

    myClasses.map((cls) => {
      const { _id, subject, teacher } = cls;
      // console.log(cls, "cls");
      cls["lectures"].map((lecture) => {
        console.log(lecture["meetingInfo"]["running"][0]);

        if (lecture["meetingInfo"]["running"][0] === "true") {
          liveLectures.push({ ...lecture, subject, teacher, courseId: _id });
        }
      });
    });
  }

  if (!isEmpty(user)) {
    const myClasses = orderBy(
      filter(lectures, (found) => found.subscribers.includes(user._id)),
      (object) => new Date(object.startTime),
      ["asc"]
    );

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
  }

  useEffect(() => {
    if (lectures["length"]) {
      setContentLoader(false);
    }
    setTimeout(() => {
      setContentLoader(false);
    }, 1000);
  }, [lectures]);

  console.log(liveLectures, "liveLectures liveLectures", clName);

  return (
    <div className={classes.root}>
      <h1 variant="h4" className={`${classes.title} ${classes.fontBold}`}>
        LIVE ONLINE CLASSES FOR{" "}
        <span className={classes.primaryColor}>{clName}</span>
      </h1>

      {!isEmpty(liveLectures) && (
        <>
          <SliderHeader
            title="Live Classes"
            subTitle="From the courses you subscribed to"
            linkRef="#"
            linkText="View all"
          />
          <LiveClassesSlider
            lectures={liveLectures}
            enrollToCourse={props.enrollToCourse}
          />
        </>
      )}

      {!isEmpty(user) && (
        <>
          <Divider className={classes.divider} />

          <SliderHeader
            title="Upcoming Classes"
            subTitle="From the courses you subscribed to"
            linkRef="/online-class/upcoming-classes"
            linkText="View all"
            onClickLinkText={() => localStorage.setItem("courseId", courseId)}
          />

          {contentLoader ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
              }}
            >
              <Loader showOnlyLoader={true} size="small" />
            </div>
          ) : !isEmpty(myUpComingLectures) ? (
            <ClassesSlider lectures={myUpComingLectures} />
          ) : (
            <div className={"alert alert-info w-100 my-3"} role="alert">
              There is no results based on your filters.
            </div>
          )}
        </>
      )}

      <Divider className={classes.divider} />

      <SliderHeader
        title="Courses"
        linkRef=""
        linkText=""
        onClickLinkText={() => localStorage.setItem("courseId", courseId)}
      />

      {contentLoader ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30vh",
          }}
        >
          <Loader showOnlyLoader={true} size="small" />
        </div>
      ) : !isEmpty(lectures) && !contentLoader ? (
        // <CoursesSlider
        //   user={user}
        //   lectures={lectures}
        //   enrollToCourse={enrollToCourse}
        // />
        <div style={{ marginTop: "1em" }}>
          <AllCourses
            Courses={props.lectures}
            isLiveClassesPage={true}
            cId={courseId}
            enrollToCourse={enrollToCourse}
          />
        </div>
      ) : (
        <div className={"alert alert-info w-100 my-3"} role="alert">
          No Upcoming Classes For You.
        </div>
      )}
    </div>
  );
};

liveClasses.getInitialProps = async (ctx) => {
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, { Location: "/login" }).end();
  } else if (!Authorization) {
    document.location.pathname = "/login";
  } else return { Authorization };
};

export default liveClasses;
