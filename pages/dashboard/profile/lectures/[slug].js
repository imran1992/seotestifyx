import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';

import {useDispatch, useSelector} from 'react-redux';
import {getLectures, getUser, updateLecture} from '@utils/API';
import {timeLefter} from '@utils/utilities';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [lectures, setLectures] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const owner = useSelector(({USER}) => USER.user);


  const subscribe = (id, subscribers) => {
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
          setNotifMessage('You successfully subscribed to the lecture.');
          setNotifMessageType('success');
          setTimeout(() => {
            setNotifMessage('');
          }, 5000);
        } else {
          setNotifMessageType('danger');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };
  const unsubscribe = (id, subscribers) => {
    const index = subscribers.indexOf(user._id);
    const newSubscribers = [...subscribers];
    newSubscribers.splice(index, 1);
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
          setNotifMessage('You successfully unsubscribed from the lecture.');
          setNotifMessageType('success');
          setTimeout(() => {
            setNotifMessage('');
          }, 5000);
        } else {
          setNotifMessageType('danger');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };


  useEffect(() => {
    getUser(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setUser(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getLectures().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectures(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main className={owner.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">

        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Lectures of tutor: <span className="headerSecondary">{user.name}</span></h2>
        </div>
        {notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-5 mx-4`} role="alert">
            {notifMessage}
          </div>
        ) : null}
        <div className="row">
          {
            !isEmpty(lectures) ? filter(lectures.data, (found) => found.user._id === user._id).map(({
              _id, user: ownerX, title, subject, classRoom, duration, price, keywords, description, lectureSeries, subscribers, startTime, meetingID, meetingInfo, endTime,
            }, index) => {
              const options = {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              };
              const date = new Date(startTime);
              const startDate = `${date.toLocaleDateString('en-US', options)} ${date.toLocaleTimeString('en-US')}`;

              return (
                <div key={_id} className="col-md-6 my-4">
                  <div className="card card-cascade narrower">
                    <div
                      style={{backgroundColor: subject.color}}
                      className={'view view-cascade lectureHeader gradient-card-header'}>
                      <h5 onClick={(e) => { e.preventDefault(); Router.push(`${pathname}/view/${_id}`); }} className="mb-0 text-white">{subject.name}</h5>
                    </div>
                    {
                      meetingInfo.running[0] === 'true' ? (
                        <div className="video__icon">
                          <div className="circle--outer" />
                          <div className="circle--inner" />
                          <p>LIVE</p>
                        </div>
                      ) : null
                    }
                    <h6 className="indigo-text mt-4 text-center">{title}
                      <small className="d-block dark-grey-text mt-2 px-4 text-justify">
                        {description}
                      </small>
                    </h6>
                    <div className="card-body text-center px-4">
                      <div className="list-group list-panel">
                        <div
                          className="list-group-item d-flex justify-content-between"
                        >
                          <h6 className="text-primary font-weight-bold mr-auto">
                            <i className="fa fa-user-md text-primary" /> Tutor:
                          </h6>
                          <span onClick={() => Router.push(`/dashboard/profile/${ownerX._id}`)} style={{cursor: 'pointer', position: 'relative', bottom: 4}} className="datetime text-white bg-primary">{ownerX.name}</span>
                        </div>
                        <div
                          className="list-group-item d-flex justify-content-between"
                        >
                          <h6 className="text-primary font-weight-bold mr-auto">
                            <i className="fa fa-calendar text-primary" /> Date:
                          </h6>
                          <span className="datetime text-secondary">{startDate}</span>
                        </div>
                        <div
                          className="list-group-item d-flex justify-content-between"
                        >
                          <h6 className="text-primary font-weight-bold mr-auto">
                            <i className="fa fa-clock-o text-primary" /> Duration:
                          </h6>
                          <span className="datetime text-secondary">{`${duration} minutes`}</span>
                        </div>
                        <div
                          className="list-group-item d-flex justify-content-between"
                        >
                          <h6 className="text-primary font-weight-bold mr-auto">
                            <i className="fa fa-dollar text-primary" /> Price:
                          </h6>
                          <span className="datetime text-secondary">{price ? `Rs ${price.toLocaleString()}` : 'FREE'}</span>
                        </div>
                        {
                          ownerX._id !== owner._id && meetingInfo.running[0] === 'false' && !endTime
                            ? subscribers.includes(owner._id) ? (
                              <button
                                onClick={(e) => { e.preventDefault(); unsubscribe(_id, subscribers); }}
                                type="button"
                                className="btn btn-md btn-outline-danger waves-effect mt-4 mx-5">
                                Unsubscribe
                              </button>
                            ) : (
                              <button
                                onClick={(e) => { e.preventDefault(); subscribe(_id, subscribers); }}
                                type="button"
                                className="btn btn-md btn-outline-primary waves-effect mt-4 mx-5">
                                Subscribe
                              </button>
                            ) : null
                        }
                        {
                          ownerX._id === owner._id && meetingInfo.running[0] === 'false' ? (
                            <button
                              onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/live/${_id}`); }}
                              type="button"
                              className="btn btn-md btn-success waves-effect mt-4 mx-5">
                              {endTime ? 'Restart lecture' : 'Start lecture'}
                            </button>
                          ) : null
                        }
                        {
                          ownerX._id !== owner._id && meetingInfo.running[0] === 'true' ? (
                            <button
                              onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/live/${_id}`); }}
                              type="button"
                              className="btn btn-md btn-success waves-effect mt-4 mx-5">
                              Join lecture
                            </button>
                          ) : null
                        }
                        {
                          endTime && meetingInfo.running[0] === 'false' ? (
                            <div className={'alert alert-info mt-4 mx-5'} role="alert">
                              <i className="fa fa-info text-primary" /> Lecture ended.
                            </div>
                          ) : null
                        }
                        {/* <div className="mt-2">
                        <div className="chip waves-effect waves-effect"> math </div>
                        <div className="chip waves-effect waves-effect"> learning </div>
                        <div className="chip waves-effect waves-effect"> success </div>
                      </div> */}
                      </div>
                    </div>
                    <div className="mdb-color lighten-3 text-center">
                      <ul className="list-unstyled list-inline font-small mt-3 d-flex justify-content-between px-4">
                        <li className="list-inline-item pr-2 white-text">
                          <i className="fa fa-clock-o pr-1" />
                          {`Starts in ${timeLefter(startTime)}`}
                        </li>
                        <li className="list-inline-item">
                          <span title="subscribers" className="white-text">
                            <i className="fa fa-thumbs-up pr-1"> </i>{subscribers.length}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }) : null
          }
        </div>
      </div>
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
