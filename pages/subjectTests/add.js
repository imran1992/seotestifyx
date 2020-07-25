import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";
import { createSubjectTest, getMcqs, getAllCourses, getLecturesByTeacher } from "@utils/API";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { ListItemText } from '@material-ui/core';
import Notif from "@components/Notif";

import useInput from "@components/useInput";

import nextCookie from "next-cookies";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [allMcqs, setAllMcqs] = useState([]);
  const [allCourses, setCourses] = useState([]);
  const [allLectures, setLectures] = useState([]);

  const user = useSelector(({ USER }) => USER.user);

  const { name, courseId, lectureId, mcqIds } = input;
  console.log(input);
  const validSubjectTest = name;

  const addSubjectTest = () => {
    setLoading(true);
    createSubjectTest({ ...input }).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        handleInputChange("wipe");
        setNotifMessage("Test successfully added.");
        setNotifMessageType("success");
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
      setLoading(false);
    });
  };

  useEffect(() => {

    getMcqs(user._id).then((response) => {
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

  return (
    <main
      className={
        user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
      <Head>
        <meta
          property="og:title"
          content="SCHOOLX leading online learning platform"
        />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>
      <div className="container-fluid mt-5">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">
            Add a Test
          </h2>
        </div>
        <div className="row">
          <Notif
            setNotifMessage={setNotifMessage}
            notifMessage={notifMessage}
            notifMessageType={notifMessageType}
          />
          <div className="row">
            <div className="d-md-flex col flex-md-fill">
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
                  placeholder="Name of Test"
                  name="name"
                  value={name || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <FormControl className="lSeriesInput d-flex col justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="courseId"
                value={courseId || ""}
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
                value={lectureId || ""}
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
                value={mcqIds || []}
                onChange={handleInputChange}
                input={<Input />}
                renderValue={(selected) => null}
                MenuProps={{ PaperProps: { style: { width: 150, maxHeight: 900 } } }}

                fullWidth
                displayEmpty
              >
                {allMcqs.map(({ _id, name }) => (

                  <MenuItem key={_id} value={_id}>
                    <Checkbox checked={mcqIds ? mcqIds.indexOf(_id) > -1 : false} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>


          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validSubjectTest}
                onClick={e => {
                  e.preventDefault();
                  addSubjectTest();
                }}
                className="btn btn-primary btn-rounded btn-md waves-effect waves-light"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div >
    </main >
  );
};
Dashboard.getInitialProps = async ctx => {
  const { pathname } = ctx;
  const { slug } = ctx.query;
  const returnto = pathname.replace("[slug]", slug);
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, { Location: `/login?returnto=${returnto}` }).end();
  } else if (!Authorization) {
    document.location.pathname = `/login?returnto=${returnto}`;
  } else return { Authorization };
};
export default Dashboard;
