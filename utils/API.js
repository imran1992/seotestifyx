import { create } from "apisauce";
import Cookies from "universal-cookie";
import gql from "graphql-tag";
import cookie from "js-cookie";
//import { useQuery } from '@apollo/react-hooks';
import axios from "axios";

const cookies = new Cookies();

const base_url = "https://api.schoolx.pk";

const api = create({
  baseURL: "https://api.schoolx.pk",
  // baseURL: "https://www.weteach.schoolx.pk",
  // baseURL: "https://www.stagging.schoolx.pk",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookies.get("Authorization")}`,
  },
  timeout: 60000,
});

const user_api = create({
  baseURL: "https://api.schoolx.pk",
  // baseURL: "https://www.weteach.schoolx.pk",
  // baseURL: "https://www.stagging.schoolx.pk",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookie.get("Authorization")}`,
  },
  timeout: 60000,
});

const publicApi = create({
  baseURL: "https://api.schoolx.pk",
  // baseURL: "https://www.weteach.schoolx.pk",
  // baseURL: "https://www.stagging.schoolx.pk",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

const api2 = create({
  baseURL: "https://api.schoolx.pk",
  // baseURL: "https://www.stagging.schoolx.pk",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${cookies.get("Authorization")}`,
  },
  timeout: 60000,
});

const publicApi2 = create({
  baseURL: "https://api.schoolx.pk",
  // baseURL: "https://www.stagging.schoolx.pk",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

const monitor = (response) => console.log("API SAUCE RESPONSE ", response);
api.addMonitor(monitor);

// users

const userLogin = (data) => {
  return api
    .post("/authentication", { ...data, strategy: "local" })
    .then((response) => {
      return response;
    });
};
const userHandleActive = (id, activeState) => {
  return api.patch("/users", { active: !activeState }).then((response) => {
    return response;
  });
};

const userDelete = (id) => {
  return api.delete(`/users/${id}`).then((response) => {
    return response;
  });
};
const changePassword = (data) => {
  return api.post("/authentication/changePassword", data).then((response) => {
    return response;
  });
};

const resetPassword = (id, password) => {
  return api.patch(`/users/${id}`, { password }).then((response) => {
    return response;
  });
};
const getUser = (id) => {
  return api.get(`/users/${id}`).then((response) => {
    return response;
  });
};
const getUserByPhone = (phone) => {
  return api.get("/users", { phone }).then((response) => {
    return response;
  });
};
const getUsers = (skip = 0) => {
  return api
    .get(
      `/users?$sort[createdAt]=-1&$populate=classRoom&$limit=100&$skip=${100 *
        skip}`
    )
    .then((response) => {
      // console.log("RESPO", response.data.data);
      return response;
    });
};

const getUserById = (id, token) => {
  return axios
    .get(`${base_url}/users/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response;
    });
};

const activateUser = (id, active) => {
  return api.patch(`/users/${id}`, { active: !active }).then((response) => {
    return response;
  });
};
const updateUser = (id, data) => {
  return api.patch(`/users/${id}`, data).then((response) => {
    return response;
  });
};
const userRegister = (data) => {
  console.log("userRegisterData", data);
  return api.post("/users", data).then((response) => {
    console.log("userRegisterResponse", response);
    return response;
  });
};

// lectures

const createLecture = (data) => {
  return api.post("/lectures", data).then((response) => {
    return response;
  });
};

const getLectures = () => {
  return api
    .get("/lectures", {
      $sort: { title: 1 },
      $populate: ["subject", "user", "classRoom"],
    })
    .then((response) => {
      return response;
    });
};

const getLecturesByTeacher = (teacherId) => {
  return api.get(`/lectures?teacherId=${teacherId}`).then((response) => {
    return response;
  });
};

const getPublicLectures = () => {
  return publicApi
    .get("/lectures", {
      $sort: { title: 1 },
      $populate: ["subject", "user", "classRoom"],
    })
    .then((response) => {
      return response;
    });
};

const getLecture = (id) => {
  return api
    .get(`/lectures/${id}`, { $populate: ["subject", "user", "classRoom"] })
    .then((response) => {
      return response;
    });
};

const getLinkForMeeting = (id) => {
  return api.get(`/joinmeeting/${id}`).then((response) => {
    return response;
  });
};

const endMeeting = (id) => {
  return api.delete(`/joinmeeting/${id}`).then((response) => {
    return response;
  });
};

const meetingEnded = (id) => {
  return api.get(`/meetingended/${id}`).then((response) => {
    return response;
  });
};
const updateLecture = (id, data) => {
  console.log(data);
  return api.patch(`/lectures/${id}`, data).then((response) => {
    return response;
  });
};
const deleteLecture = (id) => {
  return api.delete(`/lectures/${id}`).then((response) => {
    return response;
  });
};
const subscribeToLecture = ({ id }, data) => {
  return api.patch(`/lectures/${id}`, data).then((response) => {
    return response;
  });
};

// lecture series

const createLectureSeries = (data) => {
  return api.post("/courses", data).then((response) => {
    return response;
  });
};

const getLectureSeries = () => {
  return (
    api
      .get("/courses", { $populate: ["subject", "user"] })
      // .get('/lectureseries', { $populate: ['subject', 'user'] })
      .then((response) => {
        return response;
      })
  );
};

const getClassesDTO = () => {
  return gql`
    {
      findClassRoom(query: {}) {
        _id
        name
      }
    }
  `;
};

const getPublicLectureSeries = (id) => {
  return gql`
    {
      findCourse(query: {}) {
        _id
        name
        description
        subscribers
        teacher {
          fullName
          phone
          country
        }
        lectures {
          name
          description
          startTime
        }
        recorded_url
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
            name
          }
        }
      }
    }
  `;
};

// const getPublicLectureSeries = () => {
//   return publicApi
//     .get("/lectureseries", { $populate: ["subject", "user"] })
//     .then((response) => {
//       return response;
//     });
// };

const getAllCourses = (id) => {
  return api.get(`/courses?teacherId=${id}`).then((response) => {
    return response;
  });
};

const getSpecificLectureSeries = (id) => {
  return api.get("/lectures", { lectureSeries: id }).then((response) => {
    return response;
  });
};
const getLectureSerie = (id) => {
  return api
    .get(`/courses/${id}`, { $populate: ["subject", "user"] })
    .then((response) => {
      return response;
    });
};
const updateLectureSerie = (id, data) => {
  return api.patch(`/courses/${id}`, data).then((response) => {
    return response;
  });
};
const deleteLectureSerie = (id) => {
  return api.delete(`/courses/${id}`).then((response) => {
    return response;
  });
};
const subscribeToLectureSerie = ({ id }, data) => {
  return api.patch(`/lectureseries/${id}`, data).then((response) => {
    return response;
  });
};

const updateEnrollmentValidity = (id, date) => {
  return api
    .patch(`/enrollments/${id}`, { validUpTo: date })
    .then((response) => {
      return response;
    });
};

const enrollToCourse = (data) => {
  return api.post("/enrollments", data).then((response) => {
    // console.log("Dump", response);
    return response;
  });
};

const getUserWithEnroll = (skip = 0) => {
  return api
    .get(`/enrollments?$sort[createdAt]=-1&$limit=100&$skip=${100 * skip}`)
    .then((response) => {
      return response;
    });
};

const patchUserWithEnrollPaid = (id, data) => {
  return api.patch(`/enrollments/${id}`, data).then((response) => {
    return response;
  });
};

// subjects

const createSubject = (data) => {
  return api.post("/subjects", data).then((response) => {
    return response;
  });
};

const getSubjects = () => {
  return api.get("/subjects").then((response) => {
    return response;
  });
};
const getSubject = (id) => {
  return api.get(`/subjects/${id}`).then((response) => {
    return response;
  });
};
const updateSubject = (id, data) => {
  return api.patch(`/subjects/${id}`, data).then((response) => {
    return response;
  });
};
const deleteSubject = (id) => {
  return api.delete(`/subjects/${id}`).then((response) => {
    return response;
  });
};

// Subject tests

const createSubjectTest = (data) => {
  return api2.post("/tests", data).then((response) => {
    return response;
  });
};

const getSubjectTests = () => {
  return api2.get("/tests").then((response) => {
    return response;
  });
};
const getSubjectTest = (id) => {
  return api2.get(`/tests/${id}`).then((response) => {
    return response;
  });
};
const updateSubjectTest = (id, data) => {
  return api2.patch(`/tests/${id}`, data).then((response) => {
    return response;
  });
};
const deleteSubjectTest = (id) => {
  return api2.delete(`/ tests / ${id} `).then((response) => {
    return response;
  });
};

// Tests admin side
const createMcq = (data) => {
  return api2.post("/mcqs", data).then((response) => {
    return response;
  });
};

const getMcqs = () => {
  return api2.get("/mcqs").then((response) => {
    return response;
  });
};

const getMcqsByTeacherId = (id) => {
  return api2.get(`/mcqs?teacherId=${id}`).then((response) => {
    return response;
  });
};
const getMcq = (id) => {
  return api2.get(`/mcqs/${id}`).then((response) => {
    return response;
  });
};
const updateMcq = (id, data) => {
  return api2.patch(`/mcqs/${id}`, data).then((response) => {
    return response;
  });
};
const deleteMcq = (id) => {
  return api2.delete(`/mcqs/${id}`).then((response) => {
    return response;
  });
};

// Feedbacks

const createFeedback = (data) => {
  return api.post("/feedbacks", data).then((response) => {
    return response;
  });
};

const getFeedbacks = () => {
  return api.get("/feedbacks").then((response) => {
    return response;
  });
};
const getFeedback = (id) => {
  return api.get("/feedbacks", { query: { user: id } }).then((response) => {
    return response;
  });
};
const updateFeedback = (id, data) => {
  return api.patch(`/ feedbacks / ${id} `, data).then((response) => {
    return response;
  });
};
const deleteFeedback = (id) => {
  return api.delete(`/ feedbacks / ${id} `).then((response) => {
    return response;
  });
};

// Classes

const createClass = (data) => {
  return api.post("/classrooms", data).then((response) => {
    return response;
  });
};

const getClasses = () => {
  return api.get("/classrooms").then((response) => {
    return response;
  });
};
const getClass = (id) => {
  return api.get(`/classrooms/${id}`).then((response) => {
    return response;
  });
};
const updateClass = (id, data) => {
  return api.patch(`/classrooms/${id}`, data).then((response) => {
    return response;
  });
};
const deleteClass = (id) => {
  return api.delete(`/classrooms/${id}`).then((response) => {
    return response;
  });
};

export {
  userLogin,
  userRegister,
  userDelete,
  getUserById,
  resetPassword,
  changePassword,
  getUsers,
  getUserByPhone,
  activateUser,
  getUser,
  updateUser,
  userHandleActive,
  createLecture,
  getLectures,
  getPublicLectures,
  getLecture,
  getLecturesByTeacher,
  getLinkForMeeting,
  meetingEnded,
  endMeeting,
  updateLecture,
  deleteLecture,
  subscribeToLecture,
  createLectureSeries,
  getLectureSerie,
  getLectureSeries,
  getPublicLectureSeries,
  getAllCourses,
  getSpecificLectureSeries,
  updateLectureSerie,
  deleteLectureSerie,
  subscribeToLectureSerie,
  createSubject,
  getSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  createSubjectTest,
  getSubjectTest,
  getSubjectTests,
  updateSubjectTest,
  deleteSubjectTest,
  createMcq,
  getMcq,
  getMcqs,
  getMcqsByTeacherId,
  updateMcq,
  deleteMcq,
  createFeedback,
  getFeedback,
  getFeedbacks,
  updateFeedback,
  deleteFeedback,
  createClass,
  getClass,
  getClasses,
  updateClass,
  deleteClass,
  enrollToCourse,
  getUserWithEnroll,
  patchUserWithEnrollPaid,
  updateEnrollmentValidity,
  getClassesDTO,
};