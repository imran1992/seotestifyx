import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Zoom,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  MenuItem,
  // Grid,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  ListItemText,
  ListItem,
  List,
  Divider,
  LinearProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Visibility, VisibilityOff, Close } from "@material-ui/icons";
import nextCookie from "next-cookies";
import Head from "next/head";
import PhoneInput from "react-phone-input-2";
import Router, { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import { withApollo } from "../../lib/apollo";
import { useDispatch } from "react-redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import { config } from "@utils/Firebase";
import isEmpty from "lodash/isEmpty";
import { /* nextLogout,  */ nextLogin } from "@utils/nextAuth";
import {
  userRegister,
  // getClasses,
  userLogin,
  getUserById,
  getClassesDTO,
} from "@utils/API";

var jwt = require("jwt-decode");

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
      maxWidth: "35em",
      // backgroundColor: "#fff",
      margin: "0 auto",
      position: "absolute",
      right: 0,
      left: 0,
      top: "7.5%",
      // boxShadow: "2px 2px 5px #cccccc",
      // padding: "2em",
      marginTop: 0,
      // marginTop: "3.5em",
      // marginBottom: "3em",
      [breakpoints.up("sm")]: {
        top: "10%",
      },
      [breakpoints.up("md")]: {
        top: "12%",
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
      // marginTop: "0.5em",
      marginTop: 0,
      marginBottom: "1em",
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
    confirmCodeDescription: {
      fontSize: 14,
      marginTop: "1em",
      textAlign: "center",
      paddingLeft: "5%",
      paddingRight: "5%",
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
    appBar: {
      position: "relative",
      backgroundColor: "#7b1fa2",
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
      color: "#fff",
    },
    dialogBtn: {
      "&:hover, &:active, &:focus": {
        backgroundColor: "#7b1fa2",
      },
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
  };
});

const OptionsDialogList = (props) => {
  const classes = useStyles();

  const { open, setOpen, classesList, onChange } = props;

  return (
    <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
          <Typography variant="h6" className={classes.dialogTitle}>
            Choose Class
          </Typography>
        </Toolbar>
      </AppBar>
      <List>
        {classesList.map((record, i) => (
          <div key={i}>
            <ListItem button onClick={() => onChange(record["_id"])}>
              <ListItemText primary={record["name"]} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Dialog>
  );
};

const registerPage = () => {
  const classes = useStyles();
  const [formFields, updateFormFields] = useState({
    phoneNumber: { text: undefined, isError: false, helperText: "" },
    fullName: { text: undefined, isError: false, helperText: "" },
    password: { text: undefined, isError: false, helperText: "" },
    city: { text: undefined, isError: false, helperText: "" },
    userClass: { text: "none", isError: false, helperText: "" },
    role: { text: "student", isError: false, helperText: "" },
    smsCode: { text: undefined, isError: false, helperText: "" },
  });
  const [passType, updatePassType] = useState("password");
  const [classesList, updateClassesList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [resendCodeTimer, setResendCodeTimer] = useState(60);
  const [showCodeConfirmation, setShowCodeConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(null);
  const [messageType, setMessageType] = useState("warning");
  const [confirmationResult, setConfirmationResult] = useState({});
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

  const { error, data, networkStatus } = useQuery(getClassesDTO(), {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (data && data["findClassRoom"] && data["findClassRoom"]["length"]) {
      updateClassesList(data["findClassRoom"]);
    } else {
      updateClassesList([]);
    }
  }, [data]);

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

  const validateForm = () => {
    const { phoneNumber, password, fullName, city, userClass } = formFields;
    let updatedFormFields = { ...formFields };

    if (phoneNumber["text"] && !phone_regex.test(`${phoneNumber["text"]}`)) {
      updatedFormFields["phoneNumber"]["isError"] = true;
      updatedFormFields["phoneNumber"]["helperText"] = "Invalid Phone number!";
    } else {
      updatedFormFields["phoneNumber"]["isError"] = false;
      updatedFormFields["phoneNumber"]["helperText"] = "";
    }

    if (
      !phoneNumber["text"] ||
      !password["text"] ||
      !fullName["text"] ||
      !city["text"] ||
      !userClass["text"] ||
      userClass["text"] === "none"
    ) {
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

      if (!password["text"]) {
        updatedFormFields["password"]["isError"] = true;
        updatedFormFields["password"]["helperText"] = "Password is required!";
      } else {
        updatedFormFields["password"]["isError"] = false;
        updatedFormFields["password"]["helperText"] = "";
      }

      if (!fullName["text"]) {
        updatedFormFields["fullName"]["isError"] = true;
        updatedFormFields["fullName"]["helperText"] = "Name is required!";
      } else {
        updatedFormFields["fullName"]["isError"] = false;
        updatedFormFields["fullName"]["helperText"] = "";
      }

      if (!city["text"]) {
        updatedFormFields["city"]["isError"] = true;
        updatedFormFields["city"]["helperText"] = "City is required!";
      } else {
        updatedFormFields["city"]["isError"] = false;
        updatedFormFields["city"]["helperText"] = "";
      }

      if (!userClass["text"] || userClass["text"] === "none") {
        updatedFormFields["userClass"]["isError"] = true;
        updatedFormFields["userClass"]["helperText"] = "Class is required!";
      } else {
        updatedFormFields["userClass"]["isError"] = false;
        updatedFormFields["userClass"]["helperText"] = "";
      }

      updateFormFields(updatedFormFields);
      return false;
    } else {
      updatedFormFields["phoneNumber"]["isError"] = false;
      updatedFormFields["password"]["isError"] = false;
      updatedFormFields["fullName"]["isError"] = false;
      updatedFormFields["city"]["isError"] = false;
      updatedFormFields["userClass"]["isError"] = false;
      updatedFormFields["phoneNumber"]["helperText"] = "";
      updatedFormFields["password"]["helperText"] = "";
      updatedFormFields["fullName"]["helperText"] = "";
      updatedFormFields["city"]["helperText"] = "";
      updatedFormFields["userClass"]["helperText"] = "";
      updateFormFields(updatedFormFields);
      return true;
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

    updateFormFields(updatedFormFields);

    return formFields["smsCode"]["text"] ? true : false;
  };

  const userRegisterX = () => {
    userRegister({
      phone: sanitizedPhone,
      name: formFields["fullName"]["text"],
      password: formFields["password"]["text"],
      role: "student",
      classRoom: formFields["userClass"]["text"],
      country: "Pakistan",
      countryCode: "pk",
      lastName: " ",
    })
      .then((response) => {
        const { ok, data, problem } = response;
         console.log(response, "register response");
        if (ok) {
          userLogin({
            phone: sanitizedPhone,
            password: formFields["password"]["text"],
          }).then(async (responseX) => {
            const { ok, data: dataX, problem: problemX } = responseX;
            if (ok) {
              var decoded = jwt(dataX.accessToken);
              if (decoded.userId) {
                // console.log(cookie.get("Authorization"), 'coooooooooookkkkkkkkkeeeeeeeee')
                let userDetail = await getUserById(
                  decoded.userId,
                  dataX.accessToken
                );

                dispatch({ type: "LOGED_IN", payload: userDetail.data });
                nextLogin(dataX.accessToken, userDetail.data.role, returnto);
                window["gtag"]("event", "Signup", {
                  event_category: "Signup",
                  event_label: userDetail.data.role,
                  value: 1,
                });
              } else {
                Router.replace("/login");
              }
            } else {
              setShowCodeConfirmation(false);
              setShowError(true);
              setMessageType("warning");
              setMessage("Somthing went wrong! Please try again");
              // console.log(problemX, "problemX")
            }
          });
        } else if (data) {
          if (data.message && data.message === "phone: value already exists.") {
            setMessage("Phone number already registered!");
            Router.push("/login");
          } else {
            setMessage(data.message || problem);
          }
          setMessageType("warning");
          setShowError(true);
        } else {
          setMessage(problem);
          setMessageType("warning");
          setShowError(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === "phone: value already exists.") {
          setMessage("Phone number already registered!");
        } else {
          setMessage(err.message);
        }
        setMessageType("warning");
        setShowError(true);
      });
  };

  const registerAccount = () => {
    if (verifyResetPasswordCriteria() && !isEmpty(confirmationResult)) {
      setLoading(true);
      confirmationResult["confirm"](formFields["smsCode"]["text"])
        .then((result) => {
          // User signed in successfully.
          console.log('registerAccountResilt',result)
          const { additionalUserInfo } = result;
          if (additionalUserInfo) {
            userRegisterX();
          } else {
            setMessage("Phone number already registered!");
            setLoading(false);
            setMessageType("warning");
            setShowError(true);
            Router.push("/login");
          }
        })
        .catch((error) => {
          // const { message } = error;
          setMessage("The SMS verification code is incorrect.");
          setLoading(false);
          setMessageType("warning");
          setShowError(true);
        });
    } else {
      setLoading(false);
      if (verifyResetPasswordCriteria()) {
        setShowCodeConfirmation(false);
      }
    }
  };

  const onRegisterSubmit = (callType) => {
    if (validateForm()) {
      setLoading(true);
      const appVerifier = window["recaptchaVerifier"];
      firebase
        .auth()
        .signInWithPhoneNumber(sanitizedPhone, appVerifier)
        .then((confirmationResult) => {
          // console.log(confirmationResult, "confirmationResult");
          setLoading(false);
          setConfirmationResult(confirmationResult);
          if (callType !== "resend-code") {
            setShowCodeConfirmation(true);
            startTimer();
          }
          setMessage(`An OTP Code has been sent to ${sanitizedPhone}`);
          setMessageType("success");
          setShowError(true);
        })
        .catch((error) => {
          const { message } = error;
          if (!message.includes("internal error")) {
            setMessage(message);
            setMessageType("warning");
            setLoading(false);
            setShowError(true);
          }
        });
    }
  };

  const errorMessageFormat = () => {
    if (message === "Invalid login") {
      return "Invalid Phone Number!";
    } else if (message === "TOO_SHORT") {
      return "Invalid Credentials! Please check your details!";
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
            showCodeConfirmation ? classes.confirmCodeContainer : ""
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

            {!showCodeConfirmation ? (
              <Slide direction="right" in={true} mountOnEnter unmountOnExit>
                <div>
                  <Typography
                    variant="h6"
                    component="h6"
                    className={`${classes.formSubHeading}`}
                  >
                    Register
                  </Typography>

                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={onRegisterSubmit}
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
                        buttonClass={classes.formPhoneDropdownBtn}
                        dropdownClass={classes.formPhoneDropdown}
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
                          name: "phoneNumber",
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
                      label="Full Name"
                      name="fullName"
                      value={formFields["fullName"]["text"]}
                      className={classes.formInput}
                      placeholder="Full Name"
                      error={formFields["fullName"]["isError"]}
                      helperText={formFields["fullName"]["helperText"]}
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

                    <TextField
                      required
                      label="City"
                      name="city"
                      value={formFields["city"]["text"]}
                      className={classes.formInput}
                      placeholder="City"
                      error={formFields["city"]["isError"]}
                      helperText={formFields["city"]["helperText"]}
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
                      label="Choose Class"
                      name="userClass"
                      value={formFields["userClass"]["text"]}
                      className={classes.formInput}
                      error={formFields["userClass"]["isError"]}
                      helperText={formFields["userClass"]["helperText"]}
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
                      select
                      SelectProps={{
                        onOpen: () => {
                          const screenWidth = window.screen.width;
                          if (screenWidth > 768) {
                            setModalOpen(false);
                            setMenuOpen(true);
                          } else {
                            setModalOpen(true);
                            setMenuOpen(false);
                          }
                        },
                        MenuProps: {
                          open: menuOpen,
                        },
                      }}
                    >
                      <MenuItem disabled value="none">
                        Choose Class
                      </MenuItem>
                      {classesList.map((record, i) => (
                        <MenuItem
                          key={i}
                          value={record["_id"]}
                          onClick={(ev) => {
                            setModalOpen(false);
                            setMenuOpen(false);
                          }}
                        >
                          {record["name"]}
                        </MenuItem>
                      ))}
                    </TextField>

                    <OptionsDialogList
                      open={modalOpen}
                      setOpen={setModalOpen}
                      classesList={classesList}
                      onChange={(value) => {
                        handleUpdateFormFields({
                          target: { name: "userClass", value },
                        });
                        setModalOpen(false);
                      }}
                    />

                    <div className={`${classes.actionsContainer}`}>
                      <div className={`${classes.loginBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn}`}
                          onClick={onRegisterSubmit}
                          disabled={loading}
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                    <div className={classes.createNewAccountContainer}>
                      <Typography
                        component="p"
                        className={`${classes.createNewAccount}`}
                      >
                        Already have an account?
                        <span
                          className={`${classes.createNewAccountBtn}`}
                          onClick={() => Router.push("/login")}
                        >
                          Login
                        </span>
                      </Typography>
                    </div>
                  </form>
                </div>
              </Slide>
            ):(
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
                    Please enter the SMS code you received on your phone
                  </Typography>

                  <form
                    noValidate
                    autoComplete="off"
                    className={classes.formMain}
                    onSubmit={registerAccount}
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

                    <div
                      className={`${classes.actionsContainer} ${classes.nextStepActionsContainer}`}
                    >
                      <div className={`${classes.registerMeBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={`${classes.loginBtn} ${classes.registerMeBtn}`}
                          onClick={registerAccount}
                          disabled={loading}
                        >
                          Confirm
                        </Button>
                      </div>
                      <div className={`${classes.mayBeLaterBtnContainer}`}>
                        <Button
                          color="primary"
                          variant="contained"
                          disabled={resendCodeTimer > 0}
                          className={`${classes.mayBeLaterBtn}`}
                          onClick={() => {
                            onRegisterSubmit("resend-code");
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
                    </div>
                  </form>
                </div>
              </Slide>
            )}

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

registerPage.getInitialProps = async (ctx) => {
  const { Authorization } = nextCookie(ctx);
  if (ctx.req && Authorization) {
    ctx.res.writeHead(302, { Location: "/online-class" }).end();
  } else if (Authorization) {
    document.location.pathname = "/online-class";
  } else return { Authorization };
};

export default withApollo(registerPage);
