import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@components/shared/loader";
import { Typography, Fab, Chip, Button } from "@material-ui/core";
import { cyan, blue, green } from "@material-ui/core/colors";
import { ArrowForwardIos, ArrowBackIos } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@components/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLecture, updateLecture } from "@utils/API";
import { isEmpty } from "lodash";
import { Rating } from "@material-ui/lab";
import Head from "next/head";
import ShareButtons from "@components/ShareButtons";

import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";

import { WhatsappShareButton, WhatsappIcon } from "react-share";

import nextCookie from "next-cookies";

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
    height: "45vw",
    maxHeight: 410,
  },
  liveClassTimerContainerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    borderRadius: 20,
    opacity: 0.4,
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
    [theme.breakpoints.down("xs")]: {
      paddingBottom: 0,
    },
  },
  timeContainer: {},
  timerContainerHeading: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    textShadow: "0 1px 1px rgba(0,0,0,.47)",
    marginBottom: 20,
    [theme.breakpoints.down("xs")]: {
      fontSize: 22,
    },
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
    [theme.breakpoints.down("xs")]: {
      fontSize: 18,
    },
  },
  time: {
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
    fontSize: "1.25em",
    fontWeight: 700,
    color: cyan[500],
    letterSpacing: 0.7,
    cursor: "pointer",
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
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexWrap: "wrap",
      fontSize: 18,
      alignItems: "center",
      marginBottom: 20,
    },
  },
  fontBold: {
    fontWeight: "bold",
  },
  startDate: {
    marginTop: 7.5,
    fontSize: 14,
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.5)",
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
  statusChip: {
    [theme.breakpoints.down("xs")]: {
      margin: 15,
    },
  },
  studyGroupSection: {
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
}));

const Dashboard = () => {
  let difference = 0;

  const calculateTimeLeft = () => {
    let timeLeft = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      const a = Math.floor(difference / (1000 * 60 * 60 * 24));
      const b = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const c = Math.floor((difference / 1000 / 60) % 60);
      const d = Math.floor((difference / 1000) % 60);

      timeLeft = {
        days: a < 10 ? `0${a}` : `${a}`,
        hours: b < 10 ? `0${b}` : `${b}`,
        minutes: c < 10 ? `0${c}` : `${c}`,
        seconds: d < 10 ? `0${d}` : `${d}`,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const dispatch = useDispatch();
  const Router = useRouter();
  const classes = useStyles();
  const { pathname, query } = Router;
  const [lecture, setLecture] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [copied, setCopied] = useState(false);
  const { slug } = query;
  const user = useSelector(({ USER }) => USER.user);
  const allCources = useSelector(({ APPSTATE }) => APPSTATE.allCources);

  const handleCopy = (id) => {
    setCopied({ [id]: true });
    setTimeout(() => {
      setCopied({ [id]: false });
    }, 3000);
  };

  const {
    _id,
    tutor: owner,
    title,
    name,
    subject,
    classRoom,
    duration,
    price,
    keywords,
    description,
    lectureSeries,
    subscribers,
    startTime,
    endTime,
    meetingInfo,
    whatsapp,
    learnDescription,
    requirements,
    image,
    recorded_url,
    rating,
  } = lecture;

  difference = +new Date(lecture["startTime"]) - +new Date();
  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  const shareUrl = `https://schoolx.pk/online-class/${_id}`;

  const subscribe = (id, subscribers) => {
    if (isEmpty(user)) {
      Router.push({
        pathname: "/login",
        query: { returnto: `/online-class/${slug}` },
      });
    }
    // window.ga("send", {
    //   hitType: "event",
    //   eventCategory: "Engagment",
    //   eventAction: "un-enroll",
    //   eventLabel: title,
    //   eventValue: 1
    // });
    window.gtag("event", "enroll", {
      event_category: "Engagment",
      event_label: title,
      value: 1,
    });
    updateLecture(id, { subscribers: [...subscribers, user._id] }).then(
      (response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setLecture({ ...lecture, subscribers: data.subscribers });
          setNotifMessage("You successfully subscribed to the lecture.");
          setNotifMessageType("success");
        } else {
          setNotifMessageType("error");
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      }
    );
  };
  const unsubscribe = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
    // ga("send", "event", "Signup Form", "submit", {
    //   hitCallback: function() {
    //     console.log("hitting");
    //   }
    // });
    window.gtag("event", "un-enroll", {
      event_category: "Engagment",
      event_label: title,
      value: 1,
    });
    // window.ga("send", {
    //   hitType: "event",
    //   eventCategory: "Engagment",
    //   eventAction: "enroll",
    //   eventLabel: title,
    //   eventValue: 1
    // });
    updateLecture(id, { subscribers: [...newSubscribers] }).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setLecture({ ...lecture, subscribers: data.subscribers });
        setNotifMessage("You successfully unsubscribed from the lecture.");
        setNotifMessageType("success");
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
      setLoading(false);
    });
  };

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(startTime);

  const startDate = `${date.toLocaleDateString(
    "en-US",
    options
  )} ${date.toLocaleTimeString("en-US")}`;

  const GET_LECTURE = gql`
  {
    findLecture(query: {_id:"${slug}"}) {
      _id,
      name
      startTime
      duration
      keywords
      description
      tutor {
        _id
        name
      },
      meetingInfo,
      recorded_url,
      classRoom{
        _id
        name
      },
      subscribers
    }
  }
  `;

  const { error, data, fetchMore, networkStatus, client, variables } = useQuery(
    GET_LECTURE,
    {
      variables: { __skip: 0, __limit: 30 },
      // notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    console.log(data, "data list id ", variables);
    if (data) {
      console.log(data, "data of lectures");
      if (data.findLecture && data.findLecture.length > 0) {
        setLecture(data.findLecture[0]);
      }
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [data]);

  function openInNewTab() {
    var win = window.open(recorded_url, '_blank');
    win.focus();
  }

  console.log(lecture, "lecure is the");

  return (
    <div className={"mainPageContainer"}>
      {!isEmpty(lecture) ? (
        <Head>
          <title>
            {name} | SchoolX, the leading online learning platform in Pakistan
          </title>
          <meta property="og:title" content={name} />
          <meta
            property="og:url"
            content={`https://www.schoolx.pk/online-class/${lecture["_id"]}`}
          />
          <meta property="og:site_name" content="SchoolX" />
          <meta
            name="description"
            content={`Learn ${name} by ${owner.name}. Schoolx is a complete learning platform for your needs ✓ Learn various subjects as a student ✓ Teach your skills and at your own pace as a teacher`}
          />
          <meta property="og:type" content="lecture" />
          {recorded_url != "" && recorded_url != null && (
            <>
              <meta
                property="og:video"
                content={`https://www.youtube.com/embed/${recorded_url}`}
              />
              <meta
                property="og:video:type"
                content="application/x-shockwave-flash"
              />
              <meta property="og:video:width" content="380" />
              <meta property="og:video:height" content="230" />
              <meta property="og:site_name" content="YouTube" />
            </>
          )}
          <meta property="og:image:alt" content={`${name} by ${owner.name}`} />
        </Head>
      ) : (
        <Head>
          <title>
            SchoolX, the leading online learning platform in Pakistan
          </title>
        </Head>
      )}
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
          {!isEmpty(lecture) ? (
            <div className={`pageBodyContainer ${classes.pageBody}`}>
              {/* <Fab
                size="small"
                color="primary"
                aria-label="back"
                className={classes.goBackIconContainer}
                onClick={() => Router.back()}
              >
                <ArrowBackIos className={classes.goBackIcon} />
              </Fab> */}
              <div className={`${classes.liveClassTimerContainer}`}>
                {timeLeft["days"] == "00" &&
                timeLeft["minutes"] == "00" &&
                timeLeft["hours"] == "00" ? (
                  recorded_url != "" && recorded_url != null ? (
                    <img
                      src={'https://schoolx.s3.me-south-1.amazonaws.com/static/play.png'}
                      alt="cover"
                      className={classes.liveClassTimerContainerImage}
                      onClick={openInNewTab}
                      style={{cursor:'pointer'}}
                    />
                    // <iframe
                    //   width="100%"
                    //   height="415"
                    //   src={`https://www.youtube.com/embed/${
                    //     recorded_url ? recorded_url : ""
                    //   }`}
                    // ></iframe>
                  ) : (
                    <img
                      src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&mp;cs=tinysrgb&mp;dpr=2&mp;h=650&mp;w=940"
                      alt="cover"
                      className={classes.liveClassTimerContainerImage}
                    />
                  )
                ) : (
                  <>
                    <img
                      src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&mp;cs=tinysrgb&mp;dpr=2&mp;h=650&mp;w=940"
                      alt="cover"
                      className={classes.liveClassTimerContainerImage}
                    />
                    <div className={classes.timerMainContainer}>
                      <div className={classes.timeContainer}>
                        <Typography
                          variant="h4"
                          component="h4"
                          className={`${classes.timerContainerHeading} ${classes.fontBold}`}
                        >
                          Class will be live in
                        </Typography>
                      </div>
                      <div className={classes.timerContainer}>
                        <div className={classes.time}>
                          {timeLeft["days"]}
                          <div className={classes.timeType}>Days</div>
                        </div>
                        <span>:</span>
                        <div className={classes.time}>
                          {timeLeft["hours"]}
                          <div className={classes.timeType}>Hours</div>
                        </div>
                        <span>:</span>
                        <div className={classes.time}>
                          {timeLeft["minutes"]}
                          <div className={classes.timeType}>Mins</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className={`${classes.classInfoContainer}`}>
                <Typography
                  variant="h6"
                  component="h6"
                  className={`${classes.classRoomName}`}
                  onClick={() =>
                    Router.push(`/online-course/${classRoom["_id"]}`)
                  }
                >
                  {classRoom && classRoom["name"]}
                  <ArrowForwardIos className={classes.classRoomNameArrow} />
                </Typography>
                <Typography
                  variant="h5"
                  component="h5"
                  className={`${classes.lectureName}`}
                >
                  {name}
                  <br />
                  <Chip label="New" color="primary" className="mt-2" />
                  <Chip label="Live" color="secondary" className="ml-2 mt-2" />
                  <Chip
                    label="Invite Friends"
                    style={{ backgroundColor: green[500] }}
                    className="ml-2 mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      handleCopy(_id);
                    }}
                  />
                  {copied[_id] ? (
                    <span
                      style={{ color: "green" }}
                      className="small mb-0 ml-2"
                    >
                      Link copied!
                    </span>
                  ) : null}
                </Typography>
                <Typography component="p" className={`${classes.startDate}`}>
                  {startDate}
                </Typography>
              </div>
              <div className="mt-3">
                <Typography
                  component="p"
                  className={`${classes.startDate} ${classes.fontBold}`}
                >
                  About this lecture
                </Typography>
                <Typography component="p" className={`${classes.startDate}`}>
                  {description}
                </Typography>
              </div>
              <div className="mt-3">
                <Typography
                  component="p"
                  className={`${classes.startDate} ${classes.fontBold}`}
                >
                  What you will learn?
                </Typography>
                <ul className="udlite-block-list">
                  {!learnDescription ? (
                    <li>Not specified.</li>
                  ) : (
                    learnDescription
                      .split(/\r?\n/)
                      .map((req, index) => <li key={`req${index}`}>{req}</li>)
                  )}
                </ul>
              </div>
              <div className="mt-3">
                <Typography
                  component="p"
                  className={`${classes.startDate} ${classes.fontBold}`}
                >
                  Requirements
                </Typography>
                <ul className="udlite-block-list">
                  {!requirements ? (
                    <li>No requirements.</li>
                  ) : (
                    requirements
                      .split(/\r?\n/)
                      .map((req, index) => <li key={`req${index}`}>{req}</li>)
                  )}
                </ul>
              </div>
              <div className="mt-3 d-flex flex-column flex-sm-row">
                <div className="">
                  <Typography
                    component="p"
                    className={`${classes.startDate} ${classes.fontBold}`}
                  >
                    Study Groups
                  </Typography>
                  {true ? (
                    <WhatsappShareButton url={""}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  ) : null}
                </div>
                <div className="ml-sm-5">
                  <Typography
                    component="p"
                    className={`${classes.startDate} ${classes.fontBold}`}
                  >
                    Lecturer
                  </Typography>
                  <span
                    onClick={() => Router.push(`/profile/${owner._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {`${owner ? owner.name : ""}`}
                  </span>
                </div>
                <div className="ml-sm-5">
                  <Typography
                    component="p"
                    className={`${classes.startDate} ${classes.fontBold}`}
                  >
                    Ratings
                  </Typography>
                  <Rating
                    name="lecture"
                    style={{
                      fontSize: "1rem",
                    }}
                    className="text-left"
                    value={rating || 4}
                    precision={0.5}
                    readOnly
                  />
                </div>
              </div>
              <div className="text-justify dark-grey-text mt-3">
                <Typography
                  component="p"
                  className={`${classes.startDate} ${classes.fontBold}`}
                >
                  Keywords
                </Typography>
                {keywords
                  ? keywords.split(",").map((keyword) => (
                      <div
                        key={keyword}
                        className="chip waves-effect waves-effect mt-2"
                      >
                        {keyword}
                      </div>
                    ))
                  : null}
              </div>
              <div className="mt-4">
                <Typography
                  component="p"
                  className={`${classes.startDate} ${classes.fontBold}`}
                >
                  Actions
                </Typography>
                {meetingInfo ? (
                  meetingInfo.running[0] === "false" ? (
                    <div
                      style={{
                        marginTop: 15,
                        marginBottom: 15,
                        marginRight: 15,
                      }}
                      className="d-flex flex-row align-items-center"
                    >
                      {subscribers.includes(user._id) ? (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            unsubscribe(_id, subscribers);
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          Unsubscribe
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            subscribe(_id, subscribers);
                          }}
                          color="primary"
                          variant="contained"
                        >
                          Enroll
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        Router.push(`/online-class/live/${_id}`);
                      }}
                      color="primary"
                      variant="outlined"
                    >
                      Join Lecture
                    </Button>
                  )
                ) : null}
              </div>
              <ShareButtons shareUrl={shareUrl} title={title} />
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
                Details not found against this Lecture Id
              </Typography>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default withApollo(Dashboard);
