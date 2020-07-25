/* eslint-disable react/self-closing-comp */
/* eslint-disable nonblock-statement-body-position */
// .noForMobile .noForDesktop
import React, { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { isEmpty, filter } from 'lodash';
import useTimer from '@components/useTimer';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { timeLefter, OurTimeShower, OurTimeShower2 } from '@utils/utilities';

const truncate = (n, string) => {
  if (string.length <= n) {
    return string;
  }
  const subString = string.substr(0, n - 1);
  return `${subString.substr(0, subString.lastIndexOf(' '))}...`;
};
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: 'large',
    fontWeight: 'bold',
  },
}));
export default ({
  subscribe,
  unsubscribe,
  handleCopy,
  user,
  copied,
  owner,
  subject,
  subscribers,
  data: {
    _id,
    // user: owner,
    title,
    // classRoom,
    duration,
    price,
    description,
    // subscribers,
    startTime,
    meetingInfo,
    whatsapp,
    image,
    // subject,
    keywords,
    lectureSeries,
    meetingID,
    endTime,
    name,
  },
  index,
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
          <div
            onClick={() => {
              push(`/online-class/${_id}`);
            }}
            className="infoCardA"
          >
            <span className="lectureTitle">{name}</span>
            <span
              style={{
                display: 'flex',
              }}
            >
              <span className="IndicatorNew">New</span>
              <span className="IndicatorActive">Active</span>
            </span>
          </div>
          <div className="infoCardB">
            <span
              className="lectureTutor HoverAble"
              onClick={() => push(`/profile/${owner._id}`)}
            >{`By ${owner.fullName}`}</span>
            <span>
              <Rating
                name={`lecture${index}`}
                style={{
                  fontSize: '1.5vh',
                  marginLeft: 10,
                }}
                className="ml-3 text-left"
                value={owner.rating ? owner.rating : 5}
                precision={0.5}
                readOnly
              />
            </span>
          </div>
          <div
            onClick={() => {
              push(`/online-class/${_id}`);
            }}
            className="small px-3 justify-content-start align-items-center strong-grey-text py-1"
          >
            <i className="fa fa-clock-o text-primary mr-2 " />
            <span className="strong-grey-text px-2">{`${duration} minutes`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="strong-grey-text">{`${subject.classRoom ? subject.classRoom.name : ''}`}</span>
          </div>
          <div
            onClick={() => {
              push(`/online-class/${_id}`);
            }}
            className="dark-grey-text w-100 px-3 text-justify small-plus"
          >
            {truncate(180, description)}
          </div>
          <div
            onClick={() => {
              push(`/online-class/${_id}`);
            }}
            className="d-flex flex-row justify-content-between px-3 py-1"
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
                    {subscribers ? subscribers.length : 0}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={'priceEnroll'}>
            {price > 0 ? (
              <span className="px-3">
                <span
                  className=" mr-2 small"
                  style={{ color: '#555', fontWeight: 'bold' }}
                >
                  <del>{`Rs ${(price * 2).toLocaleString()}`}</del>
                </span>
                {`Rs ${price.toLocaleString()}`}
              </span>
            ) : (
                <span className="text-primary px-3">FREE</span>
              )}

            {
              meetingInfo && meetingInfo.running ? meetingInfo.running[0] === 'true'
                ? <button
                  onClick={() => {
                    push(`/online-class/live/${_id}`)
                  }}
                  className={`enrollButton HoverAble waves-light waves-effect`}
                >Join Lecture</button>
                : null : null
            }

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
            <span
              className="lectureTitle"
              onClick={() => {
                push(`/online-class/${_id}`);
              }}
            >
              {name}
            </span>
            <span
              style={{
                display: 'flex',
              }}
            >
              <span className="IndicatorNew">New</span>
              <span className="IndicatorActive">Active</span>
            </span>
          </div>
          <div
            className="lectureTutor HoverAble"
            onClick={() => push(`/profile/${owner._id}`)}
          >{`By ${owner.fullName}`}</div>
          <Rating
            name={`lecture${index}`}
            style={{
              fontSize: '1.5vh',
              width: 'calc(100% - 2vw)',
            }}
            value={owner.rating ? owner.rating : 5}
            precision={0.5}
            readOnly
          />

          <div
            style={{
              width: 'calc(100% - 2vw)',
            }}
            className="small justify-content-start align-items-center strong-grey-text py-1"
          >
            <i className="fa fa-clock-o text-primary mr-2 " />
            <span className="strong-grey-text px-2">{`${duration} minutes`}</span>
            <i className="fa fa-graduation-cap text-primary mr-2" />
            <span className="strong-grey-text">{`${subject.classRoom ? subject.classRoom.name : ''}`}</span>
          </div>
          <div className="dark-grey-text w-100 text-justify small">
            {truncate(40, description)}
          </div>
          <div
            style={{
              width: 'calc(100% - 2vw)',
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
                    {subscribers ? subscribers.length : 0}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className={'priceEnroll'}>
            {/* <span
              onClick={() => {
                meetingInfo.running[0] === "false"
                  ? subscribers.includes(user._id)
                    ? () => {}
                    : subscribe(_id, subscribers)
                  : push(`/online-courses/live/${_id}`);
              }}
              className={`enrollButton${
                meetingInfo.running[0] === "false"
                  ? !subscribers.includes(user._id)
                    ? " HoverAble waves-light waves-effect"
                    : " disabledbtn"
                  : " HoverAble waves-light waves-effect"
              }`}
              className="enrollButton HoverAble waves-light waves-effect"
            >
              {meetingInfo.running[0] === "false"
                ? subscribers.includes(user._id)
                  ? "ALREADY ENROLLED"
                  : "ENROLL NOW"
                : " Join Lecture"}
            </span> */}
            {price > 0 ? (
              <span className="px-3">
                <span
                  className=" mr-2 small"
                  style={{ color: '#555', fontWeight: 'bold' }}
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
          background-color: var(--schoolx-DarkPrimaryColor);
        }
        @media (max-width: 768px) {
          .IndicatorNew {
            color: #fff;
            background-color: var(--schoolx-DarkPrimaryColor);
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
            height: auto;
            background-color: #ffffff;
            margin: 2vh 0 0 0;
          }
          .LectureCardInner {
            display: flex;
            cursor: pointer;
            justify-content: space-between;
            align-items: center;
            height: auto;
            width: 100%;
            -webkit-box-shadow: 0px 4px 10px #e6e6e6;
            -moz-box-shadow: 0px 4px 10px #e6e6e6;
            box-shadow: 0px 4px 10px #e6e6e6;
          }
          .lectureTitle {
            color: var(--schoolx-DarkPrimaryColor);
            font-weight: 900;
            font-size: 1.8vh;
            line-height: 2vh;
          }
          .LectureCard {
            background-color: var(--schoolx-DarkPrimaryColor);
          }
          .leftPart {
            width: 30%;
            height: 100%;
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
            background-color: #ffffff;
            padding: 1vh 1vw;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 70%;
          }
          .priceEnroll {
            font-weight: bold;
            color: var(--schoolx-DarkPrimaryColor);
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
            background-color: #2e47ae !important;
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
            color: var(--schoolx-DarkPrimaryColor);
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
            color: var(--schoolx-DarkPrimaryColor);
            font-weight: 900;
            font-size: 2.8vh;
          }
          .timeCircle span {
            color: #fff;
            font-weight: bold;
          }
          .timePart span {
            color: var(--schoolx-DarkPrimaryColor);
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
            height: auto;
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
            -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
            transition: 0.3s;
            border-radius: 1.5vh;
            width: 70%;
            height: auto;
            padding: 1% 1% 1% 7%;
            margin: 1vh 0;
          }
          .infoCardInner {
            width: 100%;
            height: 100%;
            cursor: pointer;
          }
        }
      `}</style>
    </div>
  );
};
