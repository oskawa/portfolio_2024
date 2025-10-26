import React, { useState, useEffect, useRef } from "react";
import { MenuScreen } from "./quizz/components/MenuScreen";
import { CategoryScreen } from "./quizz/components/CategoryScreen";
import { UsernameScreen } from "./quizz/components/UsernameScreen";
import { GameScreen } from "./quizz/components/GameScreen";
import { useQuizAudio } from "./quizz/hooks/useQuizAudio";
import { useQuizData } from "./quizz/hooks/useQuizData";
import { getContextualMessage } from "./quizz/utils/quizMessages";
import { SceneCanvas } from "./quizz/components/SceneCanvas";

const CAMERA_POSITIONS = {
  menu: { position: [7, 1, -5], rotation: [0, 2.5, 0] },
  category: { position: [7, 1, 0], rotation: [0, 2.2, 0.5] },
  username: { position: [5, 1.5, -2], rotation: [0, 2, 0] },
  game: { position: [2, 2, -0.4], rotation: [0, 1.56, 0] },
  default: { position: [7, 1, -5], rotation: [0, 2.5, 0] },
};

export function QuizzWindow() {
  // State management
  const [screen, setScreen] = useState("menu");
  const [categories, setCategories] = useState([]);
  const [excludedIds, setExcludedIds] = useState([]);
  const [username, setUsername] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [phoneAnswer, setPhoneAnswer] = useState(null);
  const [removedAnswers, setRemovedAnswers] = useState([]);
  const [publicVote, setPublicVote] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPublicModal, setShowPublicModal] = useState(true);
  const [usedLifelines, setUsedLifelines] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const thinkingTimerRef = useRef(null);

  // Custom hooks
  const { isMuted, setIsMuted, audioRefs, playAudio } = useQuizAudio(
    screen,
    currentIndex,
    audioEnabled
  );
  const {
    loadCategories: fetchCategories,
    loadQuestions: fetchQuestions,
    loadQuestion: fetchQuestion,
    verifyAnswer,
    fetchLifelineResult,
  } = useQuizData();

  // Thinking timer effect
  useEffect(() => {
    if (screen === "game" && currentQuestion) {
      if (currentIndex === 0) {
        setChatMessage(getContextualMessage("welcome", username));
      } else if (currentIndex < 5) {
        setChatMessage(getContextualMessage("earlyQuestions", username));
      } else if (currentIndex < 10) {
        setChatMessage(getContextualMessage("midGame", username));
      } else {
        setChatMessage(getContextualMessage("lateGame", username));
      }

      if (thinkingTimerRef.current) {
        clearTimeout(thinkingTimerRef.current);
      }

      thinkingTimerRef.current = setTimeout(() => {
        if (!selectedAnswer) {
          setChatMessage(getContextualMessage("thinking", username));
        }
      }, 10000);

      return () => {
        if (thinkingTimerRef.current) {
          clearTimeout(thinkingTimerRef.current);
        }
      };
    }
  }, [currentIndex, currentQuestion, screen, username, selectedAnswer]);

  useEffect(() => {
    if (selectedAnswer && thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
    }
  }, [selectedAnswer]);

  // Navigation handlers
  const enableAudio = () => {
    setAudioEnabled(true);
  };

  const handleLoadCategories = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    setScreen("category");
  };

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, checked: !cat.checked } : cat
      )
    );
  };

  const startGame = () => {
    setExcludedIds(categories.filter((c) => !c.checked).map((c) => c.id));
    setScreen("username");
  };

  const loadQuestions = async () => {
    const qs = await fetchQuestions(excludedIds);
    setQuestions(qs);
    if (qs.length > 0) {
      const question = await fetchQuestion(qs[0]);
      setCurrentQuestion(question);
    }
    setScreen("game");
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async () => {
    const q = questions[currentIndex];
    setShowPublicModal(false);

    const response = await verifyAnswer(q, selectedAnswer);
    if (!response) return;

    setResult(response.correct);

    if (response.correct) {
      setChatMessage(getContextualMessage("correct", username));
      setScore(score + 1);
      playAudio(audioRefs.correctAudioRef);

      setTimeout(async () => {
        const next = currentIndex + 1;
        if (next < questions.length) {
          setCurrentIndex(next);
          const question = await fetchQuestion(questions[next]);
          setCurrentQuestion(question);
          setSelectedAnswer("");
          setResult(null);
          setRemovedAnswers([]);
        } else {
          setChatMessage(`Incroyable ${username} ! Tu as gagné le million !`);
          setTimeout(() => {
            resetGame();
          }, 5000);
        }
      }, 3000);
    } else {
      setChatMessage(getContextualMessage("wrong", username));
      playAudio(audioRefs.wrongAudioRef);
      setTimeout(() => {
        resetGame();
      }, 5000);
    }
  };

  const handleUseLifeline = async (lifeline) => {
    if (usedLifelines.includes(lifeline)) return;

    const q = questions[currentIndex];
    const result = await fetchLifelineResult(q, lifeline);
    if (!result) return;

    switch (result.type) {
      case "phone":
        setPhoneAnswer(result.answer);
        setShowPhoneModal(true);
        break;
      case "fifty":
        setRemovedAnswers(result.removed);
        break;
      case "public":
        setPublicVote(result.votes);
        setShowPublicModal(true);
        // setTimeout(() => {
        //   setShowPublicModal(true);
        // }, 8000);
        break;
    }

    setUsedLifelines((prev) => [...prev, lifeline]);
  };

  const resetGame = () => {
    setScreen("menu");
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setResult(null);
    setCurrentQuestion(null);
    setQuestions([]);
    setUsername("");
    setRemovedAnswers([]);
    setUsedLifelines([]);
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
    }
  };



  const cameraConfig = CAMERA_POSITIONS[screen] || CAMERA_POSITIONS.default;








  return (
    <>
      <SceneCanvas
        targetPosition={cameraConfig.position}
        targetRotation={cameraConfig.rotation}
        style={{ width: "100%", height: "97.7%", position: "absolute" }}
      />
      {screen === "menu" && (
        <MenuScreen
          onStart={() => setScreen("username")}
          onCategorySelect={handleLoadCategories}
          onEnableAudio={enableAudio}
        />
      )}


      {screen === "category" && (

        <CategoryScreen
          categories={categories}
          onToggleCategory={toggleCategory}
          onContinue={startGame}
          onBack={() => setScreen("menu")}
          onEnableAudio={enableAudio}
        />
      )}

      {screen === "username" && (

        <UsernameScreen
          username={username}
          onUsernameChange={setUsername}
          onContinue={loadQuestions}
          onEnableAudio={enableAudio}
        />
      )}


      <GameScreen
        currentQuestion={currentQuestion}
        selectedAnswer={selectedAnswer}
        result={result}
        removedAnswers={removedAnswers}
        currentIndex={currentIndex}
        chatMessage={chatMessage}
        publicVote={publicVote}
        showPublicModal={showPublicModal}
        usedLifelines={usedLifelines}
        isMuted={isMuted}
        audioRefs={audioRefs}
        onAnswerClick={handleAnswerClick}
        onSubmit={handleSubmit}
        onUseLifeline={handleUseLifeline}
        onToggleMute={() => setIsMuted(!isMuted)}
      />
    </>
  );
}
