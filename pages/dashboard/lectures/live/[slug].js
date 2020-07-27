import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {getLinkForMeeting, getLecture} from '@utils/API';
import CircularProgress from '@material-ui/core/CircularProgress';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [loading, setLoading] = useState(true);
  const [lectureLink, setLectureLink] = useState('');
  const [lecture, setLecture] = useState({});

  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  useEffect(() => {
    getLinkForMeeting(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectureLink(data);
        setLoading(false);
      } else {
        setLoading(false);
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getLecture(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLecture(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main className="pl-0">
      <style>{`
        .sidebar-fixed.position-fixed {
          display: none;
        }
      `}</style>
      {
        lecture.user ? lecture.user._id !== user._id ? (
          <style>{`
        .endmeeting {
          display: none !important;
        }
      `}</style>
        ) : null : null
      }
      {
        loading ? notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-5 mx-4`} role="alert">
            {notifMessage}
          </div>
        ) : (
          <div style={{height: '100vh'}} className="d-flex justify-content-center align-items-center w-100">
            <CircularProgress style={{top: 50}} className="text-primary position-relative" />
          </div>
        ) : !lectureLink.url ? !lecture.endTime ? (
          <div style={{height: '100vh'}} className="d-flex justify-content-center align-items-center w-100">
            <div className={'alert alert-info mt-5 mx-4'} role="alert">
              {lectureLink.info}
            </div>
          </div>
        ) : (
          <div style={{height: '100vh'}} className="d-flex justify-content-center align-items-center w-100">
            <div className={'alert alert-info mt-5 mx-4'} role="alert">
              This lecture has ended.
            </div>
          </div>
        ) : (
          <iframe
            allowFullScreen
            title="Live lecture"
            src={lectureLink.url}
            style={{
              width: '100vw',
              border: 'none',
              height: 'calc(100vh - 61px)',
              bottom: 0,
              position: 'absolute',
            }}
            allow="geolocation; microphone; camera; fullscreen"
          />
        )
      }

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
