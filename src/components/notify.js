import style from "./notify.css";

export default function Notify(props) {
  if (!props.visible) return;
  return <div class={style.notif}>{props.children}</div>;
}
