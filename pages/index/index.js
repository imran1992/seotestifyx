import React, { useEffect } from "react";
import nextCookie from "next-cookies";
import Router from "next/router";
import IntroMenu from "@components/IntroSection/introMenu";

const LandingPage = (props) => {
  useEffect(() => {
    const { pathname } = Router;
    let classId = localStorage.getItem("selected-class");

    if (classId != null) {
      Router.push(`/online-courses/${classId}`);
    } else if (props.isMobileView != null) {
      Router.push("/programs");
    }
  });

  return <IntroMenu apolloClient={null} apolloState={null} />;
};

LandingPage.getInitialProps = async (ctx) => {
 // const { user } = ctx.store.getState().USER;
  const { Authorization } = nextCookie(ctx);

  let isMobileView = (ctx.req
    ? ctx.req.headers["user-agent"]
    : navigator.userAgent
  ).match(/Android|BlackBerry|iPhone|IEMobile/i);

  //console.log(isMobileView, "isMobileView", user);

  if (ctx.req && Authorization) {
    ctx.res.writeHead(302, { Location: "online-course/5ed44d34c1ee05304c0b5513" }).end();
  } else if (Authorization) {
    document.location.pathname = "online-course/5ed44d34c1ee05304c0b5513";
  } else return { Authorization, isMobileView };
};

export default LandingPage;
