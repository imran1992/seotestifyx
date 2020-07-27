import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateUser, getUser, getClasses, changePassword, getLectures, getClassesDTO
} from '@utils/API';
import MenuItem from '@material-ui/core/MenuItem';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Notif from '@components/Notif';
import { Row, Col, Divider } from "antd"

import useInput from '@components/useInput';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from '../../lib/apollo';

import ClassesSlider from "@components/UpComingClasses/ClassesSlider";
import Loader from "@components/shared/loader";
import SliderHeader from "@components/SliderHeader";
import CoursesSlider from "@components/Courses/CoursesSlider";
import gql from 'graphql-tag';
import moment from 'moment'
import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const { slug } = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [classeList, setclassList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState({});
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageCat, setNotifMessageCat] = useState('init');
  const [notifMessageType, setNotifMessageType] = useState('error');

  const owner = useSelector(({ USER }) => USER.user);

  const {
    _id,
    phone,
    classRoom,
    name,
    role,
    Class,
    subscriptions
  } = user;


  const CLASSES_QUERY = `
{
    findClassRoom(query:{}){
        _id,
        name,
        category
    }
}
`;
  const checkProperties = (obj) => {
    if (isEmpty(obj)) return false;
    for (const key in obj) {
      if (isEmpty(obj[key])) { return false; }
    }
    return true;
  };

  console.log(user, 'user detail is the',owner)

  const { password, oldPassword } = input;

  const goodPassword = password && oldPassword;

  const validUser = checkProperties(input);

  const editUser = () => {
    setLoading(true);
    updateUser(owner._id, { ...input })
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setNotifMessageType('success');
          setNotifMessageCat('info');
          setNotifMessage('Your info was successfully modified.');
          // setUser(data);
          dispatch({ type: 'LOGED_IN', payload: data });
          // handleInputChange('wipe');

        } else {
          setNotifMessageType('error');
          setNotifMessage('Your info was successfully modified.');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };

  const goChangePassword = () => {
    setLoading(true);
    changePassword({ password, oldPassword })
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setNotifMessageType('success');
          setNotifMessageCat('password');
          setNotifMessage('Your password successfully changed.');
          handleInputChange('wipe');

        } else {
          setNotifMessageType('error');
          setNotifMessageCat('password');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };

  const itsme = owner._id === _id || owner.role === 'admin';


  useEffect(() => {

  }, []);

  const classessList = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
    console.log(classessList, 'classessList classessList');

    if (classessList.data) {
      setclassList(classessList.data.findClassRoom)
    }
  }, [classessList]);



  const USER = gql`
{
  findUser(query: {_id:"${slug}"}) {
    phone
    _id
    classRoom
    name
    role
    createdAt
    Class{
      name
      category
    }
    subscriptions{
      createdAt
      validUpTo
      Course{
        _id
        name
        price
        subscribers
        image_url
        subject{
          name
        }
        classRoom{
          name
        }
        teacher{
          name
        }
      }
    }
  }
}
`;
  const {
    error, data, fetchMore, networkStatus, client,
  } = useQuery(
    USER, { notifyOnNetworkStatusChange: true },
  );


  const GET_LECTURES = gql`
  {
    findLecture(query: {teacherId:"${slug}"}) {
      _id,
      name
      startTime
      duration
      keywords
      description
      tutor {
        _id
        name
      },
      meetingInfo,
      recorded_url,
    }
  }
  `

  var LectiresByTeacher = useQuery(
    GET_LECTURES,
    {
      variables: { __skip: 0, __limit: 30 },
      // notifyOnNetworkStatusChange: true,
    }
  )

  const handleChangeClass = (event) => {

    input.classRoom = event.target.value;
    editUser()
  }

  const enrollToCourse = () => {

  }

  useEffect(() => {
    console.log(data, 'data list id ')
    if (data) {
      console.log(data, 'data of lectures')
      if (data.findUser && data.findUser.length > 0) {
        let subscribedCourses = data.findUser[0].subscriptions;
        let courseList = [];
for(let crs of subscribedCourses){
  crs.Course.validUpTo = crs.validUpTo;
  courseList.push(crs.Course);
}
setCourses(courseList);
        setUser(data.findUser[0]);

      }
    }
    if (LectiresByTeacher) {
      if (LectiresByTeacher.data && LectiresByTeacher.data.findLecture) {
        let datalist = LectiresByTeacher.data.findLecture;
      
        let myUpComingLectures = [];
        datalist.map((lecture) => {
          const { startTime } = lecture;
          const staringAt = new Date(startTime).getTime();
          const currentTime = new Date().getTime();
          const isClassOver = staringAt - currentTime < 0;
          if (!isClassOver) myUpComingLectures.push(lecture);
        });
        setLectures(myUpComingLectures);
      }
      console.log(LectiresByTeacher, 'LectiresByTeacher');
    }
  }, [data, LectiresByTeacher]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // const date = new Date(createdAt);

  console.log(lectures, 'setclassList setclassList');

  return (
    <main>
      <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
      {
        !isEmpty(user) ? (
          <div className="container mt-5">
            {/* <div className="row">
              <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">{itsme ? 'Profile' : 'Profile of '}{itsme ? '' : <span className="headerSecondary">{name}</span>}</h2>
            </div> */}
            <div className="row">
              <div className={itsme ? 'col-lg-12 mb-12' : 'col-lg-12 mb-12 mx-auto'}>
                <div className="view view-cascade gradient-card-header mdb-color bg-gradient-secondary text-white lighten-3" style={{ padding: 10 }}>
                  <img
                    src={`/images/${role}.jpg`}
                    width="100px"
                    height="100px"
                    alt="User"
                    className="z-depth-1 mb-3 mx-auto rounded"
                  />
                  <h5 className="mb-0 font-weight-bold text-center">Profile info</h5>

                </div>
                <div style={{ backgroundColor: 'white', width: '100%', textAlign: 'center', padding: 10 }} >
                  {
                    user.role == 'student' ? 
                    
                      <Select
                        labelId="select-label"
                        id="labelSelected"
                        name="classRoomId"
                        // value={ Class._id || input.classRoom  ||  ""}
                        defaultValue={Class._id || ""}
                        onChange={handleChangeClass}
                        // fullWidth
                        displayEmpty
                      >
                        <MenuItem name="classRoomId" key="void" value="" disabled>
                          Choose class
                </MenuItem>
                        {classeList ? classeList.map(({ _id, name }) => (
                          <MenuItem name="classRoomId" key={_id} value={_id}>
                            {name}
                          </MenuItem>
                        )) : null}
                      </Select>
                      :<h3>{Class ? Class.name : ""}</h3>
                  }
                </div>
                <div className="card card-cascade narrower">

                  <div className="card-body card-body-cascade text-center">

                    <Row>
                      <Col span={12}>
                        <p style={{ fontWeight: 'bold', fontSize: 18 }}>Name</p>
                      </Col>

                      <Col span={12}>
                        <p>{name}</p>
                      </Col>
                      <Divider />
                      <Col span={12}>
                        <p style={{ fontWeight: 'bold', fontSize: 18 }}>Phone</p>
                      </Col>

                      <Col span={12}>
                        <p>{phone}</p>
                      </Col>
                      <Divider />

                      <Col span={12}>
                        <p style={{ fontWeight: 'bold', fontSize: 18 }}>Role</p>
                      </Col>

                      <Col span={12}>
                        <p>{role}</p>
                      </Col>
                    </Row>
                    <Divider />
                  </div>
                </div>
              </div>

            </div>
            {
              role == "student" ?

              <section className="w-100 mt-3">
                  <SliderHeader
              title="Courses You Subscribed"
              // subTitle="From your courses"
              // linkRef="/online-courses/upcoming-classes"
              // linkText="View all"
              onClickLinkText={() => localStorage.setItem("courseId", courseId)}
            />
              <div className="card">
                <div className="card-body">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Course Name</th>
                        <th>Class Name</th>
                        <th>Teacher Name</th>
                        <th>Fee</th>
                        <th>Valid Up to</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(courses) ? courses.map(({ _id, name, classRoom, teacher, price, validUpTo }, index) => (
                        <tr key={_id}>
                          <th className="align-middle" scope="row">
                            {index + 1}
                          </th>
                          <th className="align-middle">{name}</th>
                          <td className="align-middle">
                            {classRoom ? classRoom.name : ""}
                          </td>
                          <td className="align-middle">
                            {teacher ? teacher.name : ""}
                          </td>
                          <td className="align-middle">
                            {price}
                          </td>
                          <td className="align-middle">
                            {moment(validUpTo).format('DD-MM-YYYY') }
                          </td>
                          <td className="align-middle text-center">
                            {/* <button
                              onClick={(e) => { e.preventDefault(); setSubjectToDelete(_id); setDialogOpen(true); }}
                              type="button"
                              className="btn btn-danger btn-sm waves-effect px-3 waves-light"
                            >
                              <i style={{ fontSize: 15 }} className="fa fa-trash-o" />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); Router.push(`${pathname}/edit/${_id}`); }}
                              type="button"
                              className="btn btn-success btn-sm waves-effect px-3 waves-light"
                            >
                              <i style={{ fontSize: 15 }} className="fa fa-pencil-square-o" />
                            </button> */}
                          </td>
                        </tr>
                      )) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>: null}

          </div>
        ) : null
      }

      {
        role == 'teacher' ?
          <div className="container mt-5">
            <SliderHeader
              title="Upcoming Classes"
              subTitle="From your courses"
              linkRef="/online-class/upcoming-classes"
              linkText="View all"
              onClickLinkText={() => localStorage.setItem("courseId", courseId)}
            />

            {lectures.length < 1 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "30vh",
                }}
              >
                <Loader showOnlyLoader={true} size="small" />
              </div>
            ) : !isEmpty(lectures) ? (
              <ClassesSlider lectures={lectures} forTeacher={true} />
            ) : (
                  <div className={"alert alert-info w-100 my-3"} role="alert">
                    There is no results based on your filters.
                  </div>
                )}
          </div> : null
      }
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
export default withApollo(Dashboard);
