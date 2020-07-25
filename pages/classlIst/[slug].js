// @ts-nocheck
import React, { useState, useEffect } from "react";
import groupBy from "lodash/groupBy";
import { useRouter } from "next/router";
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

    fullBg: {
      // minHeight: '100vh',
      // paddingTop: 120,
      // paddingBottom: 50,
      // backgroundColor:'white'
    },


    classTileBtn: {
      margin: spacing(1),
      minWidth: 150,
      minHeight: 50
    },
    activeBtn: {
      backgroundColor: purple[700],
    },




    buttonIcon: {
      paddingLeft: 12
    },
    menu_item: {
      textAlign: 'center',
      fontWeight: 'bold',
      border: '2px solid',
      borderColor: purple[500],
      padding: 7,
      borderRadius: 50,
      alignItems: 'center',
      width: '70%',
      margin: 'auto',
      marginTop: 10

    },


    heading1: {
      marginLeft: 10,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 0,
      paddingBottom: 0,

    },
  };
});

const ColorButton = withStyles((theme) => ({
  root: {
    boxShadow: 10,
    "&:hover": {
      backgroundColor: purple[700],
      color: 'white'
    },
    textAlign: 'center',
  },
}))(ToggleButton);

const GetStartedButton = withStyles((theme) => ({
  root: {
    color: '#ffffff',
    borderRadius: 20,
    // justifyContent: 'space-between',
    height: 50,
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: purple[700],
    "&:hover": {
      backgroundColor: purple[500],
    },
    marginTop: theme.spacing(2),

  },
}))(Button);

const IntroSection = (props) => {
  const pages = new Array(18).fill(null);
  const Router = useRouter();
  const { pathname, query } = Router;
  const { slug } = query;
  const { gql, appolo } = props;
  const { useQuery } = appolo;
  const classes = useStyles();
  const [classL, setClass] = useState(null);

  const [selectedClass, setClas] = useState(null);

  const { loading, data } = useQuery(gql(CLASSES_QUERY));

  useEffect(() => {
  if (!loading && data && data.findClassRoom.length) {
      let dataList = data.findClassRoom;
      let classList = dataList.filter(item => item.category == slug)
      setClass(classList);
    }
  }, [loading]);

  return (
    <section >
      <div
        className={`${classes.fullBg} full-bg-img align-items-center`}
      >

        <div style={{ display: 'grid', padding: 15 }}>
          <p className={classes.heading1}><span onClick={() => {
              Router.push(`/programs`);
            }}>Programs</span> > {slug}</p>

          <Grid container spacing={2} style={{ padding: 10, justifyContent:'center' }}>
            <ToggleButtonGroup
              className="d-inline"
              style={{ textAlignLast: 'center', textAlign: 'center', backgroundColor: 'unset', }}
              value={selectedClass}
              // orientation="vertical"
              exclusive
              onChange={(event, id) => setClas(id)}
            >
              {classL &&
                classL.map((item, i) => {
                  return <ColorButton
                    key={item._id}
                    style={{marginLeft:0}}
                    className={`${classes.classTileBtn} Btn-white-BG`}
                    value={item._id}
                  >

                    {item.name}

                  </ColorButton>
                })
              }
            </ToggleButtonGroup>
          </Grid>
        </div>

        <div style={{ width: '100%', textAlign: 'center',position:'absolute', bottom: 20 }}>
          <GetStartedButton
            variant="contained"
            color="primary"
            disabled={selectedClass == null ? true : false}
            onClick={() => {
              localStorage.setItem("selected-class",selectedClass )
              Router.push(`/online-courses/${selectedClass}`);
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

