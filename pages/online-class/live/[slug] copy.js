/* eslint-disable nonblock-statement-body-position */
// @ts-nocheck
/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "date-fns";
import Dialog from "@components/Dialog";
import { useSelector, useDispatch } from "react-redux";
import { getLinkForMeeting, getLecture, endMeeting, getUser } from "@utils/API";
import CircularProgress from "@material-ui/core/CircularProgress";
import Notif from "@components/Notif";
import { isEmpty } from "lodash";
import nextCookie from "next-cookies";

const Dashboard = () => {
  let Mover = 0;
  const Router = useRouter();
  const { query } = Router;
  const { slug } = query;
  const [loading, setLoading] = useState(true);
  const [lectureLink, setLectureLink] = useState("");
  const [lecture, setLecture] = useState({});
  const [hideMe, setHideMe] = useState(true);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("logout");
  const user = useSelector(({ USER }) => USER.user);
  const goEndMeeting = () => {
    if (user.role === "student") {
      Router.push("/online-class");
    } else {
      endMeeting(slug).then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          Router.push("/online-class");
        } else if (data) alert(data.message || problem);
        else alert(problem);
      });
    }
  };
  useEffect(() => {
    getLinkForMeeting(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setLectureLink(data);
        setLoading(false);
      } else {
        setLoading(false);
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
    getLecture(slug).then((response) => {
      const { ok, data, problem } = response;
      if (ok) {
        setLecture(data);
        if (data.title)
          if (!isEmpty(user)) {
            const { role } = user;
            if (role === "teacher") {
              window.gtag("event", "started", {
                event_category: "Classes",
                event_label: data.title,
                value: 1,
              });
            } else if (role === "student") {
              window.gtag("event", "joined", {
                event_category: "Classes",
                event_label: data.title,
                value: 1,
              });
            }
            console.log("Testing Role", `"${role}"`);
            console.log("Testing Title", `"${data.title}"`);
          }
      } else {
        setNotifMessageType("error");
        if (data) setNotifMessage(data.message || problem);
        else setNotifMessage(problem);
      }
    });
  }, []);

  return (
    <main
      className="pl-0 liveScreen"
      // onTouchStart={({ originalEvent: { touches } }) => {
      //   Mover = touches[0].clientY;
      //   alert("ggg");
      // }}
      // onTouchStart={() => {
      //   alert("ggg");
      // }}
      // onTouchEnd={({ originalEvent: { changedTouches } }) => {
      //   let atEnd = changedTouches[0].clientY;
      //   if (Mover > atEnd + 5) {
      //     setHideMe(false);
      //   } else if (Mover < atEnd - 5) {
      //     setHideMe(true);
      //   }
      //   setTimeout(() => {
      //     Mover = 0;
      //   }, 1000);
      // }}
    >
      <div
        className={"HeaderForLive"}
        style={{
          width: "100%",
          height: "7vh",
          zIndex: 5,
          backgroundColor: "#111111AA",
          position: "fixed",
          top: hideMe ? "-7vh" : 0,
          left: 0,
          alignItems: "center",
          transition: "top 0.2s ease-in-out",
        }}
        onMouseOut={() => {
          !hideMe && setHideMe(true);
        }}
      >
        <div>
          <img
            onMouseOver={() => {
              setHideMe(false);
            }}
            onClick={() => {
              setDialogType("endmeeting");
              setDialogOpen(true);
            }}
            src={"/images/close.png"}
            style={{ width: "4vh", height: "4vh", margin: "1.5vw 0 1.5vw 4vw" }}
          />
        </div>
      </div>
      <div
        onMouseOver={() => {
          hideMe && setHideMe(false);
        }}
        style={{
          width: "100vw",
          height: 2,
          zIndex: 3,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></div>
      <style>{`
        .sidebar-fixed.position-fixed {
          display: none;
        }
      `}</style>
      <Notif
        setNotifMessage={setNotifMessage}
        notifMessage={notifMessage}
        notifMessageType={notifMessageType}
      />
      {loading ? (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-center align-items-center w-100"
        >
          <CircularProgress
            style={{ top: 50 }}
            className="text-primary position-relative"
          />
        </div>
      ) : !lectureLink.url ? (
    
          <div
            style={{ height: "100vh" }}
            className="d-flex justify-content-center align-items-center w-100"
          >
            <div className={"alert alert-info mt-5 mx-4"} role="alert">
              {lectureLink.info}
            </div>
          </div>
    
      ) : (
        <iframe
          allowFullScreen
          title="Live lecture"
          src={lectureLink.url}
          onLoad={() => {
            setHideMe(true);
          }}
          style={{
            width: "100vw",
            height: "100vh",
            border: "none",
            bottom: 0,
            position: "absolute",
          }}
          allow="geolocation; microphone; camera; fullscreen"
        />
      )}
      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={goEndMeeting}
        dialogMessage={
          dialogType === "logout"
            ? "Do you really want to disconnect ?"
            : user.role === "student"
            ? "Do you really want to leave this lecture ? You can still come back."
            : "Do you really want to end the lecture ? All participants will be kicked."
        }
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
export default Dashboard;
