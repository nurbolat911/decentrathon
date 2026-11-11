// Demo case for the investigation screen: one synthetic scheme
// (structuring, drop accounts, a hub, a round trip, the apex beneficiary).
// Every id, amount and account is synthetic. Text fields carry both languages.
// In claims and reasons, [n] is footnote n of that block; footnote n lists its transfers.
window.CASE = {
  threshold: 1000000,

  alert: {
    id: "ALR-2026-0417",
    createdAt: "2026-10-23T09:14",
    subject: "ACC-1042",
    amount: 11630000,
    ruleScore: "0.86",
    rule: {
      ru: "R-12: 12 и больше входящих переводов ниже порога за 72 часа в окружении счёта",
      en: "R-12: 12 or more incoming transfers below the threshold within 72 hours around the account",
    },
  },

  // kind: person | llp | sole. x, y: model units; columns follow the money from left to right.
  accounts: [
    { id: "ACC-2101", kind: "person", x: 0, y: 40 },
    { id: "ACC-2102", kind: "person", x: 0, y: 120 },
    { id: "ACC-2103", kind: "person", x: 0, y: 200 },
    { id: "ACC-2104", kind: "person", x: 0, y: 280 },
    { id: "ACC-2105", kind: "person", x: 0, y: 360 },
    { id: "ACC-2106", kind: "person", x: 0, y: 440 },
    { id: "ACC-3301", kind: "person", x: 230, y: 110 },
    { id: "ACC-3302", kind: "person", x: 230, y: 240 },
    { id: "ACC-3303", kind: "person", x: 230, y: 370 },
    { id: "ACC-1042", kind: "llp", x: 400, y: 240, alert: true },
    { id: "ACC-5501", kind: "llp", x: 560, y: 320 },
    { id: "ACC-5502", kind: "sole", x: 660, y: 440 },
    { id: "ACC-5503", kind: "llp", x: 480, y: 440 },
    { id: "ACC-9001", kind: "person", x: 680, y: 200 },
    { id: "ACC-7710", kind: "llp", x: 530, y: 120 },
    { id: "ACC-7720", kind: "sole", x: 710, y: 70 },
    { id: "ACC-7730", kind: "llp", x: 310, y: 40 },
    { id: "ACC-7740", kind: "llp", x: 170, y: 0 },
  ],

  transactions: [
    // Structuring: every amount just under the 1 000 000 ₸ threshold.
    { id: "T-0001", from: "ACC-2101", to: "ACC-3301", amount: 985000, at: "2026-10-20T10:02" },
    { id: "T-0002", from: "ACC-2101", to: "ACC-3301", amount: 960000, at: "2026-10-20T15:41" },
    { id: "T-0003", from: "ACC-2102", to: "ACC-3301", amount: 975000, at: "2026-10-20T11:17" },
    { id: "T-0004", from: "ACC-2102", to: "ACC-3302", amount: 990000, at: "2026-10-21T09:08" },
    { id: "T-0005", from: "ACC-2103", to: "ACC-3302", amount: 945000, at: "2026-10-21T09:55" },
    { id: "T-0006", from: "ACC-2103", to: "ACC-3302", amount: 970000, at: "2026-10-21T13:30" },
    { id: "T-0007", from: "ACC-2104", to: "ACC-3302", amount: 980000, at: "2026-10-21T14:12" },
    { id: "T-0008", from: "ACC-2104", to: "ACC-3303", amount: 955000, at: "2026-10-22T10:20" },
    { id: "T-0009", from: "ACC-2105", to: "ACC-3303", amount: 990000, at: "2026-10-22T11:03" },
    { id: "T-0010", from: "ACC-2105", to: "ACC-3303", amount: 965000, at: "2026-10-22T16:47" },
    { id: "T-0011", from: "ACC-2106", to: "ACC-3303", amount: 940000, at: "2026-10-22T17:15" },
    { id: "T-0012", from: "ACC-2106", to: "ACC-3301", amount: 975000, at: "2026-10-20T18:30" },
    // Drop accounts pass 97% on to the hub the same evening.
    { id: "T-0013", from: "ACC-3301", to: "ACC-1042", amount: 3780000, at: "2026-10-20T21:05" },
    { id: "T-0014", from: "ACC-3302", to: "ACC-1042", amount: 3770000, at: "2026-10-21T18:40" },
    { id: "T-0015", from: "ACC-3303", to: "ACC-1042", amount: 3735000, at: "2026-10-22T22:10" },
    // Round trip: hub, 5501, 5502, 5503 and back to the hub, about 1% lost per hop.
    { id: "T-0016", from: "ACC-1042", to: "ACC-5501", amount: 4000000, at: "2026-10-23T08:15" },
    { id: "T-0017", from: "ACC-5501", to: "ACC-5502", amount: 3960000, at: "2026-10-23T10:02" },
    { id: "T-0018", from: "ACC-5502", to: "ACC-5503", amount: 3920000, at: "2026-10-23T12:48" },
    { id: "T-0019", from: "ACC-5503", to: "ACC-1042", amount: 3880000, at: "2026-10-23T15:20" },
    // Apex beneficiary.
    { id: "T-0020", from: "ACC-1042", to: "ACC-9001", amount: 6500000, at: "2026-10-23T16:05" },
    { id: "T-0021", from: "ACC-1042", to: "ACC-9001", amount: 4300000, at: "2026-10-23T17:30" },
    // Context: ordinary counterparties.
    { id: "T-0022", from: "ACC-1042", to: "ACC-7710", amount: 180000, at: "2026-10-21T12:00" },
    { id: "T-0023", from: "ACC-9001", to: "ACC-7720", amount: 250000, at: "2026-10-23T19:10" },
    { id: "T-0024", from: "ACC-7730", to: "ACC-1042", amount: 1200000, at: "2026-10-19T11:30" },
    { id: "T-0025", from: "ACC-7740", to: "ACC-7730", amount: 420000, at: "2026-10-18T14:00" },
  ],

  // risk: seriousness of the scheme (high | medium), not the accuracy of the finding.
  // basis: signs met out of the typology's signs; the word comes from the share.
  // accounts: members (they take the risk and the role); transactions: everything the footnotes cite.
  hypotheses: [
    {
      id: "H1",
      risk: "high",
      typology: { ru: "Дробление сумм", en: "Structuring" },
      roles: { "ACC-2101": "sender", "ACC-2102": "sender", "ACC-2103": "sender", "ACC-2104": "sender", "ACC-2105": "sender", "ACC-2106": "sender" },
      accounts: ["ACC-2101", "ACC-2102", "ACC-2103", "ACC-2104", "ACC-2105", "ACC-2106", "ACC-3301", "ACC-3302", "ACC-3303"],
      claim: {
        ru: "Шесть счетов физических лиц за 72 часа отправили 12 переводов от 940 000 до 990 000 ₸, каждый ниже порога, на ACC-3301[1], ACC-3302[2] и ACC-3303[3]. Всего 11 630 000 ₸.",
        en: "Six personal accounts sent 12 transfers of 940,000 to 990,000 ₸ within 72 hours, each below the threshold, to ACC-3301[1], ACC-3302[2] and ACC-3303[3]. 11,630,000 ₸ in total.",
      },
      footnotes: [
        ["T-0001", "T-0003", "T-0002", "T-0012"],
        ["T-0004", "T-0005", "T-0006", "T-0007"],
        ["T-0008", "T-0009", "T-0010", "T-0011"],
      ],
      signs: [
        { met: true, ru: "Все 12 сумм ниже порога 1 000 000 ₸", en: "All 12 amounts below the 1,000,000 ₸ threshold" },
        { met: true, ru: "Шесть отправителей на три счёта", en: "Six senders into three accounts" },
        { met: true, ru: "Все переводы в окне 72 часа", en: "All transfers within a 72-hour window" },
      ],
      check: {
        ru: "Есть ли у отправителей общая KYC-связь: адрес, телефон, устройство.",
        en: "Whether the senders share a KYC link: address, phone, device.",
      },
    },
    {
      id: "H2",
      risk: "high",
      typology: { ru: "Дроп-счета (воронка)", en: "Drop accounts (funnel)" },
      roles: { "ACC-3301": "drop", "ACC-3302": "drop", "ACC-3303": "drop", "ACC-1042": "hub" },
      accounts: ["ACC-3301", "ACC-3302", "ACC-3303", "ACC-1042"],
      claim: {
        ru: "ACC-3301[1], ACC-3302[2] и ACC-3303[3] получают по четыре перевода от трёх отправителей и в тот же вечер переводят 97 % полученного на ACC-1042.",
        en: "ACC-3301[1], ACC-3302[2] and ACC-3303[3] each take four transfers from three senders and pass 97% of it to ACC-1042 the same evening.",
      },
      footnotes: [["T-0013"], ["T-0014"], ["T-0015"]],
      signs: [
        { met: true, ru: "Три и больше отправителя на каждый счёт", en: "Three or more senders per account" },
        { met: true, ru: "Вывод в течение 6 часов после последнего входящего", en: "Paid out within 6 hours of the last incoming transfer" },
        { met: true, ru: "Выводится больше 90 % входящих", en: "Over 90% of the incoming money paid out" },
      ],
      check: {
        ru: "Снятие наличных и входы в онлайн-банк по этим счетам: данных нет.",
        en: "Cash withdrawals and online-banking logins on these accounts: no data.",
      },
    },
    {
      id: "H3",
      risk: "medium",
      typology: { ru: "Круговые переводы", en: "Round-tripping" },
      roles: { "ACC-5501": "cycle", "ACC-5502": "cycle", "ACC-5503": "cycle", "ACC-1042": "cycle" },
      accounts: ["ACC-1042", "ACC-5501", "ACC-5502", "ACC-5503"],
      claim: {
        ru: "Цикл из четырёх счетов за 7 часов: ACC-1042 переводит 4 000 000 ₸ на ACC-5501[1], деньги проходят через ACC-5502[2] и ACC-5503[3] и возвращаются на ACC-1042[4] без 120 000 ₸.",
        en: "A four-account loop in 7 hours: ACC-1042 sends 4,000,000 ₸ to ACC-5501[1], the money passes through ACC-5502[2] and ACC-5503[3] and returns to ACC-1042[4] short of 120,000 ₸.",
      },
      footnotes: [["T-0016"], ["T-0017"], ["T-0018"], ["T-0019"]],
      signs: [
        { met: true, ru: "Цикл замыкается на исходном счёте", en: "The loop closes on the starting account" },
        { met: true, ru: "Весь цикл занимает меньше суток", en: "The whole loop takes less than a day" },
        { met: false, ru: "Похожие назначения платежей: данных нет", en: "Similar payment purposes: no data" },
      ],
      check: {
        ru: "Назначения платежей: возможен реальный договор поставки.",
        en: "Payment purposes: a real supply contract is possible.",
      },
    },
    {
      id: "H4",
      risk: "high",
      typology: { ru: "Вершина схемы", en: "Scheme apex" },
      roles: { "ACC-9001": "apex", "ACC-1042": "hub" },
      accounts: ["ACC-9001", "ACC-1042"],
      claim: {
        ru: "ACC-9001 получает от ACC-1042 6 500 000 ₸[1] и 4 300 000 ₸[2], а дальше переводит только 250 000 ₸[3].",
        en: "ACC-9001 receives 6,500,000 ₸[1] and 4,300,000 ₸[2] from ACC-1042 and passes on only 250,000 ₸[3].",
      },
      footnotes: [["T-0020"], ["T-0021"], ["T-0023"]],
      signs: [
        { met: true, ru: "Крупный приход из подозрительного подграфа", en: "A large inflow from the suspicious subgraph" },
        { met: true, ru: "Дальше почти ничего не уходит", en: "Almost nothing moves on" },
        { met: false, ru: "Связь владельца с ACC-1042: данных нет", en: "The owner's link to ACC-1042: no data" },
      ],
      check: {
        ru: "Бенефициарный владелец ACC-9001 и его связь с ACC-1042 не установлены.",
        en: "The beneficial owner of ACC-9001 and their link to ACC-1042 are not established.",
      },
    },
  ],

  // Apex ranking from rank_apex. The order is the tool's rank; the internal score is never shown.
  // Flow share: money from the suspicious subgraph that reached each candidate, over one shared denominator.
  apex: {
    candidates: [
      {
        account: "ACC-9001",
        inflow: 10800000,
        reason: {
          ru: "Конечная точка: из полученных 10 800 000 ₸[1] дальше ушло 250 000 ₸[2].",
          en: "End point: of 10,800,000 ₸ received[1], only 250,000 ₸ moved on[2].",
        },
        footnotes: [["T-0020", "T-0021"], ["T-0023"]],
      },
      {
        account: "ACC-1042",
        inflow: 15165000,
        reason: {
          ru: "Транзитный счёт: деньги от дроп-счетов[1] и из цикла[2] почти целиком уходят дальше.",
          en: "Transit account: the money from the drop accounts[1] and the loop[2] almost all moves on.",
        },
        footnotes: [["T-0013", "T-0014", "T-0015"], ["T-0019"]],
      },
      {
        account: "ACC-5503",
        inflow: 3920000,
        reason: {
          ru: "Звено цикла: возвращает деньги на ACC-1042[1].",
          en: "Loop member: sends the money back to ACC-1042[1].",
        },
        footnotes: [["T-0019"]],
      },
    ],
  },

  // Agent tool calls in order. ms is the measured time of the call.
  // reveal: what the graph learns; focus: accounts a step points at; hypothesis: the one the step produced.
  steps: [
    { tool: "get_alert", args: "ALR-2026-0417", ms: 120, reveal: "subject", focus: ["ACC-1042"],
      result: { ru: "Правило R-12, субъект ACC-1042, сумма 11 630 000 ₸", en: "Rule R-12, subject ACC-1042, amount 11,630,000 ₸" } },
    { tool: "account_profile", args: "ACC-1042", ms: 340, focus: ["ACC-1042"],
      result: { ru: "ТОО, счёт открыт 47 дней назад, входящий оборот за 7 дней 16 365 000 ₸", en: "LLP, opened 47 days ago, 7-day inflow 16,365,000 ₸" } },
    { tool: "neighborhood", args: "ACC-1042, depth=2", ms: 610, reveal: "all", focus: [],
      result: { ru: "18 счетов, 25 переводов", en: "18 accounts, 25 transfers" } },
    { tool: "detect_structuring", args: "threshold=1 000 000, window=72h", ms: 880, hypothesis: "H1",
      result: { ru: "12 переводов ниже порога, гипотеза H1", en: "12 transfers below the threshold, hypothesis H1" } },
    { tool: "detect_funnels", args: "min_in=3, hold<6h", ms: 920, hypothesis: "H2",
      result: { ru: "3 дроп-счета, гипотеза H2", en: "3 drop accounts, hypothesis H2" } },
    { tool: "find_cycles", args: "max_len=5, window=7d", ms: 1450, hypothesis: "H3",
      result: { ru: "1 цикл длиной 4, гипотеза H3", en: "1 loop of length 4, hypothesis H3" } },
    { tool: "rank_apex", args: "subgraph=H1∪H2∪H3", ms: 760, hypothesis: "H4", apex: true,
      result: { ru: "Лидер ACC-9001, гипотеза H4", en: "Leader ACC-9001, hypothesis H4" } },
    { tool: "compose_hypotheses", args: { ru: "4 кандидата", en: "4 candidates" }, ms: 9100, focus: [],
      result: { ru: "4 гипотезы, у каждой есть ссылки на переводы", en: "4 hypotheses, each cites its transfers" } },
  ],
};
