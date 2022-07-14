import * as React from "react";
export const HoverCard = (props) => {
  document.onmousemove = tiltCards;
  function tiltCards(event) {
    let eventDoc, doc, body;
    event = event || window.event; // IE-ism
    // (This is to support old IE)
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;
    const pageX =
      event.clientX +
      ((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
      ((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
    const pageY =
      event.clientY +
      ((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
      ((doc && doc.clientTop) || (body && body.clientTop) || 0);
    let xTilt = pageX / (window.innerWidth / 2) - 1;
    let yTilt = (pageY / (window.innerHeight / 2) - 1) * -1;
    const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll(".card");
    let tiltAmount = Math.sqrt(Math.pow(xTilt, 2) + Math.pow(yTilt, 2)) * 20;
    cards.forEach((card: HTMLDivElement) => {
      card.style[
        "transform"
      ] = `rotate3d(${yTilt}, ${xTilt}, 0, ${tiltAmount}deg)`;
      //let shadowX = xTilt * -10;
      //let shadowY = yTilt * 10;
      //card.style.setProperty(
      //"filter",
      //`drop-shadow(${shadowX}px ${shadowY}px 30px 0px #0f0)`
      //);
    });
  }
  return <div className="card">{props.element}</div>;
};
