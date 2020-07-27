import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteLecture,
  getLecture,
  updateLecture,
  updateUser
} from "@utils/API";
import { ExtractDateAndTime, timeLefter } from "@utils/utilities";
import isEmpty from "lodash/isEmpty";
import Rating from "@material-ui/lab/Rating";
import Head from "next/head";
import Notif from "@components/Notif";

import {
  EmailShareButton,
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  InstapaperIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";
import useInput from "@components/useInput";

import nextCookie from "next-cookies";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lecture, setLecture] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [copied, setCopied] = useState(false);
  const { slug } = query;
  const user = useSelector(({ USER }) => USER.user);

  const {
    _id,
    user: owner,
    title,
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
    image
  } = lecture;

  const { rating11, rating12, rating13, rating21, rating22 } = input;

  const validRating = rating11 && rating12 && rating13 && rating21 && rating22;

  const stillTime =
    new Date(lecture.startTime).getTime() >
      new Date().getTime() - 2 * 60 * 60 * 1000 &&
    new Date().getTime() <
      new Date(lecture.endTime).getTime() + 2 * 60 * 60 * 1000;

  const sendrating = () => {
    const newRating =
      ((owner.rating || 0) * (owner.raters || 1) +
        (Number(rating11) + Number(rating12) + Number(rating13)) / 3) /
      ((owner.raters || 0) + 1);
    updateUser(owner._id, {
      rating: newRating.toFixed(2),
      raters: (owner.raters || 0) + 1
    }).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        setNotifMessageType("success");
        setNotifMessage(
          "Your rating was successfully saved. You can now go back to lectures main page."
        );
      } else {
        setNotifMessageType("error");
        setNotifMessage("An error occured while trying to save your rating.");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
      setLoading(false);
    });
  };

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const date = new Date(startTime);
  const startDate = `${date.toLocaleDateString(
    "en-US",
    options
  )} ${date.toLocaleTimeString("en-US")}`;

  useEffect(() => {
    getLecture(slug).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        setLecture(data);
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main className="pl-0 pt-5 w-75 mx-auto mainStudent">
      <style>{`
      .navbar.fixed-top {
        display: none !important;
      }
      `}</style>
      <Head>
        <title>
          Feedback for {title} | SchoolX, the leading online learning platform
          in Pakistan
        </title>
        <meta
          property="og:image"
          content={image || "/images/mathematics0.jpg"}
        />
      </Head>
      <div className="container-fluid mt-5">
        <div className="row">
          <Notif
            setNotifMessage={setNotifMessage}
            notifMessage={notifMessage}
            notifMessageType={notifMessageType}
          />
          <div className="col-md-12 mt-2">
            {!isEmpty(lecture) ? (
              stillTime ? (
                <div className="d-flex flex-column pb-5">
                  <div className="lectureHeading rounded w-100 d-flex flex-column justify-content-around px-3">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <div className="d-flex flex-row align-items-center">
                        <h2 className="h4 w-100 m-0 my-4">
                          Feedback for: {title}
                        </h2>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="small-plus justify-content-start align-items-center dark-grey-text">
                        <span
                          onClick={() => Router.push(`/profile/${owner._id}`)}
                          style={{ cursor: "pointer" }}
                        >{` By ${owner.name}`}</span>
                      </div>
                    </div>
                    <div className="w-100 d-flex flex-row mb-3 justify-content-between">
                      <div className="d-flex flex-row">
                        <div className="small-plus justify-content-start align-items-center">
                          <i className="fa fa-calendar text-primary mr-2" />
                          <span className="dark-grey-text">{` ${startDate}`}</span>
                        </div>
                        <span className="mx-2 dark-grey-text"> </span>
                        <div className="small-plus justify-content-start align-items-center dark-grey-text">
                          <i className="fa fa-clock-o text-primary mr-2" />
                          <span className="dark-grey-text">{`${duration} minutes`}</span>
                        </div>
                        <span className="mx-2 dark-grey-text"> </span>
                        <div className="small-plus justify-content-start align-items-center dark-grey-text">
                          <i className="fa fa-graduation-cap text-primary mr-2" />
                          <span className="dark-grey-text">{`${classRoom.name}`}</span>
                        </div>
                        <span className="mx-2 dark-grey-text"> </span>
                        <div className="small-plus justify-content-start align-items-center dark-grey-text">
                          <i className="fa fa-users text-primary mr-2" />
                          <span className="dark-grey-text">
                            {subscribers.length}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex">
                        {price > 0 ? (
                          <span className="text-primary">
                            <span className="strong-grey-text mr-2 small">
                              <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                            </span>
                            {`Rs ${price.toLocaleString()}`}
                          </span>
                        ) : (
                          <span className="text-primary">FREE</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                    Tutor’s rating
                  </h2>
                  <div className="px-2 text-justify d-flex flex-row justify-content-center align-items-center">
                    <p style={{ width: 300 }} className="dark-grey-text">
                      <span className="font-weight-bold">1.</span> Tutor’s
                      knowledge on the subject
                    </p>
                    <Rating
                      name="rating11"
                      style={{ position: "relative", bottom: 5 }}
                      className="ml-3 text-left"
                      value={Number(rating11) || 0}
                      precision={0.5}
                      onChange={handleInputChange}
                      size="large"
                      readOnly={!!notifMessage}
                    />
                  </div>
                  <div className="px-2 text-justify d-flex flex-row justify-content-center align-items-center">
                    <p style={{ width: 300 }} className="dark-grey-text">
                      <span className="font-weight-bold">2.</span> Tutor’s use
                      of practical examples
                    </p>
                    <Rating
                      name="rating12"
                      style={{ position: "relative", bottom: 5 }}
                      className="ml-3 text-left"
                      value={Number(rating12) || 0}
                      precision={0.5}
                      onChange={handleInputChange}
                      size="large"
                      readOnly={!!notifMessage}
                    />
                  </div>
                  <div className="px-2 text-justify d-flex flex-row justify-content-center align-items-center">
                    <p style={{ width: 300 }} className="dark-grey-text">
                      <span className="font-weight-bold">3.</span> Tutor’s
                      communication skills
                    </p>
                    <Rating
                      name="rating13"
                      style={{ position: "relative", bottom: 5 }}
                      className="ml-3 text-left"
                      value={Number(rating13) || 0}
                      precision={0.5}
                      onChange={handleInputChange}
                      size="large"
                      readOnly={!!notifMessage}
                    />
                  </div>
                  <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                    System rating
                  </h2>
                  <div className="px-2 text-justify d-flex flex-row justify-content-center align-items-center">
                    <p style={{ width: 300 }} className="dark-grey-text">
                      <span className="font-weight-bold">1.</span> Video Quality
                    </p>
                    <Rating
                      name="rating21"
                      style={{ position: "relative", bottom: 5 }}
                      className="ml-3 text-left"
                      value={Number(rating21) || 0}
                      precision={0.5}
                      onChange={handleInputChange}
                      size="large"
                      readOnly={!!notifMessage}
                    />
                  </div>
                  <div className="px-2 text-justify d-flex flex-row justify-content-center align-items-center">
                    <p style={{ width: 300 }} className="dark-grey-text">
                      <span className="font-weight-bold">2.</span> Audio Quality
                    </p>
                    <Rating
                      name="rating22"
                      style={{ position: "relative", bottom: 5 }}
                      className="ml-3 text-left"
                      value={Number(rating22) || 0}
                      precision={0.5}
                      onChange={handleInputChange}
                      size="large"
                      readOnly={!!notifMessage}
                    />
                  </div>
                  <div className="w-100 text-center">
                    <Notif
                      setNotifMessage={setNotifMessage}
                      notifMessage={notifMessage}
                      notifMessageType={notifMessageType}
                    />
                    <button
                      onClick={e => {
                        e.preventDefault();
                        sendrating();
                      }}
                      type="button"
                      disabled={!!notifMessage || !validRating}
                      className="btn btn-md btn-primary waves-effect mt-3"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={"alert alert-warning my-2 mx-3 w-100"}
                  role="alert"
                >
                  Sorry. You can't post feedback on this lecture.
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Dashboard;
