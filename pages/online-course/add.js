/* eslint-disable quotes */
/* eslint-disable nonblock-statement-body-position */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "date-fns";
import { useDispatch, useSelector } from "react-redux";
// @ts-ignore
import { createLectureSeries, getSubjects ,getClasses} from "@utils/API";
// @ts-ignore
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
// @ts-ignore
import DateFnsUtils from "@date-io/date-fns";
import { MenuItem, FormControl, Select } from "@material-ui/core";
// @ts-ignore
import Notif from "@components/Notif";
// @ts-ignore
import useInput from "@components/useInput";
import nextCookie from "next-cookies";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const Dashboard = () => {
  // @ts-ignore
  const dispatch = useDispatch();
  // @ts-ignore
  const { pathname, query, push } = useRouter();

  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");

  // @ts-ignore
  const user = useSelector(({ USER }) => USER.user);

  // @ts-ignore
  const { name, subject, description, price,classRoomId } = input;

  const validLectureSeries = name && subject && !isNaN(price);

  const addLectureSeries = () => {
    setLoading(true);
    const subjectId = input.subject;
    let classRoomId = ""
    let index = subjects.findIndex(item => item._id == input.subject);
    if (index > -1) {
      classRoomId = subjects[index].classRoomId;
    }
    const teacherId = user._id;

    console.log(classRoomId, 'classRoomId', subjectId, 'subjectId', teacherId, 'teacherId');

    if (name && subject && description && price)
      if (!isNaN(price)) {
        createLectureSeries({ ...input, classRoomId, teacherId, subjectId }).then(({ ok, data, problem }) => {
          if (ok) {
            setNotifMessage(
              "Course successfully added. You are being redirected to Course list."
            );
            setNotifMessageType("success");
            setTimeout(() => {
              push("/online-course");
            }, 3000);
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
          setLoading(false);
        });
      } else {
        alert("Price is not valid");
      }
    else {
      alert("Some Feilds are not valid");
    }
  };

  useEffect(() => {
    const Auth = cookies.get("Authorization");
    console.log("Auth", Auth);

    getClasses().then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        setClasses(data.data);
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

    getSubjects().then(({ ok, data, problem }) => {
      if (ok) {
        setSubjects(data.data);
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main
      className={
        user.role !== "student"
          ? "pt-5 mx-lg-5"
          : "pl-0 pt-5 w-75 mx-auto mainStudent"
      }
    >
      {user.role !== "student" ? (
        <div className="container-fluid mt-5">
          <div className="row">
            <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">
              Add a Course
            </h2>
          </div>
          <div className="row">
            <Notif
              setNotifMessage={setNotifMessage}
              notifMessage={notifMessage}
              notifMessageType={notifMessageType}
            />
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
                  // @ts-ignore
                  onChange={handleInputChange}
                />
              </div>

              <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
              <Select
                labelId="select-label"
                id="labelSelected"
                name="classRoomId"
                value={classRoomId || ""}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem name="classRoomId" key="void" value="" disabled>
                  Choose class
                </MenuItem>
                {classes.map(({ _id, name }) => (
                  <MenuItem name="classRoomId" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>


              <FormControl className="lSeriesInput d-flex justify-content-center ml-2">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="subject"
                  value={subject || ""}
                  // @ts-ignore
                  onChange={handleInputChange}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem
                    // @ts-ignore
                    name="subject"
                    key="void"
                    value=""
                    disabled
                  >
                    Choose subject
                  </MenuItem>
                  {subjects.filter(item => item.classRoomId == input.classRoomId).map(({ _id, name }) => (
                  <MenuItem name="subjectId" key={_id} value={_id}>
                    {name}
                  </MenuItem>
                ))}
                </Select>
              </FormControl>
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
                placeholder="Price"
                name="price"
                defaultValue={price}
                // @ts-ignore
                onChange={handleInputChange}
              />
            </div>
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
                defaultValue={description}
                // @ts-ignore
                onChange={handleInputChange}
              />
            </div>
            <div className="container">
              <div className="text-center mt-4">
                <button
                  type="submit"
                  disabled={loading || !validLectureSeries}
                  onClick={e => {
                    e.preventDefault();
                    addLectureSeries();
                  }}
                  className="btn btn-primary btn-md waves-effect waves-light"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className={"alert alert-danger mt-5 mx-5 w-100"} role="alert">
            You are not allowed to access this page.
          </div>
        )}
    </main>
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
