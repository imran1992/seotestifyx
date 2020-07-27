// @ts-nocheck
/* eslint-disable nonblock-statement-body-position */
import React, { useEffect, useState, Fragment, useRef } from "react";
import { useRouter } from "next/router";
import { isEmpty, filter, orderBy } from "lodash";
import Loader from "@components/shared/loader";
import gql from "graphql-tag";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Modal,
  Chip,
  Popper,
  Paper,
  Button,
  ClickAwayListener,
} from "@material-ui/core";
import useInput from "@components/useInput";
import LiveClasses from "@components/LiveClasses";
import Notif from "@components/Notif";
import Head from "next/head";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  SchoolRounded as ClassIcon,
  KeyboardArrowDown as ArrowDown,
} from "@material-ui/icons";
import { blue, green } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import { updateLecture, enrollToCourse } from "@utils/API";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "large",
    fontWeight: "bold",
  },
  link: {
    display: "flex",
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  tooltipBtn: {
    borderRadius: 25,
    "&:active": {
      backgroundColor: theme.palette.getContrastText(blue[500]),
    },
    "&:focus": {
      backgroundColor: theme.palette.getContrastText(blue[500]),
    },
  },
  arrowTooltip: {
    color: "#fff",
    left: "165px !important",
  },
  tooltipPlacementBottom: {
    padding: 20,
    marginTop: theme.spacing(1),
  },
  activeCourseChip: {
    backgroundColor: green[500],
    "&:hover, &:active, &:focus": {
      backgroundColor: green[800],
    },
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "25%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "15%",
    },
  },
}));

const Dashboard = ({ courseId}) => {
  const dispatch = useDispatch();
  // const [Timer] = useTimer("2020-03-19T11:45:00.000Z".replace("Z", ""), 90);
  const classes =  useStyles();
  const Router = useRouter();
  const { user } = useSelector(({ USER }) => USER);

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
            _id
          }
        }
      }
    }
  `;

  // const ALL_LECTURE_SERIES = gql`
  //   {
  //     findCourse(query: { classRoomId: "${courseId}" }) {
  //       _id
  //       name
  //       price
  //       description
  //       subscribers
  //       teacher {
  //         _id
  //         fullName
  //         phone
  //         country
  //       }
  //       lectures {
  //         _id
  //         name
  //         description
  //         duration
  //         price
  //         startTime
  //         meetingID
  //         keywords
  //         image_url
  //         meetingInfo
  //       }
  //       videos {
  //         name
  //       }
  //       tests {
  //         name
  //         mcqs {
  //           name
  //           options
  //           answer
  //           answer_index
  //         }
  //       }
  //       subject {
  //         name
  //         classRoom {
  //           name
  //         }
  //       }
  //     }
  //   }
  // `;

  const ALL_LECTURE_SERIES_IF_NO_COURSE_ID = gql`
    {
      findCourse(query: {}) {
        _id
        name
        price
        description
        subscribers
        teacher {
          _id
          fullName
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
          mcqs {
            name
            options
            answer
            answer_index
          }
        }
        subject {
          name
          classRoom {
            _id
            name
            category
            description
          }
        }
      }
    }
  `;

  const { pathname, query } = Router;

  /* New State Handling for Data */
  const [classRoom, setClassRoom] = useState(null);

  /* Old State Handling for Data */
  const [lectures, setLectures] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openChipTooltip, setOpenChipTooltip] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lectureseries, setLectureseries] = useState([]);
  const [liveLectures, setliveLectures] = useState([]);
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState({});
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const handleCopy = (id) => {
    setCopied({ [id]: true });
    setTimeout(() => {
      setCopied({ [id]: false });
    }, 3000);
  };
  const truncate = (n, string) => {
    if (string.length <= n) {
      return string;
    }
    const subString = string.substr(0, n - 1);
    return `${subString.substr(0, subString.lastIndexOf(" "))}...`;
  };

  const { category, time, price, status } = input;

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

  // console.log(subLectures, "sub lectures");

  const myLectures = orderBy(
    subLectures,
    (object) => new Date(object.startTime),
    ["asc"]
  );

  // const myLectures = orderBy(
  //   filter(lectures, (found) => found.subscribers.includes(user._id)),
  //   (object) => new Date(object.startTime),
  //   ['asc'],
  // );

  // console.log(myLectures, "my lectures ", lectures);

  const getMutationToCall = () => {
    if ((!isEmpty(user) && user["classRoom"]) || courseId) {
      return ALL_LECTURE_SERIES;
    } else {
      return ALL_LECTURE_SERIES_IF_NO_COURSE_ID;
    }
  };

  const { error, data, fetchMore, networkStatus, client } = useQuery(
    getMutationToCall(),
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    // alert(1)

    // console.log("34444443434", error, data, fetchMore, networkStatus, client);

    if (data) {
      if (data["findClassRoom"] && data["findClassRoom"]["length"]) {
        const { courses } = data["findClassRoom"][0];
        dispatch({ type: "GET_COURCES", payload: courses });
        setLectureseries(courses);
        setLectures(courses);
        setClassRoom(data["findClassRoom"][0]);
        setLoading(false);
      } else {
        dispatch({ type: "GET_COURCES", payload: data.findCourse });

        if (data.findCourse && data.findCourse["length"]) {
          setClassRoom(data["findCourse"][0]["subject"]["classRoom"]);
        }
        setLectureseries(data.findCourse);
        setLectures(data.findCourse);
        setLoading(false);
      }
    } else {
      setNotifMessageType("error");
      if (error) setNotifMessage(error.message);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (user.role == "teacher" || user.role == "admin") {
      Router.push("/online-course");
    }
    handleInputChange({ category: "courses" });
  }, []);

  useEffect(() => {
    let subLectures = [];
    let allLectures = [];
    if (lectures && lectures.length > 0) {
      for (let lec of lectures) {
        allLectures = [...allLectures, ...lec.lectures];
        for (let ll of allLectures) {
          ll.teacher = lec.teacher;
          (ll.subscribers = lec.subscribers), (ll.subject = lec.subject);
          // console.log(ll, "ll item is th");
        }
        let index = lectures.findIndex((lec) =>
          lec.subscribers.includes(user._id)
        );
        if (index > -1) {
          subLectures = [...subLectures, ...lectures[index].lectures];
        }
      }
    }
    // if (category !== "courses") {
    // console.log(lectures, "lectures of useEffect", allLectures);
    if (allLectures && allLectures.length > 0) {
      setliveLectures(
        allLectures.filter(({ meetingInfo }, index) => {
          console.log("meetingInfo.running[0]", meetingInfo.running[0]);
          return meetingInfo.running[0] === "true";
        })
      );
    }
    // console.log("data", subLectures, "4545454545454545");
    //  } else {
    //    setliveLectures([]);
    //  }
  }, [lectures, category]);

  // console.log(liveLectures, "myLectures", myLectures);

  const EnrollToCourse = (id) => {
    if (isEmpty(user)) {
      Router.push({
        pathname: "/login",
        query: { returnto: "/online-course/" + id },
      });
    } else {
      enrollToCourse({
        id,
        type: "course",
      }).then(({ ok, data, problem }) => {
        if (ok) {
          // console.log(lectureseries, "CourseEnroll", data);
          const CopyOflectureseries = JSON.parse(JSON.stringify(lectureseries));
          for (let i = 0; i < CopyOflectureseries.length; i++) {
            const el = CopyOflectureseries[i];
            if (el._id === id) {
              el.subscribers.push(data.userId);
              break;
            }
          }
          console.log(CopyOflectureseries, "CopyOflectureseries");

          setLectureseries(CopyOflectureseries);
          setLectures(CopyOflectureseries);
          dispatch({ type: "GET_COURCES", payload: CopyOflectureseries });
          setNotifMessageType("success");
          setNotifMessage("Successfully Enrolled");
          return true;
        } else {
          setNotifMessageType("error");
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
      });
    }
  };

  const handleBreadCrumbClick = (event) => {
    event.preventDefault();
    Router.push("/");
  };

  // filteredLectures = lecData.data ? lecData.data.findCourse : [];
  // console.log(filteredLectures, "filteredLectures");

  const anchorRef = useRef(null);

  return (
    <div className={"lectureMainPageContainer"}>
      <Head>
        {!isEmpty(classRoom) ? (
          <>
            <title>{`${classRoom["name"]} Online Courses`}</title>
            <meta
              property="og:title"
              content={`${classRoom["name"]} Online Courses`}
            />
          </>
        ) : (
          <>
            <title>
              Lectures | SchoolX, the leading online learning platform in
              Pakistan
            </title>
            <meta property="og:title" content="Courses We Offer" />
          </>
        )}
        <meta
          name="description"
          content={`Courses We Offer. Schoolx is a complete online learning platform for A Level, O Level, FSc & Matric in Pakistan. ✓ Get best tuition and study all subjects online with best teachers of Pakistan`}
        />
        <meta
          property="og:url"
          content={`https://schoolx.pk/online-courses/${courseId}`}
        />
        <meta property="og:site_name" content="SchoolX" />
        <meta property="og:type" content="Courses &amp; lectures" />
      </Head>
      {
        // Timer
      }
      <div className={"lecturePageBodyContainer"}>
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={showFilters}
          onClose={() => {
            setShowFilters(false);
          }}
        >
          <div
            style={{
              width: "100%",
              minHeight: "100%",
              backgroundColor: "#fff",
            }}
          >
            <div style={{ width: "100%" }}>
              <span
                onClick={() => {
                  setShowFilters(false);
                }}
              >
                <CloseIcon
                  style={{
                    marginLeft: "5%",
                    marginBottom: "2vh",
                    marginTop: "2vh",
                  }}
                />
              </span>
            </div>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Category: {category || "lectures"}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                <div
                  onClick={() => {
                    handleInputChange({ category: "lectures" });
                  }}
                  style={{
                    width: "100%",
                    fontWeight: category !== "courses" ? "bold" : "normal",
                  }}
                >
                  Lectures
                </div>
                <div
                  onClick={() => {
                    handleInputChange({ category: "courses" });
                  }}
                  style={{
                    width: "100%",
                    fontWeight: category === "courses" ? "bold" : "normal",
                  }}
                >
                  Courses
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>
                  Sort by: {time || ""}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                <div
                  onClick={() => {
                    handleInputChange({ time: "nearest" });
                  }}
                  style={{
                    width: "100%",
                    fontWeight: time === "nearest" ? "bold" : "normal",
                  }}
                >
                  {category !== "courses" ? "Nearest" : "Newest"}
                </div>
                <div
                  onClick={() => {
                    handleInputChange({ time: "farthest" });
                  }}
                  style={{
                    width: "100%",
                    fontWeight: time === "farthest" ? "bold" : "normal",
                  }}
                >
                  {category !== "courses" ? "Farthest" : "Oldest"}
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
            {category !== "courses" && (
              // eslint-disable-next-line react/jsx-fragments
              <Fragment>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel3a-header"
                  >
                    <Typography className={classes.heading}>
                      role Prices: {price || ""}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                    <div
                      onClick={() => {
                        handleInputChange({ price: "free" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: price === "free" ? "bold" : "normal",
                      }}
                    >
                      Free
                    </div>
                    <div
                      onClick={() => {
                        handleInputChange({ price: "0-1000" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: price === "0-1000" ? "bold" : "normal",
                      }}
                    >
                      Under Rs 1,000
                    </div>
                    <div
                      onClick={() => {
                        handleInputChange({ price: "1000-2000" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: price === "1000-2000" ? "bold" : "normal",
                      }}
                    >
                      Between Rs 1,000 and Rs 2,000
                    </div>
                    <div
                      onClick={() => {
                        handleInputChange({ price: "2000+" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: price === "2000+" ? "bold" : "normal",
                      }}
                    >
                      More than Rs 2,000
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel3a-header"
                  >
                    <Typography className={classes.heading}>
                      Happening time: {status || ""}
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={{ flexDirection: "column" }}>
                    <div
                      onClick={() => {
                        handleInputChange({ status: "live" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: status === "live" ? "bold" : "normal",
                      }}
                    >
                      now
                    </div>
                    <div
                      onClick={() => {
                        handleInputChange({ status: "thisweek" });
                      }}
                      style={{
                        width: "100%",
                        fontWeight: status === "thisweek" ? "bold" : "normal",
                      }}
                    >
                      this week
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </Fragment>
            )}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFilters(false);
                }}
                style={{ width: 220, height: 40, marginTop: "25px" }}
                className="btn btn-primary btn-rounded btn-sm waves-effect waves-light"
              >
                Search
              </button>
            </div>
          </div>
        </Modal>

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
          <>
            {/* <Popper
              open={openChipTooltip}
              anchorEl={anchorEl}
              placement="bottom-end"
              disablePortal={false}
              modifiers={{
                flip: {
                  enabled: true,
                },
                preventOverflow: {
                  enabled: true,
                  boundariesElement: "window",
                },
              }}
            >
              <ClickAwayListener onClickAway={() => setOpenChipTooltip(false)}>
                <Paper className={classes.tooltipPlacementBottom}>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.tooltipBtn}
                    onClick={handleBreadCrumbClick}
                  >
                    Change Course
                  </Button>
                </Paper>
              </ClickAwayListener>
            </Popper>

            <Chip
              innerRef={anchorRef}
              icon={<ClassIcon />}
              label={classRoom ? classRoom["name"] : ""}
              clickable
              disabled={!courseId}
              onDelete={(ev) => {
                setAnchorEl(ev.currentTarget);
                setOpenChipTooltip(!openChipTooltip);
              }}
              deleteIcon={<ArrowDown />}
              className={classes.activeCourseChip}
              color="secondary"
            /> */}

            <div className="sxRow">
              <h6
                style={{ marginTop: "1em" }}
                className="text-left dark-grey-text w-100 rounded"
              >
                {!isEmpty(user)
                  ? `Welcome back, ${user.name}`
                  : "Welcome to SchoolX online classes from top tutors"}
              </h6>
            </div>

            <LiveClasses
              courseId={courseId}
              lectures={lectures}
              enrollToCourse={EnrollToCourse}
              clName={classRoom && classRoom != null ? classRoom.name : ""}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default withApollo(Dashboard);
