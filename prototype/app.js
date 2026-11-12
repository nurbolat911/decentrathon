// Investigation screen: replays the demo run, draws the transfer graph in SVG and keeps one selection
// in sync across the agent run, the graph, the transfers table, the apex ranking and the hypotheses.
(function () {
  "use strict";

  const C = window.CASE;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const NB = " ";
  const STORE = "redstring.demo." + C.alert.id;
  const ZMIN = 0.75;
  const ZMAX = 3;

  // ---------- Words ----------
  const T = {
    ru: {
      title: "Разбор алерта {id}, Redstring",
      skip: "К гипотезам",
      homeLabel: "Redstring, на главную",
      langLabel: "Язык",
      stop: "Остановить",
      restart: "Перезапустить",
      running: "Идёт разбор",
      runningDetail: ": шаг {n}, прошло {t}",
      stopped: "Частично: выполнено {n} {steps}",
      done: "Завершён: {n} {steps} за {t}",
      closed: "Разбор закрыт: принято {a}, отклонено {r}",
      stepDone: "Шаг {tool} выполнен: {result}",
      alertH: "Алерт",
      fRule: "Правило",
      fSubject: "Субъект",
      fAmount: "Сумма",
      fThreshold: "Порог",
      fScore: "Оценка правила",
      fCreated: "Создан",
      stepsH: "Ход агента",
      stepRunning: "идёт",
      stepStatusDone: "выполнен",
      stepsEmpty: "Агент начинает разбор.",
      stoppedTitle: "Разбор остановлен",
      stoppedText: "Выполнено шагов: {n}. Готовые гипотезы сохранены, по ним можно принимать решения. Остальные шаги даст перезапуск.",
      graphH: "Граф переводов",
      graphStats: "{a} {accounts}, {t} {transfers}",
      graphEmpty: "Счета появятся после шага neighborhood.",
      graphHint: "Те же данные есть в таблице переводов под графом. Клавиши: плюс и минус меняют масштаб, ноль вписывает граф, стрелки сдвигают его.",
      graphLabel: "Граф переводов",
      selNone: "Ничего не выбрано. Нажмите на гипотезу, шаг, сноску или перевод.",
      selHyp: "Выбрана гипотеза {id}, {name}",
      selFn: "Выбрана сноска {n} к гипотезе {id}",
      selApex: "Выбран кандидат {id} из рейтинга вершины",
      selApexFn: "Выбрана сноска {n} к кандидату {id}",
      selTx: "Выбран перевод {id}",
      selAcc: "Выбран счёт {id}",
      selStep: "Выбран шаг {tool}",
      clear: "Снять выбор",
      hideCtx: "Скрыть контекст",
      showCtx: "Показать контекст",
      hiddenN: "скрыто {n} {accounts}",
      zoomIn: "Приблизить",
      zoomOut: "Отдалить",
      fit: "Вписать",
      alertTag: "алерт",
      rejectedEdge: "Отклонена",
      roleH: "Роль, форма",
      riskH: "Риск, обводка",
      edgeH: "Сумма по ребру, толщина",
      lineH: "Линия",
      edgeThin: "меньше {a}",
      edgeMid: "от {a} до {b}",
      edgeThick: "от {b}",
      edgeNote: "Тонкое ребро не значит маловажное: переводы ниже порога и есть дробление.",
      lineSolid: "перевод в гипотезе",
      lineDashed: "контекст",
      axisRoles: "По горизонтали этапы схемы, от отправителей к вершине. Расстояние по вертикали ничего не значит.",
      axisDirection: "По горизонтали направление переводов, от отправителей к получателям. Расстояние по вертикали ничего не значит.",
      transfersH: "Переводы",
      colTx: "Перевод",
      colFrom: "Откуда",
      colTo: "Куда",
      colAmount: "Сумма",
      colTime: "Время",
      colHyps: "Гипотезы",
      ctxWord: "контекст",
      transfersEmpty: "Переводы появятся после шага neighborhood.",
      apexH: "Вершина схемы",
      apexPending: "Рейтинг появится после шага rank_apex.",
      apexStopped: "Рейтинг не построен: разбор остановлен до шага rank_apex.",
      shareLabel: "Доля потока",
      keptLabel: "Осталось на счёте",
      panHint: "Граф шире экрана: двигайте его пальцем или мышью, масштаб кнопками выше. Те же переводы в таблице ниже.",
      showOnGraph: "Показать на графе",
      tableHint: "Таблица шире экрана, листайте её вбок.",
      rankLabel: "Место {n}",
      apexNote: "Доля потока: часть денег из подозрительного подграфа, пришедшая на счёт, знаменатель общий для трёх счетов. Порядок идёт по тому, сколько денег на счёте осталось: вершина схемы там, где они оседают.",
      hypsH: "Гипотезы",
      hypsEmpty: "Гипотезы появятся по ходу разбора.",
      basis: "Основание",
      strong: "Сильное",
      partial: "Частичное",
      weak: "Слабое",
      basisCount: "{m} из {n} {signs}",
      signsH: "Признаки",
      signMet: "сработал",
      signNotMet: "не сработал",
      fnNum: "№",
      fnCaption: "Улики к гипотезе {id}",
      fnCaptionApex: "Улики к кандидату {id}",
      fnAria: "Сноска {n}",
      check: "Проверить вручную",
      accept: "Принять",
      reject: "Отклонить",
      decisionNone: "Решения нет",
      decisionAccepted: "Принята",
      decisionRejected: "Отклонена",
      closedLine: "Принято {a}, отклонено {r}",
      panelClose: "Закрыть панель счёта",
      pKind: "Тип",
      pRole: "Роль",
      pRisk: "Риск",
      pIn: "Входящие",
      pOut: "Исходящие",
      pHyps: "Гипотезы",
      pRank: "Рейтинг вершины",
      pSubject: "Субъект алерта",
      pNone: "нет",
      txCount: "{n} {transfers}, {sum}",
      confirmTitle: "Перезапустить разбор?",
      confirmText: "Решения по {n} {hypsDat} будут потеряны.",
      cancel: "Отменить",
      kinds: { person: "Физическое лицо", llp: "ТОО", sole: "ИП" },
      roles: { sender: "Отправитель", drop: "Дроп-счёт", hub: "Концентратор", cycle: "Звено цикла", apex: "Вершина схемы", context: "Контекст", member: "Роль не определена", none: "Роль не определена" },
      risks: { high: "Высокий", medium: "Средний", low: "Низкий", lowOrNone: "Низкий или не оценён", unrated: "Не оценён" },
      w: {
        steps: ["шаг", "шага", "шагов"],
        accounts: ["счёт", "счёта", "счетов"],
        transfers: ["перевод", "перевода", "переводов"],
        hypsDat: ["гипотезе", "гипотезам", "гипотезам"],
        signs: ["признака", "признаков", "признаков"],
      },
    },
    en: {
      title: "Alert {id} investigation, Redstring",
      skip: "Skip to hypotheses",
      homeLabel: "Redstring, home page",
      langLabel: "Language",
      stop: "Stop",
      restart: "Restart",
      running: "Running",
      runningDetail: ": step {n}, {t} elapsed",
      stopped: "Partial: {n} {steps} done",
      done: "Done: {n} {steps} in {t}",
      closed: "Closed: {a} accepted, {r} rejected",
      stepDone: "Step {tool} done: {result}",
      alertH: "Alert",
      fRule: "Rule",
      fSubject: "Subject",
      fAmount: "Amount",
      fThreshold: "Threshold",
      fScore: "Rule score",
      fCreated: "Created",
      stepsH: "Agent run",
      stepRunning: "running",
      stepStatusDone: "done",
      stepsEmpty: "The agent is starting.",
      stoppedTitle: "Run stopped",
      stoppedText: "Steps done: {n}. Ready hypotheses are kept, and you can decide on them. Restart the run for the remaining steps.",
      graphH: "Transfer graph",
      graphStats: "{a} {accounts}, {t} {transfers}",
      graphEmpty: "Accounts appear after the neighborhood step.",
      graphHint: "The transfers table below the graph holds the same data. Keys: plus and minus zoom, zero fits the graph, the arrows pan it.",
      graphLabel: "Transfer graph",
      selNone: "Nothing selected. Pick a hypothesis, a step, a footnote or a transfer.",
      selHyp: "Hypothesis {id} selected, {name}",
      selFn: "Footnote {n} of hypothesis {id} selected",
      selApex: "Apex candidate {id} selected",
      selApexFn: "Footnote {n} of candidate {id} selected",
      selTx: "Transfer {id} selected",
      selAcc: "Account {id} selected",
      selStep: "Step {tool} selected",
      clear: "Clear selection",
      hideCtx: "Hide context",
      showCtx: "Show context",
      hiddenN: "{n} {accounts} hidden",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fit: "Fit",
      alertTag: "alert",
      rejectedEdge: "Rejected",
      roleH: "Role, shape",
      riskH: "Risk, outline",
      edgeH: "Amount on the edge, width",
      lineH: "Line",
      edgeThin: "under {a}",
      edgeMid: "{a} to {b}",
      edgeThick: "{b} and over",
      edgeNote: "A thin edge is not a minor one: transfers below the threshold are what structuring looks like.",
      lineSolid: "transfer in a hypothesis",
      lineDashed: "context",
      axisRoles: "Left to right: the stages of the scheme, from senders to the apex. Vertical distance means nothing.",
      axisDirection: "Left to right: the direction of the transfers, from senders to receivers. Vertical distance means nothing.",
      transfersH: "Transfers",
      colTx: "Transfer",
      colFrom: "From",
      colTo: "To",
      colAmount: "Amount",
      colTime: "Time",
      colHyps: "Hypotheses",
      ctxWord: "context",
      transfersEmpty: "Transfers appear after the neighborhood step.",
      apexH: "Scheme apex",
      apexPending: "The ranking appears after the rank_apex step.",
      apexStopped: "No ranking: the run stopped before the rank_apex step.",
      shareLabel: "Flow share",
      keptLabel: "Kept on the account",
      panHint: "The graph is wider than the screen: drag it, zoom with the buttons above. The table below holds the same transfers.",
      showOnGraph: "Show on the graph",
      tableHint: "The table is wider than the screen; scroll it sideways.",
      rankLabel: "Rank {n}",
      apexNote: "Flow share: the part of the money from the suspicious subgraph that reached the account, over one denominator for all three. The order follows how much of the money stays: the apex is where it settles.",
      hypsH: "Hypotheses",
      hypsEmpty: "Hypotheses appear as the run goes.",
      basis: "Basis",
      strong: "Strong",
      partial: "Partial",
      weak: "Weak",
      basisCount: "{m} of {n} {signs}",
      signsH: "Signs",
      signMet: "met",
      signNotMet: "not met",
      fnNum: "#",
      fnCaption: "Evidence for hypothesis {id}",
      fnCaptionApex: "Evidence for candidate {id}",
      fnAria: "Footnote {n}",
      check: "Check by hand",
      accept: "Accept",
      reject: "Reject",
      decisionNone: "No decision",
      decisionAccepted: "Accepted",
      decisionRejected: "Rejected",
      closedLine: "{a} accepted, {r} rejected",
      panelClose: "Close the account panel",
      pKind: "Type",
      pRole: "Role",
      pRisk: "Risk",
      pIn: "Incoming",
      pOut: "Outgoing",
      pHyps: "Hypotheses",
      pRank: "Apex rank",
      pSubject: "Alert subject",
      pNone: "none",
      txCount: "{n} {transfers}, {sum}",
      confirmTitle: "Restart the run?",
      confirmText: "Your decisions on {n} {hypsDat} will be lost.",
      cancel: "Cancel",
      kinds: { person: "Individual", llp: "LLP", sole: "Sole proprietor" },
      roles: { sender: "Sender", drop: "Drop account", hub: "Hub", cycle: "Loop member", apex: "Scheme apex", context: "Context", member: "No role yet", none: "No role yet" },
      risks: { high: "High", medium: "Medium", low: "Low", lowOrNone: "Low or not rated", unrated: "Not rated" },
      w: {
        steps: ["step", "steps"],
        accounts: ["account", "accounts"],
        transfers: ["transfer", "transfers"],
        hypsDat: ["hypothesis", "hypotheses"],
        signs: ["sign", "signs"],
      },
    },
  };

  // ---------- State ----------
  const ACC = Object.fromEntries(C.accounts.map((a) => [a.id, a]));
  const TX = Object.fromEntries(C.transactions.map((t) => [t.id, t]));
  const HYP = Object.fromEntries(C.hypotheses.map((h) => [h.id, h]));
  const APEX = Object.fromEntries(C.apex.candidates.map((c) => [c.account, c]));
  const PRIORITY = ["apex", "hub", "drop", "cycle", "sender"];
  const RISK_RANK = { medium: 1, high: 2 };
  const RISK_ICON = { high: "i-triangle-alert", medium: "i-circle-alert", low: "i-circle-minus" };

  const params = new URLSearchParams(location.search);
  const state = {
    lang: pickLang(),
    done: 0,
    status: "running",
    startedAt: 0,
    elapsed: 0,
    timer: 0,
    ticker: 0,
    decisions: {},
    sel: null,
    peek: null,
    sort: { key: "time", dir: 1 },
    hideContext: false,
    panel: null,
    panelOpener: null,
  };
  const view = { k: 1, x: 0, y: 0, manual: false, revealed: "" };

  function pickLang() {
    const q = params.get("lang");
    if (q === "ru" || q === "en") return q;
    try {
      const s = localStorage.getItem("redstring.lang");
      if (s === "ru" || s === "en") return s;
    } catch (_) {}
    return "ru";
  }

  const L = () => T[state.lang];
  function t(key, vars) {
    const s = L()[key] ?? T.ru[key] ?? key;
    return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m)) : s;
  }
  function plural(n, key) {
    const f = L().w[key];
    if (state.lang === "en") return n === 1 ? f[0] : f[1];
    const a = n % 10;
    const b = n % 100;
    if (a === 1 && b !== 11) return f[0];
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return f[1];
    return f[2];
  }
  const tr = (o) => (o && typeof o === "object" ? o[state.lang] ?? o.ru : o);

  // ---------- Formatting ----------
  const pad = (n) => String(n).padStart(2, "0");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtNum = (n) => (state.lang === "ru" ? n.toLocaleString("ru-RU").replace(/\s/g, NB) : n.toLocaleString("en-US"));
  const money = (n) => fmtNum(n) + NB + "₸";
  function when(iso) {
    const [d, tm] = iso.split("T");
    const [, m, dd] = d.split("-").map(Number);
    return state.lang === "ru" ? `${pad(dd)}.${pad(m)} ${tm}` : `${MONTHS[m - 1]}${NB}${dd}, ${tm}`;
  }
  function dur(ms) {
    if (ms < 1000) return ms + NB + (state.lang === "ru" ? "мс" : "ms");
    const s = (Math.round(ms / 100) / 10).toFixed(1);
    return (state.lang === "ru" ? s.replace(".", ",") : s) + NB + (state.lang === "ru" ? "с" : "s");
  }
  const clock = (ms) => `${pad(Math.floor(ms / 60000))}:${pad(Math.floor(ms / 1000) % 60)}`;
  const pct = (x) => Math.round(x * 100) + (state.lang === "ru" ? NB : "") + "%";
  const icon = (id, cls) => `<svg class="icon${cls ? " " + cls : ""}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const idSpan = (s) => `<span class="id">${esc(s)}</span>`;
  const accButton = (id) => `<button type="button" class="link-id" data-acc="${id}">${id}</button>`;

  function riskLabel(level) {
    if (!level) return `<span class="unrated">${esc(L().risks.unrated)}</span>`;
    return `<span class="risk risk-${level}">${icon(RISK_ICON[level])}${esc(L().risks[level])}</span>`;
  }

  // Plain text to HTML: ids set in the id face, [n] turned into footnote links of the block.
  function rich(text, kind, owner) {
    const glued = String(text).replace(/(\d) (?=\d{3}(?!\d))/g, "$1" + NB).replace(/(\d) (?=[₸%])/g, "$1" + NB);
    return esc(glued)
      .replace(/\b(ACC-\d{4}|T-\d{4})\b/g, '<span class="id">$1</span>')
      .replace(/\[(\d+)\]/g, (m, n) => `<sup><a class="fn-mark" href="#${fnAnchor(kind, owner, n)}" data-kind="${kind}" data-owner="${owner}" data-fn="${n}" aria-label="${esc(t("fnAria", { n }))}">${n}</a></sup>`);
  }
  const fnAnchor = (kind, owner, n) => `fn-${kind}-${owner}-${n}`;

  // ---------- Model ----------
  function model() {
    const steps = C.steps.slice(0, state.done);
    const hyps = steps.filter((s) => s.hypothesis).map((s) => HYP[s.hypothesis]);
    const all = steps.some((s) => s.reveal === "all");
    const subject = all || steps.some((s) => s.reveal === "subject");
    const role = {};
    const risk = {};
    const member = new Set();
    const txHyps = {};
    for (const h of hyps) {
      for (const [id, r] of Object.entries(h.roles)) {
        if (!role[id] || PRIORITY.indexOf(r) < PRIORITY.indexOf(role[id])) role[id] = r;
      }
      for (const id of h.accounts) {
        member.add(id);
        if (!risk[id] || RISK_RANK[h.risk] > RISK_RANK[risk[id]]) risk[id] = h.risk;
      }
      for (const id of h.footnotes.flat()) (txHyps[id] ||= []).includes(h.id) || txHyps[id].push(h.id);
    }
    return {
      hyps,
      any: hyps.length > 0,
      accounts: all ? C.accounts.map((a) => a.id) : subject ? [C.alert.subject] : [],
      txs: all ? C.transactions : [],
      role,
      risk,
      member,
      txHyps,
      apex: steps.some((s) => s.apex),
    };
  }

  const isContext = (id, m) => m.any && !m.member.has(id) && !ACC[id].alert;
  function roleOf(id, m) {
    if (!m.any) return "none";
    if (m.role[id]) return m.role[id];
    return isContext(id, m) ? "context" : "member";
  }
  const SHAPE = { sender: "circle", drop: "diamond", hub: "rsquare", cycle: "hexagon", apex: "star", context: "circle", member: "circle", none: "circle" };
  function sizeOf(id, m) {
    const r = roleOf(id, m);
    if (r === "apex") return 36;
    if (r === "context") return 14;
    return 24;
  }
  function visibleAccounts(m) {
    return m.accounts.filter((id) => !(state.hideContext && isContext(id, m)));
  }

  // One selection for the whole screen; a hover or focus on a footnote previews its transfers.
  function highlight(m) {
    const src = state.peek || state.sel;
    if (!src) return null;
    let txs = [];
    const accs = [];
    let labels = false;
    let ring = null;
    let hyp = null;
    if (src.kind === "hyp") {
      const h = HYP[src.id];
      txs = src.fn ? h.footnotes[src.fn - 1] : h.footnotes.flat();
      if (!src.fn) accs.push(...h.accounts);
      labels = true;
      hyp = h.id;
    } else if (src.kind === "apex") {
      const c = APEX[src.id];
      txs = src.fn ? c.footnotes[src.fn - 1] : c.footnotes.flat();
      accs.push(src.id);
      ring = src.id;
      labels = true;
    } else if (src.kind === "tx") {
      txs = [src.id];
      labels = true;
    } else if (src.kind === "acc") {
      accs.push(src.id);
      ring = src.id;
      txs = m.txs.filter((x) => x.from === src.id || x.to === src.id).map((x) => x.id);
    } else if (src.kind === "step") {
      // A step lights what it returned: its accounts, the whole neighbourhood, or every cited transfer.
      const st = C.steps[src.id];
      const focus = st.focus || [];
      accs.push(...focus);
      if (focus.length) txs = m.txs.filter((x) => focus.includes(x.from) || focus.includes(x.to)).map((x) => x.id);
      else if (st.reveal === "all") txs = m.txs.map((x) => x.id);
      else txs = m.hyps.flatMap((h) => h.footnotes.flat());
    }
    for (const id of txs) accs.push(TX[id].from, TX[id].to);
    if (!txs.length && !accs.length) return null;
    return { txs: new Set(txs), accs: new Set(accs), labels, ring, hyp };
  }

  // ---------- Run replay ----------
  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ finished: state.status === "done", elapsed: state.elapsed, decisions: state.decisions }));
    } catch (_) {}
  }
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "null");
    } catch (_) {
      return null;
    }
  }

  function startRun() {
    clearTimeout(state.timer);
    clearInterval(state.ticker);
    Object.assign(state, { done: 0, status: "running", startedAt: performance.now(), elapsed: 0, decisions: {}, sel: null, peek: null, panel: null });
    view.manual = false;
    view.revealed = "";
    save();
    state.ticker = setInterval(renderStatus, 1000);
    renderAll();
    schedule();
  }

  function schedule() {
    const step = C.steps[state.done];
    state.timer = setTimeout(() => {
      state.done += 1;
      announce(t("stepDone", { tool: step.tool, result: tr(step.result) }));
      if (state.done >= C.steps.length) finish();
      else schedule();
      renderAll();
    }, step.ms);
  }

  function finish() {
    clearInterval(state.ticker);
    state.status = "done";
    state.elapsed = C.steps.reduce((s, x) => s + x.ms, 0);
    save();
  }

  function stopRun() {
    if (state.status !== "running") return;
    clearTimeout(state.timer);
    clearInterval(state.ticker);
    state.status = "stopped";
    state.elapsed = performance.now() - state.startedAt;
    renderAll();
  }

  function requestRestart() {
    const n = Object.keys(state.decisions).length;
    if (!n) return startRun();
    const dlg = $("confirm");
    $("confirm-title").textContent = t("confirmTitle");
    $("confirm-text").textContent = t("confirmText", { n, hypsDat: plural(n, "hypsDat") });
    $("confirm-cancel").textContent = t("cancel");
    $("confirm-ok").textContent = t("restart");
    if (typeof dlg.showModal === "function") dlg.showModal();
    else if (window.confirm(t("confirmText", { n, hypsDat: plural(n, "hypsDat") }))) startRun();
  }

  function announce(text) {
    $("announcer").textContent = text;
  }

  // ---------- Rendering ----------
  function renderAll() {
    const m = model();
    renderStatic();
    renderStatus();
    renderAlert();
    renderNotice();
    renderSteps(m);
    renderSelection(m);
    renderGraph(m);
    renderLegend(m);
    renderTable(m);
    renderApex(m);
    renderHypotheses(m);
    renderPanel(m);
  }

  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.title = t("title", { id: C.alert.id });
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
    $("home-link").href = state.lang === "en" ? "en.html" : "index.html";
    document.querySelectorAll(".lang a").forEach((a) => {
      if (a.dataset.lang === state.lang) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    const tips = { "btn-clear": "clear", "btn-zoom-in": "zoomIn", "btn-zoom-out": "zoomOut", "btn-fit": "fit" };
    for (const [id, key] of Object.entries(tips)) {
      $(id).setAttribute("aria-label", t(key));
      $(id).dataset.tip = t(key);
    }
    const ctx = $("btn-context");
    ctx.setAttribute("aria-label", t("hideCtx"));
    ctx.setAttribute("aria-pressed", String(state.hideContext));
    ctx.dataset.tip = t("hideCtx");
    $("graph").setAttribute("aria-label", t("graphLabel"));
    $("graph-hint").textContent = t("graphHint");
    $("btn-stop").disabled = state.status !== "running";
  }

  function renderStatus() {
    const box = $("run-status");
    const decided = Object.keys(state.decisions).length;
    const closed = state.status === "done" && decided === C.hypotheses.length;
    let live;
    let detail = "";
    let ic = "i-clock";
    if (state.status === "running") {
      live = t("running");
      detail = t("runningDetail", { n: state.done + 1, t: clock(performance.now() - state.startedAt) });
    } else if (state.status === "stopped") {
      live = t("stopped", { n: state.done, steps: plural(state.done, "steps") });
      ic = "i-info";
    } else if (closed) {
      const a = Object.values(state.decisions).filter((d) => d === "accepted").length;
      live = t("closed", { a, r: decided - a });
      ic = "i-check";
    } else {
      live = t("done", { n: C.steps.length, steps: plural(C.steps.length, "steps"), t: dur(state.elapsed) });
      ic = "i-circle-check";
    }
    box.dataset.state = closed ? "closed" : state.status;
    box.querySelector("use").setAttribute("href", "#" + ic);
    if ($("run-live").textContent !== live) $("run-live").textContent = live;
    $("run-detail").textContent = detail;
  }

  function renderAlert() {
    const a = C.alert;
    const pair = (k, v, cls) => `<div class="pair${cls ? " " + cls : ""}"><dt>${esc(t(k))}</dt><dd>${v}</dd></div>`;
    $("alert").innerHTML =
      pair("fRule", rich(tr(a.rule), "alert", "rule"), "pair-wide") +
      pair("fSubject", accButton(a.subject)) +
      pair("fAmount", `<span class="num figure">${money(a.amount)}</span>`) +
      pair("fThreshold", `<span class="num">${money(C.threshold)}</span>`) +
      pair("fScore", `<span class="num">${state.lang === "ru" ? a.ruleScore.replace(".", ",") : a.ruleScore}</span>`) +
      pair("fCreated", `<span class="num">${when(a.createdAt)}</span>`);
  }

  function renderNotice() {
    const box = $("notice");
    box.hidden = state.status !== "stopped";
    if (box.hidden) return;
    box.innerHTML = `${icon("i-info", "notice-icon")}<div class="notice-body"><p class="notice-title">${esc(t("stoppedTitle"))}</p><p>${esc(t("stoppedText", { n: state.done }))}</p><button class="btn" type="button" data-action="restart">${icon("i-rotate-ccw")}<span>${esc(t("restart"))}</span></button></div>`;
  }

  function stepSelected(i) {
    const s = state.sel;
    if (!s) return false;
    if (s.kind === "step") return s.id === i;
    if (s.kind === "hyp") return C.steps[i].hypothesis === s.id;
    return false;
  }

  function renderSteps() {
    const rows = C.steps.slice(0, state.done).map((s, i) => {
      const on = stepSelected(i);
      return `<li class="step${on ? " is-selected" : ""}">
        <div class="step-row" data-step-row="${i}">
          <span class="step-mark">${icon("i-circle-check", "ok")}<span class="visually-hidden">${esc(t("stepStatusDone"))}</span></span>
          <button type="button" class="step-tool id" data-step="${i}" aria-pressed="${on}">${esc(s.tool)}</button>
          <span class="step-time num">${dur(s.ms)}</span>
          <span class="step-args id">${esc(tr(s.args))}</span>
          <span class="step-result">${rich(tr(s.result), "step", i)}</span>
        </div>
      </li>`;
    });
    if (state.status === "running" && state.done < C.steps.length) {
      const s = C.steps[state.done];
      rows.push(`<li class="step is-running">
        <div class="step-row">
          <span class="step-mark">${icon("i-clock")}</span>
          <span class="step-tool id">${esc(s.tool)}</span>
          <span class="step-time">${esc(t("stepRunning"))}</span>
          <span class="step-args id">${esc(tr(s.args))}</span>
        </div>
      </li>`);
    }
    $("steps").innerHTML = rows.join("") || `<li class="empty">${esc(t("stepsEmpty"))}</li>`;
  }

  function renderSelection(m) {
    const s = state.sel;
    let text = t("selNone");
    if (s) {
      if (s.kind === "hyp") text = s.fn ? t("selFn", { n: s.fn, id: s.id }) : t("selHyp", { id: s.id, name: tr(HYP[s.id].typology) });
      else if (s.kind === "apex") text = s.fn ? t("selApexFn", { n: s.fn, id: s.id }) : t("selApex", { id: s.id });
      else if (s.kind === "tx") text = t("selTx", { id: s.id });
      else if (s.kind === "acc") text = t("selAcc", { id: s.id });
      else if (s.kind === "step") text = t("selStep", { tool: C.steps[s.id].tool });
    }
    $("selection").innerHTML = rich(text, "sel", "x");
    $("selection").classList.toggle("is-empty", !s);
    $("btn-clear").disabled = !s;
    const shown = visibleAccounts(m).length;
    const hidden = m.accounts.length - shown;
    let stats = t("graphStats", { a: shown, accounts: plural(shown, "accounts"), t: m.txs.length, transfers: plural(m.txs.length, "transfers") });
    if (hidden > 0) stats += ", " + t("hiddenN", { n: hidden, accounts: plural(hidden, "accounts") });
    $("graph-stats").textContent = m.accounts.length ? stats : "";
    $("btn-context").disabled = !m.any;
  }

  // ---------- Graph ----------
  const canvas = $("graph");
  const svg = $("graph-svg");
  const labelsEl = $("graph-labels");
  let lastModel = null;

  function fit(m) {
    const ids = visibleAccounts(m);
    if (!ids.length) return;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const pad = 28;
    const xs = ids.map((id) => ACC[id].x);
    const ys = ids.map((id) => ACC[id].y);
    const minX = Math.min(...xs) - 24;
    const maxX = Math.max(...xs) + 24;
    const minY = Math.min(...ys) - 24;
    const maxY = Math.max(...ys) + 44;
    const want = Math.min((W - 2 * pad) / (maxX - minX), (H - 2 * pad) / (maxY - minY));
    const k = Math.max(ZMIN, Math.min(want, 1.25, ZMAX));
    view.k = k;
    view.x = W / 2 - (k * (minX + maxX)) / 2;
    view.y = H / 2 - (k * (minY + maxY)) / 2;
    // The minimum zoom is a legibility floor, so a narrow canvas pans instead of shrinking the graph.
    // Then the view starts on what matters: the current selection, or the alert subject.
    view.overflow = want < ZMIN;
    if (view.overflow) {
      const hl = highlight(m);
      const focus = hl ? [...hl.accs].filter((id) => ids.includes(id)) : [];
      centreOn(focus.length ? focus : [C.alert.subject], W, H);
    }
  }

  function centreOn(ids, W = canvas.clientWidth, H = canvas.clientHeight) {
    const xs = ids.map((id) => ACC[id].x);
    const ys = ids.map((id) => ACC[id].y);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    view.x = W / 2 - view.k * cx;
    if ((Math.max(...ys) - Math.min(...ys) + 68) * view.k > H) view.y = H / 2 - view.k * cy;
  }

  // Narrow screens: the graph sits far above the hypotheses, so the selected one offers a jump to it.
  function showOnGraph() {
    const m = lastModel;
    const hl = m && highlight(m);
    if (hl) {
      centreOn([...hl.accs].filter((id) => m.accounts.includes(id)));
      view.manual = true;
      drawGraph();
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    $("graph").scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    $("graph").focus({ preventScroll: true });
  }

  // Polygons in screen space; s is the node size in pixels at the current zoom.
  function shapePath(shape, cx, cy, s) {
    const h = s / 2;
    const f = (n) => Math.round(n * 10) / 10;
    if (shape === "circle") return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(h)}"/>`;
    if (shape === "rsquare") {
      const q = h * 0.9;
      return `<rect x="${f(cx - q)}" y="${f(cy - q)}" width="${f(2 * q)}" height="${f(2 * q)}" rx="${f(Math.max(2, q * 0.35))}"/>`;
    }
    let pts = [];
    if (shape === "diamond") {
      const d = h * 1.25;
      pts = [[cx, cy - d], [cx + d, cy], [cx, cy + d], [cx - d, cy]];
    } else if (shape === "hexagon") {
      const R = h * 1.12;
      for (let i = 0; i < 6; i++) pts.push([cx + R * Math.cos((Math.PI / 3) * i), cy + R * Math.sin((Math.PI / 3) * i)]);
    } else if (shape === "star") {
      const R = h * 1.15;
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? R * 0.48 : R;
        const a = -Math.PI / 2 + (Math.PI / 5) * i;
        pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
    }
    return `<polygon points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(" ")}"/>`;
  }
  const REACH = { circle: 1, rsquare: 1.15, diamond: 1.2, hexagon: 1.1, star: 1.05 };

  function nodeGeometry(m) {
    const geo = {};
    for (const id of visibleAccounts(m)) {
      const a = ACC[id];
      const role = roleOf(id, m);
      const shape = SHAPE[role];
      const s = sizeOf(id, m) * view.k;
      geo[id] = { cx: a.x * view.k + view.x, cy: a.y * view.k + view.y, shape, s, r: (s / 2) * REACH[shape] };
    }
    return geo;
  }

  function renderGraph(m) {
    lastModel = m;
    const empty = !m.accounts.length;
    $("graph-empty").hidden = !empty;
    $("graph-empty").textContent = t("graphEmpty");
    const stage = m.txs.length ? "all" : m.accounts.length ? "subject" : "";
    if (stage !== view.revealed) {
      view.revealed = stage;
      view.manual = false;
    }
    if (!view.manual) fit(m);
    $("graph-pan").hidden = !view.overflow || !m.accounts.length;
    $("graph-pan").textContent = t("panHint");
    $("table-hint").textContent = t("tableHint");
    drawGraph();
  }

  // Real label widths, so a label sits right at its edge; the estimate covers the time before fonts load.
  const ruler = document.createElement("canvas").getContext("2d");
  function textWidth(text, isId) {
    if (!ruler) return text.length * (isId ? 7.8 : 6.6);
    const cs = getComputedStyle(document.documentElement);
    ruler.font = `13px ${cs.getPropertyValue(isId ? "--font-id" : "--font-sans")}`;
    return ruler.measureText(text).width;
  }

  function drawGraph() {
    const m = lastModel;
    if (!m) return;
    const hl = highlight(m);
    const geo = nodeGeometry(m);
    const f = (n) => Math.round(n * 10) / 10;
    const pairs = new Map();
    for (const x of m.txs) {
      if (!geo[x.from] || !geo[x.to]) continue;
      const key = x.from + ">" + x.to;
      if (!pairs.has(key)) pairs.set(key, { from: x.from, to: x.to, txs: [] });
      pairs.get(key).txs.push(x);
    }
    // Edge labels keep clear of nodes, node labels, other selected edges and each other.
    const boxes = [];
    for (const [id, g] of Object.entries(geo)) {
      boxes.push({ x: g.cx - g.r - 2, y: g.cy - g.r - 2, w: 2 * g.r + 4, h: 2 * g.r + 4, cost: 3 });
      const lw = ACC[id].alert ? 46 : 40;
      boxes.push({ x: g.cx - lw / 2, y: g.cy + g.r + 2, w: lw, h: ACC[id].alert ? 36 : 20, cost: 3 });
    }
    const hotSegs = [];
    const wanted = [];
    let back = "";
    let front = "";
    let labels = "";
    const rejected = hl && hl.hyp && state.decisions[hl.hyp] === "rejected";

    for (const p of pairs.values()) {
      const a = geo[p.from];
      const b = geo[p.to];
      const sum = p.txs.reduce((s, x) => s + x.amount, 0);
      const w = sum < C.threshold ? 1 : sum < 5 * C.threshold ? 2 : 4;
      const hotTx = hl ? p.txs.filter((x) => hl.txs.has(x.id)) : [];
      const hot = hotTx.length > 0;
      const dim = !!hl && !hot;
      const inHyp = !m.any || p.txs.some((x) => m.txHyps[x.id]);
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const sx = a.cx + ux * (a.r + 3);
      const sy = a.cy + uy * (a.r + 3);
      const tx = b.cx - ux * (b.r + 4);
      const ty = b.cy - uy * (b.r + 4);
      const al = 6 + w * 1.5;
      const bx = tx - ux * al;
      const by = ty - uy * al;
      const hw = al * 0.45;
      const cls = `g-e${hot ? " is-hot" : ""}${dim ? " is-dim" : ""}${inHyp ? "" : " is-context"}`;
      const dash = inHyp ? "" : ' stroke-dasharray="5 4"';
      const markup = `<g class="${cls}" data-edge="${p.from}>${p.to}"><line x1="${f(sx)}" y1="${f(sy)}" x2="${f(bx)}" y2="${f(by)}" stroke-width="${w}"${dash}/><polygon points="${f(tx)},${f(ty)} ${f(bx - uy * hw)},${f(by + ux * hw)} ${f(bx + uy * hw)},${f(by - ux * hw)}"/></g>`;
      if (hot) front += markup;
      else back += markup;

      const key = p.from + ">" + p.to;
      hotSegs.push({ key, hot, sx, sy, ex: tx, ey: ty });
      if (hot && hl.labels) {
        const lines = hotTx.length === 1 ? [hotTx[0].id, money(hotTx[0].amount)] : ["×" + hotTx.length, money(hotTx.reduce((s, x) => s + x.amount, 0))];
        if (rejected) lines.push(t("rejectedEdge"));
        wanted.push({ key, lines, sx, sy, ex: bx, ey: by, ux, uy, len: Math.hypot(bx - sx, by - sy) });
      }
    }

    // Each label goes on its own edge where there is room and right beside it where there is not.
    // A label is never dropped: with no free spot it takes the least crowded one.
    const hits = (b, o) => b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h;
    const crosses = (b, g) => {
      const n = Math.max(2, Math.ceil(Math.hypot(g.ex - g.sx, g.ey - g.sy) / 5));
      for (let i = 0; i <= n; i++) {
        const x = g.sx + ((g.ex - g.sx) * i) / n;
        const y = g.sy + ((g.ey - g.sy) * i) / n;
        if (x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h) return true;
      }
      return false;
    };
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    // Labels lean away from the middle of the selected edges, so the inside of a loop stays clear.
    const mid = wanted.reduce((c, L) => ({ x: c.x + (L.sx + L.ex) / 2 / wanted.length, y: c.y + (L.sy + L.ey) / 2 / wanted.length }), { x: 0, y: 0 });
    wanted.sort((a, b) => a.len - b.len);
    for (const L of wanted) {
      const bw = Math.max(...L.lines.map((l, i) => textWidth(l, i === 0 && l.startsWith("T-")))) + 8;
      const bh = L.lines.length * 17;
      const side = Math.abs(L.uy) * (bw / 2) + Math.abs(L.ux) * (bh / 2) + 4;
      const covers = Math.abs(L.ux) * bw + Math.abs(L.uy) * bh > 0.85 * L.len;
      const out = ((L.sx + L.ex) / 2 - mid.x) * -L.uy + ((L.sy + L.ey) / 2 - mid.y) * L.ux >= 0 ? side : -side;
      let best = null;
      search: for (const off of [0, out, -out]) {
        for (const at of [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.2, 0.8]) {
          const lx = L.sx + (L.ex - L.sx) * at - L.uy * off;
          const ly = L.sy + (L.ey - L.sy) * at + L.ux * off;
          const box = { x: lx - bw / 2, y: ly - bh / 2, w: bw, h: bh };
          let cost = off === 0 ? (covers ? 1 : 0) : off === out ? 0.5 : 1.5;
          for (const o of boxes) if (hits(box, o)) cost += o.cost;
          for (const g of hotSegs) if (g.key !== L.key && crosses(box, g)) cost += g.hot ? 2 : 1;
          if (box.x < 0 || box.y < 0 || box.x + bw > cw || box.y + bh > ch) cost += 5;
          if (!best || cost < best.cost) best = { cost, lx, ly, box };
          if (cost === 0) break search;
        }
      }
      boxes.push({ ...best.box, cost: 4 });
      const first = L.lines[0].startsWith("T-") ? `<span class="id">${esc(L.lines[0])}</span>` : `<span class="num">${esc(L.lines[0])}</span>`;
      const rest = L.lines.slice(1).map((l, i) => `<span class="${i === 0 ? "num" : "edge-flag"}">${esc(l)}</span>`).join("");
      labels += `<span class="g-edge-label" data-edge="${L.key}" style="left:${f(best.lx)}px;top:${f(best.ly)}px">${first}${rest}</span>`;
    }

    let nodes = "";
    for (const [id, g] of Object.entries(geo)) {
      const risk = m.risk[id];
      const dim = !!hl && !hl.accs.has(id);
      const k = view.k;
      const sw = risk === "high" ? 4 * k : risk === "medium" ? 2 * k : Math.max(1, k);
      const dash = risk === "medium" ? ` stroke-dasharray="${f(4 * k)} ${f(3 * k)}"` : "";
      const path = shapePath(g.shape, g.cx, g.cy, g.s);
      nodes += `<g class="g-n${risk ? " risk-" + risk : ""}${dim ? " is-dim" : ""}" data-acc="${id}">`;
      nodes += path.replace("/>", ` stroke-width="${f(sw)}"${dash}/>`);
      if (risk === "high") nodes += path.replace("/>", ` class="g-gap" stroke-width="${f(sw / 3)}"/>`);
      if (hl && hl.ring === id || state.panel === id) {
        nodes += `<circle class="g-ring" cx="${f(g.cx)}" cy="${f(g.cy)}" r="${f(g.r + sw / 2 + 4 + 1.5)}" stroke-width="3"/>`;
      }
      nodes += "</g>";
      const tag = ACC[id].alert ? `<span class="g-tag">${esc(t("alertTag"))}</span>` : "";
      labels += `<span class="g-label${ACC[id].alert ? " is-subject" : ""}" style="left:${f(g.cx)}px;top:${f(g.cy + g.r + sw / 2 + 3)}px">${id.slice(4)}${tag}</span>`;
    }

    svg.innerHTML = `<g>${back}</g><g>${front}</g><g>${nodes}</g>`;
    labelsEl.innerHTML = labels;
  }

  let frame = 0;
  const redraw = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      drawGraph();
    });
  };

  function zoomAt(factor, px, py) {
    const k2 = Math.max(ZMIN, Math.min(ZMAX, view.k * factor));
    const r = k2 / view.k;
    view.x = px - (px - view.x) * r;
    view.y = py - (py - view.y) * r;
    view.k = k2;
    view.manual = true;
    drawGraph();
  }

  function hitNode(clientX, clientY) {
    if (!lastModel) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    let best = null;
    let bestD = Infinity;
    for (const [id, g] of Object.entries(nodeGeometry(lastModel))) {
      const d = Math.hypot(px - g.cx, py - g.cy);
      if (d <= Math.max(g.r + 4, 12) && d < bestD) {
        best = id;
        bestD = d;
      }
    }
    return best;
  }

  let drag = null;
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false, id: e.pointerId };
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) {
      canvas.classList.toggle("is-over-node", !!hitNode(e.clientX, e.clientY));
      return;
    }
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      canvas.setPointerCapture(drag.id);
      canvas.classList.add("is-panning");
    }
    view.x = drag.vx + dx;
    view.y = drag.vy + dy;
    view.manual = true;
    redraw();
  });
  const endDrag = (e) => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    canvas.classList.remove("is-panning");
    if (moved || e.type === "pointercancel") return;
    const id = hitNode(e.clientX, e.clientY);
    if (id) openAccount(id, canvas);
    else if (state.panel) closePanel(false);
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener(
    "wheel",
    (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - rect.left, e.clientY - rect.top);
    },
    { passive: false }
  );
  canvas.addEventListener("keydown", (e) => {
    const W = canvas.clientWidth / 2;
    const H = canvas.clientHeight / 2;
    const step = 40;
    if (e.key === "+" || e.key === "=") zoomAt(1.25, W, H);
    else if (e.key === "-" || e.key === "_") zoomAt(0.8, W, H);
    else if (e.key === "0") {
      view.manual = false;
      fit(lastModel);
      drawGraph();
    } else if (e.key.startsWith("Arrow")) {
      view.x += e.key === "ArrowLeft" ? step : e.key === "ArrowRight" ? -step : 0;
      view.y += e.key === "ArrowUp" ? step : e.key === "ArrowDown" ? -step : 0;
      view.manual = true;
      drawGraph();
    } else return;
    e.preventDefault();
  });
  if (document.fonts) document.fonts.ready.then(() => lastModel && drawGraph());
  new ResizeObserver(() => {
    if (!lastModel) return;
    if (!view.manual) fit(lastModel);
    $("graph-pan").hidden = !view.overflow || !lastModel.accounts.length;
    drawGraph();
  }).observe(canvas);

  // ---------- Legend ----------
  function swatch(inner) {
    return `<svg class="swatch" viewBox="0 0 28 20" aria-hidden="true">${inner}</svg>`;
  }
  function renderLegend(m) {
    const node = (shape, size, extra) => `<g class="g-n${extra || ""}">${shapePath(shape, 14, 10, size).replace("/>", ' stroke-width="1.5"/>')}</g>`;
    const highNode = `<g class="g-n risk-high">${shapePath("circle", 14, 10, 13).replace("/>", ' stroke-width="3"/>')}${shapePath("circle", 14, 10, 13).replace("/>", ' class="g-gap" stroke-width="1"/>')}</g>`;
    const medNode = `<g class="g-n risk-medium">${shapePath("circle", 14, 10, 13).replace("/>", ' stroke-width="2" stroke-dasharray="3 2"/>')}</g>`;
    const lowNode = node("circle", 13, "");
    const edge = (w, dash) => `<g class="g-e"><line x1="2" y1="10" x2="26" y2="10" stroke-width="${w}"${dash ? ' stroke-dasharray="5 4"' : ""}/></g>`;
    const R = L().roles;
    const roles = m.any
      ? [["circle", 13, R.sender], ["diamond", 12, R.drop], ["rsquare", 13, R.hub], ["hexagon", 12, R.cycle], ["star", 15, R.apex], ["circle", 8, R.context]]
      : [["circle", 13, R.none]];
    const item = (sw, text) => `<li>${swatch(sw)}<span>${esc(text)}</span></li>`;
    $("legend").innerHTML = `
      <div class="legend-group"><p class="legend-h">${esc(t("roleH"))}</p><ul>${roles.map(([s, z, txt]) => item(node(s, z), txt)).join("")}</ul></div>
      <div class="legend-group"><p class="legend-h">${esc(t("riskH"))}</p><ul>${m.any ? item(highNode, L().risks.high) + item(medNode, L().risks.medium) + item(lowNode, L().risks.lowOrNone) : item(lowNode, L().risks.unrated)}</ul></div>
      <div class="legend-group"><p class="legend-h">${esc(t("edgeH"))}</p><ul>${item(edge(1), t("edgeThin", { a: money(C.threshold) }))}${item(edge(2), t("edgeMid", { a: money(C.threshold), b: money(5 * C.threshold) }))}${item(edge(4), t("edgeThick", { b: money(5 * C.threshold) }))}</ul><p class="legend-note">${esc(t("edgeNote"))}</p></div>
      <div class="legend-group"><p class="legend-h">${esc(t("lineH"))}</p><ul>${item(edge(1.5), t("lineSolid"))}${item(edge(1.5, true), t("lineDashed"))}</ul><p class="legend-note">${esc(m.any ? t("axisRoles") : t("axisDirection"))}</p></div>`;
  }

  // ---------- Transfers table ----------
  function renderTable(m) {
    const hl = highlight(m);
    const sortTh = (key, label, cls) => {
      const on = state.sort.key === key;
      const dir = on ? (state.sort.dir === 1 ? "ascending" : "descending") : "none";
      const ic = on ? (state.sort.dir === 1 ? "i-chevron-up" : "i-chevron-down") : "i-chevron-down";
      return `<th scope="col" class="${cls}" aria-sort="${dir}"><button type="button" class="sort${on ? " is-on" : ""}" data-sort="${key}"><span>${esc(label)}</span>${icon(ic)}</button></th>`;
    };
    const head = `<thead><tr>
      <th scope="col">${esc(t("colTx"))}</th>
      <th scope="col">${esc(t("colFrom"))}</th>
      <th scope="col">${esc(t("colTo"))}</th>
      ${sortTh("amount", t("colAmount"), "amt")}
      ${sortTh("time", t("colTime"), "")}
      <th scope="col">${esc(t("colHyps"))}</th>
    </tr></thead>`;
    if (!m.txs.length) {
      $("transfers").innerHTML = `${head}<tbody><tr><td colspan="6" class="empty">${esc(t("transfersEmpty"))}</td></tr></tbody>`;
      return;
    }
    const rows = m.txs.slice().sort((a, b) => {
      const d = state.sort.key === "amount" ? a.amount - b.amount : a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
      return d * state.sort.dir;
    });
    const body = rows
      .map((x) => {
        const on = hl && hl.txs.has(x.id);
        const hyps = m.txHyps[x.id];
        const hcell = hyps ? hyps.map(idSpan).join(" ") : `<span class="muted">${esc(t("ctxWord"))}</span>`;
        return `<tr class="${on ? "is-selected" : ""}" data-row="${x.id}">
          <td><button type="button" class="link-id" data-tx="${x.id}" aria-pressed="${state.sel && state.sel.kind === "tx" && state.sel.id === x.id}">${x.id}</button></td>
          <td>${idSpan(x.from)}</td>
          <td>${idSpan(x.to)}</td>
          <td class="amt num">${money(x.amount)}</td>
          <td class="num">${when(x.at)}</td>
          <td>${hcell}</td>
        </tr>`;
      })
      .join("");
    $("transfers").innerHTML = `${head}<tbody>${body}</tbody>`;
  }

  // ---------- Footnote tables ----------
  function fnTable(kind, owner, footnotes, caption) {
    const s = state.sel;
    const p = state.peek;
    const rows = footnotes
      .map((list, i) => {
        const n = i + 1;
        const on = s && s.kind === kind && s.id === owner && s.fn === n;
        const peek = p && p.kind === kind && p.id === owner && p.fn === n;
        const trs = list
          .map((id, j) => {
            const x = TX[id];
            const num = j === 0 ? `<th scope="rowgroup" rowspan="${list.length}" class="fn-n"><a class="fn-mark" href="#${fnAnchor(kind, owner, n)}" data-kind="${kind}" data-owner="${owner}" data-fn="${n}" aria-label="${esc(t("fnAria", { n }))}">${n}</a></th>` : "";
            return `<tr>${num}<td>${idSpan(x.id)}</td><td class="amt num">${money(x.amount)}</td><td>${idSpan(x.from)}</td><td>${idSpan(x.to)}</td></tr>`;
          })
          .join("");
        return `<tbody id="${fnAnchor(kind, owner, n)}" class="fn${on ? " is-selected" : ""}${peek ? " is-peek" : ""}">${trs}</tbody>`;
      })
      .join("");
    return `<table class="fn-table"><caption class="visually-hidden">${esc(caption)}</caption>
      <thead><tr><th scope="col" class="fn-n">${esc(t("fnNum"))}</th><th scope="col">${esc(t("colTx"))}</th><th scope="col" class="amt">${esc(t("colAmount"))}</th><th scope="col">${esc(t("colFrom"))}</th><th scope="col">${esc(t("colTo"))}</th></tr></thead>
      ${rows}</table>`;
  }

  // ---------- Apex ranking ----------
  function renderApex(m) {
    const box = $("apex");
    if (!m.apex) {
      const msg = state.status === "stopped" ? t("apexStopped") : t("apexPending");
      box.innerHTML = `<p class="pending">${rich(msg, "apex", "msg")}</p>`;
      return;
    }
    const total = C.apex.candidates.reduce((s, c) => s + c.inflow, 0);
    const s = state.sel;
    const items = C.apex.candidates
      .map((c, i) => {
        const on = s && ((s.kind === "apex" && s.id === c.account) || (s.kind === "acc" && s.id === c.account));
        const share = c.inflow / total;
        // Kept: everything the account received minus everything it sent on, from the same transfers the panel counts.
        const got = m.txs.filter((x) => x.to === c.account).reduce((a, x) => a + x.amount, 0);
        const sent = m.txs.filter((x) => x.from === c.account).reduce((a, x) => a + x.amount, 0);
        const kept = got ? Math.max(0, got - sent) / got : 0;
        const open = s && s.kind === "apex" && s.id === c.account;
        return `<li class="apex-row${i === 0 ? " is-leader" : ""}${on ? " is-selected" : ""}">
          <span class="apex-rank num" aria-label="${esc(t("rankLabel", { n: i + 1 }))}">${i + 1}</span>
          <div class="apex-body">
            <div class="apex-head">
              <button type="button" class="link-id" data-apex="${c.account}" aria-expanded="${!!open}">${c.account}</button>
              ${riskLabel(m.risk[c.account])}
            </div>
            <dl class="share">
              <dt class="share-label">${esc(t("shareLabel"))}</dt>
              <dd class="share-val num">${pct(share)}</dd>
              <dd class="share-bar" aria-hidden="true"><span style="inline-size:${(share * 100).toFixed(1)}%"></span></dd>
              <dt class="share-label">${esc(t("keptLabel"))}</dt>
              <dd class="share-val num">${pct(kept)}</dd>
              <dd class="share-bar is-kept" aria-hidden="true"><span style="inline-size:${(kept * 100).toFixed(1)}%"></span></dd>
              <dd class="share-sum num">${money(Math.max(0, got - sent))}</dd>
            </dl>
            <p class="apex-reason">${rich(tr(c.reason), "apex", c.account)}</p>
            ${open ? fnTable("apex", c.account, c.footnotes, t("fnCaptionApex", { id: c.account })) : ""}
          </div>
        </li>`;
      })
      .join("");
    box.innerHTML = `<ol class="apex">${items}</ol><p class="note">${rich(t("apexNote"), "apex", "note")}</p>`;
  }

  // ---------- Hypotheses ----------
  function basisWord(met, of) {
    if (met === of) return t("strong");
    return met * 2 >= of ? t("partial") : t("weak");
  }

  function renderHypotheses(m) {
    $("hyp-count").textContent = m.hyps.length ? String(m.hyps.length) : "";
    const s = state.sel;
    const items = m.hyps.map((h) => {
      const open = s && s.kind === "hyp" && s.id === h.id;
      const d = state.decisions[h.id];
      const met = h.signs.filter((x) => x.met).length;
      const decision = d === "accepted" ? `${icon("i-check")}${esc(t("decisionAccepted"))}` : d === "rejected" ? `${icon("i-ban")}${esc(t("decisionRejected"))}` : esc(t("decisionNone"));
      const signs = open
        ? `<p class="sub-h">${esc(t("signsH"))}</p><ul class="signs">${h.signs
            .map((x) => `<li class="${x.met ? "is-met" : "is-unmet"}">${icon(x.met ? "i-check" : "i-x")}<span class="visually-hidden">${esc(x.met ? t("signMet") : t("signNotMet"))}: </span><span>${rich(tr(x), "sign", h.id)}</span></li>`)
            .join("")}</ul>`
        : "";
      return `<li class="hyp${open ? " is-selected" : ""}${d === "rejected" ? " is-rejected" : ""}" data-hyp="${h.id}">
        <div class="hyp-head">
          <button type="button" class="hyp-title" data-select-hyp="${h.id}" aria-expanded="${!!open}"><span class="id">${h.id}</span><span>${esc(tr(h.typology))}</span></button>
          ${riskLabel(h.risk)}
        </div>
        <p class="hyp-basis"><span class="muted">${esc(t("basis"))}:</span> <strong>${esc(basisWord(met, h.signs.length))}</strong>, ${esc(t("basisCount", { m: met, n: h.signs.length, signs: plural(h.signs.length, "signs") }))}</p>
        <p class="hyp-claim">${rich(tr(h.claim), "hyp", h.id)}</p>
        ${open ? `<button type="button" class="btn show-on-graph" data-show-graph>${esc(t("showOnGraph"))}</button>` : ""}
        ${open ? fnTable("hyp", h.id, h.footnotes, t("fnCaption", { id: h.id })) + signs : ""}
        <p class="hyp-check"><span class="muted">${esc(t("check"))}:</span> ${rich(tr(h.check), "hyp", h.id)}</p>
        <div class="decide">
          <button type="button" class="btn" data-decide="accepted" data-hyp-id="${h.id}" aria-pressed="${d === "accepted"}">${icon("i-check")}<span>${esc(t("accept"))}</span></button>
          <button type="button" class="btn" data-decide="rejected" data-hyp-id="${h.id}" aria-pressed="${d === "rejected"}">${icon("i-ban")}<span>${esc(t("reject"))}</span></button>
          <p class="decision${d ? " is-set" : ""}">${decision}</p>
        </div>
      </li>`;
    });
    $("hypotheses").innerHTML = items.join("") || `<li class="empty">${esc(t("hypsEmpty"))}</li>`;
    const decided = Object.keys(state.decisions).length;
    const closed = state.status === "done" && decided === C.hypotheses.length;
    $("closing").hidden = !closed;
    if (closed) {
      const a = Object.values(state.decisions).filter((x) => x === "accepted").length;
      $("closing").textContent = t("closedLine", { a, r: decided - a });
    }
  }

  // ---------- Account panel ----------
  // Re-rendering replaces the opener, so remember how to find it again rather than the element.
  function openerPath(el) {
    if (!el || el === canvas) return "#graph";
    const box = el.closest("[id]");
    const key = el.dataset.acc ? `[data-acc="${el.dataset.acc}"]` : el.dataset.apex ? `[data-apex="${el.dataset.apex}"]` : "";
    return box && key ? `#${box.id} ${key}` : "#graph";
  }

  function openAccount(id, opener) {
    state.panel = id;
    state.panelOpener = openerPath(opener || document.activeElement);
    state.sel = { kind: "acc", id };
    state.peek = null;
    renderAll();
    const close = $("panel").querySelector("[data-close-panel]");
    if (close) close.focus();
  }

  function closePanel(restoreFocus) {
    if (!state.panel) return;
    state.panel = null;
    renderAll();
    const back = state.panelOpener && document.querySelector(state.panelOpener);
    state.panelOpener = null;
    if (restoreFocus !== false && back) back.focus();
  }

  function renderPanel(m) {
    const box = $("panel");
    const id = state.panel;
    if (!id || !m.accounts.includes(id)) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const a = ACC[id];
    const inTx = m.txs.filter((x) => x.to === id);
    const outTx = m.txs.filter((x) => x.from === id);
    const sum = (l) => l.reduce((s, x) => s + x.amount, 0);
    const flows = (l) => (l.length ? esc(t("txCount", { n: l.length, transfers: plural(l.length, "transfers"), sum: money(sum(l)) })) : esc(t("pNone")));
    const hyps = m.hyps.filter((h) => h.accounts.includes(id));
    const rank = m.apex ? C.apex.candidates.findIndex((c) => c.account === id) : -1;
    const role = roleOf(id, m);
    const pair = (k, v) => `<div class="pair"><dt>${esc(t(k))}</dt><dd>${v}</dd></div>`;
    const at = nodeGeometry(m)[id];
    box.classList.toggle("is-left", !!at && at.cx > canvas.clientWidth / 2);
    box.hidden = false;
    box.innerHTML = `
      <div class="panel-head">
        <h3 class="id panel-id" id="panel-title">${id}</h3>
        <button type="button" class="icon-btn" data-close-panel aria-label="${esc(t("panelClose"))}" data-tip="${esc(t("panelClose"))}">${icon("i-x")}</button>
      </div>
      ${a.alert ? `<p class="panel-note">${esc(t("pSubject"))}</p>` : ""}
      <dl class="pairs">
        ${pair("pKind", esc(L().kinds[a.kind]))}
        ${pair("pRole", esc(L().roles[role]))}
        ${pair("pRisk", riskLabel(m.risk[id]))}
        ${pair("pIn", `<span class="num">${flows(inTx)}</span>`)}
        ${pair("pOut", `<span class="num">${flows(outTx)}</span>`)}
        ${pair("pHyps", hyps.length ? hyps.map((h) => `<button type="button" class="link-id" data-select-hyp="${h.id}">${h.id}</button>`).join(" ") : esc(t("pNone")))}
        ${rank >= 0 ? pair("pRank", `<span class="num">${rank + 1}</span>`) : ""}
      </dl>`;
  }

  // ---------- Selection ----------
  function select(next) {
    const s = state.sel;
    const same = s && next && s.kind === next.kind && s.id === next.id && (s.fn || null) === (next.fn || null);
    state.sel = same ? null : next;
    state.peek = null;
    if (state.panel && (!state.sel || state.sel.kind !== "acc" || state.sel.id !== state.panel)) state.panel = null;
    renderAll();
  }

  // The step that produced a hypothesis selects that hypothesis.
  function selectStep(i) {
    const h = C.steps[i].hypothesis;
    select(h ? { kind: "hyp", id: h } : { kind: "step", id: i });
  }

  function clearAll() {
    state.sel = null;
    state.peek = null;
    state.panel = null;
    renderAll();
  }

  function setLang(lang) {
    if (lang === state.lang) return;
    const cols = [...document.querySelectorAll(".col")].map((c) => c.scrollTop);
    const page = window.scrollY;
    state.lang = lang;
    try {
      localStorage.setItem("redstring.lang", lang);
    } catch (_) {}
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
    renderAll();
    document.querySelectorAll(".col").forEach((c, i) => (c.scrollTop = cols[i]));
    window.scrollTo(0, page);
  }

  // ---------- Events ----------
  document.addEventListener("click", (e) => {
    const el = e.target.closest("a, button");
    const row = e.target.closest("tr[data-row]");
    if (!el && row) return select({ kind: "tx", id: row.dataset.row });
    const stepRow = e.target.closest("[data-step-row]");
    if (!el && stepRow) return selectStep(Number(stepRow.dataset.stepRow));
    if (!el) {
      const hyp = e.target.closest(".hyp");
      if (hyp && !(state.sel && state.sel.kind === "hyp" && state.sel.id === hyp.dataset.hyp)) select({ kind: "hyp", id: hyp.dataset.hyp });
      return;
    }
    const d = el.dataset;
    if (d.lang) {
      e.preventDefault();
      return setLang(d.lang);
    }
    if (el.classList.contains("fn-mark") && d.kind) {
      e.preventDefault();
      if (d.kind === "hyp" || d.kind === "apex") {
        const n = Number(d.fn);
        const cur = state.sel;
        const same = cur && cur.kind === d.kind && cur.id === d.owner && cur.fn === n;
        state.sel = same ? { kind: d.kind, id: d.owner } : { kind: d.kind, id: d.owner, fn: n };
        state.peek = null;
        state.panel = null;
        renderAll();
        const target = $(fnAnchor(d.kind, d.owner, n));
        if (target) target.scrollIntoView({ block: "nearest" });
        const mark = target && target.querySelector(".fn-mark");
        if (mark && el.closest("p")) mark.focus({ preventScroll: true });
      }
      return;
    }
    if (d.selectHyp) return select({ kind: "hyp", id: d.selectHyp });
    if (d.apex) return select({ kind: "apex", id: d.apex });
    if (d.decide) {
      const id = d.hypId;
      if (state.decisions[id] === d.decide) delete state.decisions[id];
      else state.decisions[id] = d.decide;
      save();
      return renderAll();
    }
    if (d.step !== undefined) return selectStep(Number(d.step));
    if (d.tx) return select({ kind: "tx", id: d.tx });
    if (d.acc) return openAccount(d.acc, el);
    if (d.sort) {
      state.sort = state.sort.key === d.sort ? { key: d.sort, dir: -state.sort.dir } : { key: d.sort, dir: d.sort === "amount" ? -1 : 1 };
      return renderAll();
    }
    if (d.closePanel !== undefined) return closePanel();
    if (d.showGraph !== undefined) return showOnGraph();
    if (d.action === "restart") return requestRestart();
  });

  // Footnote preview on hover and focus; the selection itself changes only on a press.
  function peekFrom(el) {
    const mark = el && el.closest && el.closest(".fn-mark[data-kind]");
    if (!mark || (mark.dataset.kind !== "hyp" && mark.dataset.kind !== "apex")) return null;
    return { kind: mark.dataset.kind, id: mark.dataset.owner, fn: Number(mark.dataset.fn) };
  }
  function setPeek(p) {
    const a = state.peek;
    if ((a && p && a.kind === p.kind && a.id === p.id && a.fn === p.fn) || (!a && !p)) return;
    state.peek = p;
    const m = lastModel || model();
    drawGraph();
    renderTable(m);
    document.querySelectorAll("tbody.fn").forEach((tb) => tb.classList.toggle("is-peek", !!p && tb.id === fnAnchor(p.kind, p.id, p.fn)));
  }
  document.addEventListener("mouseover", (e) => setPeek(peekFrom(e.target)));
  document.addEventListener("focusin", (e) => setPeek(peekFrom(e.target)));
  document.addEventListener("focusout", () => setPeek(null));

  $("btn-clear").addEventListener("click", clearAll);
  $("btn-context").addEventListener("click", () => {
    state.hideContext = !state.hideContext;
    renderAll();
  });
  $("btn-zoom-in").addEventListener("click", () => zoomAt(1.25, canvas.clientWidth / 2, canvas.clientHeight / 2));
  $("btn-zoom-out").addEventListener("click", () => zoomAt(0.8, canvas.clientWidth / 2, canvas.clientHeight / 2));
  $("btn-fit").addEventListener("click", () => {
    view.manual = false;
    fit(lastModel);
    drawGraph();
  });
  $("btn-stop").addEventListener("click", stopRun);
  $("btn-restart").addEventListener("click", requestRestart);
  $("confirm-cancel").addEventListener("click", () => $("confirm").close());
  $("confirm-ok").addEventListener("click", () => {
    $("confirm").close();
    startRun();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || $("confirm").open) return;
    if (state.panel) return closePanel();
    if (state.sel) clearAll();
  });

  // ---------- Start ----------
  const saved = load();
  if (saved && saved.finished) {
    state.done = C.steps.length;
    state.status = "done";
    state.elapsed = saved.elapsed || C.steps.reduce((s, x) => s + x.ms, 0);
    state.decisions = saved.decisions || {};
    renderAll();
  } else {
    startRun();
  }
})();
