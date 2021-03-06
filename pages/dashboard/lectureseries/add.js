import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {
  createLectureSeries, getSubjects,
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
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  const {
    name, subject,
  } = input;

  const validLectureSeries = name && subject;

  const addLectureSeries = () => {
    setLoading(true);
    createLectureSeries({...input})
      .then((response) => {
        const {ok, data, problem} = response;
        if (ok) {
          setNotifMessage('Course successfully added. You are being redirected to Course list.');
          setNotifMessageType('success');
          setTimeout(() => {
            Router.push('/dashboard/lectureseries');
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
    getSubjects().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setSubjects(data.data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  if (user.role === 'student') {
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
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Add a Course</h2>
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
                placeholder="Course title"
                name="name"
                onChange={handleInputChange}
              />
            </div>
            <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="subject"
                value={subject || ''}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem
                  name="subject"
                  key="void"
                  value=""
                  disabled
                >
                  Choose subject
                </MenuItem>
                {subjects.map(({_id, name}) => (
                  <MenuItem name="subject" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validLectureSeries}
                onClick={(e) => { e.preventDefault(); addLectureSeries(); }}
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
