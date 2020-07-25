import React from "react";
import Router from "next/router";
import { connect } from "react-redux";
import { setClass } from "@redux/actions/index";

const Step1 = (props) => {

  const { groups, onClassSelect, selectedClass, setUserClass } = props;
  const classId = selectedClass ? selectedClass._id : "";

  return (
    <div className="choose-class text-center">
      {groups &&
        Object.keys(groups).map((group_name, i) => {
          const group_classes = groups[group_name] || [];

          return (
            <div key={i}>
              <h4 className="sub-title">{group_name}</h4>

              <div className="classes-grid items-grid mt-4">
                {group_classes.map((classObj, j) => {
                  const { name, sup, _id } = classObj;

                  return (
                    <button
                      className={`grid-item item-card category text-center ${
                        _id === classId ? "active" : ""
                      }`}
                      key={j}
                      onClick={() => {
                        onClassSelect(classObj);
                      }}
                    >
                      <span className="text-normal">{name}</span>
                      {sup ? <sup>th</sup> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Action button */}
      <button
        className={`action-btn mt-5 mb-5 ${classId ? "" : "disabled"}`}
        onClick={() => {
          if (classId) {
            setUserClass(selectedClass);
            //   console.log(selectedClass);
            Router.push(`/online-courses/${selectedClass["_id"]}`);
            // Router.push("/online-courses", "/online-courses");
          }
        }}
      >
        GET STARTED
      </button>
    </div>
  );
};

export default Step1;

// export default connect(
//   null,
//   { setUserClass: setClass }
//   // @ts-ignore
// )(
//   React.memo((props) => {
//     const { groups, selectedClass, onClassSelect, setUserClass } = props;
//     const classId = selectedClass ? selectedClass._id : "";

//     return (
//       <div className="choose-class text-center">
//         {groups &&
//           Object.keys(groups).map((group_name, i) => {
//             const group_classes = groups[group_name] || [];

//             return (
//               <div key={i}>
//                 <h4 className="sub-title">{group_name}</h4>

//                 <div className="classes-grid items-grid mt-4">
//                   {group_classes.map((classObj, j) => {
//                     const { name, sup, _id } = classObj;

//                     return (
//                       <button
//                         className={`grid-item item-card category text-center ${
//                           _id === classId ? "active" : ""
//                         }`}
//                         key={j}
//                         onClick={() => {
//                           onClassSelect(classObj);
//                         }}
//                       >
//                         <span className="text-normal">{name}</span>
//                         {sup ? <sup>th</sup> : null}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}

//         {/* Action button */}
//         <button
//           className={`action-btn mt-5 mb-5 ${classId ? "" : "disabled"}`}
//           onClick={() => {
//             if (classId) {
//               setUserClass(selectedClass);
//               //   console.log(selectedClass);
//               Router.push(`/course/${selectedClass["_id"]}`);
//               // Router.push("/online-courses", "/online-courses");
//             }
//           }}
//         >
//           GET STARTED
//         </button>
//       </div>
//     );
//   })
// );
