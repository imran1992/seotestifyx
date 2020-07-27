import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateSubjectTest, getSubjectTest, getMcqs,getMcqsByTeacherId, getAllCourses, getLecturesByTeacher
} from '@utils/API';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Notif from "@components/Notif";

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';
import { ListItemText } from '@material-ui/core';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const { slug } = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [subject, setSubjectTest] = useState({});
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('error');
  const [allMcqs, setAllMcqs] = useState([]);
  const [allCourses, setCourses] = useState([]);
  const [allLectures, setLectures] = useState([]);

  const user = useSelector(({ USER }) => USER.user);

  const {
    _id, name: nameX, mcqIds: mcqIdsX, courseId: courseIdX, lectureId: lectureIdX
  } = subject;

  const {
    name, mcqIds, lectureId, courseId
  } = input;

  const validSubjectTest = name || nameX;

  const editSubjectTest = () => {
    setLoading(true);
    updateSubjectTest(_id, { name: name || nameX, mcqIds: mcqIds || mcqIdsX, lectureId: lectureId || lectureIdX, courseId: courseId || courseIdX })
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setSubjectTest(data);
          setNotifMessage('Test successfully edited.');
          setNotifMessageType('success');

        } else {
          setNotifMessageType('error');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };


  useEffect(() => {

    getSubjectTest(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        console.log(data, 'data is test')
        setSubjectTest(data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

    getMcqsByTeacherId(user._id).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        console.log(data, 'data list for mzq')
        setAllMcqs(data.data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

    getLecturesByTeacher(user._id).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        console.log(data, 'data list coursedds')
        setLectures(data.data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

    getAllCourses(user._id).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        console.log(data, 'data list coursedds')
        setCourses(data.data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

  }, []);

  console.log(allCourses, 'allCourses',allLectures, 'alllecutes',allMcqs, ' all msqs list', subject)

  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Edit Test:  <span className="headerSecondary">{nameX}</span></h2>
        </div>
        <div className="row">
          <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
          <div className="row">
            <div className="d-md-flex flex-md-fill col">
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
                  placeholder="Test Name"
                  name="name"
                  defaultValue={nameX}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <FormControl className="lSeriesInput d-flex col justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="courseId"
                value={courseId || courseIdX || ""}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem name="courseId" key="void" value="" disabled>
                  Choose Course
                </MenuItem>
                {allCourses.map(({ _id, name }) => (
                  <MenuItem name="courseId" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="lSeriesInput d-flex col justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="lectureId"
                value={lectureId || lectureIdX || ""}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem name="lectureId" key="void" value="" disabled>
                  Choose Lecture
                </MenuItem>
                {allLectures.map(({ _id, name }) => (
                  <MenuItem name="lectureId" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="lSeriesInput d-flex col justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                multiple
                name="mcqIds"
                value={mcqIds || mcqIdsX || []}
                onChange={handleInputChange}
                input={<Input />}
                renderValue={(selected) => null}
                MenuProps={{ PaperProps: { style: { width: 150, maxHeight: 900 } } }}

                fullWidth
                displayEmpty
              >
                {allMcqs.map(({ _id, name }) => (

                  <MenuItem key={_id} value={_id}>
                    <Checkbox checked={mcqIds ? mcqIds.indexOf(_id) > -1 : mcqIdsX ? mcqIdsX.indexOf(_id) > -1 : false} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </div>
        </div>
        <div className="container">
          <div className="text-center mt-4">
            <button
              type="submit"
              disabled={loading || !validSubjectTest}
              onClick={(e) => { e.preventDefault(); editSubjectTest(); }}
              className="btn btn-primary btn-rounded btn-md waves-effect waves-light">
              Submit
              </button>
          </div>
        </div>
      </div>
    </main>
  );
};
Dashboard.getInitialProps = async (ctx) => {
  const { pathname } = ctx;
  const { slug } = ctx.query;
  const returnto = pathname.replace('[slug]', slug);
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, { Location: `/login?returnto=${returnto}` }).end();
  } else if (!Authorization) {
    document.location.pathname = `/login?returnto=${returnto}`;
  } else return { Authorization };
};
export default Dashboard;
