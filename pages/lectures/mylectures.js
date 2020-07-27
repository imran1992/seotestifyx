import React from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Lectures from "@components/Lectures";
import LecturesStudent from "@components/LecturesStudent";

import { useSelector } from "react-redux";

export default () => {
  const { push } = useRouter();
  const user = useSelector(({ USER }) => USER.user);
   return <Lectures />;
};
