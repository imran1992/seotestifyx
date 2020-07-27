import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "react-slick";
import CoursesCard from "../CoursesCard";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  sliderContainer: {
    marginTop: "20px",
    marginBottom: "20px",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "40px",
    },
  },
}));

const CoursesSlider = (props) => {
  const { lectures, user, enrollToCourse } = props;

  const classes = useStyles();

  const settings = {
    className: "slider variable-width",
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    nextArrow: <ArrowForwardIos color="action" />,
    prevArrow: <ArrowBackIos color="action" />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };
  // console.log(lectures);

  return (
    <div className={classes.sliderContainer}>
      <Slider {...settings}>
        {lectures.map((lecture) => (
          <CoursesCard
            key={lecture["_id"]}
            isFree={
              lecture["price"] && lecture["price"] !== "FREE" ? false : true
            }
            data={lecture}
            user={user}
            enrollToCourse={enrollToCourse}
          />
        ))}
      </Slider>
    </div>
  );
};

export default CoursesSlider;
