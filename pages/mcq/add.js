import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { useDispatch, useSelector } from "react-redux";
import { createMcq } from "@utils/API";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Notif from "@components/Notif";

import useInput from "@components/useInput";
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
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

  const { name, answer, answer_index, options } = input;
  console.log(input);
  const validMcq = name && answer && answer_index;

  const addMcq = () => {
    setLoading(true);
    console.log(input.options, 'mcqs inputs ');
    let string = input.options;
    let option = string.split(',');
    console.log(option, 'options');

    createMcq({ name, answer, answer_index, options :option }).then(response => {
      console.log(response, 'response');

      const { ok, data, problem } = response;
      if (ok) {
        handleInputChange("wipe");
        setNotifMessage("MCQs successfully added.");
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

  // if (user.role !== "admin") {
  //   return (
  //     <main
  //       className={
  //         user.role === "student"
  //           ? "pl-0 pt-5 w-75 mx-auto mainStudent"
  //           : "pt-5 mx-lg-5"
  //       }
  //     >
  //       <div className={"alert alert-danger mt-5 mx-5 w-100"} role="alert">
  //         You are not allowed to access this page.
  //       </div>
  //     </main>
  //   );
  // }
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
            Add MCQs
          </h2>
        </div>
        <div className="row">

          <Notif
            setNotifMessage={setNotifMessage}
            notifMessage={notifMessage}
            notifMessageType={notifMessageType}
          />

          <div className="md-form input-group mt-0 px-2 mt-4">
            <div className="input-group-prepend">
              <span className="input-group-text align-items-start md-addon pr-4">
                <i className="fa fa-pencil-square" />
              </span>
            </div>
            <textarea
              className="form-control md-textarea pl-0"
              rows={3}
              placeholder="Write a Question"
              name="name"
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
              placeholder="Answer detail"
              name="answer"
              onChange={handleInputChange}
            />
          </div>

          <div className="d-md-flex flex-md-fill">
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
                placeholder="options separated by commas"
                name="options"
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
                placeholder="Answer index"
                name="answer_index"
                onChange={handleInputChange}
              />
            </div>

          </div>

          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validMcq}
                onClick={e => {
                  e.preventDefault();
                  addMcq();
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
