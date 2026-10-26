import type { Lang } from "@/lib/i18n"

/**
 * Founders and advisors, shared by the /team page.
 *
 * Source: the Péladeau 2026 application document (Figma), which corrected
 * Simon's role (CFO, not CTO). Bios condensed from that document's French
 * copy. Virginie Paquet appears in the document as CSO but is deliberately
 * not listed here — removed at the user's request (2026-07).
 *
 * Portrait notes:
 *  - Founders: 1024×1536 studio photos from the document.
 *  - Advisor portraits were supplied directly by the user for publication.
 *    Sylvie Nadeau (2026-08-11), Murielle Grangeon (2026-08-17) and Diana
 *    Zidarov (2026-10-26) were removed at the user's request; their portraits
 *    are still in /images/team/advisors. Caution that still stands: some
 *    supplied portraits carry an AI-retouched finish — confirm each person's
 *    sign-off before launch.
 */
export type Member = {
  firstName: string
  lastName: string
  credentials?: string
  role: Record<Lang, string>
  bio: Record<Lang, string>
  avatar: string
  linkedin?: string
}

export type Advisor = {
  name: string
  /** Organisation, shown on its own line under the name. */
  org?: string
  role: Record<Lang, string>
  avatar: string
  /** Public profile the card links to (LinkedIn). */
  link?: string
}

export const team: Member[] = [
  {
    firstName: "Félix Étienne",
    lastName: "Roy",
    credentials: "CPI",
    role: { en: "CEO", fr: "Chef de la direction" },
    bio: {
      en: "Business development and strategic partnerships. Meets clinicians and patients to keep the device anchored to clinical value, and carries the file on regulatory and reimbursement strategy.",
      fr: "Développement des affaires et partenariats stratégiques. Rencontre cliniciens et patients pour garder l'appareil ancré dans la valeur clinique, et porte le dossier réglementaire et la stratégie de remboursement.",
    },
    avatar: "/images/team/felix-roy.jpg",
    linkedin: "https://www.linkedin.com/in/f%C3%A9lix-roy-114ab3240/",
  },
  {
    firstName: "Olivier",
    lastName: "Jackson",
    credentials: "CPI, PMP",
    role: { en: "COO", fr: "Directeur des opérations" },
    bio: {
      en: "Strategic planning, prioritisation, risk and delivery. PMP and CAPM certified, Lean Six Sigma black belt. Continuous improvement in service of measurable clinical impact.",
      fr: "Planification stratégique, priorisation, risques et livraison. Certifié PMP et CAPM, ceinture noire Lean Six Sigma. L'amélioration continue au service d'un impact clinique mesurable.",
    },
    avatar: "/images/team/olivier-jackson.jpg",
    linkedin: "https://www.linkedin.com/in/olivier-jackson/",
  },
  {
    firstName: "Simon",
    lastName: "Chayer",
    credentials: "B.Eng",
    role: { en: "CFO", fr: "Directeur financier" },
    bio: {
      en: "Financial structure and resource allocation. Experience at an early-stage medical startup shaped a bias for spreading investment across maturity levers rather than technology alone.",
      fr: "Structure financière et allocation des ressources. Son passage dans une jeune entreprise médicale a forgé le réflexe de répartir l'investissement sur tous les leviers de maturité, pas seulement la technologie.",
    },
    avatar: "/images/team/simon-chayer.jpg",
    linkedin: "https://www.linkedin.com/in/simon-chayer-2ba827270/",
  },
]

/* Catherine sits right after François Michaud because the pair is meant to
   read side by side (2026-08-11). The grid is 4 columns on desktop and 2 from
   sm up, so the pair must sit at positions 1-2 or 3-4 to hold at both widths.
   Diana Zidarov, who paired with Cyril the same way, was removed 2026-10-26
   (her portrait stays in /images/team/advisors); Alexandre Girard moved up to
   position 2 so Michaud and Catherine stay at 3-4, with Drolet closing the
   list at 5 — which leaves the last row one card short at every width.
   Inserting or removing an advisor shifts all of this: check the pair again
   whenever the list changes length.

   Cyril's title (university professor, physiotherapy and rehabilitation
   sciences, no IURDPM mention) is the user's wording (2026-08-17), replacing
   the CRSNG/PSO role. */
export const advisors: Advisor[] = [
  {
    name: "Cyril Duclos",
    role: {
      en: "University professor, physiotherapy and rehabilitation sciences",
      fr: "Professeur d'université en physiothérapie et sciences de la réadaptation",
    },
    avatar: "/images/team/advisors/cyril-duclos.jpg",
    link: "https://www.linkedin.com/in/cyril-duclos-10a20029/",
  },
  /* Added 2026-08-20 at the user's request so the four university researchers
     read as one block with the entrepreneur closing the list. Role verified
     against the UdeS mechanical-engineering department page (hired for the
     robotics engineering program; robotic arms and collaborative robotics for
     mobility and care settings). Rank left off the card because it was not
     verifiable there. Portrait generated from his LinkedIn photo — same
     sign-off caution as the other retouched portraits. */
  {
    name: "Alexandre Girard",
    org: "Université de Sherbrooke",
    role: {
      en: "Professor, mechanical engineering and robotics",
      fr: "Professeur, génie mécanique et robotique",
    },
    avatar: "/images/team/advisors/alexandre-girard.jpg",
    link: "https://www.linkedin.com/in/alx87grd/",
  },
  /* Confirmed by the user 2026-08-01 ("c'est françois michaud") — the
     grey-haired man in the checked shirt from the OneDrive_2 folder. Same
     AI-retouched finish as the other "ChatGPT Image" portraits: confirm
     sign-offs before launch. Role from the CRSNG/PSO application. */
  {
    name: "François Michaud",
    org: "Université de Sherbrooke",
    role: {
      en: "Professor, electrical and computer engineering",
      fr: "Professeur, génie électrique et informatique",
    },
    avatar: "/images/team/advisors/francois-michaud.jpg",
    link: "https://www.linkedin.com/in/francois-michaud-1b52025/",
  },
  {
    name: "Catherine Véronneau",
    org: "Université de Sherbrooke",
    role: {
      en: "Assistant professor and rehabilitation robotics researcher",
      fr: "Professeure adjointe et chercheuse en robotique de réadaptation",
    },
    avatar: "/images/team/advisors/catherine-veronneau.jpg",
    link: "https://www.linkedin.com/in/catherine-v%C3%A9ronneau-7710a3140/",
  },
  {
    name: "François Drolet",
    org: "Centech",
    role: {
      en: "Entrepreneur in residence",
      fr: "Entrepreneur en résidence",
    },
    avatar: "/images/team/advisors/francois-drolet.jpg",
    link: "https://www.linkedin.com/in/francoisdrolet/",
  },
]
