import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import Dialog from "@components/Dialog";
import Rating from "@material-ui/lab/Rating";

import { useDispatch, useSelector } from "react-redux";
import {
  getLectureSeries,
  getLectures,
  deleteLectureSerie,
  updateLectureSerie
} from "@utils/API";
import { ExtractDateAndTime, timeLefter } from "@utils/utilities";
import Notif from "@components/Notif";

import nextCookie from "next-cookies";
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../../lib/apollo'
import gql from 'graphql-tag';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lectures, setLectures] = useState([]);
  const [lectureseries, setLectureseries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkedLectures, setLinkedLectures] = useState(0);
  const [lectureSeriesToDelete, setLectureSeriesToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");

  const user = useSelector(({ USER }) => USER.user);

  const truncate = (n, string) => {
    if (string.length <= n) {
      return string;
    }
    const subString = string.substr(0, n - 1);
    return `${subString.substr(0, subString.lastIndexOf(" "))}...`;
  };
let qry = user.role == 'admin' ? `{}` : `{teacherId:"${user._id}"}`
  const GET_COURSES = gql`
  {
    findCourse(query:${qry}){
      _id,
      name,
      price,
      description,
      subscribers,
      teacher{
        _id,
        name,
        phone,
        country
      },
      lectures{
        name,
        description,
        duration,
        price,
        startTime,
        meetingID,
        keywords,
        image_url,
        meetingInfo
      },
      tests{
        name
      }
      subject{
        name,
        classRoom{
          name,
          category
        }
      }
    }
  }
  `

  const removeLectureSerie = () => {
    setLoading(true);
    if (linkedLectures > 0) {
      setNotifMessage(
        "This Course has linked lectures. Unlink lectures first before deleting it."
      );
      setNotifMessageType("error");
    } else {
      deleteLectureSerie(lectureSeriesToDelete).then(response => {
        const { ok, data, problem } = response;
        if (ok) {
         
          setLectureseries(lectureseries.filter(item => item._id != lectureSeriesToDelete));
        
          setNotifMessage("Course successfully deleted.");
          setNotifMessageType("success");
        } else {
          setNotifMessageType("error");
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
    }
  };





  const { error, data, fetchMore, networkStatus, client } = useQuery(
    GET_COURSES,
    {
      // variables: allPostsQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(() => {
    console.log(data, 'data list id ')
    if (data) {
      console.log(data, 'data of lectures')
      if (data.findCourse && data.findCourse) {
        setLectureseries(data.findCourse);
      }
    }
  }, [data]);

  console.log(lectureseries, 'lectureseries lectureseries')

  return (
    <main
      className={
        user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
      <div className="container-fluid">
        
        <div className="row dashHeading rounded" style={{ justifyContent: 'space-between' }}>
          <div className="50vh margin-0 ">
            <h2 className="h6" style={{ marginTop: 16 }}>
            Courses
          </h2>
          </div>
          <div className="50vh margin-0" style={{ float: 'right' }}>
          {user.role !== "student" && (
          <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  Router.push(`${pathname}/add`);
                }}
                className="btn btn-primary waves-effect waves-light"
              >
                Add a Course
              </button>
          )}
          </div>
        </div>
        <p className="text-primary w-100 mb-0 ">
              Showing {lectureseries.length} Courses of {lectureseries.length}
            </p>
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <div className="row">
          {!isEmpty(lectureseries)
            ? lectureseries.map(
              (
                {
                  _id,
                  name,
                  subject,
                  teacher: owner,
                  subscribers,
                  image,
                  classRoom,
                  description,
                  price,
                  lectures
                },
                index
              ) => {
                {/* const foundLectures = filter(
                  lectures.data,
                  found => found.lectureSeries === _id
                );
                const specificLectures = foundLectures
                  ? foundLectures.length
                  : 0; */}

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
                            Router.push(`/lectureseries/view/${_id}`);
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
                                  Router.push(`/lectureseries/view/${_id}`);
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
                              {(user.role === "teacher" &&
                                user._id === owner._id) ||
                                user.role === "admin" ? (
                                  <>
                                    <button
                                      onClick={e => {
                                        e.preventDefault();
                                        Router.push(`${pathname}/edit/${_id}`);
                                      }}
                                      type="button"
                                      style={{
                                        position: "relative",
                                        top: 10,
                                        width: 110
                                      }}
                                      className="btn btn-sm btn-success waves-effect m-0 px-3"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={e => {
                                        e.preventDefault();
                                        setLectureSeriesToDelete(_id);
                                        setLinkedLectures(lectures);
                                        setDialogOpen(true);
                                      }}
                                      type="button"
                                      style={{
                                        position: "relative",
                                        top: 15,
                                        width: 110
                                      }}
                                      className="btn btn-sm btn-danger waves-effect m-0 px-3"
                                    >
                                      Remove
                                    </button>
                                  </>
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
                                  Router.push(`/lectureseries/view/${_id}`);
                                }}
                                className="small dark-grey-text list-inline-item pr-2 white-text scheduled"
                              >
                                <i className="fa fa-th text-primary mr-2" />
                                {/* {lectures}{" "} */}
                                {lectures > 1
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
            )
            : null}
        </div>
      </div>
      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={removeLectureSerie}
        dialogMessage="Do you really want to delete this Course ?"
      />
    </main>
  );
};
Dashboard.getInitialProps = async ctx => {
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
export default withApollo(Dashboard);
