// @ts-nocheck
/* eslint-disable nonblock-statement-body-position */
import React, { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { isEmpty, filter, orderBy } from "lodash";
import gql from 'graphql-tag';
import { API, graphqlOperation } from 'aws-amplify'
import { withApollo } from '../lib/apollo';
import {
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Modal,
} from "@material-ui/core";
import useInput from "@components/useInput";
import useTimer from "@components/useTimer";
import Notif from "@components/Notif";
import Slider from "react-slick";
import { Rating } from "@material-ui/lab";
import Head from "next/head";
import { ScrollView2, ScrollView1 } from "@components/ScrollView";
import { makeStyles } from "@material-ui/core/styles";
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  Filter1Outlined,
} from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getLectures,
  updateLecture,
  getLectureSeries,
  updateLectureSeri,
  enrollToCourse,
  getPublicLectureSeries,
} from "@utils/API";
import { timeLefter, OurTimeShower } from "@utils/utilities";
import LectureCard from "@components/cards/lectureCard";
import CourseCard from "@components/cards/courseCard";
import { useQuery } from '@apollo/react-hooks';


export const ALL_LECTURE_SERIES = gql`
  {
    findCourse(query:{}){
      _id,
      name,
      description,
      subscribers,
      teacher{
        fullName,
        phone,
        country
      },
      lectures{
        name,
        description,
        startTime,
      },
      recorded_url
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
`




const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "large",
    fontWeight: "bold",
  },
}));


const Dashboard = () => {
  const dispatch = useDispatch();
  // const [Timer] = useTimer("2020-03-19T11:45:00.000Z".replace("Z", ""), 90);
  const classes = useStyles();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lectures, setLectures] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [lectureseries, setLectureseries] = useState([]);
  const [liveLectures, setliveLectures] = useState([]);
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
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




  const { user } = useSelector(({ USER }) => USER);

  const { category, time, price, status } = input;

  const myLectures = orderBy(
    filter(lectures.data, (found) => found.subscribers.includes(user._id)),
    (object) => new Date(object.startTime),
    ["asc"]
  );

  let filteredLectures = !isEmpty(lectures.data)
    ? category !== "courses"
      ? isEmpty(user.classRoom)
        ? orderBy(
          filter(lectures.data, (object) => new Date(object.startTime), [
            "desc",
          ])
        )
        : orderBy(
          filter(
            lectures.data,
            (found) => !found.subscribers.includes(user._id)
          ),
          (object) => {
            console.log(object.classRoom._id);
            return object.classRoom._id !== user.classRoom._id;
          },
          ["desc"],
          (object) => new Date(object.startTime),
          ["desc"]
        )
      : orderBy(lectureseries.data, (object) => new Date(object.startTime), [
        "desc",
      ])
    : [];

  const settings = {
    className: "mySlider",
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isEmpty(myLectures)
      ? 1
      : myLectures.length < 3
        ? myLectures.length
        : 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: isEmpty(myLectures)
            ? 1
            : myLectures.length < 3
              ? myLectures.length
              : 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    autoplay: true,
    autoplaySpeed: 4000,
  };

  if (category !== "courses") {
    if (price) {
      switch (price) {
        case "free":
          filteredLectures = filter(
            filteredLectures,
            (found) => found.price === 0
          );
          break;
        case "0-1000":
          filteredLectures = filter(
            filteredLectures,
            (found) => found.price < 1001 && found.price > 0
          );
          break;
        case "1000-2000":
          filteredLectures = filter(
            filteredLectures,
            (found) => found.price < 2001 && found.price > 1000
          );
          break;
        case "2000+":
          filteredLectures = filter(
            filteredLectures,
            (found) => found.price > 2000
          );
          break;
        default:
          break;
      }
    }
    if (status) {
      switch (status) {
        case "live":
          filteredLectures = filter(
            filteredLectures,
            (found) => found.meetingInfo.running[0] === "true"
          );
          break;
        case "thisweek":
          filteredLectures = filter(
            filteredLectures,
            (found) =>
              new Date(found.startTime).getTime() <
              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
          );
          break;
        default:
          break;
      }
    }
    if (time) {
      switch (time) {
        case "nearest":
          filteredLectures = orderBy(
            filteredLectures,
            (object) => new Date(object.startTime),
            ["asc"]
          );
          break;
        case "farthest":
          filteredLectures = orderBy(
            filteredLectures,
            (object) => new Date(object.startTime),
            ["desc"]
          );
          break;
        default:
          break;
      }
    }
  } else if (time) {
    switch (time) {
      case "nearest":
        filteredLectures = orderBy(
          filteredLectures,
          (object) => new Date(object.startTime),
          ["desc"]
        );
        break;
      case "farthest":
        filteredLectures = orderBy(
          filteredLectures,
          (object) => new Date(object.createdAt),
          ["asc"]
        );
        break;
      default:
        break;
    }
  }

  const resetFilters = () => {
    handleInputChange("wipe");
  };

  const subscribeCourse = (id, subscribers) => {
    if (isEmpty(user))
      Router.push({ pathname: "/login", query: { returnto: pathname } });
    else {
      updateLectureSerie(id, { subscribers: [...subscribers, user._id] }).then(
        (response) => {
          const { ok, data, problem } = response;
          if (ok) {
            console.log("Rdata", data);
            let subscribedLectureIndex = null;
            for (let i = 0; i < lectureseries.data.length; i++) {
              const el = lectureseries.data[i];
              if (el._id === id) {
                subscribedLectureIndex = i;
              }
            }
            console.log("subscribedLectureIndexX", subscribedLectureIndex);

            setLectureseries({
              ...lectureseries,
              data: [
                ...lectureseries.data.slice(0, subscribedLectureIndex),
                {
                  ...lectureseries.data[subscribedLectureIndex],
                  subscribers: data.subscribers,
                },
                ...lectureseries.data.slice(subscribedLectureIndex + 1),
              ],
            });
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        }
      );
    }
  };
  const unsubscribeCourse = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
    if (isEmpty(user)) Router.push({ pathname: "/login", query });
    else {
      updateLectureSerie(id, { subscribers: [...newSubscribers] }).then(
        (response) => {
          const { ok, data, problem } = response;
          if (ok) {
            let unsubscribedLectureIndex = null;
            for (let i = 0; i < lectureseries.data.length; i++) {
              const el = lectureseries.data[i];
              if (el._id === id) {
                unsubscribedLectureIndex = i;
              }
            }
            console.log("unsubscribedLectureIndex", unsubscribedLectureIndex);

            setLectureseries({
              ...lectureseries,
              data: [
                ...lectureseries.data.slice(0, unsubscribedLectureIndex),
                {
                  ...lectureseries.data[unsubscribedLectureIndex],
                  subscribers: data.subscribers,
                },
                ...lectureseries.data.slice(unsubscribedLectureIndex + 1),
              ],
            });
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        }
      );
    }
  };

  const subscribe = (id, subscribers) => {
    if (isEmpty(user))
      Router.push({ pathname: "/login", query: { returnto: pathname } });
    else {
      updateLecture(id, { subscribers: [...subscribers, user._id] }).then(
        (response) => {
          const { ok, data, problem } = response;
          if (ok) {
            console.log("Rdata", data);
            let subscribedLectureIndex = null;
            for (let i = 0; i < lectures.data.length; i++) {
              const el = lectures.data[i];
              if (el._id === id) {
                subscribedLectureIndex = i;
              }
            }
            console.log("subscribedLectureIndexE", subscribedLectureIndex);

            setLectures({
              ...lectures,
              data: [
                ...lectures.data.slice(0, subscribedLectureIndex),
                {
                  ...lectures.data[subscribedLectureIndex],
                  subscribers: data.subscribers,
                },
                ...lectures.data.slice(subscribedLectureIndex + 1),
              ],
            });
            setNotifMessageType("success");
            setNotifMessage("Successfully Enrolled");
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        }
      );
    }
  };
  const unsubscribe = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
    if (isEmpty(user)) Router.push({ pathname: "/login", query });
    else {
      updateLecture(id, { subscribers: [...newSubscribers] }).then(
        (response) => {
          const { ok, data, problem } = response;
          if (ok) {
            let unsubscribedLectureIndex = null;
            for (let i = 0; i < lectures.data.length; i++) {
              const el = lectures.data[i];
              if (el._id === id) {
                unsubscribedLectureIndex = i;
              }
            }
            console.log("unsubscribedLectureIndex", unsubscribedLectureIndex);

            setLectures({
              ...lectures,
              data: [
                ...lectures.data.slice(0, unsubscribedLectureIndex),
                {
                  ...lectures.data[unsubscribedLectureIndex],
                  subscribers: data.subscribers,
                },
                ...lectures.data.slice(unsubscribedLectureIndex + 1),
              ],
            });
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        }
      );
    }
  };



  const { error, data, fetchMore, networkStatus, client } = useQuery(
    ALL_LECTURE_SERIES,
    {
      variables: {
        skip: 0,
        first: 10,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(() => {
    // alert(1)

    console.log('34444443434', error, data, fetchMore, networkStatus, client)

    if (data) {
      setLectureseries(data.findCourse);
      setLectures(data.findCourse)
      setLoading(false)
    }
    else {
      setNotifMessageType("error");
      if (error) setNotifMessage(error);
      else setNotifMessage(error);
    }
  })


  useEffect(() => {
    // getLectures().then((response) => {
    //   const { ok, data, problem } = response;
    //   if (ok) {
    //     setLectures(data);
    //   } else {
    //     setNotifMessageType("error");
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    // });
    // getLectureSeries().then((response) => {
    //   const { ok, data, problem } = response;
    //   if (ok) {
    //     setLectureseries(data);
    //   } else {
    //     setNotifMessageType("error");
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    // });
    // setLoading(false);

    handleInputChange({ category: "courses" });
  }, []);


  useEffect(() => {
    const { data } = lectures;
    // if (category !== "courses") {
    if (data)
      setliveLectures(
        data.filter(({ meetingInfo }, index) => {
          return meetingInfo.running[0] === "true";
        })
      );
    console.log("data", data);
    //  } else {
    //    setliveLectures([]);
    //  }
  }, [lectures, category]);

  console.log("myLectures", myLectures);

  const EnrollToCourse = (id) => {
    if (isEmpty(user))
      Router.push({ pathname: "/login", query: { returnto: pathname } });
    else
      enrollToCourse({
        id,
        type: "course",
      }).then(({ ok, data, problem }) => {
        if (ok) {
          console.log("CourseEnroll", data);
          const CopyOflectureseries = { ...lectureseries };
          for (let i = 0; i < CopyOflectureseries.data.length; i++) {
            const el = CopyOflectureseries.data[i];
            if (el._id === id) {
              el.subscribers.push(data.user_id);
              break;
            }
          }
          setLectureseries(CopyOflectureseries);
          setNotifMessageType("success");
          setNotifMessage("Successfully Enrolled");
        } else {
          setNotifMessageType("error");
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
      });
  };

  // filteredLectures = lecData.data ? lecData.data.findCourse : [];
  console.log(filteredLectures, 'filteredLectures')

  return (
    <div className={"lectureMainPageContainer"}>
      <Head>
        <title>
          Lectures | SchoolX, the leading online learning platform in Pakistan
        </title>
        <meta property="og:title" content="Courses & lectures" />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>
      {
        //Timer
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
                      Prices: {price || ""}
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
        <div className="sxRow">
          <h6
            style={{ paddingLeft: 10, marginTop: "1vh" }}
            className=" text-left dark-grey-text w-100 rounded "
          >
            {!isEmpty(user)
              ? `Welcome back, ${user.name}`
              : "Welcome to SchoolX online classes from top tutors"}
          </h6>
        </div>
        {myLectures.length !== 0 && (
          <Fragment>
            <div className="sxRow">
              <h2 className="h6 w-100 rounded mb-3 dashHeading">
                Your upcoming online classes
              </h2>
            </div>
            <ScrollView1 data={myLectures} />
          </Fragment>
        )}
        {liveLectures.length !== 0 && (
          <Fragment>
            <div className="sxRow">
              <h2 className="h6 w-100 rounded mb-3 dashHeading">
                Live classes
              </h2>
            </div>
            <ScrollView2 data={liveLectures} />
          </Fragment>
        )}

        <div className="sxRow">
          <h2 className="h6 w-100 rounded mb-3 dashHeading">
            Discover online classes & courses
          </h2>
        </div>
        <div className="sxRow px-3">
          <div className="filterDiv w-100 rounded p-3">
            <p className="text-primary w-100 mb-0 ">
              Showing {filteredLectures.length} {category || "Lectures"}
            </p>
            <div className="w-100 d-flex justify-content-center">
              <FormControl className="filterInput d-flex justify-content-center">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="category"
                  value={category || "lectures"}
                  onChange={handleInputChange}
                  variant="outlined"
                  displayEmpty
                >
                  <MenuItem name="category" value="" disabled>
                    Choose category
                  </MenuItem>
                  <MenuItem name="category" value="lectures">
                    Category: Lectures
                  </MenuItem>
                  <MenuItem name="category" value="courses">
                    Category: Courses
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl className="filterInput d-flex justify-content-center">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="time"
                  value={time || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  displayEmpty
                >
                  <MenuItem name="time" value="">
                    Sort by
                  </MenuItem>
                  <MenuItem name="time" value="nearest">
                    {category !== "courses" ? "Sort: Nearest" : "Sort: Newest"}
                  </MenuItem>
                  <MenuItem name="time" value="farthest">
                    {category !== "courses" ? "Sort: Farthest" : "Sort: Oldest"}
                  </MenuItem>
                </Select>
              </FormControl>
              {category !== "courses" && (
                <Fragment>
                  <FormControl className="filterInput d-flex justify-content-center">
                    <Select
                      labelId="select-label"
                      id="labelSelected"
                      name="price"
                      value={price || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      displayEmpty
                    >
                      <MenuItem name="price" value="">
                        Prices
                      </MenuItem>
                      <MenuItem name="price" value="free">
                        Price : Free
                      </MenuItem>
                      <MenuItem name="price" value="0-1000">
                        Price : Under Rs 1,000
                      </MenuItem>
                      <MenuItem name="price" value="1000-2000">
                        Price : Between Rs 1,000 et Rs 2,000
                      </MenuItem>
                      <MenuItem name="price" value="2000+">
                        Price : More than Rs 2,000
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className="filterInput d-flex justify-content-center">
                    <Select
                      labelId="select-label"
                      id="labelSelected"
                      name="status"
                      value={status || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      displayEmpty
                    >
                      <MenuItem name="status" value="">
                        Happening time
                      </MenuItem>
                      <MenuItem name="status" value="live">
                        Happening now
                      </MenuItem>
                      <MenuItem name="status" value="thisweek">
                        Happening this week
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Fragment>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowFilters(!showFilters);
                }}
                style={{ width: 220, height: 40, alignSelf: "center" }}
                className="btn text-primary-color btn-rounded btn-sm waves-effect waves-light filterBtn default-primary-color"
              >
                Filter
              </button>
              {!isEmpty(input) && (
                <button
                  type="submit"
                  disabled={isEmpty(input)}
                  onClick={(e) => {
                    e.preventDefault();
                    resetFilters();
                  }}
                  style={{ width: 220, height: 40 }}
                  className="btn text-primary-color btn-rounded btn-sm waves-effect waves-light default-primary-color"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="myRow pb-5">
          {
            !isEmpty(lectures) ? (
              {/* filteredLectures.length ? (
                filteredLectures.map((item, index) => { */}
                  return category === "courses" ? (
                    <CourseCard
                      key={"Course" + index}
                      user={user}
                      lectures={lectures}
                      EnrollToCourse={EnrollToCourse}
                      index={index}
                      subscribeCourse={subscribeCourse}
                      unsubscribe={unsubscribe}
                      unsubscribeCourse={unsubscribeCourse}
                      data={item}
                    />
                  )
                   : (
                      {/* <LectureCard
                        key={"Lecture" + index}
                        user={user}
                        index={index}
                        subscribe={subscribe}
                        unsubscribe={unsubscribe}
                        handleCopy={handleCopy}
                        copied={copied}
                        data={item}
                      /> */}
                    );
                })
              ) : (
                  <div className={"alert alert-info w-100 my-3"} role="alert">
                    There is no results based on your filters.
                  </div>
                )
            )
              :
              (
                <div className="w-100">
                  <div
                    style={{ height: "100px" }}
                    className="d-flex justify-content-center align-items-center w-100"
                  >
                    <CircularProgress className="text-primary position-relative" />
                  </div>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default withApollo(Dashboard);
