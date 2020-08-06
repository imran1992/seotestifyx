// @ts-nocheck
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
  Grid,
  CardMedia,
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
    classTileBtn: {
      margin: spacing(1),
      minWidth: 150,
      minHeight: 50,
    },

    buttonIcon: {
      paddingLeft: 12,
    },
    menu_item: {
      textAlign: "center",
      fontWeight: "bold",
      border: "2px solid",
      borderColor: purple[500],
      padding: 7,
      borderRadius: 50,
      alignItems: "center",
      width: "70%",
      margin: "auto",
      marginTop: 10,
    },

    heading1: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: "600",
    },
  };
});

const ColorButton = withStyles((theme) => ({
  root: {
    boxShadow: 10,
    // backgroundColor: '#ffffff',
    "&:hover": {
      backgroundColor: purple[700],
      color: "white",
    },
    textAlign: "center",
    lineHeight: "initial",
  },
}))(ToggleButton);

const GetStartedButton = withStyles((theme) => ({
  root: {
    borderRadius: 20,
    // justifyContent: 'space-between',
    height: 50,
    width: "90%",
    alignSelf: "center",
    textAlign: "center",
    backgroundColor: purple[700],
    "&:hover": {
      backgroundColor: purple[500],
    },
    marginTop: theme.spacing(2),
  },
}))(Button);

const IntroSection = (props) => {
  const pages = new Array(18).fill(null);
  const { gql, appolo } = props;
  const { useQuery } = appolo;

  const classes = useStyles();
  const [classGroups, setGroups] = useState(null);
  const [selectedClass, setClass] = useState(null);

  const { loading, data, error } = useQuery(gql(CLASSES_QUERY));
  console.log(data, "graph response", error);

  useEffect(() => {
    if (!loading && data && data.findClassRoom.length) {
      let groups = groupBy(data.findClassRoom || [], "category");
      setGroups(groups);
    }
  }, [loading]);

  return (
    <section id="">
      <div>
        <div style={{ display: "grid", padding: 10 }}>
          <p className={classes.heading1}>Programs</p>
          <Grid container spacing={2} style={{ padding: 10 }}>
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
              {classGroups &&
                Object.keys(classGroups).map((group_name, i) => {
                  return (
                    <ColorButton
                      style={{ marginLeft: 0, width: 160 }}
                      key={group_name}
                      className={`${classes.classTileBtn} Btn-white-BG`}
                      value={group_name}
                    >
                      {group_name}
                    </ColorButton>
                  );
                })}
            </ToggleButtonGroup>
          </Grid>
        </div>
        <div
          style={{
            width: "100%",
            textAlign: "center",
            position: "absolute",
            bottom: 20,
          }}
        >
          <GetStartedButton
            variant="contained"
            color="primary"
            disabled={selectedClass == null ? true : false}
            onClick={() => {
              Router.push(`/classlist/${selectedClass}`);
            }}
          >
            Next
          </GetStartedButton>
        </div>
      </div>
    </section>
  );
};

export default GraphQL(IntroSection);
