import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Dialog from '@components/Dialog';
import isEmpty from 'lodash/isEmpty';
import Head from "next/head";
import { useDispatch, useSelector } from 'react-redux';
import { getMcqsByTeacherId,getMcqs, deleteMcq } from '@utils/API';
import { ExtractDateAndTime, timeLefter } from '@utils/utilities';

import { InlineMath, BlockMath } from 'react-katex';

import nextCookie from 'next-cookies';

const Mcqs = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [subjects, setMcqs] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subjectToDelete, setMcqToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('error');
  const user = useSelector(({ USER }) => USER.user);


  const removeMcq = () => {
    setLoading(true);
    deleteMcq(subjectToDelete)
      .then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          let deletedMcqIndex = null;
          for (let i = 0; i < subjects.data.length; i++) {
            const el = subjects.data[i];
            if (el._id === subjectToDelete) { deletedMcqIndex = i; }
          }
          console.log('deletedMcqIndex', deletedMcqIndex);

          setMcqs({ ...subjects, data: [...subjects.data.slice(0, deletedMcqIndex), ...subjects.data.slice(deletedMcqIndex + 1)] });
          setNotifMessage('Mcq successfully deleted.');
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
    if(user.role == 'teacher'){
      getMcqsByTeacherId(user._id).then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setMcqs(data);
        } else {
          setNotifMessageType('error');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
      });
    }else if(user.role == 'admin'){
      getMcqs().then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          setMcqs(data);
        } else {
          setNotifMessageType('error');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
      });
    }

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
      <div className="container-fluid mt-5">
        <div className="row">
          <ol className="breadcrumb">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                Router.push(`${pathname}/add`);
              }}
              className="btn btn-primary waves-effect waves-light"
            >
              Add MCQs
            </button>
            {/* <button type="button" className="btn btn-outline-primary waves-effect">
              Primary
            </button> */}
          </ol>
        </div>
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">MCQs</h2>
        </div>
        <section className="w-100">
          <div className="card">
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(subjects) ? subjects.data.map(({ _id, name }, index) => (
                    <tr key={_id}>
                      <th className="align-middle" scope="row">
                        {index + 1}
                      </th>
                      <th className="align-middle">{name ? name.split("&lt;Math&gt;").map((ele, id) => {
                        if (id % 2 != 0) {
                          return (<InlineMath>{ele}</InlineMath>)
                        } else {
                          return ele
                        }
                      }) : ""}</th>
                      <td className="align-middle text-center">
                        <button
                          onClick={(e) => { e.preventDefault(); setMcqToDelete(_id); setDialogOpen(true); }}
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
      <Dialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} dialogAction={removeMcq} dialogMessage="Do you really want to delete this subject ?" />
    </main>
  );
};
Mcqs.getInitialProps = async (ctx) => {
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
export default Mcqs;
