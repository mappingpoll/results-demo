import style from "./notify.css";

export default function Notify(props) {
  return <div class={style.notif}>{props.children}</div>;
}
