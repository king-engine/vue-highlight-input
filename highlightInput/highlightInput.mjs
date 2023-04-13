import { defineComponent as H, ref as g, watch as N, nextTick as A, openBlock as D, createElementBlock as I, withKeys as f } from "vue";
const K = ["innerHTML", "onKeydown", "onKeyup"], $ = {
  name: "HighlightInput"
}, V = /* @__PURE__ */ H({
  ...$,
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
    const c = s, i = g(""), r = g();
    let a = !1;
    N(() => c.modelValue, (t) => {
      v(t);
    });
    const _ = (t) => t.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&"), h = (t) => {
      var e = "";
      return t.length == 0 ? "" : (e = t.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = e.replace(/ /g, "&nbsp;"), e = e.replace(/\'/g, "&#39;"), e = e.replace(/\"/g, "&quot;"), e = e.replace(/\n/g, "<br/>"), e);
    }, y = (t) => {
      var e = "";
      return t.length == 0 ? "" : (e = t.replace(/&amp;/g, "&"), e = e.replace(/&lt;/g, "<"), e = e.replace(/&gt;/g, ">"), e = e.replace(/&nbsp;/g, " "), e = e.replace(/&#39;/g, "'"), e = e.replace(/&quot;/g, '"'), e = e.replace(/<br\/>/g, `
`), e);
    }, x = (t, e) => {
      if (!t)
        return "";
      const n = new RegExp(
        e.map((l) => _(String(l).trim())).join("|"),
        "gi"
      );
      return t.replace(/\t/g, "").replace(n, "	$&	").split(/\t/).map((l, S) => S % 2 === 0 ? l : `<span style="color: ${c.color}">${l}</span>`).join("");
    }, v = async (t) => {
      let e = E(r.value), n = h(t);
      i.value = x(n, c.keywords), await A(), T(r.value, e);
    }, E = (t) => {
      var o;
      t.focus();
      let e = (o = document.getSelection()) == null ? void 0 : o.getRangeAt(0), n = e == null ? void 0 : e.cloneRange();
      return n == null || n.selectNodeContents(t), n == null || n.setEnd(e == null ? void 0 : e.endContainer, e == null ? void 0 : e.endOffset), n == null ? void 0 : n.toString().length;
    }, T = (t, e) => {
      let n = getSelection(), o = u(r.value, { pos: e });
      o && (o.collapse(!1), n == null || n.removeAllRanges(), n == null || n.addRange(o));
    }, u = (t, e, n) => {
      if (n || (n = document.createRange(), n.selectNode(t), n.setStart(t, 0)), e.pos === 0)
        n.setEnd(t, e.pos);
      else if (t && e.pos > 0)
        if (t.nodeType === Node.TEXT_NODE) {
          let l = t.textContent || "";
          l.length < e.pos ? e.pos -= l.length : (n.setEnd(t, e.pos), e.pos = 0);
        } else
          for (var o = 0; o < t.childNodes.length && (n = u(t.childNodes[o], e, n), e.pos !== 0); o++)
            ;
      return n;
    }, k = () => {
      a = !0;
    }, w = (t) => {
      a = !1, d(t);
    }, d = (t) => {
      if (!a) {
        let e = t.target.innerText;
        p("update:modelValue", y(e || ""));
      }
    }, C = (t) => {
      a = !0;
    }, R = (t) => {
      a = !1;
    };
    return (t, e) => (D(), I("div", {
      ref_key: "inputDom",
      ref: r,
      innerHTML: i.value,
      class: "highlight-input",
      onInput: d,
      onCompositionstart: k,
      onCompositionend: w,
      contenteditable: "true",
      onKeydown: f(C, ["enter"]),
      onKeyup: f(R, ["enter"])
    }, null, 40, K));
  }
});
const L = (s, p) => {
  const c = s.__vccOpts || s;
  for (const [i, r] of p)
    c[i] = r;
  return c;
}, m = /* @__PURE__ */ L(V, [["__scopeId", "data-v-cbea2676"]]), O = [m], B = {
  install(s) {
    O.forEach((p) => {
      s.component(p.name, m);
    });
  }
};
export {
  m as HighlightInput,
  B as default
};
