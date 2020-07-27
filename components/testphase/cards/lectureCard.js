/* eslint-disable react/self-closing-comp */
/* eslint-disable nonblock-statement-body-position */
//.noForMobile .noForDesktop
import React, { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { isEmpty, filter } from "lodash";
import useTimer from "@components/useTimer";
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { timeLefter, OurTimeShower, OurTimeShower2 } from "@utils/utilities";
const truncate = (n, string) => {
  if (string.length <= n) {
    return string;
  }
  const subString = string.substr(0, n - 1);
  return `${subString.substr(0, subString.lastIndexOf(" "))}...`;
};
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: "large",
    fontWeight: "bold"
  }
}));
export default ({
  subscribe,
  unsubscribe,
  user,
  data: {
    _id,
    user: owner,
    title,
    classRoom,
    duration,
    price,
    description,
    subscribers,
    startTime,
    meetingInfo,
    whatsapp,
    image,
    subject,
    keywords,
    lectureSeries,
    meetingID,
    endTime,
    name
  },
  index
}) => {
  const { push } = useRouter();
  const startDate = OurTimeShower2(startTime);
  return (
    <div key={_id} className="LectureCard">
      <div className="noForMobile timePart ">
        <span className="timePartDay">{startDate.weekday}</span>
        <span className="timeCircleTime">{startDate.time}</span>
      </div>
      <div className="noForMobile timeCircle">
        <span className="timeCircleMonth">{startDate.month}</span>
        <span className="timeCircleDay">{startDate.day}</span>
      </div>
      <div className="noForMobile infoCard">
        <div className="infoCardInner">
          <div className="infoCardA">
            <span className="lectureTitle">{title}</span>
            <span
              style={{
                display: "flex"
              }}
            >
              <span className="IndicatorNew">New</span>
              <span className="IndicatorActive">Active</span>
            </span>
          </div>
          <div className="infoCardB">
            <span
              className="lectureTutor"
              onClick={() => push(`/profile/${owner._id}`)}
            >{`By ${owner.name}`}</span>
            <span>
              <Rating
                name={`lecture${index}`}
                style={{
                  fontSize: "1.5vh",
                  marginLeft: 10
                }}
                className="ml-3 text-left"
                value={owner.rating}
                precision={0.5}
                readOnly
              />
            </span>
          </div>
          <div className="small px-3 justify-content-start align-items-center strong-grey-text py-1">
            <i className="fa fa-clock-o text-primary mr-2 " />
            <span className="strong-grey-text px-2">{`${duration} minutes`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="strong-grey-text">{`${classRoom.name}`}</span>
          </div>
          <div className="dark-grey-text w-100 px-3 text-justify small-plus">
            {truncate(180, description)}
          </div>
          <div className="d-flex flex-row justify-content-between px-3 py-1">
            <div className="dark-grey-text">
              <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start align-items-center">
                <li className="small dark-grey-text list-inline-item pr-2 white-text">
                  <i className="fa fa-clock-o text-primary mr-2" />
                  {`Starts in ${timeLefter(startTime)}`}
                </li>
                <li className="small dark-grey-text list-inline-item">
                  <span title="subscribers">
                    <i className="fa fa-users text-primary mr-2"></i>
                    {subscribers.length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={"priceEnroll"}>
            {price > 0 ? (
              <span className="px-3">
                <span
                  className=" mr-2 small"
                  style={{ color: "#555", fontWeight: "bold" }}
                >
                  <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                </span>
                {`Rs ${price.toLocaleString()}`}
              </span>
            ) : (
              <span className="text-primary px-3">FREE</span>
            )}
            <span
              onClick={() => {
                meetingInfo.running[0] === "false"
                  ? subscribers.includes(user._id)
                    ? unsubscribe(_id, subscribers)
                    : subscribe(_id, subscribers)
                  : push(`/online-class/live/${_id}`);
              }}
              className="enrollButton"
            >
              {meetingInfo.running[0] === "false"
                ? subscribers.includes(user._id)
                  ? "Unsubscribe"
                  : "ENROLL NOW"
                : " Join Lecture"}
            </span>
          </div>
        </div>
      </div>
      <div className="noForDesktop LectureCardInner">
        <div className="leftPart">
          <div className="M_">{startDate.month}</div>
          <div className="D_">{startDate.day}</div>
          <div className="WD_">{startDate.weekday}</div>
          <div className="T_">{startDate.time}</div>
        </div>
        <div className="rightPart">
          <div className="infoCardA">
            <span className="lectureTitle">{title}</span>
            <span
              style={{
                display: "flex"
              }}
            >
              <span className="IndicatorNew">New</span>
              <span className="IndicatorActive">Active</span>
            </span>
          </div>
          <div
            className="lectureTutor"
            onClick={() => push(`/profile/${owner._id}`)}
          >{`By ${owner.name}`}</div>
          <Rating
            name={`lecture${index}`}
            style={{
              fontSize: "1.5vh",
              width: "calc(100% - 2vw)"
            }}
            value={owner.rating}
            precision={0.5}
            readOnly
          />

          <div
            style={{
              width: "calc(100% - 2vw)"
            }}
            className="small justify-content-start align-items-center strong-grey-text py-1"
          >
            <i className="fa fa-clock-o text-primary mr-2 " />
            <span className="strong-grey-text px-2">{`${duration} minutes`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="strong-grey-text">{`${classRoom.name}`}</span>
          </div>
          <div className="dark-grey-text w-100 text-justify small">
            {truncate(40, description)}
          </div>
          <div
            style={{
              width: "calc(100% - 2vw)"
            }}
            className="d-flex py-1"
          >
            <div className="dark-grey-text">
              <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start align-items-center">
                <li className="small dark-grey-text list-inline-item pr-2 white-text">
                  <i className="fa fa-clock-o text-primary mr-2" />
                  {`Starts in ${timeLefter(startTime)}`}
                </li>
                <li className="small dark-grey-text list-inline-item">
                  <span title="subscribers">
                    <i className="fa fa-users text-primary mr-2"></i>
                    {subscribers.length}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={"priceEnroll"}>
            <span
              onClick={() => {
                meetingInfo.running[0] === "false"
                  ? subscribers.includes(user._id)
                    ? unsubscribe(_id, subscribers)
                    : subscribe(_id, subscribers)
                  : push(`/online-courses/live/${_id}`);
              }}
              className="enrollButton"
            >
              {meetingInfo.running[0] === "false"
                ? subscribers.includes(user._id)
                  ? "Unsubscribe"
                  : "ENROLL NOW"
                : " Join Lecture"}
            </span>
            {price > 0 ? (
              <span className="px-3">
                <span
                  className=" mr-2 small"
                  style={{ color: "#555", fontWeight: "bold" }}
                >
                  <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                </span>
                {`Rs ${price.toLocaleString()}`}
              </span>
            ) : (
              <span className="text-primary px-3">FREE</span>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .LectureCard {
          background-color: #f5f1f6;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
        .timePart {
          background-color: #fff;
        }
        .timeCircle {
          background-color: #f30004;
        }
        .infoCard {
          background-color: #ffffff;
        }
        .priceEnroll {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
        }
        .enrollButton {
          color: #fff;
          background-color: #4751a6;
        }
        @media (max-width: 768px) {
          .IndicatorNew {
            color: #fff;
            background-color: #2e47ae;
            display: flex;
            font-size: 1.3vh;
            justify-content: center;
            align-items: center;
            height: 2.5vh;
            width: 10vw;
            border-radius: 1.8vh;
          }
          .IndicatorActive {
            margin: 0 1vw;
            font-size: 1.3vh;
            height: 2.5vh;
            width: 10vw;
            border-radius: 1.8vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background-color: #169c5f;
          }
          .M_ {
            font-size: 3vh;
            font-weight: bold;
            line-height: 3vh;
          }
          .WD_ {
            font-size: 2vh;
          }
          .T_ {
            font-size: 2vh;
            font-weight: bold;
          }
          .D_ {
            font-size: 5vh;
            line-height: 5vh;
            font-weight: bold;
          }
          .LectureCard {
            display: block;
            width: 100vw;
            height: 24vh;
            background-color: #ffffff;
          }
          .LectureCardInner {
            display: flex;
            cursor: pointer;
            justify-content: space-between;
            align-items: center;
            height: 21.5vh;
            width: 100%;
            -webkit-box-shadow: 0px 4px 10px #e6e6e6;
            -moz-box-shadow: 0px 4px 10px #e6e6e6;
            box-shadow: 0px 4px 10px #e6e6e6;
          }
          .lectureTitle {
            color: #4751a6;
            font-weight: 900;
            font-size: 1.8vh;
            line-height: 2vh;
          }
          .leftPart {
            width: 30%;
            height: 100%;
            background-color: #4751a6;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .infoCardA {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .lectureTutor {
            margin-top: 0.5vh;
            font-size: 1.5vh;
            color: #888;
            width: calc(100% - 2vw);
          }
          .rightPart {
            padding: 0.5vh 1vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 70%;
            height: 100%;
          }
          .priceEnroll {
            font-weight: bold;
            color: #4751a6;
          }
          .enrollButton {
            border-radius: 1vh;
            font-size: 1vh;
            font-weight: bold;
            padding: 0.5vh 2vw;
          }
        }
        @media (min-width: 769px) {
          .IndicatorNew {
            color: #fff;
            background-color: #2e47ae;
            display: flex;
            font-size: 1vw;
            justify-content: center;
            align-items: center;
            height: 3.5vh;
            width: 3.5vw;
            border-radius: 1.8vw;
          }
          .IndicatorActive {
            margin: 0 1vw;
            font-size: 1vw;
            height: 5vw;
            width: 3.5vw;
            height: 3.5vh;
            border-radius: 1.8vw;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            background-color: #169c5f;
          }
          .lectureTutor {
            font-size: 1.5vh;
          }
          .priceEnroll {
            font-weight: bold;
            color: #4751a6;
          }
          .enrollButton {
            border-radius: 1vh;
            font-size: 1.8vh;
            font-weight: bold;
            padding: 1vh 2vw;
          }
          .infoCardA {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          }
          .lectureTitle {
            color: #4751a6;
            font-weight: 900;
            font-size: 2.8vh;
          }
          .timeCircle span {
            color: #fff;
            font-weight: bold;
          }
          .timePart span {
            color: #4751a6;
          }
          .timePartDay {
            font-weight: bold;
            font-size: 3vh;
          }
          .timeCircleTime {
            font-size: 2.8vh;
          }
          .timeCircle .timeCircleMonth {
            font-size: 3.8vh;
            line-height: 5vh;
            text-shadow: 2px 2px #000;
          }
          .timeCircle .timeCircleDay {
            font-size: 5vh;
            line-height: 6vh;
            text-shadow: 2px 2px #000;
          }
          .LectureCard {
            background-color: #ffffff;
            position: relative;
            width: 100%;
            height: 30vh;
          }
          .timePart {
            display: flex;
            width: 25%;
            height: 90%;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .timeCircle {
            position: absolute;
            top: 7.5vh;
            left: 23%;
            z-index: 3;
            width: 8vw;
            height: 8vw;
            border-radius: 4vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .infoCard {
            position: relative;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            /* -webkit-box-shadow: 0px -4px 7px #e6e6e6;
            -moz-box-shadow: 0px -4px 7px #e6e6e6;
            box-shadow: 0px -4px 7px #e6e6e6; */
            transition: 0.3s;
            border-radius: 1.5vh;
            width: 70%;
            height: 25vh;
            padding: 1% 1% 1% 7%;
          }
          .infoCardInner {
            /* background-color: #f5f1f6; */
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
};

/*<div className="ListColumn">
        <div className="ListColumnInnerImg">
          <img
            className="card-img-left"
            src={image || `/images/mathematics${index % 2}.jpg`}
            alt="Card cap"
          />
          <a
            onClick={e => {
              e.preventDefault();
              push(`/online-courses/view/${_id}`); //
            }}
          >
            <div className="mask rgba-white-slight waves-effect waves-light" />
          </a>
        </div>
        <div className="px-3 w-100 d-flex flex-column justify-content-between">
          <div className="w-100 d-flex flex-column">
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="d-flex flex-row align-items-center justify-content-between w-100">
                <h6
                  onClick={e => {
                    e.preventDefault();
                    push(`/online-courses/view/${_id}`);
                  }}
                  style={{ cursor: "pointer" }}
                  className="h6 indigo-text mt-2 text-left text-uppercase font-weight-bold"
                >
                  {title}
                </h6>
                <span className="d-flex flex-row align-items-center">
                  <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">
                    NEW
                  </span>
                  {meetingInfo.running[0] === "true" && (
                    <span className="d-table lecture-badge badge-live badge badge-pill danger-color ml-2 mr-2">
                      LIVE
                    </span>
                  )}
                </span>
              </div>
              <div className="lectureBtnArea">
                {meetingInfo.running[0] === "false" ? (
                  subscribers.includes(user._id) ? ( //ppppppppppppppppppppp
                    <button
                      onClick={e => {
                        e.preventDefault();
                        unsubscribe(_id, subscribers);
                      }}
                      type="button"
                      style={{
                        position: "relative",
                        top: 5,
                        width: 110
                      }}
                      className="btn btn-sm btn-outline-primary waves-effect m-0 px-3"
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      onClick={e => {
                        e.preventDefault();
                        subscribe(_id, subscribers); //pppppppppppppppppppp
                      }}
                      type="button"
                      style={{
                        position: "relative",
                        top: 5,
                        width: 110
                      }}
                      className="btn btn-sm btn-primary waves-effect m-0 px-3"
                    >
                      Enroll
                    </button>
                  )
                ) : (
                  <button
                    onClick={e => {
                      e.preventDefault();
                      push(`/online-courses/live/${_id}`);
                    }}
                    type="button"
                    style={{
                      position: "relative",
                      top: 5,
                      width: 110
                    }}
                    className="btn btn-sm btn-primary waves-effect m-0 px-3"
                  >
                    Join Lecture
                  </button>
                )}
              </div>
            </div>
            <div className="small justify-content-start align-items-center strong-grey-text">
              <span
                onClick={() => push(`/profile/${owner._id}`)}
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
              <div className="small renderAtDesktop justify-content-start align-items-center strong-grey-text py-1">
                <i className="fa fa-clock-o text-primary mr-2" />
                <span className="strong-grey-text">{`${duration} minutes`}</span>
              </div>
              <span className="mx-2 strong-grey-text"> </span>
              <div className="small renderAtDesktop justify-content-start align-items-center strong-grey-text py-1">
                <i className="fa fa-graduation-cap text-primary mr-2" />
                <span className="strong-grey-text">{`${classRoom.name}`}</span>
              </div>
            </div>
            <div className="renderAtMobile">
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
                    <i className="fa fa-users mr-2 text-primary"></i>
                    {subscribers.length}
                  </span>
                </li>
                {whatsapp && (
                  <li className="small dark-grey-text list-inline-item renderAtDesktop">
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
                      />
                      join group
                    </a>
                  </li>
                )}
                <li className="small dark-grey-text list-inline-item renderAtDesktop">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://schoolx.pk/online-courses/view/${_id}`
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
                    />
                    link
                  </button>
                </li>
                <li className="small dark-grey-text list-inline-item renderAtDesktop">
                  {copied[`lecture${_id}`] && (
                    <p style={{ color: "green" }} className="small mb-0">
                      Link copied!
                    </p>
                  )}
                </li>
              </ul>
            </div>
            <div className="renderAtDesktop">
              {price > 0 && (
                <span className="text-primary">
                  <span className="strong-grey-text mr-2 small">
                    <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                  </span>
                  {`Rs ${price.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>
          <div className="renderAtMobile justify-content-between py-1">
            <div className="dark-grey-text">
              <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start align-items-center">
                {whatsapp && (
                  <li className="small dark-grey-text list-inline-item ">
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
                      />
                      join group
                    </a>
                  </li>
                )}
                <li className="small dark-grey-text list-inline-item ">
                  <button
                    onClick={() => {
                      // navigator.clipboard.writeText(
                      //   `https://schoolx.pk/online-courses/view/${_id}`
                      // );
                      navigator.share({
                        title: "SchoolX",
                        text: "Share the lecture",
                        url: `https://schoolx.pk/online-courses/view/${_id}`
                      });
                      // handleCopy(`lecture${_id}`);
                    }}
                    rel="noopener noreferrer"
                    type="button"
                    style={{ color: "#fff" }}
                    className="btn btn-sm btn-info waves-effect m-0 px-2 py-1"
                  >
                    <i
                      style={{ fontSize: ".7rem" }}
                      className="fa fa-clone mr-1"
                    />
                    link
                  </button>
                </li>
                <li className="small dark-grey-text list-inline-item ">
                  {copied[`lecture${_id}`] && (
                    <p style={{ color: "green" }} className="small mb-0">
                      Link copied!
                    </p>
                  )}
                </li>
              </ul>
            </div>
            <div className="">
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

          <div className="lectureBtnAreaB">
            {meetingInfo.running[0] === "false" ? (
              subscribers.includes(user._id) ? (
                <button
                  onClick={e => {
                    e.preventDefault();
                    unsubscribe(_id, subscribers);
                  }}
                  type="button"
                  style={{
                    position: "relative",
                    top: 5,
                    width: 110
                  }}
                  className="btn btn-sm btn-outline-primary waves-effect m-0 px-3"
                >
                  Unsubscribe
                </button>
              ) : (
                <button
                  onClick={e => {
                    e.preventDefault();
                    subscribe(_id, subscribers);
                  }}
                  type="button"
                  style={{
                    position: "relative",
                    top: 5,
                    width: 110
                  }}
                  className="btn btn-sm btn-primary waves-effect m-0 px-3"
                >
                  Enroll
                </button>
              )
            ) : (
              <button
                onClick={e => {
                  e.preventDefault();
                  push(`/online-courses/live/${_id}`);
                }}
                type="button"
                style={{
                  position: "relative",
                  top: 5,
                  width: 110
                }}
                className="btn btn-sm btn-primary waves-effect m-0 px-3"
              >
                Join Lecture
              </button>
            )}
          </div>
        </div>
      </div>
    */
