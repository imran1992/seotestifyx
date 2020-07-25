import React from "react";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import LecturesStudent from "@components/LecturesStudent";
import LecturesTeacher from "@components/LecturesTeacher";
import nextCookie from "next-cookies";
import Router from 'next/router';
import IntroMenu from "@components/IntroSection/introMenu"

const LandingPage = (props) => {
  const { user } = useSelector((state) => state["USER"]);
  console.log(props.isMobileView, 'isMobileView');
  
  return props.isMobileView != null ? (
    Router.push('/programs')
  ) : (
     <IntroMenu />
  );
};

LandingPage.getInitialProps = async (ctx) => {
  const { user } = ctx.store.getState().USER;
  const { Authorization } = nextCookie(ctx);

  let isMobileView = (ctx.req
    ? ctx.req.headers['user-agent']
    : navigator.userAgent).match(
      /Android|BlackBerry|iPhone|IEMobile/i
    )
  
    if (ctx.req && Authorization) {
      if (user && user.role === "student")
        ctx.res.writeHead(302, { Location: "/online-class" }).end();
      else ctx.res.writeHead(302, { Location: "/online-class" }).end();
    } else if (Authorization) {
      if (user && user.role === "student")
        document.location.pathname = "/online-class";
      else document.location.pathname = "/online-class";
    } else return { Authorization, isMobileView };
};

export default LandingPage;
