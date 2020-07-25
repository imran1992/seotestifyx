import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateSubject, getSubject,
} from '@utils/API';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState({});
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  const {
    _id, name: nameX, color: colorX,
  } = subject;

  const {
    name, color,
  } = input;

  const validSubject = name && /^#[0-9a-f]{3,6}$/i.test(color);


  const editSubject = () => {
    setLoading(true);
    updateSubject(_id, {name: name || nameX, color: color || colorX})
      .then((response) => {
        const {ok, data, problem} = response;
        if (ok) {
          setSubject(data);
          setNotifMessage('Subject successfully edited.');
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
  };


  useEffect(() => {

    getSubject(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setSubject(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  if (user.role !== 'admin') {
    return <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className={'alert alert-danger mt-5 mx-5 w-100'} role="alert">
        You are not allowed to access this page.
      </div>
    </main>;
  }
  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Edit subject:  <span className="headerSecondary">{nameX}</span></h2>
        </div>
        <div className="row">
          {notifMessage ? (
            <div className={`alert alert-${notifMessageType} mt-4 mx-4 w-100`} role="alert">
              {notifMessage}
            </div>
          ) : null}
          <div className="d-md-flex flex-md-fill">
            <div className="md-form input-group input-group-md px-2 mb-4">
              <div className="input-group-prepend">
                <span
                  className="input-group-text md-addon pr-4"
                  id="basic-addon9"
                >
                  <i className="fa fa-pencil-square" />
                </span>
              </div>
              <input
                type="text"
                className="form-control mt-0 pl-0"
                placeholder="class name"
                name="name"
                defaultValue={nameX}
                onChange={handleInputChange}
              />
            </div>
            <div className="md-form input-group input-group-md px-2 mb-4">
              <div className="input-group-prepend">
                <span
                  className="input-group-text md-addon pr-4"
                  id="basic-addon9"
                >
                  <i className="fa fa-pencil-square" />
                </span>
              </div>
              <input
                type="text"
                className="form-control mt-0 pl-0"
                placeholder="class color"
                name="color"
                style={{backgroundColor: color || colorX}}
                defaultValue={colorX}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validSubject}
                onClick={(e) => { e.preventDefault(); editSubject(); }}
                className="btn btn-primary btn-rounded btn-md waves-effect waves-light">
                Submit
              </button>
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
