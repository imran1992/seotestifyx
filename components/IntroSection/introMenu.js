// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import groupBy from "lodash/groupBy";
import Router from "next/router";
import GraphQL from "@components/shared/graphQL";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { FiArrowRight } from "react-icons/fi";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Head from "next/head";
import Footer from "../Footer";
import ScrollArea from "react-perfect-scrollbar";
// import { useSelector } from "react-redux";

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
    fullBg: {
      minHeight: "100vh",
      paddingTop: 120,
      paddingBottom: 50,
      backgroundColor: "white",
    },
    mainContainer: {
      // border: "1px solid red",
      width: "80%",
      margin: "0 auto",
      paddingTop: "5em",
      height: "83.25vh",
      overflow:'hidden'
    },
    classTileBtn: {
      margin: spacing(1),
      width: 150,
      minHeight: 50,
      justifyContent: "space-between",
    },
    activeBtn: {
      backgroundColor: purple[700],
    },

    buttonIcon: {
      paddingLeft: 12,
    },
    menu_item: {
      fontSize: 13,
      fontWeight: "bold",
      margin: 0,
      padding: 0,
      padding: "7px 7px 7px 20px",
      borderRadius: 50,
      cursor: "pointer",
      // marginTop: 10,
    },

    slctd_menu_item: {
      backgroundColor: "#e3d1eb",
      color: "#7B1FA2",
    },

    heading1: {
      fontSize: 13,
      fontWeight: "bold",
      margin: 0,
      padding: 0,
      marginBottom: "1em",
    },
    getStartedBtn: {
      textAlign: "center",
      backgroundColor: "#fff",
      padding: "15px 0",
    },
    getStartedBtnSticky: {
      position: "fixed",
      bottom: 0,
      width: "100%",
    },
  };
});

const ColorButton = withStyles((theme) => ({
  root: {
    boxShadow: "0px 0px 15px #0000000D",
    "&:hover": {
      backgroundColor: purple[700],
      color: "white",
    },
    margin: 0,
    marginRight: 10,
    marginBottom: 10,
    textAlign: "center",
    border: "1px solid #fff !important",
    borderRadius: "7.5px !important",
    fontSize: 12,
    textTransform: "capitalize",
    fontWeight: 500,
    padding: "1em",
    width: "175px !important",
  },
}))(ToggleButton);

const GetStartedButton = withStyles((theme) => ({
  root: {
    color: "#fff",
    borderRadius: 50,
    textTransform: "capitalize",
    width: 300,
    fontWeight: "normal",
    alignSelf: "center",
    textAlign: "center",
    margin: "0px !important",
    backgroundColor: purple[700],
    "&:hover": {
      backgroundColor: purple[500],
    },
  },
}))(Button);

const IntroSection = (props) => {
  // const pages = new Array(18).fill(null);
  const { gql, appolo } = props;
  const { useQuery } = appolo;
  const classes = useStyles();
  const [classGroups, setGroups] = useState(null);
  const [selectedClass, setClass] = useState(null);
  const [slctdGroup, setslctdGroup] = useState(null);
  const footerRef = useRef(null);
  const [scrollEl, setScrollEl] = useState();

  const { loading, data } = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
    if (!loading && data && data.findClassRoom && data.findClassRoom.length) {
      let groups = groupBy(data.findClassRoom || [], "category");
      let objValuesWithRefs = {};
      const objKeys = Object.keys(groups);

      objKeys.map((objKey) => {
        const withRefs = groups[objKey].map((item) => ({
          ...item,
          myRef: React.createRef(),
        }));
        objValuesWithRefs[objKey] = withRefs;
      });
      setGroups(objValuesWithRefs);
      console.log(objValuesWithRefs, "groups list");

      if (objValuesWithRefs) {
        let group_name = Object.keys(objValuesWithRefs)[0];
        setslctdGroup(group_name);
        if (
          objValuesWithRefs[group_name] &&
          objValuesWithRefs[group_name].length > 0
        ) {
          setClass({
            id: objValuesWithRefs[group_name][0]._id,
            ref: objValuesWithRefs[group_name][0].myRef,
          });
        }
      }
    }
  }, [loading]);

  const scrollToRef = (ref, isFirst) => {
    if (isFirst) {
      scrollEl.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      scrollEl.scrollTo({
        top: ref.current.offsetTop,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const onChangeProgram = (group_name) => {
    setslctdGroup(group_name);
    if (classGroups[group_name] && classGroups[group_name].length > 0) {
      if (Object.keys(classGroups).indexOf(group_name) === 0 || Object.keys(classGroups).indexOf(group_name) === 1) {
        scrollToRef(classGroups[group_name][0].myRef, true);
      } else {
        scrollToRef(classGroups[group_name][0].myRef, false);
      }
      setClass({
        id: classGroups[group_name][0]._id,
        ref: classGroups[group_name][0].myRef,
      });
    }
  };

  return (
    <section>
      {
        <Head>
          <title>
            Choose Program | SchoolX, the leading online learning platform in
            Pakistan
          </title>
          <meta property="og:url" content="https://www.schoolx.pk/" />
          <meta
            property="og:title"
            content="Choose Program | SchoolX, the leading online learning platform in Pakistan"
          />
          <meta
            name="description"
            content={`Schoolx is a complete learning platform for your needs based in Pakistan. ✓ Learn various subjects as a student ✓ Teach your skills and at your own pace as a teacher`}
          />
          <meta property="og:site_name" content="SchoolX" />
          <meta property="og:image" content="/images/logoN.png" />
          <meta property="og:image:secure_url" content="/images/logoN.png" />
          <meta property="og:image" content="image" />
          <meta property="og:image:width" content="202" />
          <meta property="og:image:height" content="42" />
          <meta
            property="og:image:alt"
            content="SchoolX | Online Learning Platform"
          />
        </Head>
      }
      <div
        className={classes.mainContainer}
        vocab="http://schema.org/"
        typeof="Course"
      >
        <Grid container style={{ height: "100%" }}>
          <Grid
            item
            xs={12}
            sm={3}
            md={3}
            style={{
              borderRight: "1px solid #ccc",
              height: "100%",
              padding: "0 2em 0 0",
            }}
          >
            <p
              className={`${classes.menu_item}`}
              style={{ color: purple[700] }}
            >
              Porgrams
            </p>
            {classGroups &&
              Object.keys(classGroups).map((group_name, i) => {
                return (
                  <p
                    key={i}
                    className={`${classes.menu_item} ${
                      slctdGroup == group_name ? classes.slctd_menu_item : ""
                      }`}
                    onClick={() => onChangeProgram(group_name)}
                    property={group_name}
                  >
                    {group_name}
                  </p>
                );
              })}
          </Grid>

          <Grid
            item
            xs={12}
            sm={9}
            md={9}
            style={{
              height: "100%",
              padding: "0 0 0 2em",
            }}
          >
            <ScrollArea
              wheelSpeed={0.8}
              suppressScrollY={true}
              wheelPropagation={false}
              style={{
                height: "100%",
              }}
              className='custom-scroll'
              component="div"
              containerRef={(ref) => {
                setScrollEl(ref);
              }}
            >
              <p
                className={`${classes.menu_item}`}
                style={{ color: purple[700] }}
              >
                Please Choose Your Learning Goal
              </p>
              {classGroups &&
                Object.keys(classGroups).map((group_name, i) => {
                  const group_classes = classGroups[group_name] || [];

                  return (
                    <div style={{ marginLeft: 20, marginBottom: 15 }}>
                      <p className={classes.heading1}>{group_name}</p>
                      <ToggleButtonGroup
                        className="d-inline"
                        style={{
                          textAlignLast: "center",
                          textAlign: "center",
                          backgroundColor: "unset",
                        }}
                        value={selectedClass["id"]}
                        // ref={generateRef()}
                        // orientation="vertical"
                        exclusive
                        onChange={(event, id) => {
                          if (id) setClass({ id, ref: event.target })
                        }}
                      >
                        {group_classes.map((classObj, j) => {
                          const { name, sup, _id, myRef } = classObj;
                          return (
                            <ColorButton
                              key={_id}
                              className={`${classes.classTileBtn} Btn-white-BG`}
                              value={_id}
                              property={isNaN(name) ? name : `${name} Standard`}
                              ref={myRef}
                            >
                              {isNaN(name) ? name : `${name} Standard`}
                              {sup ? <sup>th </sup> : null}
                              <FiArrowRight size={16} />
                            </ColorButton>
                          );
                        })}
                      </ToggleButtonGroup>
                    </div>
                  );
                })}
            </ScrollArea>
          </Grid>

          {/* <Grid item xs={12} sm={8} md={8} style={{ marginTop: 50 }}>
            {classGroups &&
              Object.keys(classGroups).map((group_name, i) => {
                const group_classes = classGroups[group_name] || [];

                return (
                  <div style={{ marginLeft: 20, marginBottom: 15 }}>
                    <p className={classes.heading1}>{group_name}</p>
                    <ToggleButtonGroup
                      className="d-inline"
                      style={{
                        textAlignLast: "center",
                        textAlign: "center",
                        backgroundColor: "unset",
                      }}
                      value={selectedClass}
                      // orientation="vertical"
                      exclusive
                      onChange={(event, id) => setClass(id)}
                    >
                      {group_classes.map((classObj, j) => {
                        const { name, sup, _id } = classObj;

                        return (
                          <ColorButton
                            key={_id}
                            className={`${classes.classTileBtn} Btn-white-BG`}
                            value={_id}
                            property={isNaN(name) ? name : `${name} Standard`}
                          >
                            {isNaN(name) ? name : `${name} Standard`}
                            {sup ? <sup>th </sup> : null}
                            <FiArrowRight size={16} />
                          </ColorButton>
                        );
                      })}
                    </ToggleButtonGroup>
                  </div>
                );
              })}
          </Grid> */}
        </Grid>
      </div>
      <div style={{ width: "100%" }} className={classes.getStartedBtnSticky}>
        <div className={`${classes.getStartedBtn}`}>
          <GetStartedButton
            variant="contained"
            color="primary"
            disabled={selectedClass == null ? true : false}
            onClick={() => {
              localStorage.setItem("selected-class",selectedClass["id"] )
              Router.push(`/online-courses/${selectedClass["id"]}`);
            }}
          >
            Next
          </GetStartedButton>
        </div>
        <Footer ref={footerRef} />
      </div>
    </section>
  );
};

export default GraphQL(IntroSection);
