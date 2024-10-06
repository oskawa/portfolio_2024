import axios from "axios";
import https from "https";

const http = axios.create({
  baseURL: 'https://portfolio-maxime-back.maxime-eloir.fr/wp-json/portfolio/v1/',
  headers: {
    'Content-Type': 'application/json'
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Optional: Use if SSL issues occur
})

export default http