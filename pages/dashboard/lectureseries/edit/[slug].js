import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {
  getSubjects, updateLectureSerie, getLectureSerie,
} from '@utils/API';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import isEmpty from 'lodash/isEmpty';

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [lectureSeries, setLectureSeries] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  const {
    _id, name: nameX, subject: subjectX, whatsapp: whatsappX,
  } = lectureSeries;

  const {
    name, subject, whatsapp,
  } = input;

  const validLectureSeries = !isEmpty(input);


  const editLectureSeries = () => {
    setLoading(true);
    updateLectureSerie(_id, {
      name: name || nameX, subject: subject || subjectX, whatsapp: whatsapp || whatsappX,
    })
      .then((response) => {
        const {ok, data, problem} = response;
        if (ok) {
          setLectureSeries(data);
          setNotifMessage('Course successfully edited.');
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
    getLectureSerie(slug).then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectureSeries(data);
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
  if (lectureSeries.user && user.role === 'teacher' && user._id !== lectureSeries.user._id) {
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
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Edit Course: {nameX}</h2>
        </div>
        {notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-4 mx-4 w-100`} role="alert">
            {notifMessage}
          </div>
        ) : null}
        {
          !isEmpty(lectureSeries) ? <div className="row">
            <div style={{backgroundColor: '#4285f426'}} className="md-form input-group input-group-md p-2 mb-2">
              <small className="w-100 font-weight-bold">For admins only</small>
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
                placeholder="Whatsapp Group link"
                name="whatsapp"
                defaultValue={whatsappX}
                onChange={handleInputChange}
                disabled={user.role !== 'admin'}
              />
            </div>
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
                  placeholder="Title of Course"
                  name="name"
                  defaultValue={nameX}
                  onChange={handleInputChange}
                />
              </div>
              <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="subject"
                  value={subject || subjectX._id || ''}
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
                  onClick={(e) => { e.preventDefault(); editLectureSeries(); }}
                  className="btn btn-primary btn-rounded btn-md waves-effect waves-light">
                  Submit
                </button>
              </div>
            </div>
          </div> : null
        }
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
