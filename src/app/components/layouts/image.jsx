// ClassicText.js
export function Image({ ...props }) {
  return (
    <>
      <img src={props.image.url} alt="" />
    </>
  );
}
