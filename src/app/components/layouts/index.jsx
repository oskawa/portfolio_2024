// layouts/index.js
import {ClassicText} from './classicText';
import { ClassicImage } from './classicImage';

const layoutMap = {
  'title_text_content': ClassicText,
  'classic_image': ClassicImage,
};

export default layoutMap;