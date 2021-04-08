import { h } from "preact";
import style from "./site-menu.css";

export default function SiteMenu(props) {
  return (
    <div class={style["site-menu"]} style={props.style}>
      <h1>Nicolas Grenier</h1>
      <h3>
        <a href="https://nicolasgrenier.com/Exhibitions-Projects">
          Exhibitions &amp; Projects /
        </a>
        <a href="https://nicolasgrenier.com/Paintings">/ Paintings /</a>
        <a href="https://nicolasgrenier.com/Research">/ Research /</a>
        <a href="https://nicolasgrenier.com/About">/ About&nbsp;</a>
      </h3>
    </div>
  );
}
