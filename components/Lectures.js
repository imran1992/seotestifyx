import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import useInput from "@components/useInput";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notif from "@components/Notif";
import Rating from "@material-ui/lab/Rating";
import Head from "next/head";

import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useDispatch, useSelector } from "react-redux";
import { timeLefter } from "@utils/utilities";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lectures, setLectures] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [filteredLectures, setfilteredLectures] = useState([]);
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

  const truncate = (n, string = "") => {
    if (string.length <= n) {
      return string;
    }
    const subString = string.substr(0, n - 1);
    return `${subString.substr(0, subString.lastIndexOf(" "))}...`;
  };

  const user = useSelector(({ USER }) => USER.user);
  let qry = user.role == "admin" ? `{}` : `{teacherId:"${user._id}"}`;
  const GET_LECTURES = gql`
  {
    findLecture(query: ${qry}) {
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
    }
  }
  `;

  const { error, data, fetchMore, networkStatus, client, variables } = useQuery(
    GET_LECTURES,
    {
      variables: { __skip: 0, __limit: 30 },
      // notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (user.role === "student") {
      Router.push("/online-class");
    }
  }, []);

  useEffect(() => {
    console.log(data, "data list id ", variables);
    if (data) {
      console.log(data, "data of lectures");
      if (data.findLecture && data.findLecture) {
        setfilteredLectures(
          data.findLecture.filter(
            (item) => timeLefter(item.startTime) != "Expired"
          )
        );
        setLectures(data.findLecture);
      }
    }
  }, [data]);

  const onChange = (value) => {
    if (value) {
      setfilteredLectures(lectures);
    } else {
      setfilteredLectures(
        data.findLecture.filter(
          (item) => timeLefter(item.startTime) != "Expired"
        )
      );
    }
    setShowAll(value);
  };

  return (
    <main
      className={
        !user.role || user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
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
      <div className="container-fluid">
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />

        <div
          className="row dashHeading rounded"
          style={{ justifyContent: "space-between" }}
        >
          <div className="50vh margin-0 ">
            <h2 className="h6" style={{ marginTop: 16 }}>
              Lectures
            </h2>
          </div>
          <div className="50vh margin-0" style={{ float: "right" }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                Router.push("/online-class/add");
              }}
              className="btn btn-primary waves-effect waves-light"
            >
              Add a lecture
            </button>
          </div>
        </div>
        <div>
          {" "}
          <FormControlLabel
            control={
              <Checkbox
                checked={showAll}
                onChange={(e) => onChange(e.target.checked)}
                name="show-all"
              />
            }
            label="Show all Lectures"
          />
        </div>
        <div className="row pb-5">
          {!isEmpty(filteredLectures) ? (
            filteredLectures.length ? (
              filteredLectures.map(
                (
                  {
                    _id,
                    tutor: owner,
                    teacherId,
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
                    meetingID,
                    meetingInfo,
                    endTime,
                    name,
                    whatsapp,
                    image,
                  },
                  index
                ) => {
                  const foundLectures = filter(
                    lectures.data,
                    (found) => found.lectureSeries === _id
                  );
                  const specificLectures = foundLectures
                    ? foundLectures.length
                    : 0;

                  const options = {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  };
                  const date = new Date(startTime);
                  const startDate = `${date.toLocaleDateString(
                    "en-US",
                    options
                  )} ${date.toLocaleTimeString("en-US")}`;

                  return (
                    <div key={_id} className="col-md-12 mt-3">
                      <div className="card card-cascade horizontal shadow-sm d-flex flex-row">
                        <div className="view overlay horizontal">
                          <img
                            className="card-img-left"
                            src={image || `/images/mathematics${index % 2}.jpg`}
                            alt="Card cap"
                          />
                          <a
                            href=""
                            onClick={(e) => {
                              e.preventDefault();
                              Router.push(`/online-class/${_id}`);
                            }}
                          >
                            <div className="mask rgba-white-slight waves-effect waves-light" />
                          </a>
                        </div>
                        <div className="px-3 w-100 d-flex flex-column justify-content-between">
                          <div className="w-100 d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between align-items-center">
                              <div className="d-flex flex-row align-items-center">
                                <h6
                                  onClick={(e) => {
                                    e.preventDefault();
                                    Router.push(`/online-class/${_id}`);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="h6 indigo-text mt-2 text-left text-uppercase font-weight-bold"
                                >
                                  {name}{" "}
                                </h6>
                                <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">
                                  NEW
                                </span>
                                {!(index % 2) ? (
                                  <span className="d-table lecture-badge badge-live badge badge-pill danger-color ml-2 mr-2">
                                    LIVE
                                  </span>
                                ) : null}
                              </div>
                              <div className="subscription d-flex flex-column">
                                {teacherId === user._id &&
                                meetingInfo.running[0] === "false" ? (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      Router.push(`/online-class/live/${_id}`);
                                    }}
                                    type="button"
                                    style={{
                                      position: "relative",
                                      top: 5,
                                      width: 110,
                                    }}
                                    className="btn btn-sm btn-primary waves-effect m-0 px-3"
                                  >
                                    {endTime
                                      ? "Restart lecture"
                                      : "Start lecture"}
                                  </button>
                                ) : null}
                              </div>
                            </div>
                            <div className="small justify-content-start align-items-center strong-grey-text">
                              <span
                                onClick={() =>
                                  Router.push(`/profile/${teacherId}`)
                                }
                                style={{ cursor: "pointer" }}
                              >{` By ${owner ? owner.name : ""}`}</span>
                              <Rating
                                name={`lecture${index}`}
                                style={{
                                  fontSize: ".9rem",
                                  position: "relative",
                                  bottom: -2,
                                }}
                                className="ml-3 text-left"
                                value={owner ? owner.rating : ""}
                                precision={0.5}
                                readOnly
                              />
                            </div>
                            <div className="d-flex flex-row">
                              <div className="small justify-content-start align-items-center py-1">
                                <i className="fa fa-calendar text-primary mr-2" />
                                <span className="strong-grey-text">{` ${startDate}`}</span>
                              </div>
                              <span className="mx-2 strong-grey-text"> </span>
                              <div className="small justify-content-start align-items-center strong-grey-text py-1">
                                <i className="fa fa-clock-o text-primary mr-2" />
                                <span className="strong-grey-text">{`${duration} minutes`}</span>
                              </div>
                              <span className="mx-2 strong-grey-text"> </span>
                              <div className="small justify-content-start align-items-center strong-grey-text py-1">
                                <i className="fa fa-graduation-cap text-primary mr-2" />
                                <span className="strong-grey-text">{`${
                                  classRoom ? classRoom.name : ""
                                }`}</span>
                              </div>
                            </div>
                            <div className="dark-grey-text w-100 px-3 text-justify small-plus">
                              {truncate(180, description)}
                            </div>
                          </div>
                          <div className="d-flex flex-row justify-content-between py-1">
                            <div className="dark-grey-text">
                              <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start align-items-center">
                                <li className="small dark-grey-text list-inline-item pr-2 white-text">
                                  <i className="fa fa-clock-o text-primary mr-2" />
                                  {`Starts in ${timeLefter(startTime)}`}
                                </li>
                                <li className="small dark-grey-text list-inline-item">
                                  <span title="subscribers">
                                    <i className="fa fa-users mr-2 text-primary">
                                      {" "}
                                    </i>
                                    {subscribers ? subscribers.length : 30}
                                  </span>
                                </li>
                                <li className="small dark-grey-text list-inline-item">
                                  {whatsapp ? (
                                    <a
                                      href={whatsapp}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      type="button"
                                      style={{ color: "#fff" }}
                                      className="btn btn-sm btn-info waves-effect m-0 px-2 py-1"
                                    >
                                      <i
                                        style={{ fontSize: ".7rem" }}
                                        className="fa fa-whatsapp mr-1"
                                      />{" "}
                                      join group
                                    </a>
                                  ) : null}
                                </li>
                                <li className="small dark-grey-text list-inline-item">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `https://schoolx.pk/online-class/${_id}`
                                      );
                                      handleCopy(`lecture${_id}`);
                                    }}
                                    rel="noopener noreferrer"
                                    type="button"
                                    style={{ color: "#fff" }}
                                    className="btn btn-sm btn-info waves-effect m-0 px-2 py-1"
                                  >
                                    <i
                                      style={{ fontSize: ".7rem" }}
                                      className="fa fa-clone mr-1"
                                    />{" "}
                                    link
                                  </button>
                                </li>
                                <li className="small dark-grey-text list-inline-item">
                                  {copied[`lecture${_id}`] ? (
                                    <p
                                      style={{ color: "green" }}
                                      className="small mb-0"
                                    >
                                      Link copied!
                                    </p>
                                  ) : null}
                                </li>
                              </ul>
                            </div>
                            <div className="">
                              {price > 0 ? (
                                <span className="text-primary">
                                  <span className="strong-grey-text mr-2 small">
                                    <del>{`Rs ${(
                                      price * 2
                                    ).toLocaleString()}`}</del>
                                  </span>
                                  {`Rs ${price.toLocaleString()}`}
                                </span>
                              ) : (
                                <span className="text-primary">FREE</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className={"alert alert-info w-100 my-3"} role="alert">
                There is no results based on your filters.
              </div>
            )
          ) : (
            <div className="w-100">
              <div
                style={{ height: "100px" }}
                className="d-flex justify-content-center align-items-center w-100"
              >
                <CircularProgress className="text-primary position-relative" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
export default withApollo(Dashboard);
