import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import Dialog from '@components/Dialog';

import {useDispatch, useSelector} from 'react-redux';
import {
  getLectureSeries, getLectures, deleteLectureSerie, updateLectureSerie,
} from '@utils/API';
import {ExtractDateAndTime, timeLefter} from '@utils/utilities';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const [lectures, setLectures] = useState([]);
  const [lectureseries, setLectureseries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkedLectures, setLinkedLectures] = useState(0);
  const [lectureSeriesToDelete, setLectureSeriesToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);


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
            let deletedLectureSeriesIndex = null;
            for (let i = 0; i < lectureseries.data.length; i++) {
              const el = lectureseries.data[i];
              if (el._id === lectureSeriesToDelete) { deletedLectureSeriesIndex = i; }
            }
            console.log('deletedLectureSeriesIndex', deletedLectureSeriesIndex);

            setLectureseries({...lectureseries, data: [...lectureseries.data.slice(0, deletedLectureSeriesIndex), ...lectureseries.data.slice(deletedLectureSeriesIndex + 1)]});
            setNotifMessage('Course successfully deleted.');
            setNotifMessageType('success');
            setTimeout(() => {
              setNotifMessage('');
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


  const subscribe = (id, subscribers) => {
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
          setNotifMessage('You successfully subscribed to the Course.');
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
          setNotifMessage('You successfully unsubscribed from the Course.');
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
    getLectureSeries().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectureseries(data);
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
        {
          user.role !== 'student' ? (
            <div className="row">
              <ol className="breadcrumb">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); Router.push(`${pathname }/add`); }}
                  className="btn btn-primary waves-effect waves-light">
                  Add a Course
                </button>
                {/* <button type="button" className="btn btn-outline-primary waves-effect">
              Primary
            </button> */}
              </ol>
            </div>
          ) : null
        }

        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Course</h2>
        </div>
        {notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-5 mx-4`} role="alert">
            {notifMessage}
          </div>
        ) : null}
        <div className="row">
          {
            !isEmpty(lectureseries) ? lectureseries.data.map(({
              _id, name, subject, user: owner, subscribers,
            }) => {
              const foundLectures = filter(lectures.data, (found) => found.lectureSeries === _id);
              const specificLectures = foundLectures ? foundLectures.length : 0;

              return (
                <div key={_id} className="col-md-6 mb-xl-0 my-5">
                  {/* Card */}
                  <div className="card card-cascade cascading-admin-card">
                    {/* Card Data */}
                    <div className="admin-up">
                      <span style={{backgroundColor: subject.color}} className="far fa-money-bill-alt mr-3 z-depth-2">{subject.name}</span>
                      <div className="data mt-5">
                        <h4 className="font-weight-bold dark-grey-text mb-0">{name}</h4>
                        <span style={{cursor: 'pointer'}} className="datetime text-white bg-secondary py-1 px-2 d-block text-center my-0">{owner.name}</span>
                      </div>
                      {
                        user.role !== 'student' ? <button
                          onClick={(e) => { e.preventDefault(); setLectureSeriesToDelete(_id); setLinkedLectures(specificLectures); setDialogOpen(true); }}
                          type="button"
                          className="btn btn-danger btn-sm waves-effect px-3 waves-light"
                        >
                          <i style={{fontSize: 15}} className="fa fa-trash-o" />
                        </button> : null
                      }
                      {
                        user.role !== 'student' ? <button
                          onClick={(e) => { e.preventDefault(); Router.push(`${pathname}/edit/${_id}`); }}
                          type="button"
                          className="btn btn-success btn-sm waves-effect px-3 waves-light"
                        >
                          <i style={{fontSize: 15}} className="fa fa-pencil-square-o" />
                        </button> : null
                      }

                    </div>
                    {/* Card content */}
                    <div className="card-body card-body-cascade">
                      {/* <div className="progress mb-3">
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{width: '100%'}}
                          aria-valuenow={100}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div> */}
                      {
                        subscribers.includes(user._id) ? (
                          <button
                            onClick={(e) => { e.preventDefault(); unsubscribe(_id, subscribers); }}
                            type="button"
                            className="btn btn-md btn-outline-danger waves-effect mt-3 w-75 mx-auto d-block">
                            Unsubscribe
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.preventDefault(); subscribe(_id, subscribers); }}
                            type="button"
                            className="btn btn-md btn-outline-primary waves-effect mt-3 w-75 mx-auto d-block">
                            Subscribe
                          </button>
                        )
                      }
                    </div>
                    <div className="mdb-color lighten-3 text-center">
                      <ul className="list-unstyled list-inline font-small mt-3 d-flex justify-content-between px-4">
                        <li
                          onClick={(e) => { e.preventDefault(); Router.push(`${pathname}/view/${_id}`); }}
                          className="list-inline-item pr-2 white-text scheduled">
                          <i className="fa fa-list pr-1" />
                          {specificLectures} {specificLectures > 1 ? 'lectures' : 'lecture'}
                        </li>
                        <li className="list-inline-item">
                          <a href="#" title="subscribers" className="white-text">
                            <i className="fa fa-thumbs-up pr-1"> </i>{subscribers.length}
                          </a>
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
