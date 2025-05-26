import React, { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { books } from "../books";
import SyncedAudioPlayer from "../components/SyncedAudioPlayer";

export default function BookPage() {
  const { sound } = useParams();
  const navigate = useNavigate();
  const book = books[sound];
  const [pageIndex, setPageIndex] = useState(0);

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // Callback when audio ends
  const onAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  if (!book) {
    return (
      <Container className="text-center py-5">
        <h2>No book found for phoneme: {sound}</h2>
      </Container>
    );
  }

  const page = book.pages[pageIndex];
  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === book.pages.length - 1;

  // Play/Pause toggle, controlling the audio element via ref
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.ended) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 py-2">
      <div className="row w-50 mb-3">
        <div className="col-4 text-start">
          {!isFirstPage && (
            <Button
              variant="secondary"
              className="mx-3"
              onClick={() => setPageIndex((i) => Math.max(i - 1, 0))}
              disabled={isFirstPage}>
              ←
            </Button>
          )}
        </div>
        <div className="col-4 text-center">
          <Button variant="outline-light" className="mx-3" onClick={togglePlay}>
            <i className="bi bi-play-fill"></i>
          </Button>
        </div>
        <div className="col-4 text-end">
          {!isLastPage && (
            <Button
              variant="secondary"
              className="mx-3"
              onClick={() =>
                setPageIndex((i) => Math.min(i + 1, book.pages.length - 1))
              }
              disabled={isLastPage}>
              →
            </Button>
          )}
        </div>
      </div>

      <div
        className="book-container shadow-lg p-4 bg-white rounded"
        style={{ width: "100%", maxWidth: 700 }}>
        <div className="book-header text-center"></div>

        <div className="book-content d-flex flex-column align-items-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/${sound}/${pageIndex}.png`}
            alt={`Page ${pageIndex + 1}`}
            className="book-image mb-4"
            style={{ maxWidth: "100%", height: "auto" }}
          />

          <SyncedAudioPlayer
            audioSrc={`${process.env.PUBLIC_URL}/images/${sound}/${pageIndex}.mp3`}
            labelSrc={`${process.env.PUBLIC_URL}/images/${sound}/${pageIndex}.txt`}
            rawText={page.text}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            onAudioEnded={onAudioEnded}
          />
        </div>

        {pageIndex !== 0 && (
          <h4 className="text-muted text-end m-0">{pageIndex}</h4>
        )}
      </div>
      <Button
        className="mt-3"
        variant="outline-light"
        onClick={() => navigate("/")}>
        <i className="bi bi-house"></i>
      </Button>
    </div>
  );
}
