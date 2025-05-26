import { Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";

// Flatten raw string into words and spaces
function flattenStringToWords(text) {
  const words = [];
  text.split(/(\s+)/).forEach((token) => {
    if (token === "") return;
    if (/^\s+$/.test(token)) {
      words.push({ word: token, elementType: "space" });
    } else {
      words.push({ word: token, elementType: "span" });
    }
  });
  return words;
}

export default function SyncedAudioPlayer({
  audioSrc,
  labelSrc,
  rawText,
  audioRef,
  isPlaying,
  setIsPlaying,
  onAudioEnded,
}) {
  const [labelData, setLabelData] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  function highlightMarkedWords(text) {
    const regex = /\*(.*?)%/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, word] = match;
      const matchStart = match.index;
      const matchEnd = regex.lastIndex;

      if (lastIndex < matchStart) {
        elements.push(
          <span key={key++}>{text.slice(lastIndex, matchStart)}</span>
        );
      }

      elements.push(
        <strong key={key++} className="fw-bold text-primary">
          {word}
        </strong>
      );

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      elements.push(<span key={key++}>{text.slice(lastIndex)}</span>);
    }

    return elements;
  }

  function parseLabelFile(text) {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const [start, end, ...textParts] = line.trim().split(/\s+/);
        return {
          start: parseFloat(start),
          end: parseFloat(end),
          text: textParts.join(" "),
        };
      });
  }

  // Flatten raw string directly (no formatting)
  const flattenedWords = flattenStringToWords(rawText);

  useEffect(() => {
    if (!labelSrc) {
      setLabelData([]);
      return;
    }

    fetch(labelSrc)
      .then((res) => res.text())
      .then((text) => setLabelData(parseLabelFile(text)))
      .catch(() => setLabelData([]));
  }, [labelSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || labelData.length === 0) return;

    function handleTimeUpdate() {
      const currentTime = audio.currentTime;

      const labelIndex = labelData.findIndex(
        ({ start, end }) => currentTime >= start && currentTime <= end
      );

      if (labelIndex === -1) {
        setCurrentWordIndex(-1);
        return;
      }

      let wordCount = -1;
      for (let i = 0; i < flattenedWords.length; i++) {
        if (flattenedWords[i].elementType !== "space") {
          wordCount++;
        }
        if (wordCount === labelIndex) {
          setCurrentWordIndex(i);
          return;
        }
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", onAudioEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", onAudioEnded);
    };
  }, [labelData, flattenedWords, onAudioEnded, audioRef]);

  return (
    <div className="text-center" style={{ maxWidth: 700 }}>
      <audio ref={audioRef} src={audioSrc} />
      <p style={{ fontSize: "1.9rem", lineHeight: 1.8, userSelect: "none" }}>
        {flattenedWords.map(({ word, elementType }, i) => {
          if (elementType === "space") {
            return word;
          }

          const style = {
            backgroundColor: i === currentWordIndex ? "yellow" : "transparent",
            transition: "background-color 0.2s ease",
            borderRadius: 2,
          };

          return (
            <span key={i} style={style}>
              {highlightMarkedWords(word)}
            </span>
          );
        })}
      </p>
    </div>
  );
}
