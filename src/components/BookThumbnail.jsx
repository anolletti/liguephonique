import React from "react";
import { Link } from "react-router-dom";

export default function BookThumbnail({ title, image, sound }) {
  // Find the index of the sound in the title
  const index = title.toLowerCase().indexOf(sound.toLowerCase());

  // If the sound is found, split the title and wrap the match
  const highlightedTitle =
    index !== -1 ? (
      <>
        {title.slice(0, index)}
        <strong className="fw-bold">
          {title.slice(index, index + sound.length)}
        </strong>
        {title.slice(index + sound.length)}
      </>
    ) : (
      title
    );

  return (
    <Link to={`/phoneme/${sound}`}>
      <div role="button" className="d-flex flex-column cursor-pointer card">
        <img className="book-title-img" src={image} alt={title} />
        <h3 className="book-title py-2 m-0 fw-light text-center">
          {highlightedTitle}
        </h3>
      </div>
    </Link>
  );
}
