import React from "react";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import LecturesStudent from "@components/LecturesStudent";
import LecturesTeacher from "@components/LecturesTeacher";
import nextCookie from "next-cookies";

const Lectures = () => {
  const { user } = useSelector((state) => state["USER"]);
  const AllowedTeacherorAdmin =
    user.role === "teacher" || user.role === "admin";
  return !isEmpty(user) && AllowedTeacherorAdmin ? (
    <LecturesTeacher />
  ) : (
    <LecturesStudent />
  );
};

Lectures.getInitialProps = async (ctx) => {
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && !Authorization) {
    ctx.res.writeHead(302, { Location: "/login" }).end();
  } else if (!Authorization) {
    document.location.pathname = "/login";
  } else return { Authorization };
};

export default Lectures;