import React from "react";
import Router from "next/router";
import isEmpty from "lodash/isEmpty";
import Lectures from "@components/Lectures";
import LecturesStudent from "@components/LecturesStudent";

import { useSelector } from "react-redux";

import nextCookie from "next-cookies";

const Dashboard = () => {
  const user = useSelector(({ USER }) => USER.user);

  if (!isEmpty(user) && user.role !== "student") return <Lectures />;
  return <LecturesStudent />;
};

export default Dashboard;
