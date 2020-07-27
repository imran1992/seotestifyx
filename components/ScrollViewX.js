import React, { useState, createRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Typography, Paper, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import {
  Notifications as NotifIcon,
  ChevronRight,
  ChevronLeft
} from "@material-ui/icons";
const useStyles = makeStyles(theme => ({
  card1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "12vh",
    [theme.breakpoints.down("md")]: {
      minWidth: "84vw"
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "40.75vw"
    },
    [theme.breakpoints.up("lg")]: {
      minWidth: "25vw"
    }
  },
  card2: {
    height: "15vh",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: "2vh",
    [theme.breakpoints.down("md")]: {
      minWidth: "84vw"
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "40.75vw"
    },
    [theme.breakpoints.up("lg")]: {
      minWidth: "25vw"
    }
  },
  card1R: {
    backgroundColor: "#fff",
    width: "calc(100% - 12vh)",
    height: "12vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card2R: {
    backgroundColor: "#fff",
    width: "calc(95% - 11vh)",
    height: "13vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card1RInner: {
    minWidth: "95%",
    maxWidth: "95%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden"
  },
  card2RInner: {
    minWidth: "95%",
    maxWidth: "95%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden"
    // borderBottom: "6px solid #ccc"
  },
  card1L: {
    backgroundColor: "#2d48af",
    width: "12vh",
    height: "12vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card2L: {
    width: "10vh",
    height: "10vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "2.5vh"
  },
  Icon: {
    color: "#FFF",
    width: "8vh",
    height: "8vh"
  },
  doto: {
    backgroundColor: "#F7444A",
    [theme.breakpoints.down("md")]: {
      width: "2vw",
      height: "2vw",
      borderRadius: "1vw",
      marginRight: "0.8vw"
    },
    [theme.breakpoints.up("md")]: {
      width: "2vw",
      height: "2vw",
      borderRadius: "1vw",
      marginRight: "0.8vw"
    },
    [theme.breakpoints.up("lg")]: {
      width: "2vh",
      height: "2vh",
      borderRadius: "1vh",
      marginRight: "0.8vh"
    }
  },
  smallThumbs: {
    top: 0,
    position: "absolute",
    [theme.breakpoints.down("md")]: {
      width: "2vh",
      heigh: "2vh",
      borderRadius: "1vh"
    },
    [theme.breakpoints.up("md")]: {
      width: "2vw",
      heigh: "2vw",
      borderRadius: "1vw"
    },
    [theme.breakpoints.up("lg")]: {
      width: "2vh",
      heigh: "2vh",
      borderRadius: "1vh"
    }
  },
  ScrollerView: {
    marginTop: "1vh",
    width: "100vw",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      height: "16vh"
    },
    [theme.breakpoints.up("md")]: {
      height: "15vh"
    },
    [theme.breakpoints.up("lg")]: {
      height: "15vh"
    }
  },
  Scroller: {
    overflowX: "scroll",
    height: "100%",
    display: "flex",
    margin: "0",
    flexDirection: "row",
    alignItems: "center",
    "&::-webkit-scrollbar": {
      display: "none"
    },
    [theme.breakpoints.down("md")]: {
      width: "84vw"
    },
    [theme.breakpoints.up("md")]: {
      width: "84vw"
    },
    [theme.breakpoints.up("lg")]: {
      width: "80vw"
    }
  },
  NabFab: {
    [theme.breakpoints.down("md")]: {
      width: "12vw !important",
      height: "12vw !important",
      borderRadius: "6vw !important"
    },
    [theme.breakpoints.up("md")]: {
      width: "8vw !important",
      height: "8vw !important",
      borderRadius: "4vw !important"
    },
    [theme.breakpoints.up("lg")]: {
      width: "3vw !important",
      height: "3vw !important",
      borderRadius: "1.5vw !important"
    }
  },
  FabR: {
    [theme.breakpoints.down("md")]: {
      right: "2vw !important"
    },
    [theme.breakpoints.up("md")]: {
      right: "4.5vw !important"
    },
    [theme.breakpoints.up("lg")]: {
      right: "8.5vw !important"
    }
  },
  FabL: {
    [theme.breakpoints.down("md")]: {
      left: "2vw !important"
    },
    [theme.breakpoints.up("md")]: {
      left: "4.5vw !important"
    },
    [theme.breakpoints.up("lg")]: {
      left: "8.5vw !important"
    }
  }
}));

const NPButton = ({
  onClick,
  bgColor,
  arrowColor,
  arrowDirection,
  classNameX
}) => {
  return (
    <Fab
      variant="round"
      aria-label="navigators"
      onClick={onClick}
      className={`${classNameX[0]} ${classNameX[1]}`}
      style={{
        backgroundColor: bgColor,
        position: "absolute",
        zIndex: 10
      }}
    >
      {arrowDirection === true ? (
        <ChevronLeft style={{ color: arrowColor }} fontSize={"large"} />
      ) : (
        <ChevronRight style={{ color: arrowColor }} fontSize={"large"} />
      )}
    </Fab>
  );
};

const ScrollView1 = ({ data, behavior }) => {
  const classes = useStyles();
  const [scrollIndex, setScrollIndex] = useState(0);
  let refs = data.reduce((acc, v, index) => {
    acc[index] = createRef();
    return acc;
  }, {});
  useEffect(() => {
    refs[scrollIndex].current.scrollIntoView({
      behavior,
      inline: "start"
    });
  }, [scrollIndex]);

  const handleClickPrev = id => {
    if (id > 0) {
      setScrollIndex(id - 1);
    }
  };
  const handleClickNext = id => {
    if (id < data.length - 1) {
      setScrollIndex(id + 1);
    }
  };

  return (
    <div className={classes.ScrollerView}>
      {scrollIndex !== 0 && (
        <NPButton
          classNameX={[classes.NabFab, classes.FabL]}
          onClick={() => {
            handleClickPrev(scrollIndex);
          }}
          bgColor={"#2d48af"}
          arrowColor={"#fff"}
          arrowDirection={true}
        />
      )}
      <div className={classes.Scroller}>
        {data.map(({ title, time }, index) => {
          return (
            <Paper
              ref={refs[index]}
              variant="elevation"
              elevation={6}
              key={"key" + index}
              className={classes.card1}
              style={{
                //marginRight: index === data.length - 1 ? 0 : "2vw"
                marginRight: index === data.length - 1 ? 0 : "2.5vw"
              }}
            >
              <div className={classes.card1L}>
                <NotifIcon className={classes.Icon} />
              </div>
              <div className={classes.card1R}>
                <div className={classes.card1RInner}>
                  <span
                    style={{
                      color: "#111",
                      fontWeight: "bold",
                      fontSize: "1.5vh",
                      marginTop: "1px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box"
                    }}
                  >
                    {title + " " + (index + 1)}
                  </span>
                  <span
                    style={{
                      color: "#777",
                      marginBottom: "1px",
                      fontSize: "1.5vh"
                    }}
                  >
                    {`Lecture # ${index + 1} shall start at ${5 +
                      "pm"} on ${"Monday,February 5,2020"}`}
                  </span>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>
      {scrollIndex < data.length - 1 && (
        <NPButton
          classNameX={[classes.NabFab, classes.FabR]}
          onClick={() => {
            handleClickNext(scrollIndex);
          }}
          bgColor={"#2d48af"}
          arrowColor={"#fff"}
          arrowDirection={false}
        />
      )}
    </div>
  );
};

const ScrollView2 = ({ data, behavior }) => {
  const classes = useStyles();
  const [scrollIndex, setScrollIndex] = useState(0);
  const refs = data.reduce((acc, value, index) => {
    acc[index] = createRef();
    return acc;
  }, {});
  useEffect(() => {
    refs[scrollIndex].current.scrollIntoView({
      behavior,
      inline: "start"
    });
  }, [scrollIndex]);
  const handleClickPrev = id => {
    if (id > 0) {
      setScrollIndex(id - 1);
    }
  };
  const handleClickNext = id => {
    if (id < data.length - 1) {
      setScrollIndex(id + 1);
    }
  };
  return (
    <div className={classes.ScrollerView}>
      {scrollIndex !== 0 && (
        <NPButton
          onClick={() => {
            handleClickPrev(scrollIndex);
          }}
          classNameX={[classes.NabFab, classes.FabL]}
          bgColor={"#fff"}
          arrowColor={"#2d48af"}
          arrowDirection={true}
        />
      )}
      <div className={classes.Scroller}>
        {data.map(({ title, name, time, count }, index) => {
          return (
            <Paper
              ref={refs[index]}
              variant="elevation"
              elevation={0}
              key={"key" + index}
              className={classes.card2}
              style={{
                marginRight: index === data.length - 1 ? 0 : "2.5vw"
              }}
            >
              <img src={"/images/live.gif"} className={classes.card2L} />
              <div className={classes.card2R}>
                <div className={classes.card2RInner}>
                  <span
                    style={{
                      color: "#111",
                      textAlign:'start',
                      fontWeight: "bold",
                      fontSize: "1.5vh",
                      marginTop: "1px",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {title + " " + (index + 1)}
                  </span>

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    <div className={classes.doto} />
                    <Typography variant="body2" style={{ color: "#777" }}>
                      {name}
                    </Typography>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "9vh",
                        height: "2vh",
                        position: "relative"
                      }}
                    >
                      <span style={{ color: "#2d48af", fontSize: "small" }}>
                        {count + "."}
                      </span>
                      <img
                        src={"/images/userAvatar.png"}
                        className={classes.smallThumbs}
                        style={{
                          left: "3vh"
                        }}
                      />
                      <img
                        src={"/images/userAvatar.png"}
                        className={classes.smallThumbs}
                        style={{
                          left: "4vh",
                          zIndex: 2
                        }}
                      />
                      <img
                        src={"/images/userAvatar.png"}
                        className={classes.smallThumbs}
                        style={{
                          left: "5vh",
                          zIndex: 3
                        }}
                      />
                      <img
                        src={"/images/teacher.jpg"}
                        className={classes.smallThumbs}
                        style={{
                          left: "6vh",
                          zIndex: 4
                        }}
                      />
                    </span>

                    <span
                      style={{
                        borderRadius:'5px',
                        padding: "3px",
                        backgroundColor: "red",
                        color: "#fff",
                        fontSize: "1.5vh"
                      }}
                    >
                      {time}
                    </span>
                  </div>
                </div>
              </div>
            </Paper>
          );
        })}
      </div>
      {scrollIndex < data.length - 1 && (
        <NPButton
          onClick={() => {
            handleClickNext(scrollIndex);
          }}
          classNameX={[classes.NabFab, classes.FabR]}
          bgColor={"#fff"}
          arrowColor={"#2d48af"}
          arrowDirection={false}
        />
      )}
    </div>
  );
};
ScrollView1.prototype = {
  data: PropTypes.array.isRequired,
  behavior: PropTypes.string
};
ScrollView1.defaultProps = {
  behavior: "smooth"
};

ScrollView2.prototype = {
  data: PropTypes.array.isRequired,
  behavior: PropTypes.string
};
ScrollView2.defaultProps = {
  behavior: "smooth"
};
export { ScrollView1, ScrollView2 };
