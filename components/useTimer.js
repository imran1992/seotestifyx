import { useState, useEffect } from "react";

export default (startTime, duration) => {
  //startTime: "2020-03-18T06:49:00.000Z"
  //duration: 90
  const [timeCounter, setTimeCounter] = useState("");
  useEffect(() => {
    const interval = setInterval(() => {
      const StartTime = new Date(startTime);
      const currentTime = new Date();
      const diffMs = currentTime - StartTime;
      const secondsEscaped = diffMs % 3600000;
      const minEscaped = Math.round(secondsEscaped / 60000);
      console.log("StartTime", StartTime);
      console.log("currentTime", currentTime);
      console.log("diffInMinute", minEscaped);
      if (currentTime < StartTime) {
        setTimeCounter(`Not Started Yet`);
      } else if (minEscaped <= duration) {
        const hrsEscaped = Math.floor(secondsEscaped / 60000 / 3600000);
        setTimeCounter(`${hrsEscaped}:${minEscaped}`);
      } else {
        setTimeCounter(`Session Dismissed`);
        interval && clearInterval(interval);
      }
    }, 1000);

    return () => {
      interval && clearInterval(interval);
    };
  }, []);

  return [timeCounter];
};
