// ─────────────────────────────────────────────────────────────
// Edit this file to make the portfolio yours.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Kami",
  // short handle used in the logo / footer
  initials: "K",
  role: "Full-Stack Developer",
  // one punchy line shown under the hero name
  tagline: "I design and build fast, polished products for the web.",
  location: "Lagos, Nigeria",
  email: "juwonoladele772@gmail.com",
  // longer about-me paragraph
  about:
    "Self-taught software engineer with hands-on experience across front-end development, Web3/Solana tooling, and full-stack product delivery. Led development of a high-concurrency ticketing system for 500+ live users. Active Solana builder — token launch bots, on-chain tooling, and smart contract auditing. Currently pursuing a BSc in Computer Engineering at UNILAG while shipping real products.",
  socials: [
    { label: "GitHub", href: "https://github.com/juwonsmith" },
    { label: "LinkedIn", href: "https://linkedin.com/in/oladelejuwon" },
    { label: "X", href: "https://x.com/kamixbt" },
  ],
};

export const stats = [
  { value: 5, suffix: "+", label: "Years building" },
  { value: 5, suffix: "+", label: "Projects shipped" },
  { value: 500, suffix: "+", label: "Users served" },
];

// words for the scrolling marquee strip
export const marqueeWords = [
  "Full-Stack",
  "Three.js",
  "Web Apps",
  "Motion",
  "Marketplaces",
  "Bots",
  "Real-time",
  "Performance",
];

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node / Express",
  "Three.js",
  "GSAP",
  "Rust",
  "Solana",
  "Web3",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
  "Tailwind CSS",
  "Vercel",
  "Railway",
];

export type Project = {
  id: string;
  title: string;
  year: string;
  blurb: string;
  description: string;
  tags: string[];
  // accent gradient for the card art (tailwind colors / hex)
  gradient: [string, string];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "spacia",
    title: "Spacia",
    year: "2025",
    blurb: "Student-housing marketplace",
    description:
      "A marketplace that connects students with verified housing. Landlords pay to list and renters can secure a space with an escrowed deposit. Next.js frontend with an Express API, deployed on Vercel + Railway.",
    tags: ["Next.js", "Express", "MongoDB", "Vercel"],
    gradient: ["#4f6bff", "#22d3ee"],
    links: [
      { label: "Live", href: "https://spacia.life" },
      { label: "GitHub", href: "https://github.com/SpaciaHub/spacia" },
    ],
  },
  {
    id: "void-noir",
    title: "Void Noir Store",
    year: "2024",
    blurb: "Dark-themed commerce store",
    description:
      "A moody, high-contrast online storefront with a custom admin and persistent media storage. Built with Next.js and deployed on Railway with a mounted volume for uploads.",
    tags: ["Next.js", "E-commerce", "Railway", "Prisma"],
    gradient: ["#1a1d2e", "#7aa2ff"],
    links: [
      { label: "Live", href: "https://www.voidnoir.fit" },
      { label: "GitHub", href: "https://github.com/juwonsmith/void-noir-store" },
    ],
  },
  {
    id: "novaflex",
    title: "Novaflex",
    year: "2025",
    // TODO: refine — replace with what Novaflex actually does
    blurb: "Web application",
    description:
      "A web application built with a modern JavaScript stack and deployed on Firebase Hosting.",
    tags: ["React", "Firebase"],
    gradient: ["#7c5cff", "#f472b6"],
    links: [
      { label: "Live", href: "https://novaflex-cddd6.web.app" },
      { label: "GitHub", href: "https://github.com/juwonsmith/novoplex" },
    ],
  },
  {
    id: "shared-todo",
    title: "Shared Todo App",
    year: "2025",
    blurb: "Collaborative to-do list",
    description:
      "A shared, real-time to-do list for families and groups, with live sync across devices. Built with React and Firebase.",
    tags: ["React", "Firebase", "Realtime"],
    gradient: ["#22d3ee", "#4f6bff"],
    links: [
      { label: "Live", href: "https://todolistfamily-ad717.web.app" },
      { label: "GitHub", href: "https://github.com/juwonsmith/sharedtodolistapp" },
    ],
  },
  {
    id: "voidlauncher-bot",
    title: "VoidLauncher Bot",
    year: "2025",
    // TODO: refine — replace with what the bot actually does
    blurb: "Automation bot",
    description:
      "An automation bot built for fast, reliable task execution.",
    tags: ["Node.js", "Automation"],
    gradient: ["#4f6bff", "#a9c0ff"],
    links: [
      { label: "GitHub", href: "https://github.com/juwonsmith/voidlauncher-bot" },
    ],
  },
];
