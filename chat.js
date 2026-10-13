// Interactive hero chat: plays an intro, then answers quick-reply questions.
(() => {
  const body = document.getElementById("chatBody");
  const chips = document.getElementById("chips");
  const replay = document.querySelector(".replay");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  let run = 0; // bumps on replay so an old run stops talking

  const INTRO = [
    ["you", "hey! who are you?"],
    ["me", "Hi, I'm Armielyn. Developer Relations for AI & Web3."],
    ["me", "I help developers go from \"what is this?\" to \"I shipped it\"."],
  ];

  const QUESTIONS = [
    { q: "Where do you work?", a: [
      "Right now: DevRel at <a href=\"https://www.risein.com\" target=\"_blank\" rel=\"noopener\">Rise In</a>.",
      "Before that: Head of DevRel at TARS AI, and DevRel at Virtuals Protocol / PathDAO.",
    ] },
    { q: "What have you done for builders?", a: [
      "5,000+ builders onboarded across Southeast Asia.",
      "100+ talks, workshops and demos, including Solidity Fundamentals workshops.",
    ] },
    { q: "What are you building?", a: [
      "Doqtri: planned vs shipped, proven on Stellar.",
      "Your plan becomes a mindmap, each node links to the PR that shipped it, and every version is anchored on-chain. Try it at <a href=\"https://www.doqtri.xyz\" target=\"_blank\" rel=\"noopener\">doqtri.xyz</a>.",
    ] },
    { q: "Any research?", a: [
      "Split-Brain RAG, accepted at NIAI 2026, with Jodi Moselle Alcantara.",
      "It looks at hybrid RAG for scientific QA and introduces the Value Ratio metric.",
    ] },
    { q: "Can you speak at our event?", a: [
      "Yes! Talks, hands-on workshops, and hackathon mentoring or judging.",
      "DM me on X <a href=\"https://twitter.com/aeriumcius\" target=\"_blank\" rel=\"noopener\">@aeriumcius</a> or on <a href=\"https://www.linkedin.com/in/armielyn-obinguar/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a>.",
    ] },
  ];

  function add(who, html) {
    const el = document.createElement("div");
    el.className = `msg ${who}`;
    if (who === "me") el.innerHTML = html; else el.textContent = html; // only my fixed copy uses HTML links
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  async function say(lines, id) {
    for (const line of lines) {
      if (id !== run) return;
      const t = document.createElement("div");
      t.className = "typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      await wait(700 + Math.min(line.length * 12, 900));
      t.remove();
      if (id !== run) return;
      add("me", line);
      await wait(350);
    }
  }

  function renderChips(asked, id) {
    chips.innerHTML = "";
    QUESTIONS.forEach((item, i) => {
      if (asked.has(i)) return;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = item.q;
      b.addEventListener("click", async () => {
        if (id !== run) return;
        chips.querySelectorAll("button").forEach((x) => (x.disabled = true));
        asked.add(i);
        add("you", item.q);
        await wait(300);
        await say(item.a, id);
        if (id === run) renderChips(asked, id);
      });
      chips.appendChild(b);
    });
    if (!chips.children.length && id === run) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "Start over";
      b.addEventListener("click", start);
      chips.appendChild(b);
    }
  }

  async function start() {
    const id = ++run;
    body.innerHTML = "";
    chips.innerHTML = "";
    for (const [who, text] of INTRO) {
      if (id !== run) return;
      if (who === "you") { await wait(500); add("you", text); await wait(300); }
      else await say([text], id);
    }
    if (id === run) renderChips(new Set(), id);
  }

  replay.addEventListener("click", start);
  document.getElementById("year").textContent = new Date().getFullYear();
  start();
})();
