import axios from "axios";
import https from "https";

const http = axios.create({
  baseURL: 'http://portfolio-maxime-back.maxime-eloir.fr/wp-json/portfolio/v1/',
})

export default http