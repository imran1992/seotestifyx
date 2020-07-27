import React, { useState, useEffect } from "react";
import groupBy from "lodash/groupBy";
import Step1 from "./components/step1";
import Loader from "@components/shared/loader";
import GraphQL from "@components/shared/graphQL";

const CLASSES_QUERY = `
{
    findClassRoom(query:{}){
        _id,
        name,
        category
    }
}
`;

const User_Class = ({ appolo, gql }) => {
  const { useQuery } = appolo;

  const [classGroups, setGroups] = useState(null);
  const [selectedClass, setClass] = useState({ index: -1 });

  const { loading, data } = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
    if (!loading && data.findClassRoom.length) {
      let groups = groupBy(data.findClassRoom || [], "category");
      setGroups(groups);
    }
  }, [loading]);


  return (
    <div className="onboarding d-flex justify-content-center align-items-center flex-column mt-3">
      {loading ? (
        <Loader />
      ) : (
          <Step1
            groups={classGroups}
            selectedClass={selectedClass}
            onClassSelect={item => setClass(item)}
          />
        )}
    </div>
  );
};

export default GraphQL( User_Class)