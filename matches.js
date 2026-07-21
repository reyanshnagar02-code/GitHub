/**
 * ============================================================
 *  MATCH DATA
 * ============================================================
 * This file is SAMPLE / PLACEHOLDER data so the site works
 * out of the box. Swap in the real World Cup results whenever
 * you're ready — just keep the same shape for each object:
 *
 * {
 *   id: unique number,
 *   stage: "Group A" | "Round of 16" | "Quarter-final" | "Semi-final" | "Third Place" | "Final",
 *   date: "YYYY-MM-DD",
 *   venue: "Stadium, City",
 *   teamA: { name, flag (emoji), score },
 *   teamB: { name, flag (emoji), score },
 *   summary: "1-2 sentence plain-English recap",
 *   stars: ["Player name (what they did)"],
 *   attendance: number (optional)
 * }
 * ============================================================
 */

const MATCHES = [
  {
    id: 1,
    stage: "Group A",
    date: "2026-06-11",
    venue: "Estadio Azteca, Mexico City",
    teamA: { name: "Mexico", flag: "🇲🇽", score: 2 },
    teamB: { name: "Poland", flag: "🇵🇱", score: 1 },
    summary:
      "The host nation kicked off the tournament in style, coming from behind to win in front of a roaring home crowd.",
    stars: ["Santiago Giménez (2 goals)"],
    attendance: 87000
  },
  {
    id: 2,
    stage: "Group B",
    date: "2026-06-12",
    venue: "SoFi Stadium, Los Angeles",
    teamA: { name: "Argentina", flag: "🇦🇷", score: 3 },
    teamB: { name: "Australia", flag: "🇦🇺", score: 0 },
    summary:
      "The defending champions made an emphatic statement, cruising to a comfortable win with a dominant first half.",
    stars: ["Julián Álvarez (2 goals)", "Enzo Fernández (1 goal)"],
    attendance: 70000
  },
  {
    id: 3,
    stage: "Group C",
    date: "2026-06-13",
    venue: "BC Place, Vancouver",
    teamA: { name: "France", flag: "🇫🇷", score: 2 },
    teamB: { name: "Japan", flag: "🇯🇵", score: 2 },
    summary:
      "A thrilling back-and-forth draw. Japan twice fought back from behind to snatch a well-earned point.",
    stars: ["Kylian Mbappé (1 goal)", "Takefusa Kubo (1 goal, 1 assist)"],
    attendance: 54000
  },
  {
    id: 4,
    stage: "Group D",
    date: "2026-06-14",
    venue: "AT&T Stadium, Dallas",
    teamA: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 },
    teamB: { name: "Senegal", flag: "🇸🇳", score: 0 },
    summary:
      "A tight, tactical battle decided by a single second-half strike after Senegal hit the post twice.",
    stars: ["Jude Bellingham (1 goal)"],
    attendance: 80000
  },
  {
    id: 5,
    stage: "Group E",
    date: "2026-06-15",
    venue: "Estadio Monterrey, Monterrey",
    teamA: { name: "Brazil", flag: "🇧🇷", score: 4 },
    teamB: { name: "South Korea", flag: "🇰🇷", score: 1 },
    summary:
      "Brazil put on a samba show with flowing attacking football, scoring four unanswered goals before a late consolation.",
    stars: ["Vinícius Júnior (2 goals)", "Rodrygo (1 goal, 2 assists)"],
    attendance: 51000
  },
  {
    id: 6,
    stage: "Group F",
    date: "2026-06-16",
    venue: "Lincoln Financial Field, Philadelphia",
    teamA: { name: "Germany", flag: "🇩🇪", score: 0 },
    teamB: { name: "Morocco", flag: "🇲🇦", score: 1 },
    summary:
      "A huge upset — Morocco's disciplined defense frustrated Germany all night before sealing it on the counter-attack.",
    stars: ["Achraf Hakimi (1 goal)"],
    attendance: 62000
  },
  {
    id: 7,
    stage: "Round of 16",
    date: "2026-06-30",
    venue: "MetLife Stadium, New Jersey",
    teamA: { name: "Argentina", flag: "🇦🇷", score: 2 },
    teamB: { name: "Netherlands", flag: "🇳🇱", score: 1 },
    summary:
      "A gripping knockout clash. Argentina broke the deadlock late and held on through a nervy final ten minutes.",
    stars: ["Lionel Messi (1 goal, 1 assist)"],
    attendance: 82000
  },
  {
    id: 8,
    stage: "Round of 16",
    date: "2026-07-01",
    venue: "Arrowhead Stadium, Kansas City",
    teamA: { name: "France", flag: "🇫🇷", score: 3 },
    teamB: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 },
    summary:
      "France's pace on the counter-attack was too much for England, who pushed forward but got caught out twice.",
    stars: ["Kylian Mbappé (2 goals)"],
    attendance: 73000
  },
  {
    id: 9,
    stage: "Quarter-final",
    date: "2026-07-08",
    venue: "Estadio Azteca, Mexico City",
    teamA: { name: "Brazil", flag: "🇧🇷", score: 1 },
    teamB: { name: "France", flag: "🇫🇷", score: 1 },
    summary:
      "A tense, tightly matched quarter-final that stayed level after extra time. Brazil held their nerve in the shootout.",
    stars: ["Alisson (3 penalty saves in shootout)"],
    attendance: 87000
  },
  {
    id: 10,
    stage: "Semi-final",
    date: "2026-07-14",
    venue: "SoFi Stadium, Los Angeles",
    teamA: { name: "Argentina", flag: "🇦🇷", score: 2 },
    teamB: { name: "Brazil", flag: "🇧🇷", score: 1 },
    summary:
      "A classic South American derby on the world stage. Argentina edged a fierce, end-to-end contest to reach the final.",
    stars: ["Julián Álvarez (1 goal)", "Emiliano Martínez (key saves)"],
    attendance: 70000
  },
  {
    id: 11,
    stage: "Third Place",
    date: "2026-07-18",
    venue: "Hard Rock Stadium, Miami",
    teamA: { name: "Brazil", flag: "🇧🇷", score: 2 },
    teamB: { name: "Morocco", flag: "🇲🇦", score: 1 },
    summary:
      "Brazil bounced back from semi-final heartbreak to claim third place in an entertaining, open contest.",
    stars: ["Vinícius Júnior (1 goal, 1 assist)"],
    attendance: 65000
  },
  {
    id: 12,
    stage: "Final",
    date: "2026-07-19",
    venue: "MetLife Stadium, New Jersey",
    teamA: { name: "Argentina", flag: "🇦🇷", score: 3 },
    teamB: { name: "Morocco", flag: "🇲🇦", score: 2 },
    summary:
      "An unforgettable final! Argentina held off a spirited Morocco comeback to lift the trophy in front of a sold-out crowd.",
    stars: ["Lionel Messi (1 goal, Golden Ball)", "Julián Álvarez (1 goal)"],
    attendance: 82500
  }
];
