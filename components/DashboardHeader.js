import React, { useEffect, useState, Fragment, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import { getMobileOperatingSystem } from "@utils/utilities";
import {
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Popper,
  Chip,
  Paper,
  ClickAwayListener,
  IconButton,
  //SwipeableDrawer,
} from "@material-ui/core";
import {
  Mail as MailIcon,
  ChevronLeft,
  AccountCircle,
  PersonAdd,
  PowerSettingsNew,
  Notifications,
  Home,
  ExitToApp,
  MobileFriendly,
  Apple,
  Android,
  Person,
  Share,
  StarRate,
  Grade,
} from "@material-ui/icons";
import { useRouter } from "next/router";
import Dialog from "@components/Dialog";
import isEmpty from "lodash/isEmpty";
import { endMeeting, getUser } from "@utils/API";
import { nextLogout } from "@utils/nextAuth";
import { useDispatch, useSelector } from "react-redux";
import { blue, green } from "@material-ui/core/colors";
import {
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  SchoolRounded as ClassIcon,
  KeyboardArrowDown as ArrowDown,
} from "@material-ui/icons";

import GraphQL from "@components/shared/graphQL";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "100vw",
  },
  fullList: {
    width: "auto",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  paper: {
    background: "var(--schoolx-DarkPrimaryColor)",
    color: "#fff",
  },
  tooltipBtn: {
    borderRadius: 25,
    "&:active": {
      backgroundColor: theme.palette.getContrastText(blue[500]),
    },
    "&:focus": {
      backgroundColor: theme.palette.getContrastText(blue[500]),
    },
  },
  tooltipPlacementBottom: {
    padding: 20,
    marginTop: theme.spacing(1),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    color: "#fff !important",
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  onMobile: {
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },

  activeCourseChip: {
    backgroundColor: "#F57C00",
    "&:hover, &:active, &:focus": {
      backgroundColor: "#F57C00",
    },
    [theme.breakpoints.up("xs")]: {
      width: "110%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "110%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
      marginTop: 8,
      marginLeft: 40,
    },
    // width: 140,
  },
}));
const DashboardHeader = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const Router = useRouter();
  const { pathname, query, push, back } = Router;
  const { slug } = query;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("logout");
  const [slctClass, setSlctClass] = useState("");

  const [notifMessage, setNotifMessage] = useState("");
  const [notifMessageType, setNotifMessageType] = useState("error");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openChipTooltip, setOpenChipTooltip] = useState(false);
  const { user } = useSelector(({ USER }) => USER);
  const { gql, appolo } = props;
  const { useQuery } = appolo;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  const goLogOut = () => {
    window.localStorage.removeItem("persist:primary");
    nextLogout();
  };

  const goEndMeeting = () => {
    if (user.role === "student") {
      Router.push("/online-class");
    } else {
      endMeeting(slug).then((response) => {
        const { ok, data, problem } = response;
        if (ok) {
          Router.push("/online-class");
        } else if (data) alert(data.message || problem);
        else alert(problem);
      });
    }
  };

  const CLASSES_QUERY = `
{
    findClassRoom(query:{_id: "${slug}"}){
        _id,
        name,
        category
    }
}
`;
  const { loading, data } = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
    if (
      data &&
      data.findClassRoom &&
      data.findClassRoom.length > 0 &&
      pathname == "/online-courses/[slug]"
    ) {
      setSlctClass(data.findClassRoom[0].name);
    }
  }, [data, pathname]);

  useEffect(() => {
    if (user)
      if (user.role) {
        getUser(user._id).then((response) => {
          const { ok, data, problem } = response;
          if (ok) {
            dispatch({ type: "LOGED_IN", payload: data });
          } else {
            setNotifMessageType("error");
            if (data) setNotifMessage(data.message || problem);
            else setNotifMessage(problem);
          }
        });
      }
  }, []);

  const handleBreadCrumbClick = (event) => {

    event.preventDefault();
    localStorage.removeItem("selected-class");
    Router.push("/");
  };
  // console.log(pathname, 'path name is he');
  const anchorRef = useRef(null);

  return (
    <header>
      <nav
        className={`navbar fixed-top  ${
          user.role === "student" || !user.role ? "pl-0" : ""
        } navbar-expand-lg navbar-dark top-nav-collapse`}
      >
        <div
          style={{
            width: user.role === "student" || !user.role ? "95%" : "100%",
          }}
          className={`container-fluid myHeader ${
            user.role === "student" || !user.role ? "mx-auto" : ""
          }`}
        >
          {!pathname.split("/")[2] === "live" && (
            <a
              className="navbar-brand"
              href=""
              onClick={(e) => {
                e.preventDefault();
                Router.back();
              }}
            >
              <i className="fa fa-arrow-left primary" />
            </a>
          )}

          {pathname == "/" ||
          pathname == "/programs" ||
          pathname == "/online-courses/[slug]" ||
          pathname == "/online-class" ? (
            <>
              <button
                className="navbar-toggler"
                type="button"
                onClick={() => setDrawerOpen(true)}
                //data-toggle="collapse"
                //data-target="#navbarSupportedContent"
                //aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>

              {pathname == "/online-courses/[slug]" ? (
                <div>
                  <Popper
                    open={openChipTooltip}
                    anchorEl={anchorEl}
                    placement="bottom-end"
                    disablePortal={false}
                    modifiers={{
                      flip: {
                        enabled: true,
                      },
                      preventOverflow: {
                        enabled: true,
                        boundariesElement: "window",
                      },
                    }}
                  >
                    <ClickAwayListener
                      onClickAway={() => setOpenChipTooltip(false)}
                    >
                      <Paper className={classes.tooltipPlacementBottom}>
                        <Button
                          variant="outlined"
                          color="primary"
                          className={classes.tooltipBtn}
                          onClick={handleBreadCrumbClick}
                        >
                          Change Course
                        </Button>
                      </Paper>
                    </ClickAwayListener>
                  </Popper>

                  <Chip
                    innerRef={anchorRef}
                    icon={<ClassIcon />}
                    label={slctClass}
                    clickable
                    // disabled={!courseId}
                    onDelete={(ev) => {
                      setAnchorEl(ev.currentTarget);
                      setOpenChipTooltip(!openChipTooltip);
                    }}
                    deleteIcon={<ArrowDown />}
                    className={`${classes.activeCourseChip} ${classes.onMobile}`}
                    color="secondary"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <a
              className="navbar-brand m-l-10"
              href=""
              onClick={(e) => {
                e.preventDefault();
                Router.back();
              }}
            >
              <i className="fa fa-arrow-left primary" />
            </a>
          )}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              {user.role === "student" && (
                <li className="nav-item ml-3">
                  <a
                    style={{ fontWeight: "bold" }}
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isEmpty(user)) {
                        Router.push("/");
                      } else {
                        Router.push("/online-class");
                      }
                    }}
                    className={"text-white text-bold"}
                  >
                    <img
                      src="/images/logoN.png"
                      height="28px"
                      alt="logo schoolx"
                    />
                  </a>
                </li>
              )}
              {!pathname.split("/")[2] === "live" &&
                user.role &&
                user.role !== "student" && (
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        pathname === "/online-class" ? "active" : ""
                      }`}
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        Router.replace("/online-class");
                      }}
                    >
                      Home
                    </a>
                  </li>
                )}
              {!user.role && (
                <>
                  <li className="nav-item">
                    <a
                      className={`nav-link${
                        pathname === "/online-class" ? "active" : ""
                      }`}
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        if (isEmpty(user)) {
                          Router.push("/");
                        } else {
                          Router.push("/");
                        }
                      }}
                    >
                      <img src={"/images/logoN.png"} />
                    </a>
                  </li>
                  {pathname == "/online-courses/[slug]" ? (
                    <li>
                      <Popper
                        open={openChipTooltip}
                        anchorEl={anchorEl}
                        placement="bottom-end"
                        disablePortal={false}
                        modifiers={{
                          flip: {
                            enabled: true,
                          },
                          preventOverflow: {
                            enabled: true,
                            boundariesElement: "window",
                          },
                        }}
                      >
                        <ClickAwayListener
                          onClickAway={() => setOpenChipTooltip(false)}
                        >
                          <Paper className={classes.tooltipPlacementBottom}>
                            <Button
                              variant="outlined"
                              color="primary"
                              className={classes.tooltipBtn}
                              onClick={(e)=>handleBreadCrumbClick(e)}
                            >
                              Change Course 2
                            </Button>
                          </Paper>
                        </ClickAwayListener>
                      </Popper>

                      <Chip
                        innerRef={anchorRef}
                        icon={<ClassIcon />}
                        label={slctClass}
                        clickable
                        // disabled={!courseId}
                        onDelete={(ev) => {
                          setAnchorEl(ev.currentTarget);
                          setOpenChipTooltip(!openChipTooltip);
                        }}
                        deleteIcon={<ArrowDown />}
                        className={classes.activeCourseChip}
                        color="secondary"
                      />
                    </li>
                  ) : null}
                </>
              )}
              {pathname.split("/")[2] === "live" && (
                <li className="nav-item ml-5 endmeeting">
                  <a
                    className="btn btn-md btn-danger rounded waves-effect"
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setDialogType("endmeeting");
                      setDialogOpen(true);
                    }}
                  >
                    {user.role === "student" ? "Leave class" : "End class"}
                  </a>
                </li>
              )}
            </ul>
            {pathname.split("/")[2] === "live" ? null : !isEmpty(user) ? (
              <ul className="navbar-nav nav-flex-icons">
                {/* <li className="nav-item mr-3">
                  <a
                    className={`nav-link waves-effect ${
                      pathname.split("/")[1] === "notifications" ? "active" : ""
                    }`}
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      Router.push("/notifications");
                    }}
                  >
                    <i className="fa fa-bell" />
                  </a>
                  {user.notificationCount > 0 && (
                    <span className="counter">{user.notificationCount}</span>
                  )}
                </li> */}
                <li className="nav-item avatar dropdown">
                  <a
                    className={`nav-link dropdown-toggle waves-effect profile ${
                      pathname.split("/")[1] === "profile" && user._id === slug
                        ? "active"
                        : ""
                    }`}
                    id="navbarDropdownMenuLink-5"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    <img
                      src={`/images/${user.role}.jpg`}
                      className="img-fluid rounded-circle z-depth-0"
                      alt="profile"
                    />
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right dropdown-secondary"
                    aria-labelledby="navbarDropdownMenuLink-5"
                  >
                    <a
                      className="dropdown-item waves-effect waves-light"
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        Router.push(`/profile/${user._id}`);
                      }}
                    >
                      Profile
                    </a>
                    <a
                      className="dropdown-item waves-effect waves-light"
                      href=""
                      onClick={(e) => {
                        e.preventDefault();
                        setDialogType("logout");
                        setDialogOpen(true);
                      }}
                    >
                      Log out
                    </a>
                  </div>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav nav-flex-icons">
                <li className="nav-item avatar dropdown">
                  <a
                    style={{
                      background: "var(--schoolx-DefaultPrimaryColor)",
                      marginRight: "1rem",
                    }}
                    className={"nav-link"}
                    href
                    onClick={(e) => {
                      e.preventDefault();
                      Router.push({ pathname: "/register", query });
                    }}
                  >
                    Register
                  </a>
                </li>
                <li className="nav-item avatar dropdown">
                  <a
                    style={{
                      background: "var(--schoolx-DefaultPrimaryColor)",
                    }}
                    className={"nav-link"}
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      Router.push("/login?returnto="+pathname.replace('[slug]',slug));
                    }}
                  >
                    Login
                  </a>
                </li>
              </ul>
            )}
          </div>
          <Drawer
            classes={{ paper: classes.paper }}
            anchor={"left"}
            onOpen={() => {}}
            open={drawerOpen}
            onClose={() => {
              toggleDrawer(false);
            }}
          >
            <div className={classes.toolbar}>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  push({ pathname: "/online-class" });
                  setDrawerOpen(false);
                  //alert("CLICKED");
                }}
              >
                <img src={"/images/logoN.png"} />
              </span>
              <IconButton onClick={toggleDrawer(false)}>
                <ChevronLeft style={{ color: "#fff" }} />
              </IconButton>
            </div>
            <Divider />
            <div className={classes.list} role="presentation">
              <List>
                {pathname.split("/")[2] === "live" ? (
                  <ListItem
                    onClick={() => {
                      setDialogType("endmeeting");
                      setDialogOpen(true);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        user.role === "student" ? "Leave class" : "End class"
                      }
                    />
                  </ListItem>
                ) : (
                  <Fragment>
                    {/* <ListItem
                      button
                      onClick={() => {
                        Router.replace({ pathname: "/online-courses" });
                        toggleDrawer(false);
                      }}
                    >
                      <ListItemIcon>
                        <Home style={{ color: "#fff" }} />
                      </ListItemIcon>
                      <ListItemText primary={"Home"} />
                    </ListItem> */}
                    {!isEmpty(user) ? (
                      <Fragment>
                        <ListItem
                          button
                          onClick={() => {
                            Router.push({ pathname: "/profile", query });
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemIcon>
                            <Person style={{ color: "#fff" }} />
                          </ListItemIcon>
                          <ListItemText primary={"Profile"} />
                        </ListItem>
                        {/* <ListItem
                          button
                          onClick={() => {
                            Router.push("/notifications");
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemIcon>
                            <Notifications style={{ color: "#fff" }} />
                          </ListItemIcon>
                          <ListItemText primary={"Notification"} />
                        </ListItem> */}
                        <ListItem
                          button
                          onClick={() => {
                            setDialogType("logout");
                            setDialogOpen(true);
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemIcon>
                            <PowerSettingsNew style={{ color: "#fff" }} />
                          </ListItemIcon>
                          <ListItemText primary={"Logout"} />
                        </ListItem>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <ListItem
                          button
                          onClick={() => {
                            Router.push({ pathname: "/login", query });
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemIcon>
                            <AccountCircle style={{ color: "#fff" }} />
                          </ListItemIcon>
                          <ListItemText primary={"Login"} />
                        </ListItem>
                        <ListItem
                          button
                          onClick={() => {
                            Router.push({ pathname: "/register", query });
                            setDrawerOpen(false);
                          }}
                        >
                          <ListItemIcon>
                            <PersonAdd style={{ color: "#fff" }} />
                          </ListItemIcon>
                          <ListItemText primary={"Register"} />
                        </ListItem>
                      </Fragment>
                    )}
                    {typeof window !== "undefined" ? (
                      !!window.isNativeAppx ? (
                        <Fragment>
                          <ListItem
                            button
                            onClick={async () => {
                              window.ReactNativeWebView.postMessage(
                                JSON.stringify({
                                  data: {
                                    link:
                                      window.schoolxPlatform === "android"
                                        ? "https://play.google.com/store/apps/details?id=org.schoolx.pk&hl=en"
                                        : "",
                                    message:
                                      "SchoolX Online learning for O Level & FSc",
                                    title: "SchoolX",
                                  },
                                  action: "sharelink",
                                })
                              );
                            }}
                          >
                            <ListItemIcon>
                              <Share style={{ color: "#FFF" }} />
                            </ListItemIcon>
                            <ListItemText
                              style={{ color: "#fff" }}
                              primary={"Share"}
                            />
                          </ListItem>
                          <ListItem
                            button
                            onClick={async () => {
                              window.ReactNativeWebView.postMessage(
                                JSON.stringify({
                                  action: "rateApp",
                                })
                              );
                            }}
                          >
                            <ListItemIcon>
                              <Grade style={{ color: "#FFF" }} />
                            </ListItemIcon>
                            <ListItemText
                              style={{ color: "#fff" }}
                              primary={"Rate Us"}
                            />
                          </ListItem>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <ListItem
                            button
                            // onClick={async () => {
                            //   await window.navigator.share({
                            //     title: "SchoolX",
                            //     text: "SchoolX Online learning for O Level & FSc",
                            //     url:
                            //       getMobileOperatingSystem() === "Android"
                            //         ? "https://play.google.com/store/apps/details?id=org.schoolx.pk&hl=en"
                            //         : "",
                            //   });
                            // }}
                          >
                            <ListItemIcon>
                              <Share style={{ color: "#FFF" }} />
                            </ListItemIcon>
                            <ListItemText
                              style={{ color: "#fff" }}
                              primary={"Share"}
                            />
                          </ListItem>
                          {getMobileOperatingSystem() === "Android" && (
                            <a href="https://play.google.com/store/apps/details?id=org.schoolx.pk&amp;hl=en">
                              <ListItem button>
                                <ListItemIcon>
                                  <Android style={{ color: "#FFF" }} />
                                </ListItemIcon>
                                <ListItemText
                                  style={{ color: "#fff" }}
                                  primary={"Download App"}
                                />
                              </ListItem>
                            </a>
                          )}
                          {getMobileOperatingSystem() === "iOS" && (
                            <ListItem button>
                              <ListItemIcon>
                                <Apple style={{ color: "#fff" }} />
                              </ListItemIcon>
                              <ListItemText primary={"Download App"} />
                            </ListItem>
                          )}
                        </Fragment>
                      )
                    ) : null}
                  </Fragment>
                )}
              </List>
            </div>
          </Drawer>
        </div>
      </nav>
      {/* Navbar */}

      {/* Sidebar */}
      <div
        className={`sidebar-fixed position-fixed ${
          !user.role ||
          user.role === "student" ||
          pathname.includes("feedbacks")
            ? "d-none"
            : ""
        }`}
      >
        <a
          style={{
            width: "100%",
            backgroundColor: "#4751A6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="logo-wrapper waves-effect"
          onClick={(e) => {
            e.preventDefault();
            Router.push("/");
          }}
        >
          <img src={"/images/logoN.png"} />
        </a>
        <hr className="my-0 text-primary" />
        <div className="list-group list-group-flush">
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              Router.push("/online-class/mylectures");
            }}
            className={`list-group-item waves-effect ${
              pathname.split("/")[1] === "lectures" &&
              pathname.split("/")[2] === "mylectures"
                ? "active"
                : ""
            }`}
          >
            <i className="fa fa-book mr-3" />
            {user.role === "teacher" ? "My" : ""} Lectures
          </a>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              Router.push("/online-course");
            }}
            className={`list-group-item waves-effect ${
              pathname.split("/")[1] === "online-course" ? "active" : ""
            }`}
          >
            <i className="fa fa-book mr-3" />
            {user.role === "teacher" ? "My" : ""} Courses
          </a>

          {user.role === "teacher" ? (
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                Router.push("/mcq");
              }}
              className={`list-group-item waves-effect ${
                pathname.split("/")[1] === "mcq" ? "active" : ""
              }`}
            >
              <i className="fa fa-tags mr-3" />
              MCQs
            </a>
          ) : null}

          {user.role === "teacher" ? (
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                Router.push("/subjectTests");
              }}
              className={`list-group-item waves-effect ${
                pathname.split("/")[1] === "subjectTests" ? "active" : ""
              }`}
            >
              <i className="fa fa-tags mr-3" />
              Tests
            </a>
          ) : null}

          {user.role === "admin" ? (
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                Router.push("/subjects");
              }}
              className={`list-group-item waves-effect ${
                pathname.split("/")[1] === "subjects" ? "active" : ""
              }`}
            >
              <i className="fa fa-tags mr-3" />
              Subjects
            </a>
          ) : null}
          {user.role === "admin" && (
            <Fragment>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  Router.push("/classes");
                }}
                className={`list-group-item waves-effect ${
                  pathname.split("/")[1] === "classes" ? "active" : ""
                }`}
              >
                <i className="fa fa-desktop mr-3" />
                Classes
              </a>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  Router.push("/users");
                }}
                className={`list-group-item waves-effect ${
                  pathname.split("/")[1] === "users" ? "active" : ""
                }`}
              >
                <i className="fa fa-users mr-3" />
                Users
              </a>
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  Router.push("/enrollments");
                }}
                className={`list-group-item waves-effect ${
                  pathname.split("/")[1] === "enrollments" ? "active" : ""
                }`}
              >
                <i className="fa fa-users mr-3" />
                Enrollments
              </a>
            </Fragment>
          )}
        </div>
      </div>
      {/* Sidebar */}
      <Dialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        dialogAction={dialogType === "logout" ? goLogOut : goEndMeeting}
        dialogMessage={
          dialogType === "logout"
            ? "Do you really want to disconnect ?"
            : user.role === "student"
            ? "Do you really want to leave this lecture ? You can still come back."
            : "Do you really want to end the lecture ? All participants will be kicked."
        }
      />
    </header>
  );
};

export default GraphQL(DashboardHeader);
