import axios from "axios";
import https from "https";

const http = axios.create({
  baseURL:
    "https://portfolio-maxime-back.maxime-eloir.fr/wp-json/portfolio/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Optional: Use if SSL issues occur
});
const httpCard = axios.create({
  baseURL:
    "https://portfolio-maxime-back.maxime-eloir.fr/wp-json/rest-api-more/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Optional: Use if SSL issues occur
});

const httpQuiz = axios.create({
  baseURL: "https://portfolio-maxime-back.maxime-eloir.fr/wp-json/quiz/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Optional: Use if SSL issues occur
});

export { httpCard, httpQuiz };
export default http;
