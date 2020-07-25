import React,{useEffect} from "react";
import { useSelector } from "react-redux";
import nextCookie from "next-cookies";
import Router from 'next/router';
import IntroMenu from "@components/IntroSection/introMenu"

const LandingPage = (props) => {
  const { user } = useSelector((state) => state["USER"]);
  console.log(props.isMobileView, 'isMobileView', user);
  
  useEffect(() => {
    const {pathname} = Router
    let classId = localStorage.getItem("selected-class")

    if(classId != null ){
      Router.push(`/online-courses/${classId || user._id}`)
    }else if(props.isMobileView != null){
        Router.push('/programs')
    }
  });

  return (
     <IntroMenu apolloClient={null} apolloState={null} />
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

    console.log(isMobileView, 'isMobileView', user);
    
    if (ctx.req && Authorization) {
      if (user && user.role === "student")
        ctx.res.writeHead(302, { Location: "/online-courses/"+user.classRoom }).end();
      else ctx.res.writeHead(302, { Location: "/online-class"}).end();
    } else if (Authorization) {
      if (user && user.role === "student")
        document.location.pathname = "/online-courses/"+user.classRoom;
      else document.location.pathname = "/online-class";
    } else 
    return { Authorization, isMobileView };  
};


export default LandingPage;
