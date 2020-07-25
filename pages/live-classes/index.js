import React from "react";
// import {
//     Typography
// } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { blue } from '@material-ui/core/colors';
// import ClassesSlider from "../../components/UpComingClasses/ClassesSlider";
// import CoursesSlider from "../../components/Courses/CoursesSlider";
// import SliderHeader from "../../components/SliderHeader";
import nextCookie from 'next-cookies';

const primaryColor = blue[500];

const useStyles = makeStyles({
    root: {
        margin: "0 7.5%"
    },
    fontBold: {
        fontWeight: 'bold',
    },
    primaryColor: {
        color: primaryColor,
    },
    title: {
        textAlign: 'center',
        margin: '20px'
    },
});

const liveClasses = () => {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            {/* <Typography
                variant="h4"
                className={`${classes.title} ${classes.fontBold}`}
            >
                <span className={classes.primaryColor}>Live</span> Classes
            </Typography>

            <SliderHeader
                title="Upcoming Classes"
                subTitle="From the courses you subscribed to"
                linkRef="#"
                linkText='View all'
            />

            <ClassesSlider />

            <SliderHeader
                title="Courses"
                linkRef="#"
                linkText='View all'
            />

            <CoursesSlider /> */}
        </div>
    )
}

liveClasses.getInitialProps = async (ctx) => {
    const { Authorization } = nextCookie(ctx);
    if (ctx.req && !Authorization) {
        ctx.res.writeHead(302, { Location: '/login' }).end();
    } else if (!Authorization) {
        document.location.pathname = '/login';
    } else return { Authorization };
};

export default liveClasses;