import axios from "axios";
import https from "https";

export const httpQuiz = axios.create({
    baseURL: "https://portfolio-maxime-back.maxime-eloir.fr/wp-json/quiz/v1/",
    headers: { "Content-Type": "application/json" },
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});