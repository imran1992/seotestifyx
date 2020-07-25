import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLecture, updateLecture } from "@utils/API";
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
  WhatsappIcon,
} from "react-share";

import nextCookie from "next-cookies";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lecture, setLecture] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [copied, setCopied] = useState(false);
  const { slug } = query;
  const user = useSelector(({ USER }) => USER.user);

  const handleCopy = (id) => {
    setCopied({ [id]: true });
    setTimeout(() => {
      setCopied({ [id]: false });
    }, 3000);
  };

  const {
    _id,
    tutor: owner,
    name,
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
    image,
    rating,
  } = lecture;

  const shareUrl = `https://schoolx.pk/online-class/${_id}`;

  const removeLecture = () => {
    setLoading(true);
    deleteLecture(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setNotifMessage(
          "Lecture successfully deleted. You are being redirected to lectures page."
        );
        setNotifMessageType("success");
        setTimeout(() => {
          Router.push("/online-class/mylectures");
        }, 3000);
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

  useEffect(() => {
    // getLecture(slug).then(response => {
    //   const { ok, data, problem } = response;
    //   if (ok) {
    //     setLecture(data);
    //   } else {
    //     setNotifMessageType("error");
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    // });
  }, []);

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
      recorded_url
      classRoom{
        _id
        name
      }
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
    }
  }, [data]);

  return (
    <main
      className={
        user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
      <Head>
        <title>
          {title} | SchoolX, the leading online learning platform in Pakistan
        </title>
        <meta
          property="og:image"
          content={image || "/images/mathematics0.jpg"}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
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
              <div className="d-flex flex-column pb-5">
                <div className="lectureHeading rounded w-100 d-flex flex-column justify-content-around px-3">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                      <h2 className="h4 w-100 m-0 my-4">{name}</h2>
                      <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">
                        NEW
                      </span>
                      <span className="d-table lecture-badge badge-live badge badge-pill danger-color ml-2 mr-2">
                        LIVE
                      </span>
                    </div>
                    <div className="subscription d-flex flex-column align-items-end">
                      {owner._id === user._id && meetingInfo ? (
                        
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              Router.push(`/online-class/live/${_id}`);
                            }}
                            type="button"
                            style={{ position: "relative", top: 5, width: 110 }}
                            className="btn btn-sm btn-primary waves-effect m-0 px-3"
                          >
                            {endTime ? "Restart lecture" : "Start lecture"}
                          </button>
                        
                      ) : null}
                      {(user.role === "teacher" && user._id === owner._id) ||
                      user.role === "admin" ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              Router.push("/online-class/edit/" + slug);
                            }}
                            type="button"
                            style={{
                              position: "relative",
                              top: 10,
                              width: 110,
                            }}
                            className="btn btn-sm btn-success waves-effect m-0 px-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setDialogOpen(true);
                            }}
                            type="button"
                            style={{
                              position: "relative",
                              top: 15,
                              width: 110,
                            }}
                            className="btn btn-sm btn-danger waves-effect m-0 px-3"
                          >
                            Remove
                          </button>
                        </>
                      ) : null}
                      {whatsapp ? (
                        <a
                          href={whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          type="button"
                          style={{
                            position: "relative",
                            top: 20,
                            color: "#fff",
                            width: 110,
                          }}
                          className="btn btn-sm btn-info waves-effect m-0 px-3"
                        >
                          <i
                            style={{ fontSize: ".9rem" }}
                            className="fa fa-whatsapp mr-1"
                          />{" "}
                          group
                        </a>
                      ) : null}
                      <div
                        style={{ position: "relative", top: 25 }}
                        className="d-flex flex-row align-items-center"
                      >
                        {copied[_id] ? (
                          <p
                            style={{ color: "green" }}
                            className="small mb-0 mr-2"
                          >
                            Link copied!
                          </p>
                        ) : null}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            handleCopy(_id);
                          }}
                          rel="noopener noreferrer"
                          type="button"
                          style={{ color: "#fff", width: 110 }}
                          className="btn btn-sm btn-info waves-effect m-0 px-2"
                        >
                          Invite friends
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="small-plus justify-content-start align-items-center dark-grey-text">
                      <span
                        onClick={() => Router.push(`/profile/${owner._id}`)}
                        style={{ cursor: "pointer" }}
                      >{` By ${owner.name}`}</span>
                      <Rating
                        name="lecture"
                        style={{
                          fontSize: "1rem",
                          position: "relative",
                          bottom: -2,
                        }}
                        className="ml-3 text-left"
                        value={rating || 4}
                        precision={0.5}
                        readOnly
                      />
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
                      {/* <div className="small-plus justify-content-start align-items-center dark-grey-text">
                        <i className="fa fa-users text-primary mr-2" />
                        <span className="dark-grey-text">
                          {subscribers ? subscribers.length : ''}
                        </span>
                      </div> */}
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
                  About this lecture
                </h2>
                <div className="px-2 text-justify dark-grey-text">
                  {description}
                </div>
                <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                  Requirements
                </h2>
                <div className="px-2 text-justify dark-grey-text">
                  <ul className="udlite-block-list">
                    {!requirements ? (
                      <li>No requirements.</li>
                    ) : (
                      requirements.split(/\r?\n/).map((req) => <li>{req}</li>)
                    )}
                  </ul>
                </div>
                <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                  What you will learn
                </h2>
                <div className="px-2 dark-grey-text">
                  <ul className="udlite-block-list">
                    {!learnDescription ? (
                      <li>Not specified.</li>
                    ) : (
                      learnDescription
                        .split(/\r?\n/)
                        .map((req) => <li>{req}</li>)
                    )}
                  </ul>
                </div>
                <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                  Keywords
                </h2>
                <div className="px-2 text-justify dark-grey-text">
                  {keywords
                    ? keywords.split(",").map((keyword) => (
                        <div
                          key={keyword}
                          className="chip waves-effect waves-effect"
                        >
                          {keyword}
                        </div>
                      ))
                    : null}
                </div>
                <h2 className="h6 w-100 rounded p-2 mt-3 mb-3 dashHeading">
                  <div className="w-100 d-flex flex-row justify-content-start">
                    <EmailShareButton
                      className="mr-2"
                      url={shareUrl}
                      subject={title}
                      body={description}
                    >
                      {" "}
                      <EmailIcon size={32} round />{" "}
                    </EmailShareButton>
                    <FacebookShareButton
                      className="mr-2"
                      url={shareUrl}
                      quote={title}
                      hashtag="#schoolx"
                    >
                      {" "}
                      <FacebookIcon size={32} round />{" "}
                    </FacebookShareButton>
                    <InstapaperShareButton
                      className="mr-2"
                      url={shareUrl}
                      title={title}
                    >
                      {" "}
                      <InstapaperIcon size={32} round />{" "}
                    </InstapaperShareButton>
                    <LinkedinShareButton
                      className="mr-2"
                      url={shareUrl}
                      title={title}
                    >
                      {" "}
                      <LinkedinIcon size={32} round />{" "}
                    </LinkedinShareButton>
                    <TelegramShareButton
                      className="mr-2"
                      url={shareUrl}
                      title={title}
                    >
                      {" "}
                      <TelegramIcon size={32} round />{" "}
                    </TelegramShareButton>
                    <TwitterShareButton
                      className="mr-2"
                      url={shareUrl}
                      title={title}
                    >
                      {" "}
                      <TwitterIcon size={32} round />{" "}
                    </TwitterShareButton>
                    <WhatsappShareButton
                      className="mr-2"
                      url={shareUrl}
                      separator=": "
                      title={title}
                    >
                      {" "}
                      <WhatsappIcon size={32} round />{" "}
                    </WhatsappShareButton>
                  </div>
                </h2>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={removeLecture}
        dialogMessage="Do you really want to delete this lecture ?"
      />
    </main>
  );
};

export default withApollo(Dashboard);
