import { useState, useEffect, useRef } from "react";

export const useQuizAudio = (screen, currentIndex, audioEnabled) => {
    const [isMuted, setIsMuted] = useState(false);

    const introAudioRef = useRef(null);
    const letsplayAudioRef = useRef(null);
    const ambiantAudioRef = useRef(null);
    const correctAudioRef = useRef(null);
    const wrongAudioRef = useRef(null);

    const stopAllAudio = () => {
        [
            introAudioRef,
            letsplayAudioRef,
            ambiantAudioRef,
            correctAudioRef,
            wrongAudioRef,
        ].forEach((ref) => {
            if (ref.current) {
                ref.current.pause();
                ref.current.currentTime = 0;
            }
        });
    };

    const playAudio = (audioRef) => {
        if (audioRef.current && audioEnabled) {
            audioRef.current.muted = isMuted;
            audioRef.current
                .play()
                .catch((e) => console.log("Audio play failed:", e));
        }
    };

    // Gérer le changement de mute/unmute
    useEffect(() => {
        [
            introAudioRef,
            letsplayAudioRef,
            ambiantAudioRef,
            correctAudioRef,
            wrongAudioRef,
        ].forEach((ref) => {
            if (ref.current) {
                ref.current.muted = isMuted;
            }
        });
    }, [isMuted]);

    // Gérer le changement d'écran
    useEffect(() => {
        if (!audioEnabled) return;

        if (screen === "menu" || screen === "username" || screen === "category") {
            stopAllAudio();
            playAudio(introAudioRef);
        }
    }, [screen, audioEnabled]);

    // Gérer le démarrage du jeu avec transition musique
    useEffect(() => {
        if (!audioEnabled) return;

        if (screen === "game" && currentIndex === 0) {
            stopAllAudio();

            playAudio(letsplayAudioRef);

            if (letsplayAudioRef.current) {
                letsplayAudioRef.current.onended = () => {
                    playAudio(ambiantAudioRef);
                };

                const fallbackTimer = setTimeout(() => {
                    if (ambiantAudioRef.current && ambiantAudioRef.current.paused) {
                        console.log("Fallback: Starting ambient sound");
                        playAudio(ambiantAudioRef);
                    }
                }, 5000);

                return () => clearTimeout(fallbackTimer);
            } else {
                playAudio(ambiantAudioRef);
            }
        }
    }, [screen, currentIndex, audioEnabled]);

    // Nettoyer tous les sons au démontage du composant
    useEffect(() => {
        return () => {
            stopAllAudio();
        };
    }, []);

    return {
        isMuted,
        setIsMuted,
        audioRefs: {
            introAudioRef,
            letsplayAudioRef,
            ambiantAudioRef,
            correctAudioRef,
            wrongAudioRef,
        },
        playAudio,
        stopAllAudio,
    };
};