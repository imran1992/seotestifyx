import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateClass, getClass,
} from '@utils/API';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import useInput from '@components/useInput';

import nextCookie from 'next-cookies';

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const {pathname, query} = Router;
  const {slug} = query;
  const [input, handleInputChange] = useInput();
  const [loading, setLoading] = useState(false);
  const [classRoom, setClass] = useState({});
  const [notifMessage, setNotifMessage] = useState('');
  const [notifMessageType, setNotifMessageType] = useState('error');

  const user = useSelector(({USER}) => USER.user);

  useEffect(()=>{
    if(user._id){
      Router.push(`/profile/${user._id}`);
    }
  },[])

  return <div />;
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
