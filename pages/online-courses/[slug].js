import React, { useEffect } from "react";
import { useRouter } from "next/router";
import LecturesStudent from "@components/LecturesStudent";

const Course = () => {
  const router = useRouter();
  const { slug } = router.query;
  return <LecturesStudent courseId={slug} />;
};

export default Course;
