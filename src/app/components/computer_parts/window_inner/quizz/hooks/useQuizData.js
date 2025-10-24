import { httpQuiz } from "../utils/httpQuiz";

export const useQuizData = () => {
    const loadCategories = async () => {
        try {
            const response = await httpQuiz.get("categories");
            return response.data.map((cat) => ({ ...cat, checked: true }));
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    };

    const loadQuestions = async (excludedIds) => {
        try {
            const params = excludedIds.length
                ? { exclude_categories: excludedIds.join(",") }
                : {};
            const response = await httpQuiz.get("questions", { params });
            return response.data;
        } catch (error) {
            console.error("Error fetching questions:", error);
            return [];
        }
    };

    const loadQuestion = async (q) => {
        try {
            const response = await httpQuiz.get(
                `question?post_id=${q.post_id}&difficulty=${q.difficulty}&index=${q.index}`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching question:", error);
            return null;
        }
    };

    const verifyAnswer = async (q, answer) => {
        try {
            const response = await httpQuiz.post("verify", {
                post_id: q.post_id,
                difficulty: q.difficulty,
                index: q.index,
                answer: answer,
            });
            return response.data;
        } catch (error) {
            console.error("Error verifying answer:", error);
            return null;
        }
    };

    const fetchLifelineResult = async (q, lifeline) => {
        try {
            const response = await httpQuiz.post("verify-finding", {
                post_id: q.post_id,
                difficulty: q.difficulty,
                index: q.index,
                lifeline: lifeline,
            });
            return response.data;
        } catch (error) {
            console.error("Lifeline error:", error);
            return null;
        }
    };

    return {
        loadCategories,
        loadQuestions,
        loadQuestion,
        verifyAnswer,
        fetchLifelineResult,
    };
};