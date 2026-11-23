export type ZoneId =
  | "about"
  | "education"
  | "projects"
  | "research"
  | "skills"
  | "achievements"
  | "leadership"
  | "innovation"
  | "future"
  | "contact";

export type Stage = "intro" | "hub" | ZoneId;

export const profile = {
  name: "Arden Vale",
  shortName: "A. VALE",
  pronouns: "they/them",
  title: "Computational neuroscientist & human–AI interaction designer",
  location: "Toronto, Canada",
  status: "Open to research collaborations · 2027 intake",
  bio: "I study how machines can understand attention, effort, and confusion — and how interfaces can respond with restraint. My work sits between cognitive science, machine learning, and interaction design, turning noisy biological signals into calm, legible tools for learning.",
  interests: [
    "Adaptive learning interfaces",
    "Neural decoding & BCI",
    "Explainable machine learning",
    "Calm technology",
    "Scientific visualisation",
  ],
  statement:
    "Technology should widen the range of people who can think deeply. I build sensing systems that notice when a learner is lost, then step back instead of shouting. Every project begins with a human constraint and ends with a measurable change in someone's day.",
  goals:
    "Pursue doctoral research in adaptive neurotechnology, build a lab that pairs rigorous cognitive science with humane design, and publish tools that other researchers can actually reuse.",
  languages: ["English (native)", "French (B2)", "Mandarin (A2)"],
  contact: {
    email: "arden.vale@example.com",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    cv: "/cv/",
  },
  metrics: [
    { label: "Degree GPA", value: "3.94", suffix: "/4.0" },
    { label: "Research studies", value: "06", suffix: "" },
    { label: "People led", value: "120", suffix: "+" },
    { label: "Peer-reviewed", value: "02", suffix: "" },
  ],
};

export const education = [
  {
    id: "primary",
    years: "2010 — 2016",
    stage: "Foundations",
    institution: "Ashgrove Primary School",
    credential: "Primary education",
    grade: "Graduated with distinction",
    height: 9,
    summary:
      "Where the first circuits were drawn: a school science fair project on plant bioelectricity, built from a borrowed multimeter and a lot of copper wire.",
    highlights: [
      "Science Fair Gold — 'Do plants talk in voltages?'",
      "Founded the school's first coding club (age 10)",
      "Perfect attendance, six years running",
    ],
    accent: "#fbbf77",
  },
  {
    id: "junior",
    years: "2016 — 2019",
    stage: "Discovery",
    institution: "Kestrel Junior High",
    credential: "Junior high school",
    grade: "92.6% average",
    height: 13,
    summary:
      "First contact with machine learning through an open online course. Built a rudimentary gesture recogniser with a webcam and far too much confidence.",
    highlights: [
      "Regional Mathematics Olympiad — silver medal",
      "First Python programme: a gesture-controlled game",
      "Volunteer tutor for the school's remedial maths programme",
    ],
    accent: "#fbbf77",
  },
  {
    id: "senior",
    years: "2019 — 2022",
    stage: "Specialisation",
    institution: "Northgate Senior High",
    credential: "Senior high school · Science stream",
    grade: "96.1% average · top 2%",
    height: 17,
    summary:
      "A research methods elective changed the trajectory. Ran a small study on note-taking and memory, and learned that a good question outlasts a clever answer.",
    highlights: [
      "National Science Olympiad — finalist",
      "Student Research Prize for a study on spaced repetition",
      "Head of the robotics club; built a line-following swarm",
    ],
    accent: "#fbbf77",
  },
  {
    id: "university",
    years: "2022 — 2026",
    stage: "University",
    institution: "Northbridge University",
    credential: "BSc Cognitive Science & Computer Science",
    grade: "GPA 3.94 / 4.0 · First Class",
    height: 24,
    summary:
      "Interdisciplinary honours programme bridging neural computation and interface design. Thesis on cognitive-load estimation in mixed-reality learning environments.",
    highlights: [
      "Presidential Scholar — full merit scholarship",
      "Undergraduate Research Fellow, Neural Interfaces Lab",
      "Best Poster, Congress of Cognitive Science (2025)",
      "Teaching assistant: Introduction to Cognitive Science",
    ],
    accent: "#fbbf77",
  },
  {
    id: "professional",
    years: "2024 — 2026",
    stage: "Professional",
    institution: "Meridian Institute for Applied Neurotechnology",
    credential: "Advanced certificate · Applied Neurotechnology",
    grade: "Distinction",
    height: 12,
    summary:
      "Two years of part-time study alongside the degree: signal acquisition, ethics review, and the unglamorous engineering of reproducible EEG pipelines.",
    highlights: [
      "Capstone: low-cost EEG calibration using transfer learning",
      "Certified in human-subjects research ethics (TCPS 2)",
      "Summer residency: neural signal processing intensive",
    ],
    accent: "#fbbf77",
  },
];

export const projects = [
  {
    id: "neurosketch",
    index: "P.01",
    title: "NEUROSKETCH",
    year: "2025",
    category: "Brain–computer interface",
    tagline: "A drawing surface that begins where the hand stops.",
    description:
      "An accessible sketching environment controlled by imagined movement. A consumer EEG headset feeds a lightweight classifier that translates motor imagery into cursor intent, while a confidence-aware UI decides when to assist and when to wait.",
    tech: ["Python", "PyTorch", "React", "WebGL", "BrainFlow"],
    results: [
      "87% intent classification across 12 participants",
      "240 ms end-to-end latency on commodity hardware",
      "Two users with limited motor control completed a full drawing unaided",
    ],
    lessons:
      "Assistive systems fail when they over-predict. The most important design decision was adding a visible 'uncertain' state that returns control to the person instead of guessing.",
    role: "Lead researcher & interface engineer",
    visual: "constellation",
    accent: "#5eead4",
  },
  {
    id: "atlas",
    index: "P.02",
    title: "ATLAS OF ATTENTION",
    year: "2025",
    category: "Data installation",
    tagline: "Twelve thousand gazes, rendered as a living city of light.",
    description:
      "A projected data installation visualising how visitors moved through a university gallery. Gaze paths become illuminated streets; moments of shared attention become landmarks that bloom and fade.",
    tech: ["Three.js", "GLSL", "D3", "TouchDesigner"],
    results: [
      "Exhibited for six weeks at the Northbridge Gallery",
      "4,000+ visitors interacted with the live projection",
      "Featured in the university's annual research showcase",
    ],
    lessons:
      "An honest visualisation needs negative space. Showing where attention did not go was more revealing than the bright paths everyone had come to see.",
    role: "Concept, visual system, engineering",
    visual: "city",
    accent: "#a78bfa",
  },
  {
    id: "echo",
    index: "P.03",
    title: "ECHO",
    year: "2024",
    category: "Accessibility tool",
    tagline: "Lectures that become structured memory, not transcripts.",
    description:
      "A note-taking companion for deaf and hard-of-hearing students. Speech is transcribed live, then restructured into claims, definitions, and open questions in real time — designed to be scanned during a lecture, not after.",
    tech: ["Whisper", "Next.js", "Supabase", "TypeScript"],
    results: [
      "Piloted with 300 students across four faculties",
      "Median note review time reduced by 41%",
      "Adopted by the university's accessibility office",
    ],
    lessons:
      "Accessibility is not a feature at the end of a roadmap. Captioning was the easy part; structuring meaning fast enough to be useful was the actual design problem.",
    role: "Product lead & full-stack engineer",
    visual: "waveform",
    accent: "#67e8f9",
  },
  {
    id: "garden",
    index: "P.04",
    title: "SYNAPTIC GARDEN",
    year: "2024",
    category: "Generative art",
    tagline: "An EEG signal grown into a garden that never repeats.",
    description:
      "A generative artwork translating live brain activity into botanical growth. Each participant's resting-state signal produces a unique digital specimen, archived with a seed so the piece can be regrown.",
    tech: ["TouchDesigner", "GLSL", "Python", "Muse SDK"],
    results: [
      "120 unique specimens generated at the research open day",
      "Seed-based archive allows deterministic regrowth",
      "Used as a public demonstration of neural interfaces",
    ],
    lessons:
      "Metaphor is a form of explanation. Visitors understood signal quality and noise after watching a plant struggle, long before any chart made sense to them.",
    role: "Artist & signal engineer",
    visual: "bloom",
    accent: "#a3e635",
  },
  {
    id: "civic",
    index: "P.05",
    title: "CIVIC SIGNAL",
    year: "2023",
    category: "Civic data",
    tagline: "Thermal inequality, visible block by block.",
    description:
      "A public dashboard combining satellite thermal imagery, tree canopy data, and household energy reports to expose heat vulnerability at neighbourhood scale. Built with a city council's climate office.",
    tech: ["Python", "GeoPandas", "MapLibre", "D3"],
    results: [
      "Identified seven priority blocks for tree-planting",
      "Dataset adopted into the council's 2024 climate plan",
      "Open-sourced pipeline and methodology notes",
    ],
    lessons:
      "A dashboard is a political object. Making the methodology visible — assumptions, gaps, uncertainty — earned more trust than a polished map alone.",
    role: "Data engineer & visualisation designer",
    visual: "grid",
    accent: "#f0abfc",
  },
];

export const research = [
  {
    id: "cognitive-load",
    index: "R.01",
    title: "Adaptive Cognitive Load Estimation in Mixed-Reality Learning",
    type: "Honours thesis · Preprint",
    year: "2026",
    venue: "Northbridge University · Neural Interfaces Lab",
    abstract:
      "Can a mixed-reality tutor estimate cognitive load without interrupting the learner? This thesis combines pupillometry, head-motion entropy, and interaction timing into a lightweight estimator that adapts task difficulty in real time.",
    method:
      "34 participants completed structured problem-solving tasks in a custom WebXR environment. A multimodal sensor pipeline recorded pupil diameter, head pose, and input latency; a temporal fusion model was evaluated against validated self-report and dual-task measures.",
    findings: [
      "Multimodal fusion outperformed any single signal (F1 0.84 vs. 0.71)",
      "Adapting only after two consecutive high-load windows avoided thrashing",
      "Participants reported the adaptive condition as 'less demanding' despite completing more problems",
    ],
    citation: "Vale, A. (2026). Adaptive Cognitive Load Estimation in Mixed-Reality Learning. Undergraduate honours thesis, Northbridge University.",
    status: "Under review",
    accent: "#93c5fd",
  },
  {
    id: "explainable-attention",
    index: "R.02",
    title: "Explainable Attention for Non-Expert Users",
    type: "Workshop paper",
    year: "2025",
    venue: "Congress of Cognitive Science · Workshop track",
    abstract:
      "Attention maps are often shown as heat. This paper tests whether a different visual grammar — provenance lines and counterfactual toggles — helps people reason about model behaviour without over-trusting it.",
    method:
      "Mixed methods study with 48 participants and four visualisation conditions. Participants judged model reliability on paired examples; think-aloud sessions followed each condition.",
    findings: [
      "Counterfactual toggles reduced over-trust by 31%",
      "Heat maps were fastest to read but least understood",
      "Participants wanted to see disagreement between models, not a single answer",
    ],
    citation: "Vale, A., Osei, N., & Lindqvist, M. (2025). Explainable Attention for Non-Expert Users. Workshop on Human-Centred ML, Congress of Cognitive Science.",
    status: "Published",
    accent: "#93c5fd",
  },
  {
    id: "eeg-calibration",
    index: "R.03",
    title: "Low-Cost EEG Calibration via Transfer Learning",
    type: "Laboratory study",
    year: "2025",
    venue: "Meridian Institute · Applied Neurotechnology",
    abstract:
      "Consumer EEG devices demand long calibration. This study evaluates whether representations learned from a small open dataset can reduce per-user calibration from twelve minutes to under three.",
    method:
      "Cross-subject transfer evaluation on three public datasets and a lab cohort of 18 participants. A compact convolutional encoder was fine-tuned with as little as 90 seconds of new data.",
    findings: [
      "Calibration time reduced by 74% with a 3.6-point accuracy cost",
      "Fine-tuning on 90 seconds recovered most of the gap",
      "Signal quality, not model size, remained the dominant limitation",
    ],
    citation: "Vale, A. (2025). Low-Cost EEG Calibration via Transfer Learning. Advanced Certificate Capstone, Meridian Institute.",
    status: "Lab report",
    accent: "#93c5fd",
  },
  {
    id: "quiet-interface",
    index: "R.04",
    title: "The Quiet Interface: A Case Study in Calm Technology",
    type: "Critical case study",
    year: "2024",
    venue: "HCI Seminar · Northbridge University",
    abstract:
      "A design critique of notification systems through the lens of calm technology. Three commercial products are analysed for their attention debt, followed by a proposed framework for interfaces that yield.",
    method:
      "Structured product analysis, diary study with six participants, and a synthesis of literature on peripheral interaction and attention restoration.",
    findings: [
      "Ambient indicators carried the same information with 60% fewer interruptions",
      "Escalation should be earned, not scheduled",
      "Dismissal is a first-class interaction and deserves design attention",
    ],
    citation: "Vale, A. (2024). The Quiet Interface: A Case Study in Calm Technology. HCI Seminar, Northbridge University.",
    status: "Seminar paper",
    accent: "#93c5fd",
  },
];

export const skills = [
  {
    id: "programming",
    name: "Programming",
    kind: "Technical",
    level: 94,
    years: "8 yrs",
    summary:
      "Comfortable across research code, production front-ends, and the awkward boundary between them. TypeScript and Python are home; C++ and GLSL are tools I reach for when performance matters.",
    stack: ["Python", "TypeScript", "React", "C++", "GLSL", "PyTorch"],
    certifications: ["Deep Learning Specialisation — Coursera", "Advanced WebGL — Frontend Masters"],
    evidence: [
      "Built and shipped five research tools used by 300+ students",
      "Maintains an open-source EEG preprocessing pipeline",
      "Teaching assistant for a 180-student programming course",
    ],
    related: ["neurosketch", "echo"],
    accent: "#c4b5fd",
  },
  {
    id: "ml",
    name: "Machine Learning",
    kind: "Technical",
    level: 88,
    years: "5 yrs",
    summary:
      "Applied modelling with a bias toward small, interpretable systems. Experience in signal classification, temporal fusion, and evaluation that respects how noisy human data actually is.",
    stack: ["PyTorch", "scikit-learn", "Signal processing", "Evaluation design"],
    certifications: ["Neural Signal Processing Intensive — Meridian Institute"],
    evidence: [
      "87% accuracy on a 12-participant motor-imagery task",
      "Designed and ran four controlled model evaluations",
      "Peer review for two undergraduate ML workshops",
    ],
    related: ["neurosketch", "eeg-calibration"],
    accent: "#c4b5fd",
  },
  {
    id: "hci",
    name: "Human–Computer Interaction",
    kind: "Design",
    level: 92,
    years: "4 yrs",
    summary:
      "My core discipline. I prototype quickly, test with real people, and treat friction as data. Particularly interested in interfaces that know when not to speak.",
    stack: ["Figma", "User testing", "Wizard-of-Oz prototyping", "Accessibility"],
    certifications: ["Accessibility for Interactive Systems — IAAP-aligned course"],
    evidence: [
      "41% reduction in note-review time for Echo pilot users",
      "Ran 30+ moderated usability sessions",
      "Co-designed an adaptive tutor with neurodivergent students",
    ],
    related: ["echo", "quiet-interface"],
    accent: "#c4b5fd",
  },
  {
    id: "analysis",
    name: "Data Analysis",
    kind: "Technical",
    level: 90,
    years: "5 yrs",
    summary:
      "Statistical reasoning for messy, human-scale datasets: mixed-effects models, bootstrapping, and visualisation that shows uncertainty instead of hiding it.",
    stack: ["pandas", "R", "Statsmodels", "D3", "GeoPandas"],
    certifications: ["Statistical Inference — Coursera"],
    evidence: [
      "Analysed multimodal data from 34 thesis participants",
      "Built the open Civic Signal analysis pipeline",
      "Reconstructed a council climate dataset from raw sources",
    ],
    related: ["civic", "atlas"],
    accent: "#c4b5fd",
  },
  {
    id: "research",
    name: "Research Methods",
    kind: "Academic",
    level: 91,
    years: "4 yrs",
    summary:
      "From question to ethics board to reproducible pipeline. Comfortable designing studies where the dependent variable is a human being doing their best.",
    stack: ["Study design", "Ethics review", "Pre-registration", "Qualitative coding"],
    certifications: ["TCPS 2: Core ethics certification"],
    evidence: [
      "Two peer-reviewed outputs before graduation",
      "Wrote three approved human-subjects protocols",
      "Research Fellow in the Neural Interfaces Lab",
    ],
    related: ["cognitive-load", "explainable-attention"],
    accent: "#c4b5fd",
  },
  {
    id: "critical",
    name: "Critical Thinking",
    kind: "Academic",
    level: 89,
    years: "6 yrs",
    summary:
      "The habit of asking what a result would look like if I were wrong. I value falsification, adversarial collaboration, and readable limitations sections.",
    stack: ["Argument mapping", "Causal reasoning", "Peer critique"],
    certifications: [],
    evidence: [
      "Designed counterfactual conditions to test over-trust",
      "Led journal clubs across three labs",
      "Peer reviewer for the undergraduate research symposium",
    ],
    related: ["explainable-attention", "quiet-interface"],
    accent: "#c4b5fd",
  },
  {
    id: "communication",
    name: "Communication",
    kind: "Human",
    level: 86,
    years: "5 yrs",
    summary:
      "Explaining complex work without flattening it. I write, present, and design for audiences ranging from first-year students to city council committees.",
    stack: ["Technical writing", "Public speaking", "Visual storytelling"],
    certifications: ["Science Communication for Researchers — workshop series"],
    evidence: [
      "Presented to 200+ at the university research showcase",
      "Briefed city council staff on heat-vulnerability findings",
      "Writes a monthly research notebook for 900 subscribers",
    ],
    related: ["civic", "atlas"],
    accent: "#c4b5fd",
  },
  {
    id: "leadership",
    name: "Project Leadership",
    kind: "Human",
    level: 87,
    years: "4 yrs",
    summary:
      "Leading small, interdisciplinary teams with clear scope and generous credit. I plan in milestones, document decisions, and protect time for the work that matters.",
    stack: ["Roadmapping", "Facilitation", "Mentoring", "Research operations"],
    certifications: ["Inclusive Leadership — university certificate"],
    evidence: [
      "Led a six-person research team through two study cycles",
      "Grew a student society from 40 to 120 members",
      "Mentored 14 first-generation students",
    ],
    related: ["echo", "neurosketch"],
    accent: "#c4b5fd",
  },
];

export const achievements = [
  {
    id: "presidential",
    index: "A.01",
    title: "Presidential Scholarship",
    category: "Scholarship",
    year: "2022 — 2026",
    issuer: "Northbridge University",
    detail:
      "Full merit scholarship awarded to the top 1% of admitted students, renewed annually on academic standing and research contribution.",
    proof: "Renewed for four consecutive years",
    accent: "#f5c97b",
    metal: "gold",
  },
  {
    id: "innovation-prize",
    index: "A.02",
    title: "Global Student Innovation Prize",
    category: "Competition",
    year: "2025",
    issuer: "International Student Innovation Council",
    detail:
      "Finalist for NEUROSKETCH, an assistive sketching interface for people with limited motor control. Selected from 1,400 entries across 38 countries.",
    proof: "Top 12 globally · Assistive technology track",
    accent: "#f5c97b",
    metal: "gold",
  },
  {
    id: "poster",
    index: "A.03",
    title: "Best Undergraduate Research Poster",
    category: "Research",
    year: "2025",
    issuer: "Congress of Cognitive Science",
    detail:
      "Awarded for the poster 'Signals of Struggle: Estimating Cognitive Load in Mixed Reality', judged on rigour, clarity, and potential for translation.",
    proof: "First place · 180 posters",
    accent: "#d7deea",
    metal: "silver",
  },
  {
    id: "deans",
    index: "A.04",
    title: "Dean's List",
    category: "Academic",
    year: "2022 — 2026",
    issuer: "Faculty of Science, Northbridge University",
    detail:
      "Recognised for sustained academic excellence across the Cognitive Science and Computer Science honours programme.",
    proof: "Six consecutive semesters",
    accent: "#f5c97b",
    metal: "gold",
  },
  {
    id: "dataviz",
    index: "A.05",
    title: "National Data Visualisation Challenge",
    category: "Competition",
    year: "2024",
    issuer: "Open Data Collective",
    detail:
      "Winner for ATLAS OF ATTENTION, a live installation that made gallery attention patterns legible to a general audience.",
    proof: "First place · Visual storytelling category",
    accent: "#f5c97b",
    metal: "gold",
  },
  {
    id: "ethics",
    index: "A.06",
    title: "Ethics in AI Fellowship",
    category: "Fellowship",
    year: "2024",
    issuer: "Meridian Institute",
    detail:
      "A competitive fellowship for researchers working on responsible sensing and human-subjects data governance. Convened a public seminar on consent in neural interfaces.",
    proof: "Cohort of 18 · one of three undergraduate fellows",
    accent: "#c9d6e8",
    metal: "platinum",
  },
  {
    id: "leadership-award",
    index: "A.07",
    title: "Leadership Recognition Award",
    category: "Leadership",
    year: "2025",
    issuer: "Northbridge Students' Union",
    detail:
      "Recognised for founding the Open Lecture Notes initiative and growing the Human–AI Interaction Society into one of the faculty's most active communities.",
    proof: "Selected from 60 nominees",
    accent: "#d7deea",
    metal: "silver",
  },
];

export const leadership = [
  {
    id: "society",
    role: "President",
    org: "Human–AI Interaction Society",
    period: "2024 — 2026",
    scope: "120 members · 14 events",
    mandate:
      "Rebuilt a dormant society into a working community: monthly research salons, an annual demo night, and a peer-review circle for student papers.",
    impact: [
      "Grew membership from 40 to 120 in two semesters",
      "Raised funding for eight external speakers",
      "Launched a peer-review circle that supported 11 student submissions",
    ],
    accent: "#fb923c",
  },
  {
    id: "lab-lead",
    role: "Research Team Lead",
    org: "Neural Interfaces Lab",
    period: "2024 — 2026",
    scope: "6 researchers · 2 study cycles",
    mandate:
      "Coordinated a mixed-ability team across protocol design, data collection, and analysis. Owned the schedule, ethics documentation, and the unglamorous reproducibility work.",
    impact: [
      "Delivered two complete study cycles on schedule",
      "Introduced a shared analysis pipeline adopted by the whole lab",
      "Mentored three junior researchers through their first study",
    ],
    accent: "#fb923c",
  },
  {
    id: "open-notes",
    role: "Founder",
    org: "Open Lecture Notes",
    period: "2023 — 2025",
    scope: "300 students · 12 courses",
    mandate:
      "A student-run archive of structured, accessible lecture notes. Voluntary contributors write summaries that are edited, reviewed, and released under an open licence.",
    impact: [
      "Reached 300 active students across 12 courses",
      "Cut average note-review time by 41% in the Echo pilot",
      "Handed over to a six-person committee before graduating",
    ],
    accent: "#fb923c",
  },
  {
    id: "mentor",
    role: "Peer Mentor",
    org: "First-Generation Scholars Program",
    period: "2023 — 2026",
    scope: "14 mentees · 3 cohorts",
    mandate:
      "Weekly mentoring for first-generation students navigating university life, from study systems to research opportunities and everything the syllabus never covers.",
    impact: [
      "Supported 14 students across three cohorts",
      "Four mentees secured undergraduate research placements",
      "Co-wrote the programme's mentoring handbook",
    ],
    accent: "#fb923c",
  },
];

export const innovation = [
  {
    id: "lumen",
    index: "I.01",
    title: "LUMEN",
    state: "Prototype",
    year: "2026",
    tagline: "A learning companion that senses confusion, not clicks.",
    concept:
      "Most adaptive learning products measure what a student does. LUMEN measures what the room feels like: hesitation, revisiting, and help-seeking patterns folded into a gentle model of when to intervene.",
    progress: 64,
    next: "Six-week classroom pilot with 40 students",
    assets: ["Working prototype", "Ethics protocol approved", "Pilot partner secured"],
    accent: "#a3e635",
  },
  {
    id: "quiet",
    index: "I.02",
    title: "QUIET",
    state: "Concept",
    year: "2026",
    tagline: "Notification infrastructure that knows how to yield.",
    concept:
      "A calm-technology layer for desktop work: notifications are batched, ranked by interruption cost, and released only at natural breaks. The product is not an app but an operating principle with an API.",
    progress: 28,
    next: "Build the break-detection prototype",
    assets: ["Design research", "Interaction spec", "Open-source plan"],
    accent: "#a3e635",
  },
  {
    id: "openneuro",
    index: "I.03",
    title: "OPENNEURO",
    state: "Open source",
    year: "2025",
    tagline: "Low-cost neural research, reproducible from day one.",
    concept:
      "A shared dataset and preprocessing toolkit for consumer EEG studies. The goal is to make a well-designed brain–computer experiment possible under a student budget.",
    progress: 46,
    next: "Publish the v0.4 processing pipeline",
    assets: ["48-subject dataset", "Pipeline v0.3", "Documentation site"],
    accent: "#a3e635",
  },
];

export const future = [
  {
    id: "masters",
    index: "F.01",
    horizon: "2027",
    title: "Master's Degree",
    subtitle: "Computational Neuroscience",
    detail:
      "A research master's focused on adaptive sensing and neural signal processing — the technical foundation for independent work at the intersection of cognition and machines.",
    milestones: ["Secure a fully funded place", "Publish thesis follow-up", "Join an active neurotechnology lab"],
    accent: "#f0abfc",
    height: 22,
  },
  {
    id: "doctorate",
    index: "F.02",
    horizon: "2029",
    title: "Doctoral Research",
    subtitle: "Adaptive neurotechnology",
    detail:
      "A doctorate examining how sensing systems can model attention and effort in real learning environments without becoming surveillance. Methods first, products second.",
    milestones: ["Develop a field-ready sensing toolkit", "Run a longitudinal classroom study", "Publish in a top-tier HCI venue"],
    accent: "#f0abfc",
    height: 30,
  },
  {
    id: "lab",
    index: "F.03",
    horizon: "2032",
    title: "Research Group",
    subtitle: "A humane sensing lab",
    detail:
      "Build a small, interdisciplinary group where cognitive scientists, engineers, and design researchers share ownership of the questions — and the datasets stay open.",
    milestones: ["Secure independent research funding", "Grow to six researchers", "Release tools others genuinely use"],
    accent: "#f0abfc",
    height: 27,
  },
  {
    id: "studio",
    index: "F.04",
    horizon: "2035",
    title: "Public Practice",
    subtitle: "Science communication studio",
    detail:
      "A studio translating neurotechnology research into public installations and honest explanations — the kind of work that makes a field legible without making it simpler than it is.",
    milestones: ["Stage a national touring exhibition", "Publish an accessible book on attention", "Mentor the next cohort"],
    accent: "#f0abfc",
    height: 20,
  },
];

export const guidePrompts = [
  "What is Arden researching?",
  "Summarise the strongest project",
  "What are the future goals?",
  "Which skills are strongest?",
];
