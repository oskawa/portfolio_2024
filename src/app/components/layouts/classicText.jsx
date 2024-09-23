// ClassicText.js
export function ClassicText({ ...props }) {
  return <div dangerouslySetInnerHTML={{ __html: props.content }}></div>;
}
