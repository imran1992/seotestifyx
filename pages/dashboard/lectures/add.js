import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {
  getLectureSeries, getClasses, getSubjects, createLecture,
} from '@utils/API';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import filter from 'lodash/filter';

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const [input, handleInputChange] = useInput();
  const [startTime, setSelectedDate] = React.useState(new Date());
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [lectureSeriesData, setLectureSeriesData] = useState([]);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');

  const user = useSelector(({USER}) => USER.user);

  const {
    title, subject, classRoom, duration, price, keywords, description, lectureSeries, learnDescription, requirements,
  } = input;

  const validLecture = title && subject && classRoom && duration && price && keywords && description && startTime && learnDescription && requirements;


  const addLecture = () => {
    setLoading(true);
    createLecture({...input, startTime})
      .then((response) => {
        const {ok, data, problem} = response;
        if (ok) {
          setNotifMessage('Lecture successfully added. You are being redirected to lectures list.');
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
  };


  useEffect(() => {
    getClasses().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setClasses(data.data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
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
    getLectureSeries().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setLectureSeriesData(filter(data.data, (found) => found.user._id === user._id));
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
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Add a lecture</h2>
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
                placeholder="Title"
                name="title"
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
            <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="classRoom"
                value={classRoom || ''}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem
                  name="classRoom"
                  key="void"
                  value=""
                  disabled
                >
                  Choose class
                </MenuItem>
                {classes.map(({_id, name}) => (
                  <MenuItem name="classRoom" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="d-md-flex flex-md-fill">
            <div className="md-form input-group input-group-md px-2 mb-4">
              <div className="input-group-prepend">
                <span
                  className="input-group-text md-addon pr-4"
                  id="basic-addon9"
                >
                  <i className="fa fa-clock-o" />
                </span>
              </div>
              <input
                type="number"
                className="form-control mt-0 pl-0"
                placeholder="Duration in minutes"
                name="duration"
                onChange={handleInputChange}
              />
            </div>
            <div className="md-form input-group input-group-md px-2 mb-4">
              <div className="input-group-prepend">
                <span
                  className="input-group-text md-addon pr-4"
                  id="basic-addon10"
                >
                  <i className="fa fa-dollar" />
                </span>
              </div>
              <input
                type="number"
                className="form-control mt-0 pl-0"
                placeholder="Price (0 for free)"
                name="price"
                onChange={handleInputChange}
              />
            </div>
            <div className="md-form input-group input-group-md px-2 mb-4">
              <div className="input-group-prepend">
                <span
                  className="input-group-text md-addon pr-4"
                  id="basic-addon101"
                >
                  <i className="fa fa-pencil-square" />
                </span>
              </div>
              <input
                type="text"
                className="form-control mt-0 pl-0"
                placeholder="Keywords separated by commas"
                name="keywords"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              variant="inline"
              className="datetimepicker mt-2 mb-4 mx-3"
              ampm={false}
              label="Choose lecture start time"
              value={startTime}
              onChange={(date) => setSelectedDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              disablePast
              format="yyyy/MM/dd HH:mm"
            />
          </MuiPickersUtilsProvider>
          <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
            <Select
              labelId="select-label"
              id="labelSelected"
              name="lectureSeries"
              value={lectureSeries || ''}
              onChange={handleInputChange}
              displayEmpty
            >
              <MenuItem name="lectureSeries" key="void" value="" disabled>
                Choose a Course (optional)
              </MenuItem>
              {lectureSeriesData.map(({_id, name}) => (
                <MenuItem name="lectureSeries" key={_id} value={_id}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="md-form input-group mt-0 px-2 mt-4">
            <div className="input-group-prepend">
              <span className="input-group-text align-items-start md-addon pr-4">
                <i className="fa fa-pencil-square" />
              </span>
            </div>
            <textarea
              className="form-control md-textarea pl-0"
              rows={3}
              placeholder="Write a short description"
              name="description"
              onChange={handleInputChange}
            />
          </div>
          <div className="md-form input-group mt-0 px-2 mt-2">
            <div className="input-group-prepend">
              <span className="input-group-text align-items-start md-addon pr-4">
                <i className="fa fa-pencil-square" />
              </span>
            </div>
            <textarea
              className="form-control md-textarea pl-0"
              rows={3}
              placeholder="What will students learn from this lecture ? Press ENTER to separate each item."
              name="learnDescription"
              onChange={handleInputChange}
            />
          </div>
          <div className="md-form input-group mt-0 px-2 mt-2">
            <div className="input-group-prepend">
              <span className="input-group-text align-items-start md-addon pr-4">
                <i className="fa fa-pencil-square" />
              </span>
            </div>
            <textarea
              className="form-control md-textarea pl-0"
              rows={3}
              placeholder="What are the requirements for fully benefiting from this lecture ? Press ENTER to separate each item."
              name="requirements"
              onChange={handleInputChange}
            />
          </div>
          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validLecture}
                onClick={(e) => { e.preventDefault(); addLecture(); }}
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
