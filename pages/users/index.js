import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Dialog from "@components/Dialog";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import { Select, FormControl, MenuItem } from "@material-ui/core";
import BottomScrollListener from "react-bottom-scroll-listener";
import useInput from "@components/useInput";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, activateUser } from "@utils/API";
import Notif from "@components/Notif";
import moment from "moment"
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../../lib/apollo'
import gql from 'graphql-tag';

import nextCookie from "next-cookies";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(false);
  const [userToDeleteActive, setUserToDeleteActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, handleInputChange] = useInput();
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(true);
  const [skip, setSkip] = useState(0);
  const [fullyFetched, setFullyFetched] = useState(false);
  const user = useSelector(({ USER }) => USER.user);

  const { name: nameX, role: roleX, active: activeX } = input;

  const GET_USERS = gql`
  {
    findUser(query: {}) {
      _id
      phone
      classRoom
      name
      role
      active
      createdAt
      Class{
        name
        category
      }    
    }
  }
  `;


  let filteredUsers = !isEmpty(users)
    ? users // sortBy(users.data, ["role"])
    : [];

  if (nameX) {
    filteredUsers = filter(filteredUsers, found =>
      found.name.toLowerCase().includes(nameX.toLowerCase())
    );
  }
  if (roleX) {
    filteredUsers = filter(filteredUsers, found => found.role === roleX);
  }

  console.log(input.hasOwnProperty("active"), 'ererer');
  
  if (input.hasOwnProperty("active")) {
    filteredUsers = filter(filteredUsers, found => found.active === activeX);
  }

  const resetFilters = () => {
    handleInputChange("wipe");
  };

  const removeUser = () => {
    setLoading(true);
    activateUser(userToDelete, userToDeleteActive).then(response => {
      const { ok, data, problem } = response;
      if (ok) {
        let deletedUserIndex = null;
        for (let i = 0; i < users.length; i++) {
          const el = users[i];
          if (el._id === userToDelete) {
            deletedUserIndex = i;
          }
        }
        console.log("deletedUserIndex", deletedUserIndex);

        setUsers({
          ...users,
          data: [
            ...users.slice(0, deletedUserIndex),
            data,
            ...users.slice(deletedUserIndex + 1)
          ]
        });
        setNotifMessage(
          userToDeleteActive
            ? "User successfully desactivated."
            : "User successfully activated."
        );
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
    // getUsers().then(response => {
    //   const { ok, data, problem } = response;
    //   if (ok) {
    //     console.log("Condition", data);
    //     let { total: countR, limit: pageSizeR, skip } = data;
    //     const totalPagesR = Math.ceil(countR / pageSizeR);
    //     console.log("Condition", totalPagesR);
    //     setSkip(1);
    //     if (totalPagesR < 1) setTotalPages(2);
    //     setUsers(data);
    //   } else {
    //     setNotifMessageType("error");
    //     if (data) setNotifMessage(data.message || problem);
    //     else setNotifMessage(problem);
    //   }
    //   setBusy(false);
    // });
  }, []);



  const { error, data, fetchMore, networkStatus, client } = useQuery(
    GET_USERS,
    {
      // variables: allPostsQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(() => {
    console.log(data, 'data list id ')
    if (data) {
      console.log(data, 'data of lectures')
      if (data.findUser && data.findUser) {
        setUsers(data.findUser);
      }
    }
  }, [data]);

  
  const loadMoreData = () => {
    console.log("LOAD", "FetchingData");
    if (!fullyFetched && !busy) {
      console.log("LOAD", "LoadingL1");
      setBusy(true);
      getUsers(skip).then(response => {
        const { ok, data: RES, problem } = response;
        if (ok) {
          const { total: countR, limit: pageSizeR, skip: skipper } = RES;
          if (countR > pageSizeR + skipper) {
            setSkip(skip + 1);
          } else {
            setFullyFetched(true);
          }
          setUsers({
            ...users,
            data: [...users, ...RES.data]
          });
          setBusy(false);
        } else {
          console.log("Error", "Result with Error");
          setBusy(false);
        }
      });
    } else {
      console.log("Condition", `${fullyFetched}_`);
    }
  };

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
      <style jsx>
        {`
          .table th,
          .table td {
            padding: 0 !important;
          }
        `}
      </style>
      <div className="container-fluid">
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Users</h2>
        </div>
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <div className="row px-3 mt-3">
          <div className="filterDiv w-100 rounded p-3 shadow-sm">
            <p className="text-primary w-100 mb-0 ">
              Showing {filteredUsers.length} users of {users.length}
            </p>
            <div className="w-100 d-flex align-items-center">
              <div className="md-form input-group input-group-md filterInput d-flex justify-content-center">
                <input
                  type="text"
                  className="form-control mt-0 pl-0"
                  placeholder="Search for user names"
                  name="name"
                  value={nameX || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </div>
              <FormControl className="filterInput d-flex justify-content-center">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="role"
                  value={roleX || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  displayEmpty
                >
                  <MenuItem name="role" value="" disabled>
                    Choose role
                  </MenuItem>
                  <MenuItem name="role" value="student">
                    {" "}
                    Student{" "}
                  </MenuItem>
                  <MenuItem name="role" value="teacher">
                    {" "}
                    Teacher{" "}
                  </MenuItem>
                  <MenuItem name="role" value="admin">
                    {" "}
                    Admin{" "}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl className="filterInput d-flex justify-content-center">
                <Select
                  labelId="select-label"
                  id="labelSelected"
                  name="active"
                  value={activeX || ""}
                  onChange={handleInputChange}
                  variant="outlined"
                  displayEmpty
                >
                  <MenuItem name="active" value="" disabled>
                    Choose status
                  </MenuItem>
                  <MenuItem name="active" value={true}>
                    {" "}
                    Active{" "}
                  </MenuItem>
                  <MenuItem name="active" value={false}>
                    {" "}
                    Inactive{" "}
                  </MenuItem>
                </Select>
              </FormControl>
              <button
                type="submit"
                disabled={isEmpty(input)}
                onClick={e => {
                  e.preventDefault();
                  resetFilters();
                }}
                style={{ width: 220, height: 40 }}
                className="btn btn-primary btn-rounded btn-sm waves-effect waves-light"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        <section className="w-100 mt-3">
          <div className="card shadow-sm" style={{ height: "55vh" }}>
            <BottomScrollListener onBottom={loadMoreData} offset={300}>
              {scrollRef => (
                <div
                  className="card-body"
                  ref={scrollRef}
                  style={{ maxHeight: "100%", overflowY: "scroll" }}
                >
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Registration Date</th>
                        <th>Class</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(users) &&
                        filteredUsers.map(
                          ({ _id, name, role, active, phone, createdAt ,Class}, index) => (
                            <tr key={_id}>
                              <th className="align-middle" scope="row">
                                {index + 1}
                              </th>
                              <th className="align-middle" style={{maxWidth: 200}}>{name}</th>
                              <th className="align-middle">{moment(createdAt).format('DD-MM-YYYY')}</th>
                              <th className="align-middle">{Class && Class.name ? Class.name : ''}</th>
                              <th className="align-middle">{phone}</th>
                              <th className="align-middle small-plus">
                                {role.toUpperCase()}
                              </th>
                              <th className="align-middle">
                                {active ? (
                                  <span className="lecture-badge badge-new badge badge-pill info-color">
                                    ACTIVE
                                  </span>
                                ) : (
                                  <span className="lecture-badge badge-new badge badge-pill danger-color">
                                    INACTIVE
                                  </span>
                                )}
                              </th>
                              <td className="align-middle text-center">
                                <button
                                  onClick={e => {
                                    e.preventDefault();
                                    setUserToDelete(_id);
                                    setUserToDeleteActive(active);
                                    setDialogOpen(true);
                                  }}
                                  type="button"
                                  className={`py-1 btn btn-${
                                    !active ? "success" : "error"
                                  } btn-sm waves-effect px-2 waves-light`}
                                >
                                  {!active ? (
                                    <i
                                      style={{ fontSize: 13 }}
                                      className="fa fa-check"
                                    />
                                  ) : (
                                    <i
                                      style={{ fontSize: 15 }}
                                      className="fa fa-times"
                                    />
                                  )}
                                </button>
                                <button
                                  onClick={e => {
                                    e.preventDefault();
                                    Router.push(`/profile/${_id}`);
                                  }}
                                  type="button"
                                  className="py-1 btn btn-info btn-sm waves-effect px-2 waves-light"
                                >
                                  <i
                                    style={{ fontSize: 15 }}
                                    className="fa fa-pencil-square-o"
                                  />
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              )}
            </BottomScrollListener>
          </div>
        </section>
      </div>
      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={removeUser}
        dialogMessage={`Do you really want to ${
          userToDeleteActive ? "desactivate" : "activate"
        } this user ?`}
      />
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
export default withApollo(Dashboard);
