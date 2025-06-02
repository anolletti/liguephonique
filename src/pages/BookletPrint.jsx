import React from "react";
import "./Booklet.css";
import { useParams } from "react-router-dom";
import { books } from "../books";

export default function BookletPrint() {
  const { sound } = useParams();

  const { pages } = books[sound];
  const orderedPairs = getBookletPageOrder(pages);

  return (
    <div className="booklet-print bg-white">
      {orderedPairs.map(([left, right], index) => (
        <div className="sheet" key={index}>
          <div className="page left">
            {left.image && (
              <img
                src={`${process.env.PUBLIC_URL}/images/${sound}/${
                  left.pageNumber - 1
                }.png`}
                alt=""
              />
            )}
            <p>{left.pageNumber}</p>
            <p>{highlightMarkedWords(left.text)}</p>
          </div>
          <div className="page right">
            {right.image && (
              <img
                src={`${process.env.PUBLIC_URL}/images/${sound}/${
                  right.pageNumber - 1
                }.png`}
                alt=""
              />
            )}{" "}
            <p>{highlightMarkedWords(right.text)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

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

function getBookletPageOrder(pages) {
  const paddedPages = [...pages];
  while (paddedPages.length % 4 !== 0) {
    paddedPages.push({ text: "", image: "" });
  }

  // Assign page numbers (starting from 1)
  paddedPages.forEach((page, index) => {
    page.pageNumber = index + 1;
  });

  const order = [];
  const n = paddedPages.length;

  for (let i = 0; i < n / 4; i++) {
    const left1 = n - 1 - i * 2;
    const right1 = i * 2;
    const left2 = right1 + 1;
    const right2 = left1 - 1;
    order.push([paddedPages[left1], paddedPages[right1]]);
    order.push([paddedPages[left2], paddedPages[right2]]);
  }

  return order;
}
