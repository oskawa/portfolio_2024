// ClassicText.js
import styles from "./imgcontent.module.scss";

export function ImageContent({ ...props }) {
  return (
    <>
      <div class={styles.flex}>
        <div class={styles.content} dangerouslySetInnerHTML={{ __html: props.content }}></div>
        <div class={styles.img}>
          <img src={props.image.url} alt="" />
        </div>
      </div>
    </>
  );
}
