// layouts/index.js
import { ClassicText } from "./classicText";
import { ClassicImage } from "./classicImage";
import { Image } from "./image";
import { ImageContent } from "./imgContent";

const layoutMap = {
  title_text_content: ClassicText,
  classic_image: ClassicImage,
  text_img_content: ImageContent,
  image:Image,
};

export default layoutMap;
