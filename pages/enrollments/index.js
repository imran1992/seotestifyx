import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Dialog from "@components/Dialog";
import isEmpty from "lodash/isEmpty";
import BottomScrollListener from "react-bottom-scroll-listener";
import useInput from "@components/useInput";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserWithEnroll,
  patchUserWithEnrollPaid,
  updateEnrollmentValidity,
} from "@utils/API";
import Notif from "@components/Notif";
import ValidyDialog from "@components/validityDialog";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import gql from "graphql-tag";

import moment from "moment";

import nextCookie from "next-cookies";

const GET_ENROLMENTS = gql`
  {
    findEnrollment(query: {}) {
      _id
      name
      phone
      validUpTo
      createdAt
      fee
      Course {
        name
      }
      User {
        name
        Class {
          name
        }
      }
    }
  }
`;
const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [userEnrollment, setUserEnrollment] = useState([]);
  const [CurrentOp, setCurrentOp] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDeleteActive, setUserToDeleteActive] = useState(false);
  const [validityDialogValue, setValidityDialogValue] = useState(null);

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

  let filteredUsers = !isEmpty(userEnrollment)
    ? userEnrollment // sortBy(users.data, ["role"])
    : [];
  const resetFilters = () => {
    handleInputChange("wipe");
  };

  // useEffect(() => {
  //   getUserWithEnroll().then((response) => {
  //     const { ok, data, problem } = response;
  //     if (ok) {
  //       console.log("Condition", data);
  //       let { total: countR, limit: pageSizeR, skip } = data;
  //       const totalPagesR = Math.ceil(countR / pageSizeR);
  //       console.log("Condition", totalPagesR);
  //       setSkip(1);
  //       if (totalPagesR < 1) setTotalPages(2);
  //       setUserEnrollment(data);
  //     } else {
  //       setNotifMessageType("error");
  //       if (data) setNotifMessage(data.message || problem);
  //       else setNotifMessage(problem);
  //     }
  //     setBusy(false);
  //   });
  // }, []);

  const { error, data, fetchMore, networkStatus, client } = useQuery(
    GET_ENROLMENTS,
    {
      // variables: allPostsQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    console.log(data, "data list id ");
    if (data) {
      console.log(data, "data of lectures");
      if (data.findEnrollment) {
        setUserEnrollment(data.findEnrollment);
      }
    }
  }, [data]);

  const loadMoreData = () => {
    console.log("LOAD", "FetchingData");
    if (!fullyFetched && !busy) {
      console.log("LOAD", "LoadingL1");
      setBusy(true);
      getUserWithEnroll(skip).then((response) => {
        const { ok, data: RES, problem } = response;
        if (ok) {
          const { total: countR, limit: pageSizeR, skip: skipper } = RES;
          if (countR > pageSizeR + skipper) {
            setSkip(skip + 1);
          } else {
            setFullyFetched(true);
          }
          setUserEnrollment({
            ...userEnrollment,
            data: [...userEnrollment.data, ...RES.data],
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

  const updateValidity = (date) => {
    console.log(validityDialogValue, "updating", date);
    updateEnrollmentValidity(validityDialogValue._id, date).then((res) => {
      console.log(res, "res for update date");
      let index = userEnrollment.findIndex(
        (item) => item._id == validityDialogValue._id
      );
      if (index > -1) {
        userEnrollment[index].validUpTo = date;
        setUserEnrollment(userEnrollment);
        if (res.data) {
          setNotifMessageType("success");
          setNotifMessage("Updated Successfully");
        } else {
          setNotifMessageType("error");
          setNotifMessage(res.problem);
        }
      }
      setValidityDialogValue(null);
    });
  };

  const MakeItAsPaid = () => {
    const CurrentIndexObject = userEnrollment[CurrentOp];
    patchUserWithEnrollPaid(CurrentIndexObject._id, {
      ...CurrentIndexObject,
      fee_paid: true,
    }).then(({ ok, data, problem }) => {
      if (ok) {
        const CopyOfUserEnrollment = { ...userEnrollment };
        CopyOfUserEnrollment[CurrentOp] = {
          ...CurrentIndexObject,
          fee_paid: true,
        };
        setUserEnrollment(CopyOfUserEnrollment);
        setCurrentOp(-1);
      }
    });
  };
  return user.role !== "admin" ? (
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
  ) : (
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
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Enrollments</h2>
        </div>
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <div className="row px-3 mt-3">
          <div className="filterDiv w-100 rounded p-3 shadow-sm">
            <p className="text-primary w-100 mb-0 ">
              Showing {filteredUsers.length} users
            </p>
          </div>
        </div>
        <section className="w-100 mt-3">
          <div className="card shadow-sm" style={{ height: "66vh" }}>
            <BottomScrollListener onBottom={loadMoreData} offset={300}>
              {(scrollRef) => (
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
                        <th>Enrollment Date</th>
                        <th>Phone</th>
                        {/* <th>Type</th> */}
                        <th>Fee</th>
                        <th>Valid Up To</th>
                        <th style={{ maxWidth: 100 }}>Lecture Title</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!isEmpty(userEnrollment) &&
                        filteredUsers.map(
                          (
                            {
                              _id,
                              name,
                              Course,
                              fee,
                              user_id,
                              phone,
                              fee_paid,
                              createdAt,
                              validUpTo,
                            },
                            index
                          ) => (
                            <tr key={_id}>
                              <th className="align-middle" scope="row">
                                {index + 1}
                              </th>
                              <th className="align-middle">{name}</th>
                              <th className="align-middle">
                                {moment(createdAt).format("DD-MM-YYYY")}
                              </th>
                              <th className="align-middle">
                                {!!phone ? phone : ""}
                              </th>
                              {/* <th className="align-middle">
                                {type.toUpperCase()}
                              </th> */}
                              <th className="align-middle small-plus">
                                {`Rs ${fee}`}
                              </th>
                              <th className="align-middle">
                                {moment(validUpTo).format("DD-MM-YYYY")}
                              </th>
                              <th
                                className="align-middle small-plus"
                                style={{ maxWidth: 150 }}
                              >
                                {Course != null && Course.name
                                  ? Course.name
                                  : "N/A"}
                              </th>
                              <td className="align-middle text-center">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setValidityDialogValue({ _id, validUpTo });
                                  }}
                                  type="button"
                                  className="btn btn-success btn-sm waves-effect px-3 waves-light"
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
        dialogAction={MakeItAsPaid}
        dialogMessage={`Are you sure? `}
      />

      <ValidyDialog
        dialogOpen={validityDialogValue}
        setDialogOpen={setValidityDialogValue}
        dialogAction={updateValidity}
      />
    </main>
  );
};
Dashboard.getInitialProps = async (ctx) => {
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
