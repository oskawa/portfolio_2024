// Contextual messages for the quiz game
export const getContextualMessage = (context, username, presenterName = "Friend") => {
    const messages = {
        phone: [
            `${presenterName}: "I'm pretty confident it's answer B!"`,
            `${presenterName}: "Hmm, tough one... I'd lean toward C."`,
            `${presenterName}: "Not 100% sure, but I think it's A."`,
        ],
        public: ["The audience has voted!", "Here's what the crowd thinks..."],
        fifty: ["Two incorrect answers have been eliminated."],
        welcome: [
            `Bienvenue ${username} ! Prêt à gagner le million ?`,
            `Salut ${username} ! On commence facile...`,
            `${username}, c'est parti pour l'aventure !`,
        ],
        earlyQuestions: [
            `Pour l'instant c'est facile ${username}...`,
            `Tu gères bien pour le moment !`,
            `Pas de panique ${username}, on commence tranquille.`,
            `Les premières questions sont un jeu d'enfant !`,
        ],
        midGame: [
            `Ça se corse ${username} !`,
            `On entre dans le vif du sujet...`,
            `Plus que quelques questions pour le million !`,
            `Tu es à mi-chemin ${username} !`,
        ],
        lateGame: [
            `${username}, c'est presque gagné !`,
            `La tension monte... Plus que quelques questions !`,
            `Le million est tout proche ${username} !`,
            `Concentre-toi, on y est presque !`,
        ],
        thinking: [
            `${username}, tu réfléchis ? Prends ton temps...`,
            `Hmm... ${username} hésite ?`,
            `La réponse ne saute pas aux yeux hein ?`,
            `Pas de stress ${username}, réfléchis bien !`,
            `${username} cherche la bonne réponse...`,
        ],
        correct: [
            `Bravo ${username} ! C'est la bonne réponse !`,
            `Excellent ${username} !`,
            `Parfait ! Continue comme ça !`,
            `C'est ça ${username} ! Tu assures !`,
        ],
        wrong: [
            `Oh non ${username}... C'était pas ça !`,
            `Dommage ${username}, c'était pas la bonne...`,
            `Perdu ! On recommence ${username} ?`,
        ],
    };

    const messageArray = messages[context] || messages.welcome;
    return messageArray[Math.floor(Math.random() * messageArray.length)];
};

export const questionsPrice = [
    "200",
    "300",
    "500",
    "800",
    "1500",
    "3 000",
    "6 000",
    "12 000",
    "24 000",
    "48 000",
    "72 000",
    "100 000",
    "150 000",
    "300 000",
    "1 000 000",
];