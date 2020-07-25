import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import useInput from "@components/useInput";
import CircularProgress from "@material-ui/core/CircularProgress";
import Slider from "react-slick";
import Rating from "@material-ui/lab/Rating";
import Head from "next/head";
import nextCookie from "next-cookies";
import Notif from "@components/Notif";

import { useDispatch, useSelector } from "react-redux";
import {
  getPublicLectures,
  updateLecture,
  getPublicLectureSeries,
  updateLectureSerie
} from "@utils/API";
import { timeLefter } from "@utils/utilities";

const DashboardReal = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lectures, setLectures] = useState({});
  const [lectureseries, setLectureseries] = useState([]);
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({});
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");

  const handleCopy = id => {
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

  const user = useSelector(({ USER }) => USER.user);

  const { category, time, price, status } = input;

  let filteredLectures = !isEmpty(lectures.data)
    ? category !== "courses"
      ? orderBy(lectures.data, object => new Date(object.startTime), ["desc"])
      : orderBy(lectureseries.data, object => new Date(object.startTime), [
          "desc"
        ])
    : [];

  if (category !== "courses") {
    if (price) {
      switch (price) {
        case "free":
          filteredLectures = filter(
            filteredLectures,
            found => found.price === 0
          );
          break;
        case "0-1000":
          filteredLectures = filter(
            filteredLectures,
            found => found.price < 1001 && found.price > 0
          );
          break;
        case "1000-2000":
          filteredLectures = filter(
            filteredLectures,
            found => found.price < 2001 && found.price > 1000
          );
          break;
        case "2000+":
          filteredLectures = filter(
            filteredLectures,
            found => found.price > 2000
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
            found => found.meetingInfo.running[0] === "true"
          );
          break;
        case "thisweek":
          filteredLectures = filter(
            filteredLectures,
            found =>
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
            object => new Date(object.startTime),
            ["asc"]
          );
          break;
        case "farthest":
          filteredLectures = orderBy(
            filteredLectures,
            object => new Date(object.startTime),
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
          object => new Date(object.startTime),
          ["desc"]
        );
        break;
      case "farthest":
        filteredLectures = orderBy(
          filteredLectures,
          object => new Date(object.createdAt),
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

  useEffect(() => {
    getPublicLectures().then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        setLectures(data);
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getPublicLectureSeries().then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        setLectureseries(data);
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  if (user.role === "student") {
    Router.push("/online-class");
    return <div />;
  }
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
        <meta property="og:title" content='Courses & lectures' />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>
      <div className="container-fluid mt-5">
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <div className="row">
          <h2 className="h6 w-100 rounded p-2 mt-2 mb-3 dashHeading">
            All lectures available to students
          </h2>
        </div>
        <div className="row px-3">
          <div className="filterDiv w-100 rounded p-3">
            <p className="text-primary w-100 mb-0 ">
              Showing {filteredLectures.length} {category || "lectures"}
            </p>
            <div className="w-100 d-flex">
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
                    {" "}
                    Category: Lectures{" "}
                  </MenuItem>
                  <MenuItem name="category" value="courses">
                    {" "}
                    Category: Courses{" "}
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
                    {" "}
                    {category !== "courses"
                      ? "Sort: Nearest"
                      : "Sort: Newest"}{" "}
                  </MenuItem>
                  <MenuItem name="time" value="farthest">
                    {" "}
                    {category !== "courses"
                      ? "Sort: Farthest"
                      : "Sort: Oldest"}{" "}
                  </MenuItem>
                </Select>
              </FormControl>
              {category !== "courses" ? (
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
                      {" "}
                      Price : Free{" "}
                    </MenuItem>
                    <MenuItem name="price" value="0-1000">
                      {" "}
                      Price : Under Rs 1,000{" "}
                    </MenuItem>
                    <MenuItem name="price" value="1000-2000">
                      {" "}
                      Price : Between Rs 1,000 et Rs 2,000{" "}
                    </MenuItem>
                    <MenuItem name="price" value="2000+">
                      {" "}
                      Price : More than Rs 2,000{" "}
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              {category !== "courses" ? (
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
                      {" "}
                      Happening now{" "}
                    </MenuItem>
                    <MenuItem name="status" value="thisweek">
                      {" "}
                      Happening this week{" "}
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              <button
                type="submit"
                disabled={isEmpty(input)}
                onClick={e => {
                  e.preventDefault();
                  resetFilters();
                }}
                style={{ width: 220, height: 40 }}
                className="btn btn-primary btn-rounded btn-sm waves-effect waves-light"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <div className="row pb-5">
          {!isEmpty(lectures) ? (
            filteredLectures.length ? (
              filteredLectures.map(
                (
                  {
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
                    meetingID,
                    meetingInfo,
                    endTime,
                    name,
                    whatsapp,
                    image
                  },
                  index
                ) => {
                  const foundLectures = filter(
                    lectures.data,
                    found => found.lectureSeries === _id
                  );
                  const specificLectures = foundLectures
                    ? foundLectures.length
                    : 0;

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

                  if (category === "courses") {
                    return (
                      <div key={_id} className="col-md-12 mt-3">
                        <div className="card card-cascade horizontal shadow-sm d-flex flex-row">
                          <div className="view overlay horizontal">
                            <img
                              className="card-img-left"
                              src={
                                image || `/images/mathematics${index % 2}.jpg`
                              }
                              alt="Card cap"
                            />
                            <a
                              href=""
                              onClick={e => {
                                e.preventDefault();
                                Router.push(`/online-course/${_id}`);
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
                                    onClick={e => {
                                      e.preventDefault();
                                      Router.push(`/online-course/${_id}`);
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
                                <div className="subscription" />
                              </div>
                              <div className="small justify-content-start align-items-center strong-grey-text">
                                <span
                                  onClick={() =>
                                    Router.push(`/profile/${owner._id}`)
                                  }
                                  style={{ cursor: "pointer" }}
                                >{` By ${owner.name}`}</span>
                                <Rating
                                  name={`lecture${index}`}
                                  style={{
                                    fontSize: ".9rem",
                                    position: "relative",
                                    bottom: -2
                                  }}
                                  className="ml-3 text-left"
                                  value={owner.rating}
                                  precision={0.5}
                                  readOnly
                                />
                              </div>
                              <div className="d-flex flex-row">
                                <div className="small justify-content-start align-items-center strong-grey-text py-1">
                                  <i className="fa fa-book text-primary mr-2" />
                                  <span className="strong-grey-text">
                                    {subject.name}
                                  </span>
                                </div>
                                <span className="mx-2 strong-grey-text"> </span>
                                <div className="small justify-content-start align-items-center strong-grey-text py-1">
                                  <i className="fa fa-graduation-cap text-primary mr-2" />
                                  <span className="strong-grey-text">{`${
                                    classRoom ? classRoom.name : "A Level"
                                  }`}</span>
                                </div>
                              </div>
                              <div className="dark-grey-text w-100 px-3 text-justify small-plus">
                                {description
                                  ? truncate(180, description)
                                  : "This course is for students that want to learn mathematics every tuesday."}
                              </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between py-1">
                              <div className="dark-grey-text">
                                <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start">
                                  <li
                                    onClick={e => {
                                      e.preventDefault();
                                      Router.push(`/online-course/${_id}`);
                                    }}
                                    className="small dark-grey-text list-inline-item pr-2 white-text scheduled"
                                  >
                                    <i className="fa fa-th text-primary mr-2" />
                                    {specificLectures}{" "}
                                    {specificLectures > 1
                                      ? "lectures"
                                      : "lecture"}
                                  </li>
                                  <li className="small dark-grey-text list-inline-item">
                                    <span title="subscribers">
                                      <i className="fa fa-users mr-2 text-primary">
                                        {" "}
                                      </i>
                                      {subscribers.length}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                              <div className="">
                                {price ? (
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
                            onClick={e => {
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
                                  onClick={e => {
                                    e.preventDefault();
                                    Router.push(`/online-class/${_id}`);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  className="h6 indigo-text mt-2 text-left text-uppercase font-weight-bold"
                                >
                                  {title}{" "}
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
                                {owner._id === user._id &&
                                meetingInfo.running[0] === "false" ? (
                                  <button
                                    onClick={e => {
                                      e.preventDefault();
                                      Router.push(`/online-class/live/${_id}`);
                                    }}
                                    type="button"
                                    style={{
                                      position: "relative",
                                      top: 5,
                                      width: 110
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
                                  Router.push(`/profile/${owner._id}`)
                                }
                                style={{ cursor: "pointer" }}
                              >{` By ${owner.name}`}</span>
                              <Rating
                                name={`lecture${index}`}
                                style={{
                                  fontSize: ".9rem",
                                  position: "relative",
                                  bottom: -2
                                }}
                                className="ml-3 text-left"
                                value={owner.rating}
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
                                <span className="strong-grey-text">{`${classRoom.name}`}</span>
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
                                    {subscribers.length}
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
DashboardReal.getInitialProps = async ctx => {
  const { pathname } = ctx;
  const { slug } = ctx.query;
  const returnto = pathname.replace("[slug]", slug);
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, { Location: `/login?returnto=${returnto}` }).end();
  } else if (!Authorization) {
    document.location.pathname = `/login?returnto=${returnto}`;
  } else return { Authorization };
};
export default DashboardReal;
