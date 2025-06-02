import React from "react";
import "../App.css";

import BookThumbnail from "../components/BookThumbnail";

export default function MainPage() {
  const bookList = [
    { title: "Agente Éclaira", image: "images/é/0.png", sound: "é" },
    { title: "Agent Oizo", image: "images/oi/0.png", sound: "oi" },
    { title: "Agent Boum", image: "images/ou/0.png", sound: "ou" },
  ];
  return (
    <div>
      <div className="text-center">
        <img
          src={`${process.env.PUBLIC_URL}/images/ligue_phonique_logo.png`}
          className="App-logo"
          alt="logo"
        />
      </div>
      <hr className="text-white mt-0 vw-50 mb-4" />

      <div className="container">
        <div className="d-flex flex-row justify-content-around">
          {bookList.map((book, index) => (
            <div className="col-3 mb-4" key={index}>
              <BookThumbnail
                title={book.title}
                image={book.image}
                sound={book.sound}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
