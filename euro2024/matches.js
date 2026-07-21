/**
 * ============================================================
 *  MATCH DATA — UEFA EURO 2024 (Germany, 14 Jun – 14 Jul 2024)
 * ============================================================
 * This is REAL tournament data, compiled from memory of the
 * actual 2024 European Championship. It covers the full
 * knockout stage (Round of 16 through the Final) plus a
 * representative set of group-stage matches rather than all
 * 51 games. Scorer names, minutes and small details are
 * recalled from memory rather than pulled from a live source,
 * so double check exact numbers if you need them for something
 * official. Same data shape as the World Cup version — add more
 * matches by copying the object format below.
 */

const MATCHES = [
  // ---------------- GROUP STAGE ----------------
  {
    id: 1,
    stage: "Group A",
    date: "2024-06-14",
    venue: "Munich Football Arena, Munich",
    teamA: { name: "Germany", flag: "🇩🇪", score: 5 },
    teamB: { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", score: 1 },
    summary:
      "The host nation opened the tournament with a statement rout, tearing Scotland apart with slick, high-tempo attacking football from the first whistle.",
    stars: ["Kai Havertz (1 goal)", "Jamal Musiala (1 goal)", "Florian Wirtz (1 goal)"]
  },
  {
    id: 2,
    stage: "Group B",
    date: "2024-06-15",
    venue: "Olympiastadion Berlin, Berlin",
    teamA: { name: "Spain", flag: "🇪🇸", score: 3 },
    teamB: { name: "Croatia", flag: "🇭🇷", score: 0 },
    summary:
      "Spain's young, fearless side announced themselves early, controlling the game against a fancied Croatia and never looking back.",
    stars: ["Fabián Ruiz (1 goal)", "Álvaro Morata (1 goal)"]
  },
  {
    id: 3,
    stage: "Group C",
    date: "2024-06-16",
    venue: "Arena AufSchalke, Gelsenkirchen",
    teamA: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 },
    teamB: { name: "Serbia", flag: "🇷🇸", score: 0 },
    summary:
      "A cagey, nervy England performance was settled by a single towering header, enough to get their tournament up and running.",
    stars: ["Jude Bellingham (1 goal)"]
  },
  {
    id: 4,
    stage: "Group D",
    date: "2024-06-16",
    venue: "Volksparkstadion, Hamburg",
    teamA: { name: "Netherlands", flag: "🇳🇱", score: 2 },
    teamB: { name: "Poland", flag: "🇵🇱", score: 1 },
    summary:
      "The Dutch needed a late rally to get past a stubborn Poland side that had taken the lead against the run of play.",
    stars: ["Cody Gakpo (1 goal)"]
  },
  {
    id: 5,
    stage: "Group D",
    date: "2024-06-17",
    venue: "Düsseldorf Arena, Düsseldorf",
    teamA: { name: "France", flag: "🇫🇷", score: 1 },
    teamB: { name: "Austria", flag: "🇦🇹", score: 0 },
    summary:
      "France ground out a narrow win in a match remembered for Kylian Mbappé breaking his nose in a collision, later playing tournament games in a protective mask.",
    stars: ["Own goal (Max Wöber, Austria)"]
  },
  {
    id: 6,
    stage: "Group E",
    date: "2024-06-17",
    venue: "Frankfurt Arena, Frankfurt",
    teamA: { name: "Belgium", flag: "🇧🇪", score: 0 },
    teamB: { name: "Slovakia", flag: "🇸🇰", score: 1 },
    summary:
      "One of the tournament's early shocks — Slovakia soaked up heavy Belgian pressure and hit them on the break for a famous win.",
    stars: ["Ivan Schranz (1 goal)"]
  },
  {
    id: 7,
    stage: "Group F",
    date: "2024-06-18",
    venue: "Leipzig Stadion, Leipzig",
    teamA: { name: "Portugal", flag: "🇵🇹", score: 2 },
    teamB: { name: "Czechia", flag: "🇨🇿", score: 1 },
    summary:
      "Portugal looked set to drop points until a dramatic stoppage-time winner deep into added time snatched all three points.",
    stars: ["Francisco Conceição (stoppage-time winner)"]
  },
  {
    id: 8,
    stage: "Group F",
    date: "2024-06-18",
    venue: "BVB Stadion Dortmund, Dortmund",
    teamA: { name: "Turkey", flag: "🇹🇷", score: 3 },
    teamB: { name: "Georgia", flag: "🇬🇪", score: 1 },
    summary:
      "A lively, end-to-end game where Turkey's clinical finishing was the difference, despite a spirited Georgia response.",
    stars: ["Kerem Aktürkoğlu (2 goals)", "Georges Mikautadze (Georgia, 1 goal)"]
  },

  // ---------------- ROUND OF 16 ----------------
  {
    id: 9,
    stage: "Round of 16",
    date: "2024-06-29",
    venue: "Olympiastadion Berlin, Berlin",
    teamA: { name: "Switzerland", flag: "🇨🇭", score: 2 },
    teamB: { name: "Italy", flag: "🇮🇹", score: 0 },
    summary:
      "A huge shock — the defending champions were dismantled by a sharp, disciplined Switzerland performance and crashed out.",
    stars: ["Ruben Vargas (1 goal)", "Remo Freuler (1 goal)"]
  },
  {
    id: 10,
    stage: "Round of 16",
    date: "2024-06-29",
    venue: "BVB Stadion Dortmund, Dortmund",
    teamA: { name: "Germany", flag: "🇩🇪", score: 2 },
    teamB: { name: "Denmark", flag: "🇩🇰", score: 0 },
    summary:
      "The hosts kept their momentum going, controlling the game throughout and putting the tie to bed before half-time.",
    stars: ["Kai Havertz (penalty)", "Jamal Musiala (1 goal)"]
  },
  {
    id: 11,
    stage: "Round of 16",
    date: "2024-06-30",
    venue: "Arena AufSchalke, Gelsenkirchen",
    teamA: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 2 },
    teamB: { name: "Slovakia", flag: "🇸🇰", score: 1 },
    summary:
      "England looked out of the tournament until a spectacular last-gasp overhead kick forced extra time, where they finished the job.",
    stars: ["Jude Bellingham (95th-minute overhead-kick equalizer)", "Harry Kane (extra-time winner)"]
  },
  {
    id: 12,
    stage: "Round of 16",
    date: "2024-06-30",
    venue: "Cologne Stadium, Cologne",
    teamA: { name: "Spain", flag: "🇪🇸", score: 4 },
    teamB: { name: "Georgia", flag: "🇬🇪", score: 1 },
    summary:
      "Spain's attack finally clicked into top gear, brushing aside a brave Georgia side that had caused upsets earlier in the tournament.",
    stars: ["Dani Olmo (1 goal)", "Fabián Ruiz (1 goal)"]
  },
  {
    id: 13,
    stage: "Round of 16",
    date: "2024-07-01",
    venue: "Düsseldorf Arena, Düsseldorf",
    teamA: { name: "France", flag: "🇫🇷", score: 1 },
    teamB: { name: "Belgium", flag: "🇧🇪", score: 0 },
    summary:
      "A tight, low-scoring affair decided by a deflected free kick that looped in off a Belgian defender.",
    stars: ["Own goal (Jan Vertonghen, Belgium)"]
  },
  {
    id: 14,
    stage: "Round of 16",
    date: "2024-07-01",
    venue: "Frankfurt Arena, Frankfurt",
    teamA: { name: "Portugal", flag: "🇵🇹", score: 0 },
    teamB: { name: "Slovenia", flag: "🇸🇮", score: 0 },
    summary:
      "Ninety scoreless minutes plus extra time led to penalties, where a heroic goalkeeping display settled it without Slovenia scoring once.",
    stars: ["Diogo Costa (saved all 3 Slovenian penalties)"],
    penalties: "Portugal 3–0 Slovenia (pens)"
  },
  {
    id: 15,
    stage: "Round of 16",
    date: "2024-07-02",
    venue: "Munich Football Arena, Munich",
    teamA: { name: "Romania", flag: "🇷🇴", score: 0 },
    teamB: { name: "Netherlands", flag: "🇳🇱", score: 3 },
    summary:
      "The Dutch cruised through this one, dominating possession and territory in a comfortable, controlled win.",
    stars: ["Cody Gakpo (1 goal)"]
  },
  {
    id: 16,
    stage: "Round of 16",
    date: "2024-07-02",
    venue: "Leipzig Stadion, Leipzig",
    teamA: { name: "Austria", flag: "🇦🇹", score: 1 },
    teamB: { name: "Turkey", flag: "🇹🇷", score: 2 },
    summary:
      "Turkey raced into a two-goal lead inside the first five minutes with a whirlwind start and held on through late Austrian pressure.",
    stars: ["Merih Demiral (2 goals, both inside the opening 5 minutes)"]
  },

  // ---------------- QUARTER-FINALS ----------------
  {
    id: 17,
    stage: "Quarter-final",
    date: "2024-07-05",
    venue: "Stuttgart Arena, Stuttgart",
    teamA: { name: "Spain", flag: "🇪🇸", score: 2 },
    teamB: { name: "Germany", flag: "🇩🇪", score: 1 },
    summary:
      "A brilliant, end-to-end quarter-final between two of the tournament's best sides, settled by a header deep into extra time that ended the hosts' run.",
    stars: ["Mikel Merino (119th-minute winner)", "Dani Olmo (1 goal)"]
  },
  {
    id: 18,
    stage: "Quarter-final",
    date: "2024-07-05",
    venue: "Volksparkstadion, Hamburg",
    teamA: { name: "Portugal", flag: "🇵🇹", score: 0 },
    teamB: { name: "France", flag: "🇫🇷", score: 0 },
    summary:
      "A tense, goalless stalemate between two heavyweights went all the way to penalties, where France kept their cool.",
    stars: ["Cristiano Ronaldo (converted his penalty in the shootout)"],
    penalties: "Portugal 3–5 France (pens)"
  },
  {
    id: 19,
    stage: "Quarter-final",
    date: "2024-07-06",
    venue: "Düsseldorf Arena, Düsseldorf",
    teamA: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 },
    teamB: { name: "Switzerland", flag: "🇨🇭", score: 1 },
    summary:
      "Switzerland's shock tournament run nearly continued as they led late, but a superb curling equalizer forced penalties, which England edged.",
    stars: ["Bukayo Saka (late equalizer)", "Jordan Pickford (penalty save)"],
    penalties: "England 5–3 Switzerland (pens)"
  },
  {
    id: 20,
    stage: "Quarter-final",
    date: "2024-07-06",
    venue: "Olympiastadion Berlin, Berlin",
    teamA: { name: "Netherlands", flag: "🇳🇱", score: 2 },
    teamB: { name: "Turkey", flag: "🇹🇷", score: 1 },
    summary:
      "Turkey's underdog run finally ended against a Dutch side that showed enough quality in both boxes to edge a tight contest.",
    stars: ["Cody Gakpo (1 goal)", "Stefan de Vrij (1 goal)"]
  },

  // ---------------- SEMI-FINALS ----------------
  {
    id: 21,
    stage: "Semi-final",
    date: "2024-07-09",
    venue: "Munich Football Arena, Munich",
    teamA: { name: "Spain", flag: "🇪🇸", score: 2 },
    teamB: { name: "France", flag: "🇫🇷", score: 1 },
    summary:
      "A 16-year-old announced himself to the world with a stunning long-range curler, and Spain never looked back on their way to the final.",
    stars: ["Lamine Yamal (wonder goal, youngest scorer in Euros history)", "Dani Olmo (1 goal)"]
  },
  {
    id: 22,
    stage: "Semi-final",
    date: "2024-07-10",
    venue: "BVB Stadion Dortmund, Dortmund",
    teamA: { name: "Netherlands", flag: "🇳🇱", score: 1 },
    teamB: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 2 },
    summary:
      "An England side that had ridden its luck all tournament finally clicked, snatching a dramatic extra-time winner in the closing minutes.",
    stars: ["Ollie Watkins (extra-time winner)", "Harry Kane (equalizing penalty)"]
  },

  // ---------------- FINAL ----------------
  {
    id: 23,
    stage: "Final",
    date: "2024-07-14",
    venue: "Olympiastadion Berlin, Berlin",
    teamA: { name: "Spain", flag: "🇪🇸", score: 2 },
    teamB: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: 1 },
    summary:
      "Spain capped off a perfect tournament — winning every single game — with a deserved final victory, clinching a record fourth European Championship title.",
    stars: ["Mikel Oyarzabal (winning goal)", "Nico Williams (1 goal)", "Rodri (Player of the Tournament)"]
  }
];
