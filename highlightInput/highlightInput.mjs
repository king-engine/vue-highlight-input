import { defineComponent as H, ref as g, watch as N, nextTick as w, openBlock as A, createElementBlock as I } from "vue";
const $ = ["innerHTML"], D = {
  name: "HighlightInput"
}, V = /* @__PURE__ */ H({
  ...D,
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    keywords: {
      type: Array,
      default: []
    },
    color: {
      type: String,
      default: "#F56C6C"
    }
  },
  emits: ["update:modelValue"],
  setup(s, { emit: p }) {
    const c = s, a = g(""), r = g();
    let i = !1;
    N(() => c.modelValue, (t) => {
      u(t);
    });
    const _ = (t) => t.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&"), h = (t) => {
      var e = "";
      return t.length == 0 ? "" : (e = t.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = e.replace(/ /g, "&nbsp;"), e = e.replace(/\'/g, "&#39;"), e = e.replace(/\"/g, "&quot;"), e = e.replace(/\n/g, "<br/>"), e);
    }, x = (t) => {
      var e = "";
      return t.length == 0 ? "" : (e = t.replace(/&amp;/g, "&"), e = e.replace(/&lt;/g, "<"), e = e.replace(/&gt;/g, ">"), e = e.replace(/&nbsp;/g, " "), e = e.replace(/&#39;/g, "'"), e = e.replace(/&quot;/g, '"'), e = e.replace(/<br\/>/g, `
`), e);
    }, v = (t, e) => {
      if (!t)
        return "";
      const n = new RegExp(
        e.map((l) => _(String(l).trim())).join("|"),
        "gi"
      );
      return t.replace(/\t/g, "").replace(n, "	$&	").split(/\t/).map((l, S) => S % 2 === 0 ? l : `<span style="color: ${c.color}">${l}</span>`).join("");
    }, y = (t, e) => {
      let n = null;
      return (...o) => {
        n && (clearTimeout(n), n = null), n = setTimeout(() => {
          t.apply(this, o);
        }, e);
      };
    }, u = async (t) => {
      let e = T(r.value), n = h(t);
      a.value = v(n, c.keywords), await w(), E(r.value, e);
    }, T = (t) => {
      var o;
      t.focus();
      let e = (o = document.getSelection()) == null ? void 0 : o.getRangeAt(0), n = e == null ? void 0 : e.cloneRange();
      return n == null || n.selectNodeContents(t), n == null || n.setEnd(e == null ? void 0 : e.endContainer, e == null ? void 0 : e.endOffset), n == null ? void 0 : n.toString().length;
    }, E = (t, e) => {
      let n = getSelection(), o = d(r.value, { pos: e });
      o && (o.collapse(!1), n == null || n.removeAllRanges(), n == null || n.addRange(o));
    }, d = (t, e, n) => {
      if (n || (n = document.createRange(), n.selectNode(t), n.setStart(t, 0)), e.pos === 0)
        n.setEnd(t, e.pos);
      else if (t && e.pos > 0)
        if (t.nodeType === Node.TEXT_NODE) {
          let l = t.textContent || "";
          l.length < e.pos ? e.pos -= l.length : (n.setEnd(t, e.pos), e.pos = 0);
        } else
          for (var o = 0; o < t.childNodes.length && (n = d(t.childNodes[o], e, n), e.pos !== 0); o++)
            ;
      return n;
    }, k = y(u, 300), C = () => {
      i = !0;
    }, R = (t) => {
      i = !1, m(t);
    }, m = (t) => {
      if (!i) {
        let e = t.target.textContent;
        p("update:modelValue", x(e || "")), k(e);
      }
    };
    return (t, e) => (A(), I("div", {
      ref_key: "inputDom",
      ref: r,
      innerHTML: a.value,
      class: "highlight-input",
      onInput: m,
      onCompositionstart: C,
      onCompositionend: R,
      contenteditable: "true"
    }, null, 40, $));
  }
});
const L = (s, p) => {
  const c = s.__vccOpts || s;
  for (const [a, r] of p)
    c[a] = r;
  return c;
}, f = /* @__PURE__ */ L(V, [["__scopeId", "data-v-bc8dd032"]]), O = [f], B = {
  install(s) {
    O.forEach((p) => {
      s.component(p.name, f);
    });
  }
};
export {
  f as HighlightInput,
  B as default
};
