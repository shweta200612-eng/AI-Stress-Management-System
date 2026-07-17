export const JOKES: string[] = [
  "Why don't scientists trust atoms? Because they make up everything.",
  "I told my wifi we needed to talk. Now the connection is awkward.",
  "Parallel lines have so much in common… it's a shame they'll never meet.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "Why did the scarecrow get promoted? He was outstanding in his field.",
  "I asked my dog what's two minus two. He said nothing.",
  "I would tell you a construction joke, but I'm still working on it.",
  "My therapist says I have a preoccupation with vengeance. We'll see about that.",
  "Why don't eggs tell jokes? They'd crack each other up.",
  "I used to play piano by ear. Now I use my hands.",
  "I'm on a seafood diet. I see food and I eat it.",
  "What do you call cheese that isn't yours? Nacho cheese.",
  "Why did the bicycle fall over? It was two-tired.",
  "I'm afraid for the calendar. Its days are numbered.",
  "My wife told me to stop impersonating a flamingo. I had to put my foot down.",
  "I only know 25 letters of the alphabet. I don't know y.",
  "Why don't skeletons fight each other? They don't have the guts.",
  "I'd avoid the sushi if I were you. It's a little fishy.",
  "Want to hear a joke about paper? Never mind — it's tearable.",
  "Why did the math book look sad? Because it had too many problems.",
  "I tried to catch fog yesterday. Mist.",
  "Did you hear about the claustrophobic astronaut? He just needed a little space.",
  "Why don't programmers like nature? Too many bugs.",
  "I asked the librarian if the library had books about paranoia. She whispered, 'They're right behind you.'",
  "How does the moon cut his hair? Eclipse it.",
  "What do you call fake spaghetti? An impasta.",
  "Why did the coffee file a police report? It got mugged.",
  "I'm reading a book about teleportation. It's bound to take me places.",
  "Why was the math teacher suspicious of prime numbers? They were all odd.",
  "My friend said I was childish. I told him to get out of my fort.",
  "I named my horse Mayo. Sometimes Mayo neighs.",
  "Why don't oysters share? Because they're shellfish.",
  "I bought shoes from a drug dealer. I don't know what he laced them with, but I was tripping all day.",
  "What's orange and sounds like a parrot? A carrot.",
  "Why did the golfer wear two pairs of pants? In case he got a hole in one.",
  "I told my computer I needed a break. It said 'No problem — I'll go to sleep.'",
  "Why did the cookie go to the doctor? It was feeling crumbly.",
  "What do you call a dinosaur with an extensive vocabulary? A thesaurus.",
  "I'm great at multitasking. I can waste time, be unproductive, and procrastinate all at once.",
  "Why did the tomato turn red? It saw the salad dressing.",
  "Did you hear about the kidnapping at school? It's fine — he woke up.",
  "I have a fear of speed bumps. I'm slowly getting over it.",
  "Why do bees have sticky hair? Because they use honeycombs.",
  "What did the ocean say to the shore? Nothing — it just waved.",
  "I'd tell you a chemistry joke but I know I wouldn't get a reaction.",
  "Why are elevator jokes so good? They work on so many levels.",
  "How do you organize a space party? You planet.",
  "Why don't crabs give to charity? Because they're shellfish.",
  "I told my suitcase no more vacations. Now I'm dealing with emotional baggage.",
  "Time flies like an arrow. Fruit flies like a banana.",
];

export const randomJoke = () => JOKES[Math.floor(Math.random() * JOKES.length)];

export const MOTIVATIONAL_QUOTES: { text: string; author?: string }[] = [
  { text: "You are stronger than you think and braver than you feel.", author: "A.A. Milne" },
  { text: "Every storm runs out of rain.", author: "Maya Angelou" },
  { text: "Healing is not linear. Be patient with yourself.", author: "Unknown" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "This too shall pass.", author: "Persian Proverb" },
  { text: "The sun will rise and we will try again.", author: "Twenty One Pilots" },
  { text: "Be soft. Do not let the world make you hard.", author: "Iain Thomas" },
  { text: "Rest when you're weary. Refresh and renew yourself.", author: "Ralph Marston" },
  { text: "You are allowed to be both a masterpiece and a work in progress.", author: "Sophia Bush" },
  { text: "Your only obligation in any lifetime is to be true to yourself.", author: "Richard Bach" },
];

export const YOGA_POSES: {
  name: string;
  duration: string;
  ytId: string;
}[] = [
  { 
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "yqeirBfn2j4"
 },
  { 
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "IGQgt3eHoRc"
 },
  {
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "cMfChJLqma4"
 },
  { 
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "O2EY79Ys_qg" 
},
  { 
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "oDP-89wRXUk"
 },
  { 
  name: "Morning Yoga",
  duration: "10 min",
  ytId: "Lv1jpqkN4ZY"
 },
];

// Exercise sessions tuned by stress level
export type StressLevel = "low" | "medium" | "high";

export const EXERCISE_SESSIONS: {
  id: string; level: StressLevel; title: string; duration: string; emoji: string;
  steps: { name: string; time: string; desc: string }[];
}[] = [
  {
    id: "ex-low", level: "low", title: "Energy boost flow", duration: "12 min", emoji: "⚡",
    steps: [
      { name: "Jumping jacks", time: "2 min", desc: "Warm up the body, get the heart moving." },
      { name: "Bodyweight squats", time: "3 min", desc: "3 sets of 15. Keep chest up." },
      { name: "Push-ups", time: "3 min", desc: "3 sets of 10 — knees ok." },
      { name: "Plank", time: "2 min", desc: "4 holds of 30s each." },
      { name: "Cool-down stretch", time: "2 min", desc: "Forward fold + side bends." },
    ],
  },
  {
    id: "ex-med", level: "medium", title: "Tension release walk-flow", duration: "15 min", emoji: "🌿",
    steps: [
      { name: "Shoulder rolls", time: "1 min", desc: "Slow forward + backward circles." },
      { name: "Neck releases", time: "2 min", desc: "Ear to shoulder, hold 20s each side." },
      { name: "Standing forward fold", time: "2 min", desc: "Bend knees, let head hang heavy." },
      { name: "Walking in place", time: "5 min", desc: "Match steps to slow inhale/exhale." },
      { name: "Wall push-ups", time: "3 min", desc: "Easy push-ups against a wall." },
      { name: "Final stretch", time: "2 min", desc: "Quad + hamstring stretch each side." },
    ],
  },
  {
    id: "ex-high", level: "high", title: "Gentle restorative", duration: "10 min", emoji: "🌸",
    steps: [
      { name: "Lie down + deep breaths", time: "2 min", desc: "Hand on belly, slow inhales." },
      { name: "Supine twist", time: "2 min", desc: "Knees to one side, head opposite. 1 min each side." },
      { name: "Legs up the wall", time: "3 min", desc: "Soften everything. Just exist." },
      { name: "Self-hug stretch", time: "1 min", desc: "Wrap arms around self, sway gently." },
      { name: "Savasana", time: "2 min", desc: "Lie still, eyes closed, soften the jaw." },
    ],
  },
];

export const MEDITATION_SESSIONS: {
  id: string; level: StressLevel; title: string; duration: string; emoji: string; script: string[];
}[] = [
  {
    id: "med-low", level: "low", title: "Gratitude scan", duration: "5 min", emoji: "",
    script: [
      "Sit comfortably and close your eyes.",
      "Take 3 slow breaths — in through the nose, out through the mouth.",
      "Picture one person you appreciate. Hold their face for a breath.",
      "Now one place. Now one tiny thing — a smell, a song, a sip.",
      "Breathe in 'thank', breathe out 'you' — for 1 minute.",
      "Open your eyes slowly.",
    ],
  },
  {
    id: "med-med", level: "medium", title: "4-7-8 calming", duration: "7 min", emoji: "🌬️",
    script: [
      "Sit upright. Place tongue behind upper teeth.",
      "Exhale completely with a 'whoosh' sound.",
      "Inhale through the nose for 4 counts.",
      "Hold the breath for 7 counts.",
      "Exhale through mouth for 8 counts — whoosh.",
      "Repeat 4 cycles. Rest. Repeat 4 more.",
    ],
  },
  {
    id: "med-high", level: "high", title: "Body scan grounding", duration: "10 min", emoji: "🪷",
    script: [
      "Lie down. Feel the floor under you.",
      "Name 5 things you can hear right now.",
      "Bring attention to your toes. Soften them.",
      "Move up — calves, knees, thighs. Release each as you exhale.",
      "Belly, chest, shoulders. Let them drop.",
      "Face: jaw, eyes, forehead. Let it all melt.",
      "Stay in stillness for 2 more minutes.",
    ],
  },
];

// 10 dance tutorial videos across types
export type DanceStyle = "hip-hop" | "classical" | "bollywood" | "contemporary" | "salsa" | "zumba" | "kpop" | "ballet" | "garba" | "breakdance";

export const DANCE_STYLES: { id: DanceStyle; label: string; emoji: string }[] = [
  { id: "hip-hop", label: "Hip Hop", emoji: "🎤" },
  { id: "classical", label: "Classical", emoji: "🕉️" },
  { id: "bollywood", label: "Bollywood", emoji: "🎬" },
  { id: "contemporary", label: "Contemporary", emoji: "🌊" },
  { id: "zumba", label: "Zumba", emoji: "🔥" },
  { id: "kpop", label: "K-Pop", emoji: "🌟" },
  { id: "ballet", label: "Ballet", emoji: "🩰" },
  { id: "garba", label: "Garba", emoji: "🪔" },
  { id: "breakdance", label: "Breakdance", emoji: "🤸" },
];

export const DANCE_VIDEOS: { id: string; style: DanceStyle; title: string; ytId: string; level: "beginner" | "intermediate" }[] = [
  { id: "d1", style: "hip-hop", title: "Hip Hop Basics — 5 essential moves", ytId: "OHUjG9mv9yk", level: "beginner" },
  { id: "d2", style: "classical", title: "Bharatanatyam basic adavus", ytId: "mEnYjGQJst8", level: "beginner" },
  { id: "d3", style: "bollywood", title: "Easy Bollywood dance tutorial",ytId: "BeJO4LJ9PJQ", level: "beginner" },
  { id: "d4", style: "bollywood", title: "Dance is conversation between body & soul",ytId: "lD1X-ODWhvg", level: "beginner" },
  { id: "d5", style: "contemporary", title: "Contemporary dance for beginners", ytId: "XlNSFgSMGZA", level: "beginner" },
  { id: "d6", style: "zumba", title: "15-min Zumba dance workout", ytId: "aezI0ieNqMo", level: "beginner" },
  { id: "d7", style: "kpop", title: "K-Pop dance class — beginner", ytId: "fs7Qb23LEjM", level: "beginner" },
  { id: "d8", style: "ballet", title: "Ballet at home — barre basics", ytId: "kazu_X_v5zc", level: "beginner" },
  { id: "d9", style: "garba", title: "Garba steps tutorial", ytId: "Hn2qIm2_nlI", level: "beginner" },
  { id: "d10", style: "breakdance", title: "Breakdance — top rock basics", ytId: "3Ki45n-qm_U", level: "beginner" },
  { id: "d11", style: "bollywood", title: "Bollywood is a rhythm of the soul",ytId: "OpTySRpMDvw", level: "beginner" },
  { id: "d12", style: "bollywood", title: "Filmy soul, dancing feet.",ytId: "tm_eyBaS8Bo", level: "beginner" },
  { id: "d13", style: "bollywood", title: "Eat, sleep, Bollywood, repeat.",ytId: "KJl2RK2gYYs", level: "beginner" },
  { id: "d14", style: "garba", title: "Garba steps tutorial", ytId: "X2JiR3_3Aq8", level: "beginner" },
  { id: "d15", style: "garba", title: "Garba steps tutorial", ytId: "XBvnHShxfmw", level: "beginner" },
  { id: "d16", style: "garba", title: "Garba steps tutorial", ytId: "6B5pRfKHPfs", level: "beginner" },
  { id: "d17", style: "bollywood", title: "Less drama, more Bollywood.", ytId: "ROMGN1-o0kk", level: "beginner" },
  { id: "d18", style: "bollywood", title: "When words fail, Bollywood dance speaks.", ytId: "C9cRlYsd47Y", level: "beginner" },
  { id: "d19", style: "bollywood", title: "Life is a movie, make your dance the blockbuster.", ytId: "vbVekC8CcdM", level: "beginner" },
  { id: "d20", style: "bollywood", title: "Keep calm and do a thumka", ytId: "v0JKF8S8ehc", level: "beginner" },
  { id: "d21", style: "classical", title: "Garba steps tutorial", ytId: "V6mkya4t69o", level: "beginner" },
  { id: "d22", style: "classical", title: "Garba steps tutorial", ytId: "thqjfSF7DV8", level: "beginner" },
  { id: "d23", style: "zumba", title: "15-min Zumba dance workout", ytId: "aBTqnj8qLTc", level: "beginner" },
  { id: "d24", style: "bollywood", title: "When words fail, Bollywood dance speaks.", ytId: "SeT7VMcgKCk", level: "beginner" },
  { id: "d25", style: "garba", title: "Garba steps tutorial", ytId: "6B5pRfKHPfs", level: "beginner" },
  { id: "d26", style: "zumba", title: "Fitness disguised as fun.", ytId: "AoXwZAJvLvs", level: "beginner" },
  { id: "d27", style: "zumba", title: "Ditch the workout, join the party.", ytId: "5X3vxcAO2W8", level: "beginner" },
  { id: "d28", style: "zumba", title: "Rhythm is my cardio.", ytId: "3TmHluYlJs4", level: "beginner" },
  { id: "d29", style: "zumba", title: "In Zumba, there are no mistakes—only unexpected solos!", ytId: "diDEfUd3JA0", level: "beginner" },
];