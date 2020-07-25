import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import Head from "next/head";
import nextCookie from "next-cookies";
import Notif from "@components/Notif";

import ClassesSlider from "@components/UpComingClasses/ClassesSlider";
import Loader from "@components/shared/loader";
import SliderHeader from "@components/SliderHeader";

import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../lib/apollo'
import gql from 'graphql-tag';

import CoursesSlider from "@components/Courses/CoursesSlider";
import { useDispatch, useSelector } from "react-redux";

const DashboardReal = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lectures, setLectures] = useState({});
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");


  const user = useSelector(({ USER }) => USER.user);
  let qry = user.role == 'admin' ? `{}` : `{teacherId:"${user._id}"}`
  const GET_LECTURES = gql`
  {
    findLecture(query: ${qry}) {
      _id,
      name
      startTime
      duration
      keywords
      description
      tutor {
        _id
        name
      },
      meetingInfo,
      recorded_url,
    }
  }
  `

  var LectiresByTeacher = useQuery(
    GET_LECTURES,
    {
      variables: { __skip: 0, __limit: 30 },
      // notifyOnNetworkStatusChange: true,
    }
  )

  useEffect(()=>{
    
  if (user.role === "student") {
    Router.push("/online-class");
  }
  },[])
  

  useEffect(() => {
      if(LectiresByTeacher){
        if(LectiresByTeacher.data && LectiresByTeacher.data.findLecture){
          let datalist = LectiresByTeacher.data.findLecture;
let myUpComingLectures= [];
          datalist.map((lecture) => {
            const { startTime } = lecture;
            const staringAt = new Date(startTime).getTime();
            const currentTime = new Date().getTime();
            const isClassOver = staringAt - currentTime < 0;
            if (!isClassOver) myUpComingLectures.push(lecture);
          });

          console.log(myUpComingLectures, 'ooooooooooo');
          
          setLectures(myUpComingLectures);
        }
        console.log(LectiresByTeacher,  'LectiresByTeacher');
      }
    }, [ LectiresByTeacher]);


  
  return (
    <main
      className={
        !user.role || user.role === "student"
          ? "pl-0 pt-5 w-75 mx-auto mainStudent"
          : "pt-5 mx-lg-5"
      }
    >
      <Head>
        <title>
          Lectures | SchoolX, the leading online learning platform in Pakistan
        </title>
        <meta property="og:title" content='Courses & lectures' />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>
      <div className="container-fluid">
        <Notif
          setNotifMessage={setNotifMessage}
          notifMessage={notifMessage}
          notifMessageType={notifMessageType}
        />
        <div className="row">
          <h2 className="h6 w-100 rounded p-2 mt-2 mb-3 dashHeading">
            All Upcoming Lectures
          </h2>
        </div>

        <div className="container mt-5">
 <SliderHeader
            title="Upcoming Classes"
            subTitle="From your courses"
            // linkRef="/online-courses/upcoming-classes"
            linkText="View all"
            // onClickLinkText={() => localStorage.setItem("courseId", courseId)}
          />

          {lectures.length < 1 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "30vh",
              }}
            >
              <Loader showOnlyLoader={true} size="small" />
            </div>
          ) : !isEmpty(lectures) ? (
            <ClassesSlider lectures={lectures} forTeacher={true} />
          ) : (
            <div className={"alert alert-info w-100 my-3"} role="alert">
              There is no results based on your filters.
            </div>
          )}
        </div>
      
      </div>
    </main>
  );
};
DashboardReal.getInitialProps = async ctx => {
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
export default withApollo(DashboardReal);
