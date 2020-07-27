import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';

import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '@utils/API';
import {ExtractDateAndTime, timeLefter} from '@utils/utilities';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;

  const user = useSelector(({USER}) => USER.user);

  const notifications = user.notifications || [];

  const timeSince = (date) => {

    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return `${interval } years`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return `${interval } months`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return `${interval } days`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return `${interval } hours`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return `${interval } minutes`;
    }
    return `${Math.floor(seconds) } seconds`;
  };

  useEffect(() => {

  }, []);

  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-md-8 mx-auto my-4">
            <div className="card card-cascade narrower">
              <div className="view view-cascade gradient-card-header bg-gradient-primary primary-color">
                <h4 className="mb-0 font-weight-500 text-white">Last notifications</h4>
              </div>
              <div className="card-body text-center px-4 mb-3">
                <div className="list-group list-panel">
                  {notifications.map(({
                    name, id, name2, id2, message, createdAt,
                  }, index) => {
                    const date = createdAt ? new Date(createdAt) : new Date();
                    return user.role === 'student' ? (
                      <a
                        href=""
                        style={{backgroundColor: index < user.notificationCount ? '#44baff54' : 'none'}}
                        onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/${ id}`); }}
                        className="list-group-item d-flex justify-content-start dark-grey-text p-2"
                      >
                        <i
                          className="fa fa-eye text-primary"
                          data-toggle="tooltip"
                          data-placement="top"
                          data-original-title="Click to fix"
                        />
                        <span className="ml-4 text-left">
                          Lecture <span style={{display: 'contents'}} className="headerSecondary">{name}</span> started {timeSince(date)} ago
                        </span>
                      </a>
                    ) : (
                      <a
                        href=""
                        style={{backgroundColor: index < user.notificationCount ? '#44baff54' : 'none'}}
                        onClick={(e) => { e.preventDefault(); Router.push(`/dashboard/lectures/${id}`); }}
                        className="list-group-item d-flex justify-content-start align-items-center dark-grey-text p-2"
                      >
                        <i
                          className="fa fa-eye text-primary"
                          data-toggle="tooltip"
                          data-placement="top"
                          data-original-title="Click to fix"
                        />
                        <span className="ml-4 text-left">
                          Student <span style={{display: 'contents'}} className="headerSecondary">{name2}</span> subscribed to your lecture <span style={{display: 'contents'}} className="headerSecondary">{name}</span>, {timeSince(date)} ago
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
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
