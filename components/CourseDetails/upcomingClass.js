import React from "react";
import { ArrowForwardIos, FiberManualRecord } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  upComingClassContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: "18px 0 0",
    width: "100%",
    cursor: "pointer",
    "&:first-child": {
      paddingTop: 0,
    },
  },
  upComingClassDateContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    minWidth: 54,
    height: 60,
    background: "transparent",
    marginRight: 30,
    overflow: "hidden",
  },
  upComingClassDateMonth: {
    display: "flex",
    textRransform: "uppercase",
    fontWeight: 700,
    justifyContent: "center",
    width: "100%",
    fontSize: 16,
    color: "rgba(0,0,0,0.3)",
  },
  upComingClassDateDay: {
    padding: "4px 0",
    fontWeight: 700,
    fontSize: 24,
    color: "rgba(227,107,113,0.8)",
  },
  upComingClassInfoContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 18,
    borderBottom: "1px solid hsla(0,0%,59%,0.2)",
  },
  upComingClassInfoHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 1,
    alignItems: "flex-start",
  },
  upComingClassInfoHeading: {
    color: "#000",
    fontSize: 18,
    fontWeight: 700,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  upComingClassInfo: {
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    color: "rgba(0,0,0,0.4)",
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.5,
    [theme.breakpoints.down("xs")]: {
      flexWrap: 'wrap',
    },
  },
  upComingClassInfoSeparator: {
    fontSize: 8,
    marginLeft: 10,
    marginRight: 10,
    [theme.breakpoints.down("xs")]: {
      display: 'none'
    },
  },
  upComingClassIconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  upComingClassIcon: {
    fontSize: 14,
  },
}));

const UpcomingClass = (props) => {
  const classes = useStyles();
  const { data, onClick } = props;

  return (
    <div className={`${classes.upComingClassContainer}`} onClick={onClick}>
      <div className={`${classes.upComingClassDateContainer}`}>
        <div className={`${classes.upComingClassDateMonth}`}>
          {data["month"]}
        </div>
        <div className={`${classes.upComingClassDateDay}`}>{data["day"]}</div>
      </div>
      <div className={`${classes.upComingClassInfoContainer}`}>
        <div className={`${classes.upComingClassInfoHeadingContainer}`}>
          <div className={`${classes.upComingClassInfoHeading}`}>
            {data["className"]}
          </div>
          <div className={`${classes.upComingClassInfo}`}>
            <span>{data["classNumber"]}</span>
            <FiberManualRecord
              className={`${classes.upComingClassInfoSeparator}`}
            />
            <span>{data["classTime"]}</span>
            <FiberManualRecord
              className={`${classes.upComingClassInfoSeparator}`}
            />
            <span>{data["teacherName"]}</span>
          </div>
        </div>
        <div className={`${classes.upComingClassIconContainer}`}>
          <ArrowForwardIos className={`${classes.upComingClassIcon}`} />
        </div>
      </div>
    </div>
  );
};

export default UpcomingClass;
