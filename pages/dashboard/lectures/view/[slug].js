import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";
import LectureViewStudent from "@components/LectureViewStudent";
import LectureView from "@components/LectureView";
import { useDispatch, useSelector } from "react-redux";
import { deleteLecture, getLecture, updateLecture } from "@utils/API";
import { ExtractDateAndTime, timeLefter } from "@utils/utilities";
import isEmpty from "lodash/isEmpty";

import nextCookie from "next-cookies";

const Dashboard = () => {
  const dispatch = useDispatch();
  const Router = useRouter();
  const { pathname, query } = Router;
  const [lecture, setLecture] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("danger");
  const { slug } = query;
  const user = useSelector(({ USER }) => USER.user);

  useEffect(() => {}, []);

  return user.role === "teacher" ? (
    <LectureView />
  ) : (
    <LectureViewStudent role={user.role} />
  );
};
Dashboard.getInitialProps = async ctx => {
  const { pathname } = ctx;
  const { slug } = ctx.query;
  const returnto = pathname.replace("[slug]", slug);
  const { Authorization } = nextCookie(ctx);
  // if (ctx.req && !Authorization) {
  //   ctx.res.writeHead(302, { Location: `/login?returnto=${returnto}` }).end();
  // } else if (!Authorization) {
  //   document.location.pathname = `/login?returnto=${returnto}`;
  // } else return { Authorization };
  return { Authorization };
};
export default Dashboard;
