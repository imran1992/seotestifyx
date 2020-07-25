import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Zoom,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  LinearProgress,
  Slide,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import nextCookie from "next-cookies";
import Head from "next/head";
import PhoneInput from "react-phone-input-2";
import Router, { useRouter } from "next/router";
import {
  userLogin,
  getUserByPhone,
  resetPassword,
  getUserById,
} from "@utils/API";
import { useDispatch } from "react-redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import { config } from "@utils/Firebase";
import { nextLogout, nextLogin, saveToken } from "@utils/nextAuth";
import isEmpty from "lodash/isEmpty";

const jwt = require("jwt-decode");

// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import isEmpty from "lodash/isEmpty";
// import useInput from "@components/useInput";
// import {
//   userLogin,
//   getUserByPhone,
//   resetPassword,
//   getUserById,
// } from "@utils/API";
// import { nextLogout, nextLogin, saveToken } from "@utils/nextAuth";
// import PhoneInput from "react-phone-input-2";
// import Notif from "@components/Notif";
// import { withApollo } from "../../lib/apollo";
// // import cookie from "js-cookie";
// import gql from "graphql-tag";
// import { useMutation } from "@apollo/react-hooks";
// // import jwt from 'jsonwebtoken';
// var jwt = require("jwt-decode");

// const ADD_TODO = gql`
//   mutation authentication($type: String!) {
//     authentication(type: $type) {
//       phone
//       password
//       strategy
//     }
//   }
// `;

const useStyles = makeStyles((theme) => {
  const { breakpoints } = theme;

  return {
    container: {
      width: "100%",
      height: "100vh",
      position: "relative",
    },
    formContainer: {
      // width: "90%",
      width: "100%",
      maxWidth: "30em",
      // backgroundColor: "#fff",
      margin: "0 auto",
      position: "absolute",
      right: 0,
      left: 0,
      // top: "7.5%",
      top: "12%",
      // boxShadow: "2px 2px 5px #cccccc",
      // padding: "2em",
      marginTop: "3.5em",
      // marginBottom: "3em",
      [breakpoints.up("sm")]: {
        top: "15%",
      },
      [breakpoints.up("md")]: {
        top: "20%",
        backgroundColor: "#fff",
        boxShadow: "2px 2px 5px #cccccc",
      },
    },
    formHeading: {
      fontWeight: 700,
      color: "#7b1fa2",
      textAlign: "center",
      // [breakpoints.up("md")]: {
      //   textAlign: "left",
      // },
    },
    formSubHeading: {
      fontWeight: 700,
      textAlign: "center",
      textTransform: "uppercase",
      // marginTop: "1.25em",
      color: "#525252",
    },
    formMain: {
      width: "100%",
      // marginTop: "2em",
      marginTop: "1em",
    },
    formPhoneNumberContainer: {
      display: "flex",
      flexDirection: "column",
    },
    formPhoneNumberLabel: {
      fontSize: "0.85em",
      color: "#7b1fa2",
    },
    formPhoneContainer: {
      width: "100%",
      // marginBottom: "2em",
    },
    formPhoneInput: {
      width: "100% !important",
      border: "none !important",
      outline: "none !important",
      borderRadius: "0px !important",
      borderBottom: "2px solid #7b1fa2 !important",
      boxShadow: "none !important",
      backgroundColor: "transparent !important",
    },
    formPhoneInputError: {
      borderBottom: "2px solid #f44336 !important",
    },
    formPhoneNumberErrorText: {
      fontSize: "0.85em",
      color: "#f44336",
      marginTop: "0.25em",
      marginBottom: "1em",
    },
    formPhoneDropdown: {
      borderRadius: "0px !important",
      "&.open": {
        backgroundColor: "transparent !important",
      },
    },
    formPhoneDropdownBtn: {
      backgroundColor: "transparent !important",
    },
    formInput: {
      width: "100%",
      // marginBottom: "2em",
      marginBottom: "1em",
    },
    iconBtn: {
      "&:hover, &:active, &:focus": {
        backgroundColor: "transparent",
      },
    },
    formInputUnderline: {
      "&:after": {
        borderBottom: `2px solid #7b1fa2`,
      },
    },
    formInputLabel: {
      color: "#7b1fa2",
    },
    formInputLabelFocused: {
      color: "#7b1fa2 !important",
    },
    actionsContainer: {
      display: "flex",
      alignItems: "center",
    },
    nextStepActionsContainer: {
      flexDirection: "column",
      [breakpoints.up("sm")]: {
        flexDirection: "row",
        justifyContent: "center",
      },
    },
    confirmCodeContainer: {
      marginTop: "4em",
    },
    mayBeLaterBtnContainer: {},
    registerMeBtnContainer: {},
    registerMeBtn: {},
    mayBeLaterBtn: {
      marginTop: "1em",
      [breakpoints.up("sm")]: {
        marginTop: 0,
        marginLeft: "1em",
      },
    },
    forgotPassContainer: {
      flex: 1,
      display: "flex",
    },
    forgotPass: {
      color: "#d32f2f",
      fontSize: 14,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    loginBtnContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "flex-end",
    },
    loginBtn: {
      backgroundColor: "#7b1fa2",
      "&:hover, &:active, &:focus": {
        backgroundColor: "#7b1fa2",
      },
    },
    createNewAccountContainer: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1.5em",
    },
    createNewAccount: {
      fontSize: 14,
    },
    createNewAccountBtn: {
      fontWeight: 700,
      // display: "block",
      textAlign: "center",
      color: "#7b1fa2",
      cursor: "pointer",
      paddingLeft: 5,
      "&:hover": {
        textDecoration: "underline",
      },
      // [breakpoints.up("md")]: {
      //   display: "inline-block",
      //   paddingLeft: 5,
      // },
    },
    formLoader: {
      [breakpoints.down("sm")]: {
        maxWidth: "23em",
        margin: "0 auto",
      },
    },
    progressColorPrimary: {
      backgroundColor: "#7b1fa2",
    },
    progressBarColorPrimary: {
      backgroundColor: "#ce93d8",
    },
    confirmCodeDescription: {
      fontSize: 14,
      marginTop: "1em",
      textAlign: "center",
    },
  };
});

const loginPage = () => {
  const classes = useStyles();
  const [formFields, updateFormFields] = useState({
    phoneNumber: { text: undefined, isError: false, helperText: "" },
    password: { text: undefined, isError: false, helperText: "" },
    smsCode: { text: undefined, isError: false, helperText: "" },
    newPassword: { text: undefined, isError: false, helperText: "" },
  });
  const [passType, updatePassType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("warning");
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [showCodeConfirmation, setShowCodeConfirmation] = useState(false);
  const [goodSmsCode, setGoodSmsCode] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState({});
  const [userToReset, setUserToReset] = useState("");
  const [resendCodeTimer, setResendCodeTimer] = useState(60);
  const [timer, setTimer] = useState(null);
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { returnto } = query;
  const phone_regex = new RegExp(/^\+92 [1-9][0-9]{2}-[0-9]{7}$/, "i");

  let sanitizedPhone = "";

  if (formFields["phoneNumber"]["text"]) {
    sanitizedPhone = formFields["phoneNumber"]["text"]
      .replace(/ /g, "")
      .replace(/-/g, "");
  }

  const handleUpdateFormFields = (ev) => {
    const { name, value } = ev["target"];
    let updatedFormFields = { ...formFields };
    updatedFormFields[name]["text"] = value;
    updateFormFields(updatedFormFields);
  };

  const handleClickShowPassword = () => {
    updatePassType("password");
  };

  const handleMouseDownPassword = () => {
    updatePassType("text");
  };

  const startTimer = () => {
    if (resendCodeTimer < 0) {
      setResendCodeTimer(60);
    }
    if (!timer) {
      setTimer(setTimeout(() => setResendCodeTimer(resendCodeTimer - 1), 1000));
    } else {
      setTimeout(() => setResendCodeTimer(resendCodeTimer - 1), 1000);
    }
  };

  useEffect(() => {
    if (timer) {
      if (resendCodeTimer < 0) {
        clearInterval(timer);
      } else {
        startTimer();
      }
    }
  }, [resendCodeTimer]);

  const onRegisterSubmit = () => {
    if (validateForm()) {
      setLoading(true);
      const appVerifier = window["recaptchaVerifier"];
      firebase
        .auth()
        .signInWithPhoneNumber(`${sanitizedPhone}`, appVerifier)
        .then((confirmationRes) => {
          setLoading(true);
          setConfirmationResult(confirmationRes);
          setShowCodeConfirmation(true);
        })
        .catch((error) => {
          const { message } = error;
          if (!message.includes("internal error")) {
            setMessage(message);
            console.log("firebase error", error);
            setLoading(false);
            setMessageType("warning");
          }
        });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (firebase.apps.length === 0) {
      firebase.initializeApp(config);
    }
    firebase.auth().useDeviceLanguage();
    window["recaptchaVerifier"] = new firebase.auth.RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback(response) {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onRegisterSubmit();
        },
      }
    );

    return () => {
      clearInterval(timer);
      setTimer(null);
    };
  }, []);

  const verifyPhoneNumber = () => {
    const { phoneNumber } = formFields;
    let updatedFormFields = { ...formFields };

    if (phoneNumber["text"] && !phone_regex.test(phoneNumber["text"])) {
      updatedFormFields["phoneNumber"]["isError"] = true;
      updatedFormFields["phoneNumber"]["helperText"] = "Invalid Phone number!";
      updateFormFields(updatedFormFields);
      return false;
    }

    if (!phoneNumber["text"]) {
      updatedFormFields["phoneNumber"]["isError"] = true;
      updatedFormFields["phoneNumber"]["helperText"] =
        "Phone number is required!";
      updateFormFields(updatedFormFields);
      return false;
    }

    if (phoneNumber["text"] && phone_regex.test(phoneNumber["text"])) {
      updatedFormFields["phoneNumber"]["isError"] = false;
      updatedFormFields["phoneNumber"]["helperText"] = "";
      updateFormFields(updatedFormFields);
      return true;
    }
  };

  const validateForm = () => {
    const { phoneNumber, password } = formFields;
    let updatedFormFields = { ...formFields };

    if (phoneNumber["text"] && !phone_regex.test(phoneNumber["text"])) {
      updatedFormFields["phoneNumber"]["isError"] = true;
      updatedFormFields["phoneNumber"]["helperText"] = "Invalid Phone number!";
    } else {
      updatedFormFields["phoneNumber"]["isError"] = false;
      updatedFormFields["phoneNumber"]["helperText"] = "";
    }

    if (!phoneNumber["text"] || !password["text"]) {
      if (!phoneNumber["text"]) {
        updatedFormFields["phoneNumber"]["isError"] = true;
        updatedFormFields["phoneNumber"]["helperText"] =
          "Phone number is required!";
      }

      if (phoneNumber["text"] && phone_regex.test(phoneNumber["text"])) {
        updatedFormFields["phoneNumber"]["isError"] = false;
        updatedFormFields["phoneNumber"]["helperText"] = "";
      }

      if (!password["text"]) {
        updatedFormFields["password"]["isError"] = true;
        updatedFormFields["password"]["helperText"] = "Password is required!";
      } else {
        updatedFormFields["password"]["isError"] = false;
        updatedFormFields["password"]["helperText"] = "";
      }

      updateFormFields(updatedFormFields);
      return false;
    } else {
      updatedFormFields["phoneNumber"]["isError"] = false;
      updatedFormFields["password"]["isError"] = false;
      updatedFormFields["phoneNumber"]["helperText"] = "";
      updatedFormFields["password"]["helperText"] = "";
      updateFormFields(updatedFormFields);
      return true;
    }
  };

  const handleForgotPass = (callType) => {
    if (verifyPhoneNumber()) {
      setLoading(true);
      let resultData = null;
      getUserByPhone(`${sanitizedPhone}`)
        .then((response) => {
          const { ok, data, problem } = response;
          const appVerifier = window["recaptchaVerifier"];
          if (problem) {
            throw new Error(problem);
          } else if (!ok && data && data.message) {
            throw new Error(data.message);
          } else if (!data.total) {
            throw new Error(
              "There is no schoolX account under this phone number."
            );
          } else {
            resultData = data;
            return firebase
              .auth()
              .signInWithPhoneNumber(`${sanitizedPhone}`, appVerifier);
          }
        })
        .then((confirmationRes) => {
          setConfirmationResult(confirmationRes);
          setUserToReset(resultData.data[0]._id);
          if (callType !== "resend-code") {
            setShowCodeConfirmation(true);
            startTimer();
          }
          setMessage(`An OTP Code has been sent to ${sanitizedPhone}`);
          setMessageType("success");
          setShowError(true);
          setLoading(false);
        })
        .catch((error) => {
          const { message } = error;
          if (!message.includes("internal error")) {
            setMessageType("warning");
            setMessage(message);
            setLoading(false);
            setShowError(true);
          }
        });
    }
  };

  const verifyResetPasswordCriteria = () => {
    let updatedFormFields = { ...formFields };

    if (!formFields["smsCode"]["text"]) {
      updatedFormFields["smsCode"]["isError"] = true;
      updatedFormFields["smsCode"]["helperText"] = "SMS Code is required!";
    } else {
      updatedFormFields["smsCode"]["isError"] = false;
      updatedFormFields["smsCode"]["helperText"] = "";
    }

    if (!formFields["newPassword"]["text"]) {
      updatedFormFields["newPassword"]["isError"] = true;
      updatedFormFields["newPassword"]["helperText"] =
        "New Password is required!";
    } else {
      updatedFormFields["newPassword"]["isError"] = false;
      updatedFormFields["newPassword"]["helperText"] = "";
    }

    updateFormFields(updatedFormFields);

    if (
      updatedFormFields["smsCode"]["isError"] &&
      updatedFormFields["newPassword"]["isError"]
    ) {
      return false;
    } else {
      return true;
    }
  };

  const goResetPassword = () => {
    if (verifyResetPasswordCriteria() && !isEmpty(confirmationResult)) {
      setLoading(true);
      confirmationResult["confirm"](formFields["smsCode"]["text"])
        .then((result) => {
          // User signed in successfully.
          // console.log(result, "result for new sms");
          // const { user } = result;
          // setGoodSmsCode(true);
          // setMessageType("success");
          // setMessage("Fill your new reset password.");
          // setLoading(false);
          // setShowError(true);
          // setTimeout(() => {
          //   setShowError(false);
          // }, 3000);
          resetPasswordNow();
        })
        .catch((error) => {
          // const { message } = error;
          setMessageType("warning");
          setMessage("The SMS verification code is incorrect.");
          setLoading(false);
          setShowError(true);
        });
    }
  };


  const resetPasswordNow = () => {
    // setLoading(true);
    if (formFields["newPassword"]["text"]) {
      resetPassword(userToReset, formFields["newPassword"]["text"]).then(
        (response) => {
          const { ok, data, problem } = response;
          if (ok) {
            userLogin({
              phone: sanitizedPhone,
              password: formFields["newPassword"]["text"],
            }).then(async (response) => {
              const { ok, data, problem } = response;
              if (ok) {
                var decoded = jwt(data.accessToken);
                if (decoded.userId) {
                  let userDetail = await getUserById(
                    decoded.userId,
                    data.accessToken
                  );
                  // console.log(userDetail, "userDetail");
                  if (data.accessToken && userDetail.data) {
                    dispatch({ type: "LOGED_IN", payload: userDetail.data });
                    nextLogin(data.accessToken, userDetail.data.role, returnto);
                  } else {
                    setMessageType("warning");
                    setMessage("Sorry. Your account is no longer active.");
                    setShowError(true);
                  }
                }
              } else if (data) {
                setMessageType("warning");
                setMessage(data.message || problem);
                setShowError(true);
              } else {
                setMessageType("warning");
                setMessage(problem);
                setShowError(true);
              }
              setLoading(false);
            });
          } else {
            setLoading(false);
            setMessageType("warning");
            setMessage("An error occured while trying to reset the password.");
            setShowError(true);
          }
        }
      );
    } else {
      setLoading(false);
      setMessageType("warning");
      setMessage("The SMS verification code is incorrect.");
      setShowError(true);
    }
  };

  // const logintoAccount = () => {
  //   if (validateForm()) {
  //     setLoading(true);
  //     userLogin({
  //       phone: `${sanitizedPhone}`,
  //       password: formFields["password"]["text"],
  //     })
  //       .then(async (response) => {
  //         const { ok, data, problem } = response;
  //         if (ok) {
  //           var decoded = jwt(data.accessToken);
  //           if (decoded.userId) {
  //             let userDetail = await getUserById(
  //               decoded.userId,
  //               data.accessToken
  //             );
  //             if (userDetail.data.active) {
  //               window.gtag("event", "Login", {
  //                 event_category: "Login",
  //                 event_label: userDetail.data.role,
  //                 value: 1,
  //               });
  //               dispatch({ type: "LOGED_IN", payload: userDetail.data });
  //               nextLogin(data.accessToken, userDetail.data.role, returnto);
  //             } else {
  //               setMessageType("warning");
  //               setMessage("Sorry. Your account is no longer active.");
  //               setShowError(true);
  //             }
  //           }
  //         } else if (data) {
  //           setMessageType("warning");
  //           setMessage(data.message || problem);
  //           setShowError(true);
  //         } else {
  //           setMessageType("warning");
  //           setMessage(problem);
  //           setShowError(true);
  //         }
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         setMessageType("warning");
  //         setMessage(err.message);
  //         setShowError(true);
  //       });
  //   }
  // };
  const logintoAccount = () => {
    if (validateForm()) {
      setLoading(true);
      let token = null;
      userLogin({
        phone: `${sanitizedPhone}`,
        password: formFields["password"]["text"],
      })
        .then((response) => {
          const { ok, data, problem } = response;
          if (problem && problem !== "CLIENT_ERROR") {
            setLoading(false);
            throw new Error(problem);
          } else if (!ok && data && data.message) {
            setLoading(false);
            throw new Error(data.message);
          } else {
            const decoded = jwt(data.accessToken);
            if (decoded.userId) {
              setLoading(false);
              token = data.accessToken;
              return getUserById(decoded.userId, data.accessToken);
            } else {
              setLoading(false);
              throw new Error("Something went wrong! Please try again!");
            }
          }
        })
        .then((userDetail) => {
          // console.log(userDetail, "userDetail")
          if (token && userDetail.data) {
            window.gtag("event", "Login", {
              event_category: "Login",
              event_label: userDetail.data.role,
              value: 1,
            });
            dispatch({ type: "LOGED_IN", payload: userDetail.data });
            nextLogin(token, userDetail.data.role, returnto);
          } else {
            throw new Error("Sorry. Your account is no longer active.");
          }
        })
        .catch((err) => {
          setMessageType("warning");
          setMessage(err.message);
          setShowError(true);
          setLoading(false);
        });
    }
  };

  // const dispatch = useDispatch();
  // const [forgotSwitch, setForgotSwitch] = useState(false);
  // const [messageType, setMessageType] = useState("warning");
  // const [userToReset, setUserToReset] = useState("");
  // const [phone, setPhone] = useState("");
  // const [goodSmsCode, setGoodSmsCode] = useState(false);
  // const [input, handleInputChange] = useInput();
  // const { pathname, query } = useRouter();
  // const { returnto } = query;
  // const { password, smsCode, passwordToReset } = input;
  // const phone_regex = new RegExp(/^\+92 [1-9][0-9]{2}-[0-9]{7}$/, "i");
  // const validLogin = phone_regex.test(phone) && !isEmpty(password);
  // const validJustPhone = phone_regex.test(phone);
  // const validLoginReset = phone_regex.test(phone) && !isEmpty(passwordToReset);
  // const sanitizedPhone = phone.replace(/ /g, "").replace(/-/g, "");

  // const handlePhoneChange = (e) => {
  //   const inputX = e.target.value;
  //   // eslint-disable-next-line security/detect-unsafe-regex
  //   const phone_regex = new RegExp(
  //     /^\+92 ([1-9][0-9]{0,2})?-?[0-9]{0,7}$/,
  //     "i"
  //   );
  //   let result = inputX || "+92 ";
  //   result = result.replace(/^\+92 ([0-9]{3})([0-9]{1})/g, "+92 $1-$2");
  //   if (phone_regex.test(result)) {
  //     setPhone(result);
  //   }
  // };

  // const logintoAccount = () => {
  //   setLoading(true);
  //   // addTodo({ variables: { phone: sanitizedPhone, password, strategy: "local" } }).then(res => {
  //   //   console.log(res, 'res for the login')
  //   // })

  //   userLogin({ phone: sanitizedPhone, password }).then(async (response) => {
  //     const { ok, data, problem } = response;
  //     if (ok) {
  //       var decoded = jwt(data.accessToken, { complete: true });
  //       if (decoded.userId) {
  //         let userDetail = await getUserById(decoded.userId, data.accessToken);
  //         if (userDetail.data.active) {
  //           window.gtag("event", "Login", {
  //             event_category: "Login",
  //             event_label: userDetail.data.role,
  //             value: 1,
  //           });
  //           dispatch({ type: "LOGED_IN", payload: userDetail.data });
  //           nextLogin(data.accessToken, userDetail.data.role, returnto);
  //         } else {
  //           setMessageType("warning");
  //           setMessage("Sorry. Your account is no longer active.");
  //         }
  //       }
  //     } else if (data) {
  //       setMessageType("warning");
  //       setMessage(data.message || problem);
  //     } else {
  //       setMessageType("warning");
  //       setMessage(problem);
  //     }
  //     setLoading(false);
  //   });
  // };

  // const forgotPass = () => {
  //   if (!phone && phone.length < 13)
  //     setMessage("Please give a valid Schoolx account phone number");
  //   else {
  //     setLoading(true);
  //     getUserByPhone(sanitizedPhone).then((response) => {
  //       const { ok, data, problem } = response;
  //       if (ok) {
  //         if (data.total) {
  //           const appVerifier = window.recaptchaVerifier;
  //           firebase
  //             .auth()
  //             .signInWithPhoneNumber(sanitizedPhone, appVerifier)
  //             .then((confirmationResult) => {
  //               console.log(data.data[0]._id);
  //               console.log("fire confirmationResult", confirmationResult);
  //               setLoading(true);
  //               setConfirmationResult(confirmationResult);
  //               setUserToReset(data.data[0]._id);
  //               setDialogOpen(true);
  //             })
  //             .catch((error) => {
  //               const { message } = error;
  //               if (!message.includes("internal error")) {
  //                 setMessage(message);
  //                 console.log("firebase error", error);
  //                 setLoading(false);
  //               }
  //             });
  //         } else {
  //           setMessageType("warning");
  //           setMessage("There is no schoolX account under this phone number.");
  //           setLoading(false);
  //         }
  //       } else if (data) {
  //         setMessageType("warning");
  //         setMessage(data.message || problem);
  //       } else {
  //         setMessageType("warning");
  //         setMessage(problem);
  //       }
  //       setLoading(false);
  //     });
  //   }
  // };

  // const goResetPassword = () => {
  //   setLoading(true);
  //   confirmationResult
  //     .confirm(smsCode)
  //     .then((result) => {
  //       // User signed in successfully.
  //       console.log(result, "result for new sms");
  //       const { user } = result;
  //       setGoodSmsCode(true);
  //       setMessageType("success");
  //       setMessage("Fill your new reset password.");
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       const { message } = error;
  //       setMessageType("warning");
  //       setMessage("The SMS verification code is incorrect.");
  //       setLoading(false);
  //     });
  // };

  // const resetPasswordNow = () => {
  //   setLoading(true);
  //   if (passwordToReset) {
  //     resetPassword(userToReset, passwordToReset).then((response) => {
  //       const { ok, data, problem } = response;
  //       if (ok) {
  //         userLogin({ phone: sanitizedPhone, password: passwordToReset }).then(
  //           async (response) => {
  //             const { ok, data, problem } = response;
  //             if (ok) {
  //               var decoded = jwt(data.accessToken, { complete: true });
  //               if (decoded.userId) {
  //                 let userDetail = await getUserById(
  //                   decoded.userId,
  //                   data.accessToken
  //                 );
  //                 console.log(userDetail, "userDetail");
  //                 if (
  //                   userDetail.data.active != undefined &&
  //                   userDetail.data.active != null
  //                 ) {
  //                   dispatch({ type: "LOGED_IN", payload: userDetail.data });
  //                   nextLogin(data.accessToken, userDetail.data.role, returnto);
  //                 } else {
  //                   setMessageType("warning");
  //                   setMessage("Sorry. Your account is no longer active.");
  //                 }
  //               }
  //             } else if (data) {
  //               setMessageType("warning");
  //               setMessage(data.message || problem);
  //             } else {
  //               setMessageType("warning");
  //               setMessage(problem);
  //             }
  //             setLoading(false);
  //           }
  //         );
  //       } else {
  //         setLoading(false);
  //         setMessageType("warning");
  //         setMessage("An error occured while trying to reset the password.");
  //       }
  //     });
  //   } else {
  //     setLoading(false);
  //     setMessageType("warning");
  //     setMessage("The SMS verification code is incorrect.");
  //   }
  // };

  // const onRegisterSubmit = () => {
  //   setLoading(true);
  //   const appVerifier = window.recaptchaVerifier;
  //   firebase
  //     .auth()
  //     .signInWithPhoneNumber(sanitizedPhone, appVerifier)
  //     .then((confirmationResult) => {
  //       console.log("fire confirmationResult", confirmationResult);

  //       setLoading(true);
  //       setConfirmationResult(confirmationResult);
  //       setDialogOpen(true);
  //     })
  //     .catch((error) => {
  //       const { message } = error;
  //       if (!message.includes("internal error")) {
  //         setMessage(message);
  //         console.log("firebase error", error);
  //         setLoading(false);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   if (firebase.apps.length === 0) {
  //     firebase.initializeApp(config);
  //   }
  //   firebase.auth().useDeviceLanguage();
  //   window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  //     "recaptcha",
  //     {
  //       size: "invisible",
  //       callback(response) {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         onRegisterSubmit();
  //       },
  //     }
  //   );
  // }, []);

  const errorMessageFormat = () => {
    if (message === "Invalid login") {
      return "Invalid Phone Number or Password!";
    } else {
      return message;
    }
  };

  return (
    <div className={classes.container}>
      <Head>
        <meta
          property="og:title"
          content="SCHOOLX leading online learning platform"
        />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform | login"
        />
      </Head>
      <Zoom in={true}>
        <div
          className={`${classes.formContainer} ${
            showForgetPassword || showCodeConfirmation
              ? classes.confirmCodeContainer
              : ""
          }`}
        >
          {loading && (
            <LinearProgress
              className={classes.formLoader}
              classes={{
                colorPrimary: classes.progressColorPrimary,
                barColorPrimary: classes.progressBarColorPrimary,
              }}
            />
          )}
          <div style={{ padding: "2em" }}>
            <Typography
              variant="h6"
              component="h6"
              className={`${classes.formHeading}`}
            >
              Welcome to SchoolX
            </Typography>

            {!showCodeConfirmation && !showForgetPassword && (
              <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                <div>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={`${classes.formSubHeading}`}
                  >
                    Sign In
                  </Typography>
                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={logintoAccount}
                  >
                    <div className={`${classes.formPhoneNumberContainer}`}>
                      <Typography
                        component="p"
                        className={`${classes.formPhoneNumberLabel}`}
                      >
                        Phone Number *
                      </Typography>
                      <PhoneInput
                        placeholder="Phone Number"
                        containerClass={classes.formPhoneContainer}
                        inputClass={`${classes.formPhoneInput} ${
                          formFields["phoneNumber"]["isError"]
                            ? classes.formPhoneInputError
                            : ""
                        }`}
                        containerStyle={{
                          marginBottom: formFields["phoneNumber"]["isError"]
                            ? 0
                            : "1em",
                        }}
                        dropdownClass={classes.formPhoneDropdown}
                        buttonClass={classes.formPhoneDropdownBtn}
                        country="pk"
                        value={sanitizedPhone.replace("+", "")}
                        onChange={(value, data, event, formattedValue) =>
                          handleUpdateFormFields({
                            target: {
                              name: "phoneNumber",
                              value: formattedValue,
                            },
                          })
                        }
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                      />
                      {formFields["phoneNumber"]["isError"] && (
                        <Typography
                          component="p"
                          className={`${classes.formPhoneNumberErrorText}`}
                        >
                          {formFields["phoneNumber"]["helperText"]}
                        </Typography>
                      )}
                    </div>

                    <TextField
                      required
                      type={passType}
                      label="Password"
                      name="password"
                      value={formFields["password"]["text"]}
                      className={classes.formInput}
                      placeholder="Password"
                      error={formFields["password"]["isError"]}
                      helperText={formFields["password"]["helperText"]}
                      focused={true}
                      InputLabelProps={{
                        className: classes.formInputLabel,
                        focused: true,
                        classes: { focused: classes.formInputLabelFocused },
                      }}
                      InputProps={{
                        classes: { underline: classes.formInputUnderline },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              className={classes.iconBtn}
                            >
                              {passType === "text" ? (
                                <Visibility
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              ) : (
                                <VisibilityOff
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleUpdateFormFields}
                    />

                    <div className={`${classes.actionsContainer}`}>
                      <div className={`${classes.forgotPassContainer}`}>
                        <Typography
                          component="p"
                          className={`${classes.forgotPass}`}
                          onClick={() => setShowForgetPassword(true)}
                        >
                          Forgot password?
                        </Typography>
                      </div>
                      <div className={`${classes.loginBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn}`}
                          onClick={logintoAccount}
                          disabled={loading}
                        >
                          Login
                        </Button>
                      </div>
                    </div>
                    <div className={classes.createNewAccountContainer}>
                      <Typography
                        component="p"
                        className={`${classes.createNewAccount}`}
                      >
                        Don't have an account?{" "}
                        <span
                          className={`${classes.createNewAccountBtn}`}
                          onClick={() => Router.push("/register")}
                        >
                          Register Now
                        </span>
                      </Typography>
                    </div>
                  </form>
                </div>
              </Slide>
            )}

            {showForgetPassword && !showCodeConfirmation && (
              <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                <div style={{ marginTop: "1em" }}>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={`${classes.formSubHeading}`}
                  >
                    Forgot Password
                  </Typography>

                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={handleForgotPass}
                  >
                    <div className={`${classes.formPhoneNumberContainer}`}>
                      <Typography
                        component="p"
                        className={`${classes.formPhoneNumberLabel}`}
                      >
                        Phone Number *
                      </Typography>
                      <PhoneInput
                        placeholder="Phone Number"
                        containerClass={classes.formPhoneContainer}
                        inputClass={`${classes.formPhoneInput} ${
                          formFields["phoneNumber"]["isError"]
                            ? classes.formPhoneInputError
                            : ""
                        }`}
                        containerStyle={{
                          marginBottom: formFields["phoneNumber"]["isError"]
                            ? 0
                            : "1em",
                        }}
                        dropdownClass={classes.formPhoneDropdown}
                        buttonClass={classes.formPhoneDropdownBtn}
                        country="pk"
                        value={sanitizedPhone.replace("+", "")}
                        onChange={(value, data, event, formattedValue) =>
                          handleUpdateFormFields({
                            target: {
                              name: "phoneNumber",
                              value: formattedValue,
                            },
                          })
                        }
                        inputProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                      />
                      {formFields["phoneNumber"]["isError"] && (
                        <Typography
                          component="p"
                          className={`${classes.formPhoneNumberErrorText}`}
                        >
                          {formFields["phoneNumber"]["helperText"]}
                        </Typography>
                      )}
                    </div>

                    <div
                      className={`${classes.actionsContainer} ${classes.nextStepActionsContainer}`}
                    >
                      <div className={`${classes.registerMeBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn} ${classes.registerMeBtn}`}
                          onClick={handleForgotPass}
                          disabled={loading}
                        >
                          Send Code
                        </Button>
                      </div>
                      <div className={`${classes.mayBeLaterBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.mayBeLaterBtn}`}
                          onClick={() => setShowForgetPassword(false)}
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </Slide>
            )}

            {showCodeConfirmation && !goodSmsCode && (
              <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                <div>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={`${classes.formSubHeading}`}
                  >
                    One More Step
                  </Typography>

                  <Typography
                    component="p"
                    className={`${classes.confirmCodeDescription}`}
                  >
                    Please enter the SMS code you received on{" "}
                    <span style={{ fontWeight: "bold", marginRight: 5 }}>
                      {sanitizedPhone}
                    </span>
                    and New Password
                  </Typography>

                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={goResetPassword}
                  >
                    <TextField
                      required
                      label="SMS Code"
                      name="smsCode"
                      value={formFields["smsCode"]["text"]}
                      className={classes.formInput}
                      placeholder="SMS Code"
                      error={formFields["smsCode"]["isError"]}
                      helperText={formFields["smsCode"]["helperText"]}
                      focused={true}
                      InputLabelProps={{
                        className: classes.formInputLabel,
                        focused: true,
                        classes: { focused: classes.formInputLabelFocused },
                      }}
                      InputProps={{
                        classes: { underline: classes.formInputUnderline },
                      }}
                      onChange={handleUpdateFormFields}
                    />

                    <TextField
                      required
                      type={passType}
                      label="New Password"
                      name="newPassword"
                      value={formFields["newPassword"]["text"]}
                      className={classes.formInput}
                      placeholder="Password"
                      error={formFields["newPassword"]["isError"]}
                      helperText={formFields["newPassword"]["helperText"]}
                      focused={true}
                      InputLabelProps={{
                        className: classes.formInputLabel,
                        focused: true,
                        classes: { focused: classes.formInputLabelFocused },
                      }}
                      InputProps={{
                        classes: { underline: classes.formInputUnderline },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              className={classes.iconBtn}
                            >
                              {passType === "text" ? (
                                <Visibility
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              ) : (
                                <VisibilityOff
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleUpdateFormFields}
                    />

                    <div
                      className={`${classes.actionsContainer} ${classes.nextStepActionsContainer}`}
                    >
                      <div className={`${classes.registerMeBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn} ${classes.registerMeBtn}`}
                          onClick={goResetPassword}
                          disabled={loading}
                        >
                          Reset Password
                        </Button>
                      </div>
                      <div className={`${classes.mayBeLaterBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={resendCodeTimer > 0}
                          className={`${classes.mayBeLaterBtn}`}
                          onClick={() => {
                            handleForgotPass("resend-code");
                            setResendCodeTimer(60);
                            startTimer();
                          }}
                        >
                          Resend Code{" "}
                          {resendCodeTimer > 0 &&
                            `(${
                              resendCodeTimer < 10
                                ? "0" + resendCodeTimer
                                : resendCodeTimer
                            })`}
                        </Button>
                      </div>
                      {/* <div className={`${classes.mayBeLaterBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.mayBeLaterBtn}`}
                          onClick={() => setShowCodeConfirmation(false)}
                        >
                          May be later
                        </Button>
                      </div> */}
                    </div>
                  </form>
                </div>
              </Slide>
            )}

            {/* {goodSmsCode && (
              <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                <div>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={`${classes.formSubHeading}`}
                  >
                    Enter New Password
                  </Typography>

                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={() => {}}
                  >
                    <TextField
                      required
                      type={passType}
                      label="New Password"
                      name="newPassword"
                      value={formFields["newPassword"]["text"]}
                      className={classes.formInput}
                      placeholder="Password"
                      error={formFields["newPassword"]["isError"]}
                      helperText={formFields["newPassword"]["helperText"]}
                      focused={true}
                      InputLabelProps={{
                        className: classes.formInputLabel,
                        focused: true,
                        classes: { focused: classes.formInputLabelFocused },
                      }}
                      InputProps={{
                        classes: { underline: classes.formInputUnderline },
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              className={classes.iconBtn}
                            >
                              {passType === "text" ? (
                                <Visibility
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              ) : (
                                <VisibilityOff
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={handleUpdateFormFields}
                    />

                    <div
                      className={`${classes.actionsContainer} ${classes.nextStepActionsContainer}`}
                    >
                      <div className={`${classes.registerMeBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn} ${classes.registerMeBtn}`}
                          onClick={resetPasswordNow}
                          disabled={loading}
                        >
                          Reset &amp; Log in
                        </Button>
                      </div>
                      <div className={`${classes.mayBeLaterBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.mayBeLaterBtn}`}
                          onClick={() => setGoodSmsCode(false)}
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </Slide>
            )} */}

            {showError && (
              <Alert severity={messageType} style={{ marginTop: 15 }}>
                {errorMessageFormat()}
              </Alert>
            )}

            <div id="recaptcha" />
          </div>
        </div>
      </Zoom>
    </div>
  );
};

loginPage.getInitialProps = async (ctx) => {
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && Authorization) {
    ctx.res.writeHead(302, { Location: "/" }).end();
  } else if (Authorization) {
    document.location.pathname = "/";
  } else return { Authorization };
};

export default loginPage;
