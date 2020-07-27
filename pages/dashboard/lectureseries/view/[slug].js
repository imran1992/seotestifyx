import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import Rating from '@material-ui/lab/Rating';
import Dialog from '@components/Dialog';

import {useDispatch, useSelector} from 'react-redux';
import {
  getLectures, getLectureSerie, updateLecture, updateLectureSerie, deleteLectureSerie,
} from '@utils/API';
import {ExtractDateAndTime, timeLefter} from '@utils/utilities';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [lectures, setLectures] = useState([]);
  const [lectureSerie, setLectureSerie] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkedLectures, setLinkedLectures] = useState(0);
  const [lectureSeriesToDelete, setLectureSeriesToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  const truncate = (n, string) => {
    if (string.length <= n) { return string; }
    const subString = string.substr(0, n - 1);
    return `${subString.substr(0, subString.lastIndexOf(' '))}...`;
  };


  const removeLectureSerie = () => {
    setLoading(true);
    if (linkedLectures > 0) {
      setNotifMessage('This Course has linked lectures. Unlink lectures first before deleting it.');
      setNotifMessageType('danger');
      setTimeout(() => {
        setNotifMessage('');
      }, 15000);
    } else {
      deleteLectureSerie(lectureSeriesToDelete)
        .then((response) => {
          const {ok, data, problem} = response;
          if (ok) {
            setNotifMessage('Lecture series successfully deleted. You are being redirected to lectures page.');
            setNotifMessageType('success');
            setTimeout(() => {
              Router.push('/dashboard/lectures');
            }, 3000);
          } else {
            setNotifMessageType('danger');
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
    }
  };

  const subscribeCourse = (id, subscribers) => {
    if (isEmpty(user)) Router.push({pathname: '/register', query});
    else {
      updateLectureSerie(id, {subscribers: [...subscribers, user._id]})
        .then((response) => {
          const {ok, data, problem} = response;
          if (ok) {
            let subscribedLectureIndex = null;
            for (let i = 0; i < lectureseries.data.length; i++) {
              const el = lectureseries.data[i];
              if (el._id === id) { subscribedLectureIndex = i; }
            }
            console.log('subscribedLectureIndex', subscribedLectureIndex);

            setLectureseries({...lectureseries, data: [...lectureseries.data.slice(0, subscribedLectureIndex), {...lectureseries.data[subscribedLectureIndex], subscribers: data.subscribers}, ...lectureseries.data.slice(subscribedLectureIndex + 1)]});
          } else {
            setNotifMessageType('danger');
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
    }
  };
  const unsubscribeCourse = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
    if (isEmpty(user)) Router.push({pathname: '/login', query});
    else {
      updateLectureSerie(id, {subscribers: [...newSubscribers]})
        .then((response) => {
          const {ok, data, problem} = response;
          if (ok) {
            let unsubscribedLectureIndex = null;
            for (let i = 0; i < lectureseries.data.length; i++) {
              const el = lectureseries.data[i];
              if (el._id === id) { unsubscribedLectureIndex = i; }
            }
            console.log('unsubscribedLectureIndex', unsubscribedLectureIndex);

            setLectureseries({...lectureseries, data: [...lectureseries.data.slice(0, unsubscribedLectureIndex), {...lectureseries.data[unsubscribedLectureIndex], subscribers: data.subscribers}, ...lectureseries.data.slice(unsubscribedLectureIndex + 1)]});
          } else {
            setNotifMessageType('danger');
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
    }
  };

  const subscribe = (id, subscribers) => {
    if (isEmpty(user)) Router.push({pathname: '/login', query});
    else {
      updateLecture(id, {subscribers: [...subscribers, user._id]})
        .then((response) => {
          const {ok, data, problem} = response;
          if (ok) {
            let subscribedLectureIndex = null;
            for (let i = 0; i < lectures.data.length; i++) {
              const el = lectures.data[i];
              if (el._id === id) { subscribedLectureIndex = i; }
            }
            console.log('subscribedLectureIndex', subscribedLectureIndex);

            setLectures({...lectures, data: [...lectures.data.slice(0, subscribedLectureIndex), {...lectures.data[subscribedLectureIndex], subscribers: data.subscribers}, ...lectures.data.slice(subscribedLectureIndex + 1)]});
          } else {
            setNotifMessageType('danger');
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
    }
  };
  const unsubscribe = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
    if (isEmpty(user)) Router.push({pathname: '/login', query});
    else {
      updateLecture(id, {subscribers: [...newSubscribers]})
        .then((response) => {
          const {ok, data, problem} = response;
          if (ok) {
            let unsubscribedLectureIndex = null;
            for (let i = 0; i < lectures.data.length; i++) {
              const el = lectures.data[i];
              if (el._id === id) { unsubscribedLectureIndex = i; }
            }
            console.log('unsubscribedLectureIndex', unsubscribedLectureIndex);

            setLectures({...lectures, data: [...lectures.data.slice(0, unsubscribedLectureIndex), {...lectures.data[unsubscribedLectureIndex], subscribers: data.subscribers}, ...lectures.data.slice(unsubscribedLectureIndex + 1)]});
          } else {
            setNotifMessageType('danger');
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
    }
  };


  const foundLectures = filter(lectures.data, (found) => found.lectureSeries === slug);
  const specificLectures = foundLectures ? foundLectures.length : 0;

  console.log('lectures', lectures);


  useEffect(() => {
    getLectureSerie(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectureSerie(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getLectures().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectures({...data, data: filter(data.data, (found) => found.lectureSeries === slug)});
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">

        {notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-5 mx-4`} role="alert">
            {notifMessage}
          </div>
        ) : null}
        {
          !isEmpty(lectureSerie) ? (
            <div className="lectureHeading rounded w-100 d-flex flex-column justify-content-around px-3">
              <div className="d-flex flex-row justify-content-between align-items-center">
                <div className="d-flex flex-row align-items-center">
                  <h2 className="h4 w-100 m-0 my-4">Course: {lectureSerie.name}</h2>
                  <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">NEW</span>
                  <span className="d-table lecture-badge badge-live badge badge-pill danger-color ml-2 mr-2">LIVE</span>
                </div>
                {
                  user.role !== 'student' ? (
                    <div className="subscription">
                      <button
                        onClick={(e) => { e.preventDefault(); Router.push(pathname.replace('view', 'edit').replace('[slug]', slug)); }}
                        type="button"
                        style={{position: 'relative', top: 5, width: 110}}
                        className="btn btn-sm btn-success waves-effect m-0 px-3">
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); setLectureSeriesToDelete(lectureSerie._id); setLinkedLectures(specificLectures); setDialogOpen(true); }}
                        type="button"
                        style={{position: 'relative', top: 10, width: 110}}
                        className="btn btn-sm btn-danger waves-effect m-0 px-3">
                        Remove
                      </button>
                    </div>
                  ) : null
                }
              </div>
              <div className="mb-3">
                <div
                  className="small-plus justify-content-start align-items-center dark-grey-text"
                >
                  <span onClick={() => Router.push(`/dashboard/profile/${lectureSerie.user._id}`)} style={{cursor: 'pointer'}}>{` By ${lectureSerie.user.name}`}</span>
                  <Rating
                    name="lecture"
                    style={{fontSize: '1rem', position: 'relative', bottom: -2}}
                    className="ml-3 text-left"
                    value={Math.random() * 5 + 2}
                    precision={0.5}
                    readOnly
                  />
                </div>
              </div>
              <div className="w-100 d-flex flex-row mb-3 justify-content-between">
                <div className="d-flex flex-row">
                  <div
                    className="small-plus justify-content-start align-items-center dark-grey-text"
                  >
                    <i className="fa fa-book text-primary mr-2" />
                    <span className="dark-grey-text">{`${lectureSerie.subject.name}`}</span>
                  </div>
                  <span className="mx-2 dark-grey-text"> </span>
                  <div
                    className="small-plus justify-content-start align-items-center dark-grey-text"
                  >
                    <i className="fa fa-graduation-cap text-primary mr-2" />
                    <span className="dark-grey-text">{`${lectureSerie.classRoom ? lectureSerie.classRoom.name : 'A Level'}`}</span>
                  </div>
                  <span className="mx-2 dark-grey-text"> </span>
                  <div
                    className="small-plus justify-content-start align-items-center dark-grey-text"
                  >
                    <i className="fa fa-users text-primary mr-2" />
                    <span className="dark-grey-text">{lectureSerie.subscribers.length}</span>
                  </div>
                </div>
                <div className="d-flex">
                  {
                    lectureSerie.price ? (
                      <span className="text-primary"><span className="strong-grey-text mr-2 small"><del>{`Rs ${(lectureSerie.price * 2).toLocaleString()}`}</del></span>{`Rs ${lectureSerie.price.toLocaleString()}`}</span>
                    ) : (
                      <span className="text-primary">FREE</span>
                    )
                  }
                </div>
              </div>
            </div>
          ) : null
        }
        {
          !isEmpty(lectureSerie) ? (
            <div className="row">
              <div className="col-md-12 mt-3">
                <h2 className="h6 w-100 rounded dashHeading">Lectures in this course</h2>
              </div>
            </div>
          ) : null
        }
        <div className="row pb-5">
          {
            !isEmpty(lectures) ? !isEmpty(lectures.data) ? lectures.data.map(({
              _id, user: owner, title, subject, classRoom, duration, price, keywords, description, lectureSeries, subscribers, startTime, meetingID, meetingInfo, endTime,
            }, index) => {
              const options = {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              };
              const date = new Date(startTime);
              const startDate = `${date.toLocaleDateString('en-US', options)} ${date.toLocaleTimeString('en-US')}`;

              return (
                <div key={_id} className="col-md-12 mt-2">
                  <div className="card card-cascade horizontal shadow-sm d-flex flex-row">
                    <div className="view overlay horizontal">
                      <img
                        className="card-img-left"
                        src={`/images/mathematics${index % 2}.jpg`}
                        alt="Card cap"
                      />
                      <a
                        href=""
                        onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/view/${_id}`); }}
                      >
                        <div className="mask rgba-white-slight waves-effect waves-light" />
                      </a>
                    </div>
                    <div className="px-3 w-100 d-flex flex-column justify-content-between">
                      <div className="w-100 d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between align-items-center">
                          <div className="d-flex flex-row align-items-center">
                            <h6 className="h6 indigo-text mt-2 text-left text-uppercase font-weight-bold">{title} </h6>
                            <span className="d-table lecture-badge badge-new badge badge-pill info-color ml-2">NEW</span>
                            {
                              !(index % 2) ? (
                                <span className="d-table lecture-badge badge-live badge badge-pill danger-color ml-2 mr-2">LIVE</span>
                              ) : null
                            }
                          </div>
                          <div className="subscription">
                            {
                              user._id !== owner._id && user.role !== 'admin'
                                ? meetingInfo.running[0] === 'false'
                                  ? subscribers.includes(user._id) ? (
                                    <button
                                      onClick={(e) => { e.preventDefault(); unsubscribe(_id, subscribers); }}
                                      type="button"
                                      style={{position: 'relative', top: 5, width: 110}}
                                      className="btn btn-sm btn-outline-primary waves-effect m-0 px-3">
                                      Unsubscribe
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.preventDefault(); subscribe(_id, subscribers); }}
                                      type="button"
                                      style={{position: 'relative', top: 5, width: 110}}
                                      className="btn btn-sm btn-primary waves-effect m-0 px-3">
                                      Subscribe
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/live/${_id}`); }}
                                      type="button"
                                      style={{position: 'relative', top: 5, width: 110}}
                                      className="btn btn-sm btn-primary waves-effect m-0 px-3">
                                      Join Lecture
                                    </button>
                                  ) : null
                            }
                          </div>
                        </div>
                        <div
                          className="small justify-content-start align-items-center strong-grey-text"
                        >
                          <span onClick={() => Router.push(`/dashboard/profile/${owner._id}`)} style={{cursor: 'pointer'}}>{` By ${owner.name}`}</span>
                          <Rating
                            name={`lecture${index}`}
                            style={{fontSize: '.9rem', position: 'relative', bottom: -2}}
                            className="ml-3 text-left"
                            value={Math.random() * 5 + 1}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                        <div className="d-flex flex-row">
                          <div
                            className="small justify-content-start align-items-center py-1"
                          >
                            <i className="fa fa-calendar text-primary mr-2" />
                            <span className="strong-grey-text">{` ${startDate}`}</span>
                          </div>
                          <span className="mx-2 strong-grey-text"> </span>
                          <div
                            className="small justify-content-start align-items-center strong-grey-text py-1"
                          >
                            <i className="fa fa-clock-o text-primary mr-2" />
                            <span className="strong-grey-text">{`${duration} minutes`}</span>
                          </div>
                          <span className="mx-2 strong-grey-text"> </span>
                          <div
                            className="small justify-content-start align-items-center strong-grey-text py-1"
                          >
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
                          <ul className="dark-grey-text list-unstyled list-inline mb-0 d-flex justify-content-start">
                            <li className="small dark-grey-text list-inline-item pr-2 white-text">
                              <i className="fa fa-clock-o text-primary mr-2" />
                              {`Starts in ${timeLefter(startTime)}`}
                            </li>
                            <li className="small dark-grey-text list-inline-item">
                              <span title="subscribers">
                                <i className="fa fa-users mr-2 text-primary"> </i>{subscribers.length}
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="">
                          {
                            price > 0 ? (
                              <span className="text-primary"><span className="strong-grey-text mr-2 small"><del>{`Rs ${(price * 2).toLocaleString()}`}</del></span>{`Rs ${price.toLocaleString()}`}</span>
                            ) : (
                              <span className="text-primary">FREE</span>
                            )
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className={'alert alert-info w-100 mx-3 my-2'} role="alert">
                There is no lectures in this course yet.
              </div>
            ) : null
          }
        </div>
      </div>
      <Dialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} dialogAction={removeLectureSerie} dialogMessage="Do you really want to delete this Course ?" />
    </main>
  );
};
Dashboard.getInitialProps = async (ctx) => {
  const {pathname} = ctx;
  const {slug} = ctx.query;
  const returnto = pathname.replace('[slug]', slug);
  const {Authorization} = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, {Location: `/login?returnto=${returnto}`}).end();
  } else if (!Authorization) {
    document.location.pathname = `/login?returnto=${returnto}`;
  } else return {Authorization};
};
export default Dashboard;
