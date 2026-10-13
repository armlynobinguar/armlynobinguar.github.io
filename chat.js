// "Ask me something": a small chat that answers a few common questions.
// It starts when it scrolls into view, so it isn't animating while you read the top.
(() => {
  const body = document.getElementById("chatBody");
  const chips = document.getElementById("chips");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  let busy = false;

  const GREETING = "Hi! Pick a question below and I'll answer.";

  const QUESTIONS = [
    { q: "What do you do?", a: [
      "Developer relations at <a href=\"https://www.risein.com\">Rise In</a>.",
      "In practice: guides, sample apps, workshops, and passing on what developers struggled with.",
    ] },
    { q: "Where did you work before?", a: [
      "Head of DevRel at TARS AI, and DevRel at Virtuals Protocol / PathDAO.",
      "Before that I was an ML engineer at Accenture and led ML work at Omdena.",
    ] },
    { q: "What are you building?", a: [
      "Doqtri. It turns a plan into a mindmap and records on Stellar what actually shipped.",
      "It's at <a href=\"https://www.doqtri.xyz\">doqtri.xyz</a> if you want to try it.",
    ] },
    { q: "Can you speak at our event?", a: [
      "Probably! Talks, workshops, or mentoring and judging at hackathons.",
      "Message me on X: <a href=\"https://twitter.com/aeriumcius\">@aeriumcius</a>.",
    ] },
  ];

  function add(who, html) {
    const el = document.createElement("div");
    el.className = `msg ${who}`;
    if (who === "me") el.innerHTML = html; else el.textContent = html; // only my own fixed text uses links
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  async function reply(lines) {
    for (const line of lines) {
      const t = document.createElement("div");
      t.className = "typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      await wait(600 + Math.min(line.length * 10, 700));
      t.remove();
      add("me", line);
      await wait(250);
    }
  }

  function renderChips(asked) {
    chips.innerHTML = "";
    QUESTIONS.forEach((item, i) => {
      if (asked.has(i)) return;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = item.q;
      b.addEventListener("click", async () => {
        if (busy) return;
        busy = true;
        chips.querySelectorAll("button").forEach((x) => (x.disabled = true));
        asked.add(i);
        add("you", item.q);
        await wait(250);
        await reply(item.a);
        busy = false;
        renderChips(asked);
      });
      chips.appendChild(b);
    });
    if (!chips.children.length) {
      const done = document.createElement("span");
      done.className = "small";
      done.innerHTML = "That's all I've got here. For anything else, <a href=\"https://twitter.com/aeriumcius\">message me</a>.";
      chips.appendChild(done);
    }
  }

  async function start() {
    await reply([GREETING]);
    renderChips(new Set());
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  if ("IntersectionObserver" in window) {
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        start();
      }
    }, { threshold: 0.4 });
    seen.observe(body);
  } else {
    start();
  }
})();
