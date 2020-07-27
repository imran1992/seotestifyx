import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "react-slick";
import LiveClassesCard from "../LiveClassesCard";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { orderBy } from "lodash";

const useStyles = makeStyles({
  sliderContainer: {
    marginTop: "20px",
  },
});

const LiveClassesSlider = (props) => {
  const classes = useStyles();

  const { lectures } = props;

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

  const orderedLectures = orderBy(
    lectures,
    (record) => new Date(record["startTime"]),
    ["asc"]
  );

  return (
    <div className={classes.sliderContainer}>
      <Slider {...settings}>
        {orderedLectures.map((lecture) => (
          <LiveClassesCard enrollToCourse={props.enrollToCourse} key={lecture["_id"]} data={lecture} />
        ))}
      </Slider>
    </div>
  );
};

export default LiveClassesSlider;
