import axios from "axios";
import https from "https";

const http = axios.create({
  baseURL: 'https://portfolio-maxime-back.maxime-eloir.fr/wp-json/portfolio/v1/',
})

export default http