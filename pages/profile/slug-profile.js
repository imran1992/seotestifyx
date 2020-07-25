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

import useInput from '@components/useInput';
import { useQuery } from '@apollo/react-hooks';
import { withApollo } from '../../lib/apollo';
import gql from 'graphql-tag';
import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const { slug } = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [classes, setClasses] = useState({});
  const [lectures, setLectures] = useState({});
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageCat, setNotifMessageCat] = useState('init');
  const [notifMessageType, setNotifMessageType] = useState('error');

  const owner = useSelector(({ USER }) => USER.user);

  const {
    _id, name, bio, classRoom, createdAt, email, whatsapp, role, country,
  } = user;

  const checkProperties = (obj) => {
    if (isEmpty(obj)) return false;
    for (const key in obj) {
      if (isEmpty(obj[key])) { return false; }
    }
    return true;
  };

  console.log(user, 'user detail is the')

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
          setUser(data);
          dispatch({ type: 'LOGED_IN', payload: data });
          handleInputChange('wipe');

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
    // getClasses().then((response) => {
    //   const {ok, data, problem} = response;
    //   if (ok) {
    //     setClasses(data);
    //   } else {
    //     setNotifMessageType('error');
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    // });
    getUser(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setUser(data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getLectures().then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        console.log(data)
        setLectures(data);
      } else {
        setNotifMessageType('error');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });

  }, []);


  const {
    error, data, fetchMore, networkStatus, client,
  } = useQuery(
    getClassesDTO(), { notifyOnNetworkStatusChange: true },
  );

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = new Date(createdAt);

  return (
    <main>
      <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
      {
        !isEmpty(user) ? (
          <div className="container mt-5">
            <div className="row">
              <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">{itsme ? 'Profile' : 'Profile of '}{itsme ? '' : <span className="headerSecondary">{name}</span>}</h2>
            </div>
            <div className="row">
              <div className={itsme ? 'col-lg-4 mb-4' : 'col-lg-8 mb-4 mx-auto'}>
                <div className="card card-cascade narrower">
                  <div className="view view-cascade gradient-card-header mdb-color bg-gradient-secondary text-white lighten-3">
                    <h5 className="mb-0 font-weight-bold">Profile info</h5>
                  </div>
                  <div className="card-body card-body-cascade text-center">
                    <h5 className="text-primary mb-2">{role.toUpperCase()}</h5>
                    <img
                      src={`/images/${role}.jpg`}
                      width="100px"
                      height="100px"
                      alt="User"
                      className="z-depth-1 mb-3 mx-auto rounded"
                    />
                    <div className="row flex-center px-2 mt-4 ">
                      <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Name: </small></h6>
                      <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{name}</h6>
                      <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Member since : </small></h6>
                      <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{`${months[date.getMonth()]} ${date.getFullYear()}`}</h6>
                      {
                        role === 'teacher' ? <div className="w-100">
                          <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Lectures : </small></h6>
                          <h6 onClick={() => Router.push(`/profile/online-courses/${user._id}`)} style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue scheduled' : 'w-100 text-center text-primary profileValue scheduled'}>{`${filter(lectures.data, (found) => found.user ? found.user._id : "" === _id).length} (see list)`}</h6>
                        </div> : null
                      }
                      <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Class: </small></h6>
                      <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{(classRoom ? classRoom.name : '') || (data ? data.findClassRoom.find((found) => found._id === classRoom) || {} : {}).name}</h6>
                      <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Country: </small></h6>
                      <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{country}</h6>
                      {
                        whatsapp && !itsme ? <div className="w-100">
                          <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Whatsapp: </small></h6>
                          <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{whatsapp}</h6>
                        </div> : null
                      }
                      {
                        email && !itsme ? <div className="w-100">
                          <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>E-mail: </small></h6>
                          <h6 style={{ fontWeight: 'bold' }} className={itsme ? 'w-100 text-right text-primary profileValue' : 'w-100 text-center text-primary profileValue'}>{email}</h6>
                        </div> : null
                      }
                      {
                        bio && !itsme ? <div className="w-100">
                          <h6 style={{ borderBottom: '1px solid #ccc' }} className="w-100 text-left text-secondary mb-0"><small>Bio: </small></h6>
                          <p className={!itsme ? 'text-justify px-2' : 'text-justify px-2 small'}>
                            {bio}
                          </p>
                        </div> : null
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className={itsme ? 'col-lg-8 mb-4' : 'd-none'}>
                <div className="card card-cascade narrower">
                  <div className="view view-cascade gradient-card-header mdb-color lighten-3 bg-gradient-secondary text-white ">
                    <h5 className="mb-0 font-weight-bold">Edit Profile info</h5>
                  </div>
                  <div className="card-body card-body-cascade text-center">
                    {
                      role === 'admin' ? (
                        <FormControl style={{ backgroundColor: '#4285f426' }} className="lSeriesInput d-flex justify-content-left ml-2 p-2">
                          <small className="w-100 font-weight-bold">For admins only</small>
                          <Select
                            labelId="select-label"
                            id="labelSelected"
                            name="role"
                            value={role ? (input.role || role || '') : ''}
                            onChange={handleInputChange}
                            fullWidth
                            displayEmpty
                          >
                            <MenuItem
                              name="role"
                              key="void"
                              value=""
                              disabled
                            >
                              Choose role
                            </MenuItem>
                            <MenuItem name="role" value="student"> Student </MenuItem>
                            <MenuItem name="role" value="teacher"> Teacher </MenuItem>
                            <MenuItem name="role" value="admin"> Admin </MenuItem>
                          </Select>
                        </FormControl>
                      ) : null
                    }
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
                        defaultValue={name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <FormControl className="lSeriesInput d-flex justify-content-left ml-2">
                      <Select
                        labelId="select-label"
                        id="labelSelected"
                        name="classRoom"
                        value={classRoom ? (input.classRoom || classRoom._id || classRoom || '') : ''}
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
                          Choose classRoom
                        </MenuItem>
                        {!isEmpty(data) ? data.findClassRoom.map(({ _id, name }) => (
                          <MenuItem name="classRoom" key={_id} value={_id}>
                            {name}
                          </MenuItem>
                        )) : null}
                      </Select>
                    </FormControl>
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
                        placeholder="Your whatsapp"
                        name="whatsapp"
                        defaultValue={whatsapp}
                        onChange={handleInputChange}
                      />
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
                        placeholder="Your E-mail"
                        name="email"
                        defaultValue={email}
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
                        rows={5}
                        placeholder="Write a short bio of yourself"
                        name="bio"
                        defaultValue={bio}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="container">
                    <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
                    <div className="text-center mb-3">
                      <button
                        type="submit"
                        disabled={loading || !validUser}
                        onClick={(e) => { e.preventDefault(); editUser(); }}
                        className="btn btn-primary btn-rounded btn-md waves-effect waves-light">
                        Submit
                      </button>
                    </div>
                  </div>
                  {/* Card content */}
                </div>
                <div className="card card-cascade narrower mt-5">
                  <div className="view view-cascade gradient-card-header mdb-color lighten-3 bg-gradient-secondary text-white ">
                    <h5 className="mb-0 font-weight-bold">Change Password</h5>
                  </div>
                  <div className="card-body card-body-cascade text-center">
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
                        type="password"
                        className="form-control mt-0 pl-0"
                        placeholder="Your current password"
                        name="oldPassword"
                        onChange={handleInputChange}
                      />
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
                        type="password"
                        className="form-control mt-0 pl-0"
                        placeholder="Your new password"
                        name="password"
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                  <Notif setNotifMessage={setNotifMessage} notifMessage={notifMessage} notifMessageType={notifMessageType} />
                  <div className="container">
                    <div className="text-center mb-3">
                      <button
                        type="submit"
                        disabled={loading || !goodPassword}
                        onClick={(e) => { e.preventDefault(); goChangePassword(); }}
                        className="btn btn-primary btn-rounded btn-md waves-effect waves-light">
                        Save
                      </button>
                    </div>
                  </div>
                  {/* Card content */}
                </div>
              </div>
            </div>
          </div>
        ) : null
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
