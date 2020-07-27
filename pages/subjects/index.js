import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '@components/Dialog';
import isEmpty from 'lodash/isEmpty';
import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import { getSubjects, deleteSubject } from '@utils/API';
import { ExtractDateAndTime, timeLefter } from '@utils/utilities';

import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../../lib/apollo'
import gql from 'graphql-tag';
import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [subjects, setSubjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('error');
  const user = useSelector(({ USER }) => USER.user);


  const removeSubject = () => {
    setLoading(true);
    deleteSubject(subjectToDelete)
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          let newSubjects = subjects.filter(item => item._id != subjectToDelete)
          setSubjects(newSubjects)
          setNotifMessage('Subject successfully deleted.');
          setNotifMessageType('success');

        } else {
          setNotifMessageType('error');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };




  const GET_SUBJECTS = gql`
  {
    findSubject(query:{ __skip: 0, __limit: 30 }){
      _id,
      name,
      classRoom{
        _id,
        name,
        category
      }
    }
  }
  `

  const { error, data, fetchMore, networkStatus, client, variables } = useQuery(
    GET_SUBJECTS,
    {
      variables: { __skip: 0, __limit: 30 },
      // notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(() => {
    console.log(data, 'data list id ', variables)
    if (data) {
      console.log(data, 'data of lectures')
      if (data.findSubject && data.findSubject) {
        setSubjects(data.findSubject);
      }
    }
  }, [data]);


  if (user.role !== 'admin') {
    return <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className={'alert alert-danger mt-5 mx-5 w-100'} role="alert">
        You are not allowed to access this page.
      </div>
    </main>;
  }
  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <Head>
        <meta
          property="og:title"
          content="SCHOOLX leading online learning platform"
        />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform | login"
        />
      </Head>
      <div className="container-fluid">

<div className="row dashHeading rounded" style={{ justifyContent: 'space-between' }}>
          <div className="50vh margin-0 ">
            <h2 className="h6" style={{ marginTop: 16 }}>
            Subjects
          </h2>
          </div>
          <div className="50vh margin-0" style={{ float: 'right' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                Router.push(`${pathname}/add`);
              }}
              className="btn btn-primary waves-effect waves-light"
            >
              Add a subject
            </button>
          </div>

        </div>
        {/* <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Subjects</h2>
        </div> */}
        <section className="w-100 mt-3">
          <div className="card">
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Subject</th>
                    <th>Class</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(subjects) ? subjects.map(({ _id, name, classRoom }, index) => (
                    <tr key={_id}>
                      <th className="align-middle" scope="row">
                        {index + 1}
                      </th>
                      <th className="align-middle">{name}</th>
                      <td className="align-middle">
                        {classRoom ? classRoom.name : ""}
                      </td>
                      <td className="align-middle text-center">
                        <button
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
                        </button>
                      </td>
                    </tr>
                  )) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <Dialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} dialogAction={removeSubject} dialogMessage="Do you really want to delete this subject ?" />
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
