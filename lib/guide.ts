import {
  achievements,
  education,
  future,
  innovation,
  leadership,
  profile,
  projects,
  research,
  skills,
  type ZoneId,
} from "@/data/profile";

export type GuideRef = { label: string; zone: ZoneId; id?: string };
export type GuideAnswer = { text: string; refs: GuideRef[] };

type Entry = {
  keywords: string[];
  text: string;
  refs: GuideRef[];
};

const STOP = new Set([
  "the", "and", "for", "what", "which", "who", "is", "are", "was", "were", "a", "an",
  "of", "to", "in", "on", "at", "by", "with", "about", "tell", "me", "please", "can",
  "you", "your", "their", "they", "this", "that", "it", "do", "does", "has", "have",
  "most", "best", "top", "show", "give", "summarise", "summarize", "explain", "how",
]);

const stem = (word: string) =>
  word
    .toLowerCase()
    .replace(/[^a-z0-9'\-]/g, "")
    .replace(/(ing|ed|es|s)$/i, (m) => (m === "ss" ? m : ""));

const tokenize = (text: string) =>
  text
    .split(/\s+/)
    .map(stem)
    .filter((w) => w.length > 2 && !STOP.has(w));

const entries: Entry[] = [
  {
    keywords: ["about", "bio", "identity", "person", "who", "arden", "vale", "profile", "statement"],
    text: `${profile.name} is a ${profile.title.toLowerCase()} based in ${profile.location}. Their work sits between cognitive science, machine learning, and interaction design: they build sensing systems that notice when a learner is struggling, then step back instead of shouting. Core interests: ${profile.interests.slice(0, 3).join(", ").toLowerCase()}.`,
    refs: [{ label: "Open identity dossier", zone: "about" }],
  },
  {
    keywords: ["education", "university", "degree", "school", "study", "studied", "gpa", "grade", "academic", "bachelor"],
    text: `Arden is completing a BSc in Cognitive Science & Computer Science at Northbridge University with a 3.94 GPA (First Class), alongside an advanced certificate in applied neurotechnology at the Meridian Institute. Earlier stages are documented as five towers in Timeline City, from primary school to professional study.`,
    refs: [{ label: "Enter Timeline City", zone: "education" }],
  },
  {
    keywords: ["project", "build", "built", "portfolio", "work", "make", "created"],
    text: `Five selected projects: NEUROSKETCH (an EEG drawing interface), ATLAS OF ATTENTION (a gallery data installation), ECHO (live structured notes for deaf students), SYNAPTIC GARDEN (generative art from brain signals), and CIVIC SIGNAL (an urban heat dashboard). Each dossier includes the measured result and the lesson learned.`,
    refs: [
      { label: "NEUROSKETCH", zone: "projects", id: "neurosketch" },
      { label: "Exhibition Hall", zone: "projects" },
    ],
  },
  {
    keywords: ["neurosketch", "eeg", "brain", "bci", "interface", "assistive"],
    text: `NEUROSKETCH is Arden's assistive sketching environment controlled by imagined movement. A consumer EEG headset feeds a confidence-aware classifier, reaching 87% intent classification with 240 ms latency across 12 participants. The key lesson: the visible "uncertain" state, which returns control to the user rather than guessing.`,
    refs: [{ label: "Open NEUROSKETCH", zone: "projects", id: "neurosketch" }],
  },
  {
    keywords: ["atlas", "attention", "installation", "visualisation", "visualization", "gallery"],
    text: `ATLAS OF ATTENTION turns 12,000 gallery gazes into a living city of light. It was exhibited for six weeks at the Northbridge Gallery, drew 4,000+ visitors, and won the National Data Visualisation Challenge. Its lesson was that negative space — where attention did not go — carried the most meaning.`,
    refs: [{ label: "Open ATLAS OF ATTENTION", zone: "projects", id: "atlas" }],
  },
  {
    keywords: ["echo", "accessibility", "notes", "lecture", "deaf", "transcript"],
    text: `ECHO is a live note-taking companion for deaf and hard-of-hearing students. It restructures speech into claims, definitions, and open questions in real time. Piloted with 300 students, it cut median note-review time by 41% and was adopted by the university's accessibility office.`,
    refs: [{ label: "Open ECHO", zone: "projects", id: "echo" }],
  },
  {
    keywords: ["civic", "heat", "city", "council", "climate", "dataset", "geospatial"],
    text: `CIVIC SIGNAL combines thermal imagery, canopy data, and household energy reports to expose heat vulnerability block by block. It identified seven priority areas now in the council's 2024 climate plan, and its pipeline was released open source.`,
    refs: [{ label: "Open CIVIC SIGNAL", zone: "projects", id: "civic" }],
  },
  {
    keywords: ["garden", "synaptic", "generative", "art", "bloom", "metaphor"],
    text: `SYNAPTIC GARDEN grows live EEG into botanical forms. 120 unique specimens were generated at a research open day, each archived with a seed for deterministic regrowth. Visitors understood signal noise through a struggling plant before any chart could explain it.`,
    refs: [{ label: "Open SYNAPTIC GARDEN", zone: "projects", id: "garden" }],
  },
  {
    keywords: ["research", "thesis", "paper", "publication", "study", "experiment", "abstract", "lab"],
    text: `Research spans four works. The honours thesis estimates cognitive load in mixed reality using pupillometry, head-motion entropy, and interaction timing (F1 0.84). A workshop paper on explainable attention found counterfactual toggles cut over-trust by 31%. The other two cover low-cost EEG calibration and calm-interface design.`,
    refs: [
      { label: "Open thesis", zone: "research", id: "cognitive-load" },
      { label: "Research Lab", zone: "research" },
    ],
  },
  {
    keywords: ["cognitive", "load", "thesis", "mixed", "reality", "xr", "pupil", "honours"],
    text: `The honours thesis, "Adaptive Cognitive Load Estimation in Mixed-Reality Learning," fuses three weak signals into a lightweight estimator. Multimodal fusion reached F1 0.84, and adapting only after two consecutive high-load windows prevented UI thrashing. It is currently under review.`,
    refs: [{ label: "Presentation mode", zone: "research", id: "cognitive-load" }],
  },
  {
    keywords: ["explainable", "attention", "interpretability", "trust", "counterfactual", "workshop"],
    text: `"Explainable Attention for Non-Expert Users" tested a visual grammar of provenance lines and counterfactual toggles. Heat maps were fastest to read but least understood; counterfactual toggles reduced over-trust by 31%. Published in the 2025 workshop on human-centred ML.`,
    refs: [{ label: "Open paper", zone: "research", id: "explainable-attention" }],
  },
  {
    keywords: ["calibration", "transfer", "eeg", "meridian", "signal", "cost"],
    text: `The low-cost EEG calibration study reduced per-user setup from twelve minutes to under three using transfer learning on a compact convolutional encoder — a 74% reduction with a 3.6-point accuracy cost. Signal quality, not model size, remained the limiting factor.`,
    refs: [{ label: "Open lab report", zone: "research", id: "eeg-calibration" }],
  },
  {
    keywords: ["quiet", "calm", "notification", "case", "essay", "technology"],
    text: `"The Quiet Interface" analyses notification systems through calm technology. Ambient indicators carried the same information with 60% fewer interruptions, and the paper argues that escalation should be earned rather than scheduled.`,
    refs: [{ label: "Open case study", zone: "research", id: "quiet-interface" }],
  },
  {
    keywords: ["skill", "skills", "good", "proficient", "strong", "competency", "competencies", "programming", "python", "typescript"],
    text: `The strongest competencies are Programming (94), Human–Computer Interaction (92), Research Methods (91), and Data Analysis (90). Machine Learning follows at 88. Each planet in the Skills Galaxy includes certifications, practical evidence, and the projects where the skill was tested.`,
    refs: [{ label: "Enter Skills Galaxy", zone: "skills" }],
  },
  {
    keywords: ["achievement", "award", "scholarship", "prize", "honour", "honor", "recognition", "won", "winner", "competition"],
    text: `Seven recognitions are on display: the Presidential Scholarship, a Global Student Innovation Prize finalist place, Best Undergraduate Research Poster, six Dean's List semesters, a National Data Visualisation Challenge win, an Ethics in AI Fellowship, and a Leadership Recognition Award.`,
    refs: [{ label: "Enter Hall of Achievements", zone: "achievements" }],
  },
  {
    keywords: ["leadership", "president", "club", "society", "mentor", "team", "lead", "volunteer", "organisation", "organization"],
    text: `Four active mandates: President of the Human–AI Interaction Society (40 → 120 members), Research Team Lead in the Neural Interfaces Lab, founder of Open Lecture Notes (300 students), and peer mentor to 14 first-generation students. The command room tracks scope and measurable outcomes for each.`,
    refs: [{ label: "Enter Command Room", zone: "leadership" }],
  },
  {
    keywords: ["innovation", "idea", "startup", "concept", "product", "lumen", "openneuro"],
    text: `Three ideas are in development: LUMEN, an adaptive learning companion that senses confusion (prototype, 64%); QUIET, calm notification infrastructure (concept, 28%); and OPENNEURO, an open dataset and toolkit for low-cost BCI research (46%).`,
    refs: [{ label: "Enter Innovation Cores", zone: "innovation" }],
  },
  {
    keywords: ["future", "goal", "goals", "master", "masters", "phd", "doctorate", "career", "aspiration", "plan", "ambition"],
    text: `The projected path: a funded master's in computational neuroscience (2027), doctoral research in adaptive neurotechnology (2029), an independent research group (2032), and a science communication studio (2035). The Future Vision District renders each ambition as a tower with its milestone path.`,
    refs: [{ label: "Enter Future District", zone: "future" }],
  },
  {
    keywords: ["contact", "email", "hire", "collaborate", "collaboration", "reach", "linkedin", "github", "cv", "resume"],
    text: `You can reach Arden at ${profile.contact.email}. The contact terminal also carries LinkedIn, GitHub, and the full CV, which can be saved as a PDF. Their status: ${profile.status.toLowerCase()}.`,
    refs: [{ label: "Open Contact Portal", zone: "contact" }],
  },
  {
    keywords: ["value", "philosophy", "statement", "believe", "approach", "principles"],
    text: `"${profile.statement}" In practice that means measuring before intervening, making uncertainty visible, and leaving behind tools and datasets other researchers can reuse.`,
    refs: [{ label: "Read full statement", zone: "about" }],
  },
  {
    keywords: ["language", "french", "mandarin", "english"],
    text: `Arden speaks ${profile.languages.join(", ")}.`,
    refs: [{ label: "Open identity dossier", zone: "about" }],
  },
];

const special = (q: string): GuideAnswer | null => {
  const lower = q.toLowerCase();
  if (/(strongest|best|favourite|favorite|proudest)\s+project/.test(lower)) {
    return {
      text: `If "strongest" means measurable impact: NEUROSKETCH reached 87% intent classification and helped two users with limited motor control draw unaided. If it means reach: ATLAS OF ATTENTION drew 4,000+ visitors and won a national visualisation prize. Arden tends to cite ECHO as the most useful, because 300 students used it and it is still running.`,
      refs: [
        { label: "NEUROSKETCH", zone: "projects", id: "neurosketch" },
        { label: "ECHO", zone: "projects", id: "echo" },
      ],
    };
  }
  if (/(current|now|working on|right now|focus)/.test(lower) && /(work|research|project|doing)/.test(lower)) {
    return {
      text: `Current focus: finishing the honours thesis on cognitive-load estimation, running the LUMEN classroom pilot, and preparing applications for a funded master's in computational neuroscience for 2027. The thesis is under review; LUMEN is at prototype stage.`,
      refs: [
        { label: "Thesis presentation", zone: "research", id: "cognitive-load" },
        { label: "LUMEN", zone: "innovation", id: "lumen" },
      ],
    };
  }
  if (/(why|should).*(hire|admit|fund|recruit)/.test(lower)) {
    return {
      text: `Arden brings a rare combination: they can design a study, build the sensing pipeline, and ship the interface. Evidence includes two peer-reviewed outputs before graduation, an 87%-accuracy BCI project, a 300-student accessibility tool, and leadership of a six-person research team. The through-line is measurable, humane use of sensing technology.`,
      refs: [
        { label: "Research", zone: "research" },
        { label: "Leadership", zone: "leadership" },
      ],
    };
  }
  return null;
};

export function askGuide(question: string): GuideAnswer {
  const specialAnswer = special(question);
  if (specialAnswer) return specialAnswer;

  const tokens = tokenize(question);
  if (tokens.length === 0) {
    return {
      text: `Ask about the academic record — education, projects, research, skills, achievements, leadership, innovation, or future plans. I can open any dossier directly.`,
      refs: [],
    };
  }

  let best: { score: number; entry: Entry } | null = null;
  for (const entry of entries) {
    let score = 0;
    for (const token of tokens) {
      for (const kw of entry.keywords) {
        if (kw === token) score += 3;
        else if (kw.startsWith(token) || token.startsWith(kw)) score += 1.5;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { score, entry };
  }

  if (!best || best.score < 2) {
    return {
      text: `I hold the full academic record but did not find a match for that. Try: research, a project name, skills, achievements, leadership, innovation, future plans, or how to get in touch.`,
      refs: [
        { label: "Research Lab", zone: "research" },
        { label: "Projects", zone: "projects" },
      ],
    };
  }

  return { text: best.entry.text, refs: best.entry.refs };
}

export const guideIndexCount =
  education.length +
  projects.length +
  research.length +
  skills.length +
  achievements.length +
  leadership.length +
  innovation.length +
  future.length;
