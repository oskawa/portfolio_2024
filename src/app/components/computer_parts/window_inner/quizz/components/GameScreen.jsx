import React from "react";
import styles from "../../quizz.module.scss";
import { SceneCanvas } from "./SceneCanvas";
import { MuteButton } from "./MuteButton";
import { QuestionDisplay } from "./QuestionDisplay";
import { AnswerOptions } from "./AnswerOptions";
import { PriceCounter } from "./PriceCounter";
import { LifelineButtons } from "./LifelineButtons";
import { PublicVoteModal } from "./PublicVoteModal";
import { ChatMessage } from "./ChatMessage";

export const GameScreen = ({
  currentQuestion,
  selectedAnswer,
  result,
  removedAnswers,
  currentIndex,
  chatMessage,
  publicVote,
  showPublicModal,
  usedLifelines,
  isMuted,
  audioRefs,
  onAnswerClick,
  onSubmit,
  onUseLifeline,
  onToggleMute,
}) => {
  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className={styles.quizzWindow}>
      {/* Audio elements */}
      <audio ref={audioRefs.introAudioRef} src="/sound/quizz/intro.mp3" loop />
      <audio ref={audioRefs.letsplayAudioRef} src="/sound/quizz/letsplay.mp3" />
      <audio
        ref={audioRefs.ambiantAudioRef}
        src="/sound/quizz/ambiant.mp3"
        loop
      />
      <audio ref={audioRefs.correctAudioRef} src="/sound/quizz/correct.mp3" />
      <audio ref={audioRefs.wrongAudioRef} src="/sound/quizz/wrong.mp3" />

      <MuteButton isMuted={isMuted} onToggle={onToggleMute} />

      <div className={styles.canvasInner}>
        <SceneCanvas targetPosition={[0, 1, 3]} showOrbitControls={true} />

        <div className={styles.innerQuestion}>
          <QuestionDisplay question={currentQuestion.question} />
          <AnswerOptions
            answers={currentQuestion.answers}
            selectedAnswer={selectedAnswer}
            result={result}
            removedAnswers={removedAnswers}
            onAnswerClick={onAnswerClick}
            onSubmit={onSubmit}
          />
        </div>
      </div>

      <div className={styles.innerCounter}>
        <LifelineButtons
          onUseLifeline={onUseLifeline}
          usedLifelines={usedLifelines}
        />
        <PriceCounter currentIndex={currentIndex} />
        <PublicVoteModal show={showPublicModal} publicVote={publicVote} />
      </div>

      <ChatMessage message={chatMessage} />
    </div>
  );
};
