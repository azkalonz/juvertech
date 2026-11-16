// src/automation-metrics.ts
var e = new Intl.NumberFormat("en-US");
function t(e, t, n) {
	try {
		e?.setItem(t, n.toString());
	} catch {}
}
function n(e, n, r, i, a, o = Math.random) {
	try {
		let t = e?.getItem(n);
		if (t && /^\d+$/.test(t) && BigInt(t) >= r + BigInt(i)) return BigInt(t);
	} catch {}
	let s = r + BigInt(i + Math.floor(o() * (a - i + 1)));
	return t(e, n, s), s;
}
function r(t, n) {
	let r = e.format(t), i = e.format(t + n), a = 0;
	if (r.length === i.length) for (; a < r.length && r[a] === i[a];) a++;
	let o = i.length, s = n.toString().length;
	for (; o > 0 && s > 0;) o--, /\d/.test(i[o]) && s--;
	let c = Math.min(a, o);
	return {
		prefix: r.slice(0, c),
		outgoing: r.slice(c),
		incoming: i.slice(c),
		after: i
	};
}
function i() {
	let i = document.querySelector("[data-automation-metrics]");
	if (!i) return;
	let a = matchMedia("(prefers-reduced-motion: reduce)"), o = !1, s = null;
	try {
		s = localStorage;
	} catch {}
	let c = Array.from(i.querySelectorAll("[data-metric]")).map((t, r) => {
		let i = `juvertech:automation-counter:v1:${t.dataset.metric}`, a = n(s, i, BigInt(t.dataset.value), Number(t.dataset.seedMin), Number(t.dataset.seedMax)), o = t.dataset.prefix ?? "", c = document.createElement("span");
		return c.className = "metric-visual", c.setAttribute("aria-hidden", "true"), c.textContent = o + e.format(a), t.replaceChildren(c), t.setAttribute("aria-label", c.textContent), {
			element: t,
			index: r,
			key: i,
			value: a,
			prefix: o,
			min: Number(t.dataset.min),
			max: Number(t.dataset.max),
			timer: 0,
			animation: null
		};
	}), l = () => o && !a.matches && !document.hidden, u = (e, t = "") => {
		let n = document.createElement("span");
		return n.className = e, n.textContent = t, n;
	}, d = (e, t = !1) => {
		!l() || e.timer || e.animation || (e.timer = window.setTimeout(() => {
			e.timer = 0, f(e);
		}, t ? 700 + e.index * 520 : 2400 + Math.random() * 2400));
	}, f = async (e) => {
		if (!l()) return;
		let n = BigInt(e.min + Math.floor(Math.random() * (e.max - e.min + 1))), i = r(e.value, n);
		e.value += n, t(s, e.key, e.value);
		let a = u("metric-visual");
		a.setAttribute("aria-hidden", "true");
		let o = u("metric-window"), c = u("metric-reel");
		c.append(u("metric-frame", i.outgoing), u("metric-frame", i.incoming)), o.append(c), a.append(u("metric-prefix", e.prefix + i.prefix), o), e.element.replaceChildren(a), e.animation = c.animate([{ transform: "translateY(0)" }, { transform: "translateY(-50%)" }], {
			duration: 760,
			easing: "cubic-bezier(.22,1,.36,1)",
			fill: "forwards"
		}), await e.animation.finished.catch(() => {}), e.animation = null;
		let f = u("metric-visual", e.prefix + i.after);
		f.setAttribute("aria-hidden", "true"), e.element.replaceChildren(f), e.element.setAttribute("aria-label", e.prefix + i.after), d(e);
	}, p = () => {
		for (let e of c) l() ? d(e, !0) : (clearTimeout(e.timer), e.timer = 0, e.animation?.finish());
	};
	a.addEventListener("change", p), document.addEventListener("visibilitychange", p), new IntersectionObserver((e) => {
		o = e.some((e) => e.isIntersecting), p();
	}, { threshold: .15 }).observe(i), p();
}
// src/motion/bootstrap.tsx
i();
var a = new Set(document.querySelectorAll("[data-device-showcase], [data-cinematic-hero]")), o = new IntersectionObserver((e) => {
	for (let t of e) {
		if (!t.isIntersecting && t.boundingClientRect.top > 0 || !a.has(t.target)) continue;
		let e = t.target;
		a.delete(e), o.unobserve(e), (e.hasAttribute("data-cinematic-hero") ? import("./HeroShowcase-S45Fq-KW.js").then(({ mountHero: t }) => t(e)) : import("./DeviceShowcase-BdVBpmnq.js").then(({ mountShowcase: t }) => t(e))).catch((t) => {
			console.error("The software showcase could not initialize.", t), e.dataset.load = "failed";
			let n = e.querySelector("[data-loading-message]");
			n && (n.textContent = "The interactive film could not load. The project details below remain available.");
		});
	}
}, { rootMargin: "350px" });
a.forEach((e) => o.observe(e));
