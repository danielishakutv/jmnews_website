import type { Article } from "./types";
import { img } from "./utils";

/** Timestamps are generated relative to load time so content always feels fresh. */
const NOW = Date.now();
const minsAgo = (m: number) => new Date(NOW - m * 60_000).toISOString();
const hrsAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(NOW - d * 86_400_000).toISOString();

const P = (...p: string[]) => p;

export const articles: Article[] = [
  // ───────────────────────── FEATURED / HERO ─────────────────────────
  {
    slug: "fg-unveils-2026-budget-record-infrastructure-spending",
    title: "FG Unveils ₦42 Trillion 2026 Budget With Record Infrastructure Spending",
    excerpt:
      "President presents the largest budget in the nation's history to a joint session of the National Assembly, prioritising roads, power and security.",
    content: P(
      "President on Thursday presented a ₦42 trillion budget for the 2026 fiscal year to a joint session of the National Assembly, describing it as a 'Budget of National Renewal' aimed at rebuilding the country's ageing infrastructure and lifting millions out of poverty.",
      "Capital expenditure rose to its highest share in a decade, with the government earmarking ₦11.8 trillion for roads, rail, power and broadband. Officials say the spending is designed to crowd in private investment and create jobs amid a slow but steady recovery.",
      "The proposal pegs oil production at 1.8 million barrels per day and an exchange rate assumption that economists at the NGX described as 'cautiously realistic'. Recurrent expenditure was held broadly flat, a move the Finance Ministry framed as evidence of fiscal discipline.",
      "Opposition lawmakers welcomed the focus on capital projects but questioned how the deficit, projected at ₦9.1 trillion, would be financed without deepening the country's debt burden. Debate on the appropriation bill is expected to begin next week.",
      "Analysts say the credibility of the budget will hinge on revenue performance, particularly non-oil collections, which have improved following recent tax reforms but remain below target."
    ),
    category: "politics",
    tags: ["budget", "national assembly", "economy", "infrastructure"],
    authorSlug: "adaeze-okonkwo",
    image: img("budget-2026", 1600, 900),
    imageCaption: "The President presents the 2026 Appropriation Bill to a joint session of the National Assembly in Abuja.",
    publishedAt: minsAgo(38),
    readTime: 6,
    featured: true,
    live: true,
    trending: true,
    dateline: "ABUJA",
  },
  {
    slug: "super-eagles-qualify-2026-world-cup-dramatic-win",
    title: "Super Eagles Seal 2026 World Cup Spot With Dramatic Late Winner in Uyo",
    excerpt:
      "A stoppage-time strike sends the Godswill Akpabio Stadium into raptures as Nigeria books its place at next year's tournament.",
    content: P(
      "Nigeria booked its place at the 2026 FIFA World Cup with a heart-stopping 2-1 victory over their continental rivals, a stoppage-time header sealing qualification before a delirious crowd at the Godswill Akpabio International Stadium in Uyo.",
      "Trailing at half-time, the Super Eagles roared back through a second-half equaliser before the captain rose highest in the 92nd minute to spark wild celebrations across the country.",
      "The result caps a remarkable turnaround under the head coach, whose side had been written off after a stuttering start to the campaign. Supporters poured onto the streets of Lagos, Kano and Port Harcourt long into the night.",
      "Attention now turns to the draw, with the team expected to be among the second seeds. The coach urged calm, telling reporters: 'Tonight we celebrate. Tomorrow the real work begins.'"
    ),
    category: "sports",
    tags: ["super eagles", "world cup", "football", "afcon"],
    authorSlug: "tunde-bello",
    image: img("super-eagles-win", 1600, 900),
    imageCaption: "Super Eagles players celebrate the stoppage-time winner in Uyo.",
    publishedAt: hrsAgo(3),
    readTime: 4,
    featured: true,
    trending: true,
    dateline: "UYO",
  },
  {
    slug: "naira-strengthens-cbn-reforms-foreign-inflows",
    title: "Naira Strengthens to 8-Month High as Reforms Draw Foreign Inflows",
    excerpt:
      "The local currency posts its best week of the year as the central bank's clean-up of the FX market begins to pay off.",
    content: P(
      "The naira firmed to its strongest level in eight months this week, buoyed by a surge in foreign portfolio inflows and renewed confidence in the central bank's overhaul of the foreign exchange market.",
      "Traders pointed to improved dollar liquidity and a narrowing gap between official and parallel market rates as evidence that recent reforms were taking hold. The unit gained nearly four per cent over five sessions.",
      "The central bank governor said the appreciation reflected 'a return of credibility' to the market, though he cautioned that the bank would continue to intervene to smooth volatility.",
      "Manufacturers welcomed the stronger naira, which lowers the cost of imported raw materials, but exporters warned that sustained gains could erode their competitiveness."
    ),
    category: "business",
    tags: ["naira", "cbn", "forex", "markets"],
    authorSlug: "musa-ibrahim",
    image: img("naira-markets", 1600, 900),
    imageCaption: "Currency dealers monitor rates on a trading floor in Lagos.",
    publishedAt: hrsAgo(5),
    readTime: 5,
    featured: true,
    trending: true,
    dateline: "LAGOS",
  },

  // ───────────────────────── NIGERIA ─────────────────────────
  {
    slug: "lagos-blue-line-rail-extension-opens",
    title: "Lagos Opens Blue Line Rail Extension, Easing Commute for Millions",
    excerpt:
      "The long-awaited extension links the island to the mainland, promising to cut journey times that often stretch to hours.",
    content: P(
      "Lagos State on Wednesday opened the latest extension of its Blue Line rail, a milestone in a transport project that planners hope will transform daily life in Africa's largest city.",
      "The new stretch connects key commercial districts and is expected to carry hundreds of thousands of passengers each day, easing pressure on roads notorious for gridlock.",
      "Commuters described the opening as 'a relief', with some saying journeys that once took three hours could now be completed in under an hour.",
      "Officials said work on additional lines was continuing, part of a wider plan to build an integrated mass transit network across the megacity."
    ),
    category: "nigeria",
    tags: ["lagos", "transport", "rail", "infrastructure"],
    authorSlug: "adaeze-okonkwo",
    image: img("lagos-rail", 1200, 800),
    imageCaption: "Passengers board a train on the newly opened Blue Line extension in Lagos.",
    publishedAt: hrsAgo(7),
    readTime: 4,
    trending: true,
    dateline: "LAGOS",
  },
  {
    slug: "national-grid-power-supply-improves-q2",
    title: "National Grid Hits New Generation Peak as Power Supply Improves",
    excerpt:
      "Distribution companies report steadier supply across major cities after the grid records its highest output in years.",
    content: P(
      "Nigeria's national grid recorded a new peak in electricity generation this week, a development the power ministry hailed as proof that long-running reforms in the sector were beginning to bear fruit.",
      "Distribution companies in Lagos, Abuja and Kano reported more consistent supply, though many households and businesses continue to rely on generators to bridge gaps.",
      "Industry experts cautioned that transmission bottlenecks remained the sector's biggest challenge, urging sustained investment in the grid's ageing infrastructure.",
      "The government has pledged to expand metering and attract private capital into generation and distribution as it works towards stable, round-the-clock power."
    ),
    category: "nigeria",
    tags: ["power", "electricity", "grid", "energy"],
    authorSlug: "musa-ibrahim",
    image: img("power-grid", 1200, 800),
    imageCaption: "High-voltage transmission lines on the outskirts of Abuja.",
    publishedAt: hrsAgo(9),
    readTime: 4,
    dateline: "ABUJA",
  },
  {
    slug: "anambra-tech-hub-launch-jobs",
    title: "Anambra Launches Tech Hub Aiming to Create 10,000 Digital Jobs",
    excerpt:
      "The South-East state positions itself as an emerging technology destination with a new innovation campus.",
    content: P(
      "Anambra State on Tuesday inaugurated a sprawling technology hub that officials say will train thousands of young people and position the South-East as a rising star in Nigeria's digital economy.",
      "The campus offers co-working space, fibre connectivity and incubation support for startups, with a target of creating 10,000 digital jobs within three years.",
      "The state governor described technology as 'the great equaliser', pledging to make coding and digital skills part of the secondary school curriculum.",
      "Local founders welcomed the investment but called for reliable power and better internet infrastructure to help young companies scale."
    ),
    category: "nigeria",
    tags: ["anambra", "jobs", "startups", "south-east"],
    authorSlug: "ngozi-eze",
    image: img("anambra-tech", 1200, 800),
    imageCaption: "Young developers at the newly opened innovation campus in Awka.",
    publishedAt: hrsAgo(12),
    readTime: 3,
    dateline: "AWKA",
  },
  {
    slug: "flood-preparedness-plan-river-states",
    title: "Government Rolls Out Flood Preparedness Plan for River States",
    excerpt:
      "Early-warning systems and relief stockpiles are being deployed ahead of the rainy season in flood-prone communities.",
    content: P(
      "Federal and state emergency agencies have launched a coordinated flood preparedness plan covering communities along the Niger and Benue rivers ahead of an expected heavy rainy season.",
      "The plan includes early-warning sirens, pre-positioned relief materials and the dredging of key waterways to reduce the risk of the kind of devastating floods seen in recent years.",
      "Officials urged residents in low-lying areas to heed evacuation advisories, noting that timely action saves lives.",
      "Humanitarian groups welcomed the proactive approach but stressed the need for longer-term investment in resilient housing and drainage."
    ),
    category: "nigeria",
    tags: ["flood", "environment", "disaster", "rivers"],
    authorSlug: "fatima-yusuf",
    image: img("flood-prep", 1200, 800),
    imageCaption: "Emergency officials inspect flood defences along the River Benue.",
    publishedAt: hrsAgo(14),
    readTime: 3,
    dateline: "MAKURDI",
  },

  // ───────────────────────── POLITICS ─────────────────────────
  {
    slug: "electoral-reform-bill-passes-second-reading",
    title: "Electoral Reform Bill Passes Second Reading in the Senate",
    excerpt:
      "Proposed changes would expand electronic transmission of results and tighten timelines for declaring winners.",
    content: P(
      "A sweeping electoral reform bill cleared its second reading in the Senate on Wednesday, advancing proposals that supporters say could strengthen the integrity of future elections.",
      "Key provisions include the mandatory electronic transmission of results, clearer timelines for collation and stiffer penalties for electoral offences.",
      "Civil society groups have campaigned for the changes, arguing they would reduce disputes and rebuild public trust in the ballot.",
      "The bill now heads to committee, where lawmakers are expected to hold public hearings before a final vote."
    ),
    category: "politics",
    tags: ["elections", "senate", "reform", "inec"],
    authorSlug: "adaeze-okonkwo",
    image: img("senate-reform", 1200, 800),
    imageCaption: "Senators debate the electoral reform bill in the chamber in Abuja.",
    publishedAt: hrsAgo(6),
    readTime: 4,
    dateline: "ABUJA",
  },
  {
    slug: "governors-forum-state-police-debate",
    title: "Governors' Forum Renews Push for State Police Amid Security Concerns",
    excerpt:
      "State leaders argue that decentralised policing is essential to tackling insecurity, reigniting a long-running debate.",
    content: P(
      "The Governors' Forum has renewed calls for the creation of state police, arguing that a single, centrally controlled force can no longer keep pace with the country's security challenges.",
      "Speaking after a closed-door meeting, the forum's chairman said decentralised policing would bring law enforcement closer to communities and improve intelligence gathering.",
      "The proposal, which would require a constitutional amendment, has long divided opinion, with critics warning it could be abused by powerful state actors.",
      "Security analysts say any reform must be paired with strong oversight to prevent the politicisation of local forces."
    ),
    category: "politics",
    tags: ["security", "state police", "governors", "constitution"],
    authorSlug: "adaeze-okonkwo",
    image: img("governors-forum", 1200, 800),
    imageCaption: "State governors arrive for a security meeting in Abuja.",
    publishedAt: hrsAgo(11),
    readTime: 4,
    dateline: "ABUJA",
  },

  // ───────────────────────── BUSINESS ─────────────────────────
  {
    slug: "dangote-refinery-petrol-export-milestone",
    title: "Dangote Refinery Begins Petrol Exports in Landmark for Local Refining",
    excerpt:
      "The continent's largest refinery ships its first cargoes abroad, signalling a shift in regional fuel trade.",
    content: P(
      "The Dangote Refinery has begun exporting petrol, a milestone executives say marks a turning point for domestic refining and could reshape fuel trade across West Africa.",
      "The 650,000 barrel-per-day facility, the largest single-train refinery in the world, has ramped up production steadily, easing the country's historic dependence on imported fuel.",
      "Energy analysts said the development could save billions in foreign exchange and position the country as a regional refining hub.",
      "Questions remain over pricing and the pace at which savings will reach consumers at the pump, but the symbolism of exporting fuel was not lost on observers."
    ),
    category: "business",
    tags: ["dangote", "refinery", "oil", "exports"],
    authorSlug: "musa-ibrahim",
    image: img("dangote-refinery", 1200, 800),
    imageCaption: "Storage tanks at the Dangote Refinery in Lekki, Lagos.",
    publishedAt: hrsAgo(8),
    readTime: 5,
    trending: true,
    dateline: "LAGOS",
  },
  {
    slug: "ngx-all-share-index-record-high",
    title: "NGX All-Share Index Climbs to Record High on Banking Rally",
    excerpt:
      "Investor appetite for banking and consumer stocks pushes the benchmark index past a historic threshold.",
    content: P(
      "The Nigerian Exchange's All-Share Index surged to a record high on Tuesday, lifted by a powerful rally in banking and consumer goods stocks.",
      "Analysts attributed the gains to strong corporate earnings, improving macroeconomic sentiment and a rotation of funds into equities as fixed-income yields softened.",
      "Market capitalisation crossed a fresh milestone, with several blue-chip stocks touching 52-week highs during the session.",
      "Portfolio managers urged caution, noting that valuations in some sectors were beginning to look stretched after the run-up."
    ),
    category: "business",
    tags: ["ngx", "stocks", "markets", "banking"],
    authorSlug: "musa-ibrahim",
    image: img("ngx-rally", 1200, 800),
    imageCaption: "An electronic board displays share prices at the Nigerian Exchange in Lagos.",
    publishedAt: hrsAgo(10),
    readTime: 3,
    dateline: "LAGOS",
  },

  // ───────────────────────── WORLD ─────────────────────────
  {
    slug: "ecowas-summit-regional-trade-security",
    title: "ECOWAS Summit Focuses on Regional Trade and Collective Security",
    excerpt:
      "West African leaders gather to chart a path toward deeper economic integration and a unified response to instability.",
    content: P(
      "Leaders of West African nations convened this week for an ECOWAS summit dominated by debates over regional trade, the bloc's future and a coordinated response to security threats in the Sahel.",
      "Delegates discussed accelerating the free movement of goods and people, as well as long-standing plans for a single regional currency.",
      "The summit also addressed efforts to keep dialogue open with countries that have drifted from the bloc, with several leaders stressing unity.",
      "Observers said the meeting underscored both the ambitions and the strains facing one of Africa's oldest regional blocs."
    ),
    category: "world",
    tags: ["ecowas", "west africa", "trade", "diplomacy"],
    authorSlug: "emeka-nwachukwu",
    image: img("ecowas-summit", 1200, 800),
    imageCaption: "West African heads of state pose for a group photograph at the ECOWAS summit.",
    publishedAt: hrsAgo(13),
    readTime: 4,
    dateline: "ACCRA",
  },
  {
    slug: "global-markets-react-central-bank-decisions",
    title: "Global Markets Steady as Major Central Banks Signal Caution",
    excerpt:
      "Equities hold firm while investors weigh the path of interest rates in the world's largest economies.",
    content: P(
      "Global markets traded in a narrow range on Wednesday as investors digested signals from major central banks suggesting a cautious approach to interest rates in the months ahead.",
      "Wall Street futures were broadly flat, while European and Asian indices posted modest moves, reflecting a wait-and-see mood.",
      "Emerging markets, including Nigeria, stand to benefit from any easing in global financial conditions, analysts said, as lower rates abroad can spur inflows.",
      "Oil prices held steady, a key variable for the Nigerian economy given crude's outsized role in government revenue."
    ),
    category: "world",
    tags: ["markets", "central banks", "global economy"],
    authorSlug: "emeka-nwachukwu",
    image: img("global-markets", 1200, 800),
    imageCaption: "Traders work on a financial trading floor as markets steady.",
    publishedAt: hrsAgo(16),
    readTime: 3,
    dateline: "LONDON",
  },

  // ───────────────────────── SPORTS ─────────────────────────
  {
    slug: "nigerian-clubs-caf-champions-league-progress",
    title: "Nigerian Clubs Advance in CAF Champions League Group Stage",
    excerpt:
      "Two domestic sides keep continental hopes alive with battling away results in the group phase.",
    content: P(
      "Nigerian football received a continental boost this week as two domestic clubs picked up crucial results in the CAF Champions League group stage.",
      "A disciplined away performance earned one side a valuable point, while another claimed a narrow win to climb their group.",
      "Coaches praised the resilience of their young squads, many featuring players hoping to earn moves abroad.",
      "The results offer encouragement for the domestic league, which has battled to retain its best talent in recent seasons."
    ),
    category: "sports",
    tags: ["caf", "champions league", "npfl", "football"],
    authorSlug: "tunde-bello",
    image: img("caf-clubs", 1200, 800),
    imageCaption: "A domestic side celebrates a goal in a CAF Champions League fixture.",
    publishedAt: hrsAgo(4),
    readTime: 3,
    dateline: "LAGOS",
  },
  {
    slug: "nigerian-sprinter-diamond-league-victory",
    title: "Nigerian Sprinter Storms to 100m Victory at Diamond League Meet",
    excerpt:
      "A blistering personal best announces a new contender on the global athletics stage ahead of the season.",
    content: P(
      "A Nigerian sprinter lit up the Diamond League circuit with a stunning 100m victory, clocking a personal best that sent a statement to rivals ahead of the championship season.",
      "The win caps a rapid rise for the athlete, who only broke into the senior ranks last year.",
      "The athletics federation hailed the result as proof of the depth of talent emerging from the country's track programmes.",
      "Attention now turns to the global championships, where hopes of a medal are quietly building."
    ),
    category: "sports",
    tags: ["athletics", "diamond league", "track"],
    authorSlug: "tunde-bello",
    image: img("sprinter-win", 1200, 800),
    imageCaption: "A Nigerian sprinter crosses the line to win the 100m.",
    publishedAt: hrsAgo(18),
    readTime: 2,
    dateline: "DOHA",
  },

  // ───────────────────────── ENTERTAINMENT ─────────────────────────
  {
    slug: "afrobeats-star-global-tour-announcement",
    title: "Afrobeats Star Announces Sold-Out Global Arena Tour",
    excerpt:
      "Tickets for the world tour vanish within minutes as Nigerian music's global takeover gathers pace.",
    content: P(
      "One of Nigeria's biggest Afrobeats stars announced a global arena tour this week, with tickets for several dates selling out within minutes of going on sale.",
      "The tour will take in some of the world's most iconic venues, the latest sign of the genre's extraordinary international rise.",
      "Industry insiders say Afrobeats has become one of the fastest-growing genres on streaming platforms, opening doors for a new generation of Nigerian artists.",
      "The star thanked fans, promising 'the biggest show we have ever put on' and a celebration of Nigerian culture on the world stage."
    ),
    category: "entertainment",
    tags: ["afrobeats", "music", "tour", "culture"],
    authorSlug: "bisi-adeyemi",
    image: img("afrobeats-tour", 1200, 800),
    imageCaption: "Fans fill an arena during an Afrobeats concert.",
    publishedAt: hrsAgo(6),
    readTime: 3,
    trending: true,
    dateline: "LAGOS",
  },
  {
    slug: "nollywood-film-international-festival-premiere",
    title: "Nollywood Drama Earns Standing Ovation at International Film Festival",
    excerpt:
      "A homegrown production wins critical acclaim abroad, signalling Nollywood's growing global ambition.",
    content: P(
      "A Nigerian feature film received a lengthy standing ovation at its premiere at a major international film festival, drawing praise from critics for its storytelling and craft.",
      "The drama, shot largely on location, explores themes of family, ambition and identity in a rapidly changing society.",
      "Its reception abroad reflects the rising profile of Nollywood, which is increasingly attracting global distribution deals and festival slots.",
      "The director said the recognition was 'a win for the whole industry', expressing hope it would open doors for other Nigerian filmmakers."
    ),
    category: "entertainment",
    tags: ["nollywood", "film", "festival", "culture"],
    authorSlug: "bisi-adeyemi",
    image: img("nollywood-premiere", 1200, 800),
    imageCaption: "The cast and crew at the international premiere of the film.",
    publishedAt: hrsAgo(20),
    readTime: 3,
    dateline: "LAGOS",
  },

  // ───────────────────────── TECHNOLOGY ─────────────────────────
  {
    slug: "nigerian-fintech-raises-series-c-expansion",
    title: "Nigerian Fintech Raises $120m Series C to Expand Across Africa",
    excerpt:
      "One of Lagos's best-known startups secures fresh capital to scale payments infrastructure beyond Nigeria.",
    content: P(
      "A leading Nigerian fintech has raised $120 million in a Series C round, fresh capital it plans to use to expand its payments infrastructure across the continent.",
      "The round, led by a mix of global and African investors, is among the largest fundraises in the country's tech sector this year.",
      "The company said the funding would support expansion into new markets and investment in compliance and engineering talent.",
      "The deal offers a rare bright spot in a funding environment that has tightened globally, underscoring continued investor appetite for African fintech."
    ),
    category: "technology",
    tags: ["fintech", "startups", "funding", "payments"],
    authorSlug: "ngozi-eze",
    image: img("fintech-series-c", 1200, 800),
    imageCaption: "Engineers at a fintech startup's office in Lagos.",
    publishedAt: hrsAgo(5),
    readTime: 4,
    trending: true,
    dateline: "LAGOS",
  },
  {
    slug: "broadband-expansion-rural-connectivity-plan",
    title: "New Plan Targets Broadband for 20 Million Rural Nigerians",
    excerpt:
      "A public-private initiative aims to close the digital divide with fibre and community networks.",
    content: P(
      "A new public-private initiative aims to bring affordable broadband to 20 million people in rural and underserved communities over the next four years.",
      "The plan combines fibre rollout, community networks and incentives for operators to extend coverage to areas long ignored as commercially unviable.",
      "Officials say connectivity is essential for education, healthcare and economic opportunity, framing access as 'a basic right' in a digital age.",
      "Experts welcomed the ambition but cautioned that power supply and affordability would determine whether coverage translates into real usage."
    ),
    category: "technology",
    tags: ["broadband", "connectivity", "digital", "infrastructure"],
    authorSlug: "ngozi-eze",
    image: img("broadband-rural", 1200, 800),
    imageCaption: "Technicians install fibre optic cable in a rural community.",
    publishedAt: hrsAgo(15),
    readTime: 3,
    dateline: "ABUJA",
  },

  // ───────────────────────── HEALTH ─────────────────────────
  {
    slug: "malaria-vaccine-rollout-states",
    title: "Malaria Vaccine Rollout Reaches Children Across 10 States",
    excerpt:
      "Health authorities expand a vaccination drive hailed as a milestone in the fight against a deadly disease.",
    content: P(
      "Health authorities have expanded a malaria vaccine rollout to children across 10 states, a development experts describe as a milestone in the long fight against one of the country's deadliest diseases.",
      "Malaria remains a leading cause of childhood death, and officials hope the vaccine, combined with existing measures, will save tens of thousands of lives.",
      "Community health workers have been mobilised to reach remote areas, with awareness campaigns countering hesitancy in some communities.",
      "Public health experts stressed that the vaccine complements rather than replaces bed nets and prompt treatment."
    ),
    category: "health",
    tags: ["malaria", "vaccine", "public health", "children"],
    authorSlug: "fatima-yusuf",
    image: img("malaria-vaccine", 1200, 800),
    imageCaption: "A health worker administers the malaria vaccine to a child.",
    publishedAt: hrsAgo(9),
    readTime: 4,
    dateline: "ABUJA",
  },
  {
    slug: "teaching-hospitals-equipment-upgrade",
    title: "Federal Teaching Hospitals Begin Major Equipment Upgrade",
    excerpt:
      "A nationwide programme aims to modernise diagnostic and surgical facilities to stem medical tourism.",
    content: P(
      "Federal teaching hospitals have begun a major upgrade of diagnostic and surgical equipment under a programme aimed at improving care and reducing costly medical tourism abroad.",
      "The investment covers imaging machines, laboratory systems and theatre equipment, with training for staff to operate the new technology.",
      "Health officials said the goal was to ensure Nigerians could access world-class care at home.",
      "Doctors welcomed the move but called for sustained maintenance funding so that equipment does not fall into disrepair."
    ),
    category: "health",
    tags: ["hospitals", "healthcare", "medical tourism"],
    authorSlug: "fatima-yusuf",
    image: img("hospital-upgrade", 1200, 800),
    imageCaption: "New imaging equipment installed at a federal teaching hospital.",
    publishedAt: hrsAgo(22),
    readTime: 3,
    dateline: "IBADAN",
  },

  // ───────────────────────── OPINION ─────────────────────────
  {
    slug: "opinion-nigeria-youth-bulge-opportunity",
    title: "Opinion: Nigeria's Youth Bulge Is a Time Bomb — or a Goldmine",
    excerpt:
      "The choices made today on education and jobs will determine whether a young population becomes the nation's greatest asset.",
    content: P(
      "Nigeria is one of the youngest countries on earth, with a median age under 20. That demographic reality is often described as a 'time bomb'. It is just as accurate to call it a goldmine — the difference lies entirely in the choices we make now.",
      "A young population can power decades of growth, but only if it is educated, healthy and employed. Squandered, that same energy curdles into frustration.",
      "The priorities are not mysterious: quality schooling, vocational training aligned to real industries, and an economy that creates jobs faster than the population grows.",
      "The window is open, but it will not stay open forever. History rarely forgives nations that waste their youth."
    ),
    category: "opinion",
    tags: ["youth", "demographics", "education", "jobs"],
    authorSlug: "editorial-board",
    image: img("youth-opinion", 1200, 800),
    imageCaption: "Students leave a secondary school at the end of the day.",
    publishedAt: hrsAgo(7),
    readTime: 5,
    dateline: "EDITORIAL",
  },
  {
    slug: "opinion-diversify-economy-beyond-oil",
    title: "Opinion: It Is Time to Mean It About Diversifying Beyond Oil",
    excerpt:
      "Every government promises to wean the economy off crude. The reforms underway must not be allowed to stall.",
    content: P(
      "For as long as most Nigerians can remember, every government has promised to diversify the economy away from oil. Progress has been real but painfully slow.",
      "Recent reforms — in foreign exchange, in taxation, in agriculture — offer a genuine chance to break the cycle. The danger now is complacency.",
      "Diversification is not a slogan; it is a thousand unglamorous decisions about ports, power, paperwork and predictability.",
      "If the current momentum is sustained, the next decade could finally deliver an economy that no longer holds its breath every time the oil price moves."
    ),
    category: "opinion",
    tags: ["economy", "oil", "reform", "diversification"],
    authorSlug: "editorial-board",
    image: img("economy-opinion", 1200, 800),
    imageCaption: "Cargo containers stacked at a Nigerian port.",
    publishedAt: daysAgo(1),
    readTime: 4,
    dateline: "EDITORIAL",
  },

  // ───────────────────────── EXTRA DEPTH (mixed) ─────────────────────────
  {
    slug: "kano-agriculture-irrigation-scheme",
    title: "Kano Irrigation Scheme Boosts Dry-Season Farming and Incomes",
    excerpt:
      "A revived irrigation project is helping farmers grow crops year-round, lifting harvests and household incomes.",
    content: P(
      "A revived irrigation scheme in Kano State is enabling thousands of farmers to grow crops through the dry season, boosting harvests and household incomes in the agricultural heartland.",
      "The project channels water to fields that once lay idle for months, allowing farmers to cultivate vegetables, wheat and rice.",
      "Agricultural officials say the scheme is part of a broader push to strengthen food security and reduce dependence on imports.",
      "Farmers reported higher yields and more stable earnings, though some called for better access to storage and markets."
    ),
    category: "nigeria",
    tags: ["agriculture", "kano", "food security", "farming"],
    authorSlug: "musa-ibrahim",
    image: img("kano-irrigation", 1200, 800),
    imageCaption: "Farmers tend irrigated fields during the dry season in Kano.",
    publishedAt: hrsAgo(17),
    readTime: 3,
    dateline: "KANO",
  },
  {
    slug: "education-reform-curriculum-skills",
    title: "New Curriculum Puts Digital and Vocational Skills at the Centre",
    excerpt:
      "Education authorities overhaul the syllabus to better prepare students for a fast-changing job market.",
    content: P(
      "Education authorities have unveiled a revamped curriculum that places digital literacy and vocational skills at the heart of secondary schooling.",
      "The reform introduces coding, entrepreneurship and trade skills alongside traditional subjects, in a bid to better align education with the demands of the modern economy.",
      "Teachers' unions welcomed the ambition but warned that training and resources must follow if the changes are to succeed.",
      "Officials said a phased rollout would begin in the new academic year, with teacher retraining a priority."
    ),
    category: "nigeria",
    tags: ["education", "curriculum", "skills", "schools"],
    authorSlug: "fatima-yusuf",
    image: img("education-reform", 1200, 800),
    imageCaption: "Students use computers in a secondary school classroom.",
    publishedAt: hrsAgo(21),
    readTime: 3,
    dateline: "ABUJA",
  },
  {
    slug: "premier-league-nigerian-stars-weekend",
    title: "Nigerian Stars Shine in Premier League Weekend Action",
    excerpt:
      "Goals and assists from Nigerian players light up another round of fixtures in England's top flight.",
    content: P(
      "Nigerian players were among the standout performers in another action-packed Premier League weekend, contributing goals and assists across several fixtures.",
      "Their form has fuelled excitement at home, where fans follow the English top flight with near-religious devotion.",
      "Pundits singled out the impact of Nigerian forwards and midfielders, several of whom are enjoying career-best campaigns.",
      "The performances bode well for the national team as it prepares for upcoming international fixtures."
    ),
    category: "sports",
    tags: ["premier league", "football", "nigerian players"],
    authorSlug: "tunde-bello",
    image: img("premier-league", 1200, 800),
    imageCaption: "A Nigerian forward celebrates a goal in the Premier League.",
    publishedAt: hrsAgo(2),
    readTime: 3,
    live: true,
    dateline: "LONDON",
  },
  {
    slug: "ai-startups-nigeria-emerging-scene",
    title: "Nigeria's AI Startups Step Into the Spotlight",
    excerpt:
      "A wave of homegrown companies is applying artificial intelligence to agriculture, health and finance.",
    content: P(
      "A growing cluster of Nigerian startups is putting artificial intelligence to work on local problems, from crop disease detection to medical diagnostics and credit scoring.",
      "Founders say solving for local context — languages, data and infrastructure — is where the biggest opportunities lie.",
      "Investors are taking notice, though many caution that talent retention and data access remain significant hurdles.",
      "Experts argue that with the right support, the country could become a hub for applied AI on the continent."
    ),
    category: "technology",
    tags: ["ai", "startups", "innovation"],
    authorSlug: "ngozi-eze",
    image: img("ai-startups", 1200, 800),
    imageCaption: "A team works on an AI product at a Lagos startup.",
    publishedAt: hrsAgo(19),
    readTime: 4,
    dateline: "LAGOS",
  },
  {
    slug: "tourism-drive-cross-river-festivals",
    title: "Cross River Bets on Festivals to Power a Tourism Revival",
    excerpt:
      "The state leans into its carnival heritage and natural beauty to draw visitors and create jobs.",
    content: P(
      "Cross River State is betting on its renowned carnival and lush landscapes to drive a tourism revival that officials hope will create jobs and diversify the local economy.",
      "Investment is flowing into hospitality, road access and the marketing of the state's festivals to domestic and international visitors.",
      "Local businesses say the influx of tourists during peak season provides a vital boost to incomes.",
      "Tourism advocates argue that with sustained investment, the sector could become a significant earner for the state and the country."
    ),
    category: "nigeria",
    tags: ["tourism", "cross river", "carnival", "economy"],
    authorSlug: "bisi-adeyemi",
    image: img("cross-river-tourism", 1200, 800),
    imageCaption: "Performers in colourful costume during the Cross River carnival.",
    publishedAt: daysAgo(2),
    readTime: 3,
    dateline: "CALABAR",
  },
  {
    slug: "climate-finance-africa-summit-pledges",
    title: "Africa Climate Summit Yields Fresh Pledges on Green Finance",
    excerpt:
      "Leaders and investors commit new funding for renewable energy and adaptation across the continent.",
    content: P(
      "An Africa-focused climate summit has produced fresh pledges of green finance, with leaders and investors committing new funding for renewable energy and climate adaptation.",
      "Delegates emphasised that Africa, which contributes little to global emissions, bears a disproportionate share of climate impacts.",
      "Nigeria highlighted its own renewable energy ambitions, including solar mini-grids for off-grid communities.",
      "Campaigners welcomed the pledges but stressed that delivery, not announcements, would be the true measure of success."
    ),
    category: "world",
    tags: ["climate", "finance", "renewables", "africa"],
    authorSlug: "emeka-nwachukwu",
    image: img("climate-summit", 1200, 800),
    imageCaption: "Solar panels installed at a community mini-grid project.",
    publishedAt: daysAgo(1),
    readTime: 4,
    dateline: "NAIROBI",
  },
];

export default articles;
