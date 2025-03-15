import { useRef, useState } from "react";
import styles from "./tcg.module.scss";

export function TcgCard({ cardUrl }: { cardUrl: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [boxShadow, setBoxShadow] = useState("");

  const handleMouseMove = (e: MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5; // Normalize to -0.5 to 0.5
    const y = (e.clientY - top) / height - 0.5; // Normalize to -0.5 to 0.5

    const rotateX = y * -35; // Increased intensity
    const rotateY = x * 35; // Increased intensity

    // Simulating light reflection using box-shadow
    const shadowX = x * -20;
    const shadowY = y * 20;

    setTransformStyle(
      `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`
    );
    setBoxShadow(`${shadowX}px ${shadowY}px 25px rgba(255, 231, 89, 0.3)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle(
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)"
    );
    setBoxShadow("0px 0px 15px rgba(255, 231, 89, 0.2)");
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      style={{
        backgroundImage: `url(${cardUrl})`,
        transform: transformStyle,
        boxShadow: boxShadow,
        transition: "transform 0.15s ease-out, box-shadow 0.2s ease-out",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    ></div>
  );
}
