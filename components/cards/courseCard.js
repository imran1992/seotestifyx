/* eslint-disable arrow-parens */
/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable nonblock-statement-body-position */
import React, { useState, Fragment } from "react";
import { useRouter } from "next/router";
import { isEmpty, filter, orderBy } from "lodash";
import { Rating } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { enrollToCourse } from "@utils/API";
import { timeLefter, OurTimeShower, OurTimeShower2 } from "@utils/utilities";
const truncate = (n, string) => {
  if (string.length <= n) {
    return string;
  }
  const subString = string.substr(0, n - 1);
  return `${subString.substr(0, subString.lastIndexOf(" "))}...`;
};

export default ({
  lectures,
  EnrollToCourse,
  subscribeCourse,
  unsubscribeCourse,
  owner,
  user,
  data: {
    _id,
    // user: owner,
    classRoom,
    price,
    description,
    subscribers,
    startTime,
    subject,
    name,
    tests,
    meetingInfo,
    whatsapp,
    keywords,
    duration,
    image,
    title,
    lectureSeries,
    meetingID,
    endTime,
  },
  index,
}) => {
  const { push } = useRouter();
  const foundLectures = filter(
    lectures.data,
    (found) => found.lectureSeries === _id
  );
  const specificLectures = foundLectures ? foundLectures.length : 0;
  const startDate = OurTimeShower(startTime);
  console.log(subscribers, subscribers.includes(user._id), 'data liset 34576', user)
  return (
    <div key={_id} className={`CourseCard ${index === 0 ? "firstCard" : ""}`}>
      <span
        className={`noForDesktop`}
        style={{
          width: "100%",
          zIndex: 5,
          position: "absolute",
          height: "100%",
        }}
        onClick={() => {
          push(`/online-course/${_id}`);
        }}
      ></span>
      <div className={`CourseCardInner`}>
        <div className="CourseCardInnerMore">
          <div className="CardTopHead">
            <span
              className="CourseName HoverAble"
              onClick={(e) => {
                e.preventDefault();
                push(`/online-course${_id}`);
              }}
            >
              <p>{name}</p>
            </span>
            <span className="CourseIndicator">
              <span className="IndicatorActive">Active</span>
            </span>
          </div>
          <div className="infoCardA">
            <span
              className="lectureTutor HoverAble"
              onClick={() => push(`/profile/${owner._id}`)}
            >{`By ${owner && owner.fullName ? owner.fullName : ''}`}</span>
            <span>
              <Rating
                name={`lecture${index}`}
                style={{
                  fontSize: "2vh",
                  marginLeft: 10,
                }}
                className="ml-3 text-left"
                value={owner.rating ? owner.rating : 5}
                precision={0.5}
                readOnly
              />
            </span>
          </div>
          <div className="infoCardB">
            <i className="fa fa-book text-primary mr-2" />
            <span className="courseSubject">{`${
              subject ? subject.name : "Mathematics"
              }`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="courseClass">
              {`${classRoom ? classRoom.name : "A Level"}`}
            </span>
          </div>
          <div className="infoCardC">
            <p className="desc">{description}</p>
          </div>
          <div className="infoCardD">
            <span>
              <i className="fa fa-book text-primary mr-2"></i>
              <span className="courseSubject">{`${"19"} Lectures`}</span>
              <i className="fa fa-users text-primary mr-2"></i>
              <span className="courseClass">{subscribers.length}</span>
            </span>
            {price && (
              <span className="price">
                <span className="strong-grey-text mr-2 small">
                  <del>{`Rs: ${(price * 2).toLocaleString()}/-`}</del>
                </span>
                {`Rs: ${price.toLocaleString()}`}
              </span>
            )}
          </div>
          <div className="infoCardE">
            <span>
              <i className="fa fa-clipboard text-primary mr-2"></i>
              <span className="courseSubject">{`${"7"} quizzes`}</span>
              <i className="fa fa-file-video-o text-primary mr-2"></i>
              <span className="courseClass">{`${"5"} videos`}</span>
            </span>
          </div>
        </div>
        <div
          className="infoCardBtnCont HoverAble"
          onClick={() => {
            !subscribers.includes(user._id) && EnrollToCourse(_id);
          }}
        >
          {/* <div
            className="infoCardBtn HoverAble"
            // onClick={() => {
            //   !subscribers.includes(user._id) && EnrollToCourse(_id);
            // }}
          >
            {subscribers.includes(user._id)
              ? "ALREADY ENROLLED"
              : "ENROLL FOR FREE TRIAL"}
          </div> */}
          <button
            className={`infoCardBtn${
              !subscribers.includes(user._id)
                ? " HoverAble waves-light waves-effect"
                : " disabledbtn"
              }`}
          // onClick={() => {
          //   !subscribers.includes(user._id) && EnrollToCourse(_id);
          // }}
          >
            {subscribers.includes(user._id)
              ? "ALREADY ENROLLED"
              : "ENROLL FOR FREE TRIAL"}
          </button>
        </div>
        <img
          src={"/images/courseImage.jpg"}
          className={"courseImage HoverAble"}
          onClick={(e) => {
            e.preventDefault();
            push(`/online-course/${_id}`);
          }}
        />
        <div className={"courseInfoDK"}>
          <p
            className="courseTitle HoverAble"
            onClick={(e) => {
              e.preventDefault();
              push(`/online-course/${_id}`);
            }}
          >
            {name}
          </p>
          <div className="infoCardA">
            <span>
              <span
                className="lectureTutor HoverAble small-plus"
                onClick={() => push(`/profile/${owner._id}`)}
              >{`By ${owner && owner.fullName ? owner.fullName : ""}`}</span>
              <span>
                <Rating
                  name={`lecture${index}`}
                  style={{
                    fontSize: "1.8vh",
                    marginLeft: 10,
                  }}
                  className="ml-3 text-left"
                  value={owner.rating ? owner.rating : 5}
                  precision={0.5}
                  readOnly
                />
              </span>
            </span>
          </div>
          <div className="infoCardB">
            <i className="fa fa-book text-primary mr-2" />
            <span className="courseSubject small-plus">{`${
              subject ? subject.name : "Mathematics"
              }`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="courseClass small-plus">
              {`${classRoom ? classRoom.name : "A Level"}`}
            </span>
            <i className="fa fa-clipboard  text-primary mr-2"></i>
            <span style={{
              cursor: "pointer",
            }} className="courseClass hoverAble small-plus" onClick={() => push(`/tests/${_id}`)}>{tests ? tests.length : 0} online tests</span>
            <i className="fa fa-users text-primary mr-2"></i>
            <span className="courseClass small-plus">{subscribers.length}</span>
          </div>
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.preventDefault();
              push(`/online-course/${_id}`);
            }}
            className="infoCardC small-plus "
          >
            <p className="truncate-overflow">{description}</p>
            <div
              style={{
                justifyContent: "flex-end",
                display: "flex",
                marginBottom: "1rem",
              }}
            >
              <span>...More</span>
            </div>
          </div>

          <div className="infoCardD">
            <span>
              {price && (
                <span className="price">
                  <span className="strong-grey-text mr-4">
                    <del>{`Rs: ${(price * 2).toLocaleString()}/-`}</del>
                  </span>
                  {`Rs: ${price.toLocaleString()}`}
                </span>
              )}
            </span>
            <span>
              <button
                className={`EnrollerBtn${
                  !subscribers.includes(user._id)
                    ? " HoverAble waves-light waves-effect"
                    : " disabledbtn"
                  }`}
                onClick={(e) => {
                  //push(`/lectureseries/view/${_id}`);
                  !subscribers.includes(user._id) && EnrollToCourse(_id);
                }}
              >
                {subscribers.includes(user._id)
                  ? "ALREADY ENROLLED"
                  : "ENROLL FOR FREE TRIAL"}
              </button>
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .IndicatorNew {
          color: #fff;
          background-color: var(--schoolx-DarkPrimaryColor);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .IndicatorActive {
          height: 5vw;
          width: 45%;
          height: 8vw;
          border-radius: 1.8vw;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          background-color: #169c5f;
        }
        .courseSubject {
          color: #aaa;
        }
        .price {
          font-weight: bold;
          color:var(--schoolx-DarkPrimaryColor);
        }
        .courseClass {
          color: #aaa;
        }

        .lectureTutor {
          color: #aaa;
        }
        @media (max-width: 768px) {
          .courseSubject {
            margin-right: 3vw;
          }
          .desc {
            min-height: 15vh;
            max-height: 15vh;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          .IndicatorNew {
            width: 45%;
            height: 8vw;
            border-radius: 1.8vw;
          }
          .infoCardA,
          .infoCardB,
          .infoCardC,
          .infoCardD {
            margin-bottom: 2vh;
          }
          .infoCardD {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .infoCardBtnCont {
            background: #fff;
            width: 100%;
            position: absolute;
            bottom: -10px;
            left: 0;
            z-index: 3;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 6vh;
          }
          .infoCardBtn {
            background: var(--schoolx-DarkPrimaryColor);
            width: calc(100% - 6vh);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 5vw;
            font-weight: bold;
            color: #fff;
            height: 5vh;
          }
          .lectureTutor {
            font-size: 4vw;
          }
          .CourseCard {
            padding:4vh 0 0 0;
            height: auto !important;
            width: 100%;
            background-color: #fff;
            border-radius: 0;
          }

          .CourseCardInner {
            background-color: #fff;
            border-radius: 4vh 4vh 0 0;
            padding: 3vh 3vh 0 3vh;
           
            width: 100%;
            -webkit-box-shadow: 0px -4px 10px #e6e6e6;
            -moz-box-shadow: 0px -4px 10px #e6e6e6;
            box-shadow: 0px -4px 10px #e6e6e6;
            position: relative;
          }
          .CourseCard.firstCard {
            height: 62vh !important;
          }
          .firstCard > .CourseCardInner {
            height: 100%;
            margin-top: 0;
          }
          .CourseIndicator {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          .CardTopHead {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2vh;
          }
          .CourseCardInnerMore {
            width: 100%;
            padding: 0 0 6vh 0;
          }
          .CourseIndicator {
            width: 45%;
          }
          .CourseName {
            width: 53%;
            margin-right: 2%;
            color: var(--schoolx-DarkPrimaryColor);
            font-weight: bold;
            font-size: 5vw;
          }
          .courseImage {
            display: none;
          }
          .courseInfoDK {
            display: none;
          }
        }
        @media (min-width: 769px) {
          .courseSubject {
            margin-right: 3vw;
          }
          .courseClass {
            margin-right: 3vw;
          }
          .price {
            font-weight: bold;
            color: var(--schoolx-DarkPrimaryColor);
          }
          .IndicatorNew {
            width: 6vh;
            font-size: 1.5vh;
            height: 3vh;
            border-radius: 5vh;
          }
          .CourseCard {
            max-width: 100%;
            height: auto;
            background-color: #fff;
            border-radius: 0;
          }
          .lectureTutor {
            font-size: 1.5vh;
          }
          .CourseCardInnerMore {
            display: none;
          }
          .infoCardBtnCont {
            display: none;
          }
          .courseImage {
            height: 100%;
            border-radius: 0.5vh;
          }
          .infoCardA {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .infoCardD {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .courseInfoDK .courseTitle {
            color: var(--schoolx-DarkPrimaryColor);
            font-weight: bold;
            font-size: 2.5vh;
          }
          .desc {
            color: #aaa;
            font-weight: normal;
            font-size: 90%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
          }
          .courseInfoDK {
            padding: 1vh 2vw;
            width: calc(100% - 20vh);
            height: 100%;
            border-radius: 0.5vh;
          }
          .EnrollerBtn {
            background-color: var(--schoolx-DarkPrimaryColor);
            padding: 1.5vh 1.8vw;
            border-radius: 1vh;
            color: #fff;
          }
          .truncate-overflow {
            line-height: 1.4rem;
            position: relative;
            max-height: calc(1.4rem * 3);
            overflow: hidden;
            margin-bottom: 0;
            color: #aaa;
            font-weight: normal;
            font-size: 90%;
          }
          /* .truncate-overflow:before {
            position: absolute;
            content: "...";
            bottom: 0;
            right: 0;
          } */
          .truncate-overflow:after {
            content: "";
            position: absolute;
            right: 0;
            width: 1rem;
            height: 1rem;
            background: white;
          }
          .CourseCardInner {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            border-radius: 0.5vh;
            margin: 1.5vh 2%;
            height: auto;
            width: 96%;
            -webkit-box-shadow: 0px 4px 10px #e6e6e6;
            -moz-box-shadow: 0px 4px 10px #e6e6e6;
            box-shadow: 0px 4px 10px #e6e6e6;
            position: relative;
          }
        }
      `}</style>
    </div>
  );
};

/* <div key={_id} className="col-md-12 mt-3">
      <div className="ListColumn">
        <div className="ListColumnInnerImg">
          <img
            className="card-img-left"
            src={image || `/images/mathematics${index % 2}.jpg`}
            alt="Card cap"
          />
          <a
            onClick={e => {
              e.preventDefault();
              push(`/lectureseries/view/${_id}`);
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
                    //e.preventDefault();
                    push(`/lectureseries/view/${_id}`);
                  }}
                  style={{ cursor: "pointer" }}
                  className="h6 indigo-text mt-2 text-left text-uppercase font-weight-bold"
                >
                  {name}
                </h6>
                <span className="d-flex flex-row align-items-center">
                  <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">
                    NEW
                  </span>
                </span>
              </div>
              <div className="lectureBtnArea">
                {subscribers.includes(user._id) ? (
                  <button
                    onClick={e => {
                      e.preventDefault();
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
                  </span>
                ) : (
                  <button
                    onClick={e => {
                      e.preventDefault();
                      EnrollToCourse(_id);
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
                )}
              </div>
            </div>
            <div className="small justify-content-start align-items-center strong-grey-text">
              <span
                onClick={() => push(`/profile/${owner._id}`)}
                style={{ cursor: "pointer" }}
              >{` By ${owner.fullName}`}</span>
              <Rating
                name={`lecture${index}`}
                style={{
                  fontSize: ".9rem",
                  position: "relative",
                  bottom: -2
                }}
                className="ml-3 text-left"
                owner.rating={owner.rating}
5               precision={0.5}
                readOnly
              />
            </div>
            <div className="d-flex flex-row">
              <div className="small justify-content-start align-items-center strong-grey-text py-1">
                <i className="fa fa-book text-primary mr-2" />
                <span className="strong-grey-text">{subject.name}</span>
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
                    push(`/lectureseries/view/${_id}`);
                  }}
                  className="small dark-grey-text list-inline-item pr-2 white-text scheduled"
                >
                  <i className="fa fa-th text-primary mr-2" />
                  {specificLectures}
                  {specificLectures > 1 ? " lectures" : " lecture"}
                </li>
                <li className="small dark-grey-text list-inline-item">
                  <span title="subscribers">
                    <i className="fa fa-users mr-2 text-primary"></i>
                    {subscribers.length}
                  </span>
                </li>
              </ul>
            </div>
            <div className="">
              {price && (
                <span className="text-primary">
                  <span className="strong-grey-text mr-2 small">
                    <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                  </span>
                  {`Rs ${price.toLocaleString()}`}
                </span>
              )}
            </div>
          </div>
          <div className="lectureBtnAreaB">
            {subscribers.includes(user._id) ? (
              <button
                onClick={e => {
                  e.preventDefault();
                  unsubscribeCourse(_id, subscribers);
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
                  subscribeCourse(_id, subscribers);
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
            )}
          </div>
        </div>
      </div>
    </div>
  */
