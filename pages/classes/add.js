import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";
import { createClass } from "@utils/API";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
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

  const user = useSelector(({ USER }) => USER.user);

  const { name, description, category } = input;
  console.log("name, description", name, description, category);

  const validClass = name && description && category;

  const addClass = () => {
    setLoading(true);
    createClass({ ...input }).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        handleInputChange("wipe");
        setNotifMessage("Class successfully added.");
        setNotifMessageType("success");
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
      setLoading(false);
    });
  };

  useEffect(() => { }, []);

  if (user.role !== "admin") {
    return (
      <main
        className={
          user.role === "student"
            ? "pl-0 pt-5 w-75 mx-auto mainStudent"
            : "pt-5 mx-lg-5"
        }
      >
        <div className={"alert alert-danger mt-5 mx-5 w-100"} role="alert">
          You are not allowed to access this page.
        </div>
      </main>
    );
  }
  return (
    <main
      className={
        user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
      <div className="container-fluid">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Add a class</h2>
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
                placeholder="Name of class"
                name="name"
                value={name || ""}
                onChange={handleInputChange}
              />
            </div>
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
                placeholder="Category of class"
                name="category"
                value={category || ""}
                onChange={handleInputChange}
              />
            </div>
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
              onChange={handleInputChange}
            />
          </div>


          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validClass}
                onClick={e => {
                  e.preventDefault();
                  addClass();
                }}
                className="btn btn-primary btn-rounded btn-md waves-effect waves-light"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
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
