import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./styles.css";
import { urlLyric, urlMusic } from "../constants";

export default function App() {
  const [lyricText, setLyricText] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);

  const [currentHeight, seCurrentHeight] = useState(0);

  const ref = useRef(null);

  const refScroll = useRef(null);

  useEffect(() => {
    axios
      .get(urlLyric)
      .then(function(response) {
        setLyricText(
          response.data.split("\n").reduce((l, b) => {
            return [
              ...l,
              {
                data: b.slice(10),
                startTime:
                  Number(b.slice(1, 3)) * 60 * 1000 +
                  Number(b.slice(4, 6)) * 1000 +
                  Number(b.slice(7, 9)) * 10
              }
            ];
          }, [])
        );
      })
      .catch(function(error) {
        console.log(error);
      });
  }, []);

  const onTimeUpdate = () => {
    setCurrentTime(ref.current.currentTime * 1000);
    refScroll.current?.offsetTop &&
      seCurrentHeight(refScroll.current?.offsetTop - 160);
    window.scroll({ top: currentHeight, behavior: "smooth" });
  };

  return (
    <div className="App">
      <div className="audioContainer">
        <audio onTimeUpdate={onTimeUpdate} ref={ref} controls>
          <source src={urlMusic} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      {lyricText?.length &&
        lyricText.map((e, i) => {
          return (
            <div style={{ marginTop: 90 }} key={i}>
              {e.data.length !== 1 && (
                <div
                  ref={
                    e.startTime <= currentTime &&
                    currentTime <= lyricText[i + 1]?.startTime
                      ? refScroll
                      : undefined
                  }
                  style={Object.assign(
                    {},
                    {
                      color: "#fff",
                      userSelect: "auto",
                      marginTop: 14,
                      marginBottom: 14,
                      fontSize: 48,
                      letterSpacing: `1px`,
                      fontWeight: 400,
                      lineHeight: `75px`,
                      height: `75px`,
                      transition: `color 0.5s, font-size 0.5s`
                    },
                    e.startTime <= currentTime &&
                      currentTime <= lyricText[i + 1]?.startTime
                      ? {
                          color: "#ffed00",
                          fontSize: 60,
                          textTransform: "none",
                          fontWeight: 700
                        }
                      : undefined
                  )}
                >
                  {e.data}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
