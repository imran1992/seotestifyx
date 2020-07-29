import React, { useState, useEffect } from "react";
import groupBy from "lodash/groupBy";
import Router from "next/router";
import GraphQL from "@components/shared/graphQL";
import Loader from "@components/shared/loader";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Slide,
  Fade,
  Card,
  CardContent,
  Button,
  Divider,
} from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

const CLASSES_QUERY = `
{
    findClassRoom(query:{}){
        _id,
        name,
        category
    }
}
`;
const useStyles = makeStyles((theme) => {
  const { breakpoints, spacing } = theme;

  return {
    title: {
      color: "#fff",
      fontWeight: "bold",
      letterSpacing: 0.5,
      lineHeight: 1.5,
      fontSize: "3.5rem",
      [breakpoints.down("md")]: {
        fontSize: "2.5rem",
        paddingLeft: "5%",
        paddingRight: "5%",
      },
      [breakpoints.down("sm")]: {
        fontSize: "2rem",
      },
      [breakpoints.down("xs")]: {
        fontSize: "1.75rem",
      },
    },
    subTitle: {
      color: "#fff",
      letterSpacing: 0.5,
      lineHeight: 1.5,
      marginTop: 25,
      fontSize: "1.35rem",
      [breakpoints.down("xs")]: {
        fontSize: "1.15rem",
        paddingLeft: "10%",
        paddingRight: "10%",
      },
    },
    fullBg: {
      height: "100vh",
      paddingTop: 120,
      paddingBottom: 50,
    },
    courseListContainer: {
      marginTop: 50,
      height: "auto",
      minHeight: 180,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    classGroupsContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      [breakpoints.down("md")]: {
        flexWrap: "wrap",
      },
      [breakpoints.down("sm")]: {
        flexWrap: "wrap",
      },
      [breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    cardTileContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: spacing(1),
      width: 250,
      minHeight: 180,
    },
    cardTileContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "10px !important",
      height: "80%",
    },
    cardTileText: {
      textTransform: "uppercase",
      fontWeight: "bold",
      flex: 1,
      marginBottom: spacing(1),
    },
    cardTileBtnContainer: {
      flex: 1,
    },
    classTileBtn: {
      margin: spacing(1),
      minWidth: 50,
      minHeight: 50,
    },
    activeBtn: {
      backgroundColor: purple[700],
    },

    buttonIcon:{
      paddingLeft: 7
    },
  };
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(ToggleButton);

const GetStartedButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText("#fff"),
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#eee",
    },
    marginTop: theme.spacing(3.5),
  },
}))(Button);

const CourseTile = ({ id, name, sup }) => {
  const classes = useStyles();
  return (
    <ColorButton
      className={`${classes.classTileBtn} ${id ? classes.activeBtn : ""}`}
      value={id}
    >
      {name}
      {sup ? <sup>th</sup> : null}
    </ColorButton>
  );
};

const IntroSection = (props) => {
  const pages = new Array(18).fill(null);
  const { gql, appolo } = props;
  const { useQuery } = appolo;
  const classes = useStyles();
  const [classGroups, setGroups] = useState(null);
  const [selectedClass, setClass] = useState(null);

  const { loading, data } = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
    if (data) {
      if (!loading && data.findClassRoom.length) {
        let groups = groupBy(data.findClassRoom || [], "category");
        setGroups(groups);
      }
    }
  }, [loading]);

  return (
    <section className="hm-gradient" id="intro">
      <div
        className={`${classes.fullBg} full-bg-img d-flex align-items-center`}
      >
        <div className="container">
          <div className="row no-gutters justify-content-center">
            <div className="col-md-10 text-center text-md-center margins">
              <Slide direction="down" in timeout={1200}>
                <Typography
                  variant="h3"
                  component="h3"
                  className={classes.title}
                >
                  Please Choose Your Learning Goal
                </Typography>
              </Slide>
              {/* <Fade in timeout={2000}>
                <Typography component="p" className={classes.subTitle}>
                  Get Into Study Groups With Your Friends and Access the Best
                  Teachers on Demand
                </Typography>
              </Fade> */}
              <div className={`${classes.courseListContainer}`}>
                {loading ? (
                  <Loader showOnlyLoader={true} />
                ) : (
                  <div className={classes.classGroupsContainer}>
                    {classGroups &&
                      Object.keys(classGroups).map((group_name, i) => {
                        const group_classes = classGroups[group_name] || [];

                        return (
                          <Card key={i} className={classes.cardTileContainer}>
                            <CardContent className={classes.cardTileContent}>
                              <Typography
                                variant="h6"
                                component="h6"
                                className={classes.cardTileText}
                              >
                                {group_name}
                              </Typography>

                              <Divider variant="middle" />

                              <div className={classes.cardTileBtnContainer}>
                                <ToggleButtonGroup
                                  value={selectedClass}
                                  exclusive
                                  onChange={(event, id) => setClass(id)}
                                >
                                  {group_classes.map((classObj, j) => {
                                    const { name, sup, _id } = classObj;

                                    return (
                                      <ColorButton
                                        key={_id}
                                        className={`${classes.classTileBtn}`}
                                        value={_id}
                                      >
                                        {name }
                                        {sup ? <sup>th </sup> : null}
                                        <i className={`fa fa-arrow-right ${classes.buttonIcon}`} ></i>
                                      </ColorButton>
                                    );
                                  })}
                                </ToggleButtonGroup>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Action button */}
              <GetStartedButton
                variant="contained"
                color="primary"
                disabled={!selectedClass}
                onClick={() => {
                  Router.push(`/online-courses/${selectedClass}`);
                }}
              >
                <i className="fa fa-graduation-cap mr-1" />
                Get Started Now
              </GetStartedButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GraphQL(IntroSection);
