import React, { useEffect } from "react";
import { useRouter } from "next/router";
import LecturesStudent from "@components/LecturesStudent";
import { initializeStore } from "../../redux/store";
import { isEmpty, orderBy } from "lodash";
import { initApolloClient } from "@apolloX/apollo";
import gql from "graphql-tag";
const Course = ({ initialData }) => {
  const router = useRouter();
  const { slug } = router.query;
  return <LecturesStudent courseId={slug} initialData={initialData} />;
};
export const getServerSideProps = async ({ req, res, query, params }) => {
  const { slug } = query;
  const apolloClient = initApolloClient(); // initializeApollo();
  const { getState } = initializeStore();
  const { user } = getState().USER;
  const ALL_LECTURE_SERIES = gql`
  {
    findClassRoom(query: { _id: "${
      !isEmpty(user) && user["classRoom"] ? user["classRoom"] : slug
    }" }) {
      _id
      name
      category
      description
      
    }
  }
`;
  const ALL_LECTURE_SERIES_IF_NO_COURSE_ID = gql`
    {
      findCourse(query: {}) {
        _id
        name
        price
        description
        subscribers
        teacher {
          _id
          fullName
          phone
          country
        }
        lectures {
          _id
          name
          description
          duration
          price
          startTime
          meetingID
          keywords
          image_url
          meetingInfo
        }
        tests {
          name
          mcqs {
            name
            options
            answer
            answer_index
          }
        }
        subject {
          name
          classRoom {
            _id
            name
            category
            description
          }
        }
      }
    }
  `;
  const getMutationToCall = () => {
    if ((!isEmpty(user) && user["classRoom"]) || slug) {
      return ALL_LECTURE_SERIES;
    } else {
      return ALL_LECTURE_SERIES_IF_NO_COURSE_ID;
    }
  };
  // await apolloClient.query({
  //   query: getMutationToCall(),
  //   variables: {
  //     skip: 0,
  //     first: 10,
  //   },
  // });
  //const initialData = apolloClient.cache.extract();
  const { data } = await apolloClient.query({
    query: getMutationToCall(),
    variables: {
      skip: 0,
      first: 10,
    },
  });
  console.log("serverSideDataAtOnline-Courses: ", data);
  return {
    props: {
      initialData: data,
    },
  };
};
export default Course;
