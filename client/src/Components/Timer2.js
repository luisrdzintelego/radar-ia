import React, {useState, useEffect } from 'react';

const Timer2 = ({varTime}) => {
  const [count, setCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(varTime);

  useEffect(() => {
    const oneSecond = 1000;
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
      setTimeRemaining(timeRemaining < 0 ? varTime : timeRemaining - oneSecond);
    }, oneSecond);
    return () => clearInterval(interval);
  }, [timeRemaining, varTime]);

  function msToTime(milliseconds) {
    // Get hours from milliseconds.
    const hoursFromMilli = milliseconds / (1000*60*60);
    const absoluteHours = Math.floor(hoursFromMilli);
    const h = absoluteHours > 9 ? absoluteHours : `0${absoluteHours}`;

    // Get remainder from hours and convert to minutes.
    const minutesfromHours = (hoursFromMilli - absoluteHours) * 60;
    const absoluteMinutes = Math.floor(minutesfromHours);
    const m = absoluteMinutes > 9 ? absoluteMinutes : `0${absoluteMinutes}`;

    // Get remainder from minutes and convert to seconds.
    const seconds = (minutesfromHours - absoluteMinutes) * 60;
    const absoluteSeconds = Math.floor(seconds);
    const s = absoluteSeconds > 9 ? absoluteSeconds : `0${absoluteSeconds}`;

    return h === "00" ? `${m}:${s}` : `${h}:${m}:${s}`;
  }

return (<div>{msToTime(timeRemaining)}</div>)
}

export default Timer2;