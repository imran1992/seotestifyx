import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateMcq, getMcq, getSubjectTests
} from '@utils/API';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';

import { InlineMath, BlockMath } from 'react-katex';
import filter from "lodash/filter";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Notif from "@components/Notif";
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const { slug } = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [mcqs, setMcq] = useState({});
  const [subjectTests, setSubjectTests] = useState([]);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('error');

  const user = useSelector(({ USER }) => USER.user);

  const {
    _id, name: nameX,
    answer: answerX,
    answer_index: answer_indexX,
    options: optionsX
  } = mcqs;

  const {
    name, answer, answer_index, options
  } = input;

  const validMcq = name;


  const editMcq = () => {
    setLoading(true);
    let option = input.options;
    option = options.split(',');

    updateMcq(_id, { name, answer, answer_index, options: option })
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setMcq(data);
          setNotifMessage('MCQ successfully edited.');
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

    getMcq(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setMcq(data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

    // getSubjectTests().then(response => {
    //   const { ok, data, problem } = response;
    //   if (ok) {
    //     setSubjectTests(
    //       filter(data.data, found => found.user._id === user._id)
    //     );

    //   } else {
    //     setNotifMessageType("error");
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    // });



  }, []);

  // if (user.role !== 'admin') {
  //   return <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
  //     <div className={'alert alert-danger mt-5 mx-5 w-100'} role="alert">
  //       You are not allowed to access this page.
  //     </div>
  //   </main>;
  // }
  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Edit MCQs:  <span className="headerSecondary">{nameX ? nameX.split("&lt;Math&gt;").map((ele, id) => {
            if (id % 2 != 0) {
              return (<InlineMath>{ele}</InlineMath>)
            } else {
              return ele
            }
          }) : ""}</span></h2>
        </div>
        <div className="row">

          <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
          <div>  <p style={{ padding: 10, color: 'red', fontWeight: 'bold' }}>Inclose the mathematical expresions in {'&lt;Math&gt;'} <a href="https://katex.org/docs/0.10.0/supported.html">help for Mathematical expression </a></p></div>
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
              defaultValue={nameX}
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
              defaultValue={answerX}
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
                defaultValue={optionsX ? optionsX.toString() : ''}
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
                defaultValue={answer_indexX}
                onChange={handleInputChange}
              />
            </div>

          </div>

          <div className="container">
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loading || !validMcq}
                onClick={(e) => { e.preventDefault(); editMcq(); }}
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
