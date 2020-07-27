import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Dialog from '@components/Dialog';
import isEmpty from 'lodash/isEmpty';

import {useDispatch, useSelector} from 'react-redux';
import {getClasses, deleteClass} from '@utils/API';
import {ExtractDateAndTime, timeLefter} from '@utils/utilities';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const [classes, setClasses] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('danger');
  const user = useSelector(({USER}) => USER.user);


  const removeClass = () => {
    setLoading(true);
    deleteClass(classToDelete)
      .then((response) => {
        const {ok, data, problem} = response;
        if (ok) {
          let deletedClassIndex = null;
          for (let i = 0; i < classes.data.length; i++) {
            const el = classes.data[i];
            if (el._id === classToDelete) { deletedClassIndex = i; }
          }
          console.log('deletedClassIndex', deletedClassIndex);

          setClasses({...classes, data: [...classes.data.slice(0, deletedClassIndex), ...classes.data.slice(deletedClassIndex + 1)]});
          setNotifMessage('Class successfully deleted.');
          setNotifMessageType('success');
          setTimeout(() => {
            setNotifMessage('');
          }, 3000);
        } else {
          setNotifMessageType('danger');
          if (data) setNotifMessage(data.message || problem);
          else setNotifMessage(problem);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    getClasses().then((response) => {
      const {ok, data, problem} = response;
      if (ok) {
        setClasses(data);
      } else {
        setNotifMessageType('danger');
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  if (user.role !== 'admin') {
    return <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className={'alert alert-danger mt-5 mx-5 w-100'} role="alert">
        You are not allowed to access this page.
      </div>
    </main>;
  }
  return (
    <main className={user.role === 'student' ? 'pl-0 pt-5 w-75 mx-auto mainStudent' : 'pt-5 mx-lg-5'}>
      <div className="container-fluid mt-5">
        <div className="row">
          <ol className="breadcrumb">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                Router.push(`${pathname }/add`);
              }}
              className="btn btn-primary waves-effect waves-light"
            >
              Add a class
            </button>
            {/* <button type="button" className="btn btn-outline-primary waves-effect">
              Primary
            </button> */}
          </ol>
        </div>
        <div className="row">
          <h2 className="h5 w-100 rounded p-2 mt-3 dashHeading">Classes</h2>
        </div>
        {notifMessage ? (
          <div className={`alert alert-${notifMessageType} mt-5 mx-0`} role="alert">
            {notifMessage}
          </div>
        ) : null}
        <section className="w-100">
          <div className="card">
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Class</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!isEmpty(classes.data) ? classes.data.map(({_id, name}, index) => (
                    <tr key={_id}>
                      <th className="align-middle" scope="row">
                        {index + 1}
                      </th>
                      <th className="align-middle">{name}</th>
                      <td className="align-middle text-center">
                        <button
                          onClick={(e) => { e.preventDefault(); setClassToDelete(_id); setDialogOpen(true); }}
                          type="button"
                          className="btn btn-danger btn-sm waves-effect px-3 waves-light"
                        >
                          <i style={{fontSize: 15}} className="fa fa-trash-o" />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); Router.push(`${pathname}/edit/${_id}`); }}
                          type="button"
                          className="btn btn-success btn-sm waves-effect px-3 waves-light"
                        >
                          <i style={{fontSize: 15}} className="fa fa-pencil-square-o" />
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
      <Dialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} dialogAction={removeClass} dialogMessage="Do you really want to delete this class ?" />
    </main>
  );
};
Dashboard.getInitialProps = async (ctx) => {
  const {pathname} = ctx;
  const {slug} = ctx.query;
  const returnto = pathname.replace('[slug]', slug);
  const {Authorization} = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, {Location: `/login?returnto=${returnto}`}).end();
  } else if (!Authorization) {
    document.location.pathname = `/login?returnto=${returnto}`;
  } else return {Authorization};
};
export default Dashboard;
