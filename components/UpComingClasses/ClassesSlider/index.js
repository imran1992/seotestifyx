import React from "react";
import { makeStyles } from "@material-ui/styles";
import Slider from "react-slick";
import ClassCard from "../ClassCard";
import { ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";
import { orderBy } from "lodash";

const useStyles = makeStyles({
  sliderContainer: {
    marginTop: "20px",
    maxWidth: '100%'
  },
});

const ClassesSlider = (props) => {
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
    <div className={`${classes.sliderContainer} ${props.sliderContainerStyles}`}>
      <Slider {...settings}>
        {/* {console.log(orderedLectures, 'orderedLectures')} */}
        {orderedLectures.map((lecture) => (
        <ClassCard key={lecture["_id"]} data={lecture} forTeacher={props.forTeacher} />
        ))}
      </Slider>
    </div>
  );
};

export default ClassesSlider;
