import { defineComponent as A, ref as x, watch as k, nextTick as O, onMounted as H, openBlock as L, createElementBlock as I, withKeys as M } from "vue";
const V = ["innerHTML", "onKeydown"], $ = {
  name: "HighlightInput"
}, b = /* @__PURE__ */ A({
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
  setup(a, { emit: c }) {
    const i = a, p = x(""), r = x();
    let u = !1;
    k(() => i.modelValue, (n) => {
      C(n);
    });
    const N = (n) => n.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&"), T = (n) => {
      var e = "";
      return n.length == 0 ? "" : (e = n.replace(/&/g, "&amp;"), e = e.replace(/</g, "&lt;"), e = e.replace(/>/g, "&gt;"), e = e.replace(/ /g, "&nbsp;"), e = e.replace(/\'/g, "&#39;"), e = e.replace(/\"/g, "&quot;"), e = e.replace(/\n/g, "<br/>"), e);
    }, g = (n) => {
      var e = "";
      return n.length == 0 ? "" : (e = n.replace(/&amp;/g, "&"), e = e.replace(/&lt;/g, "<"), e = e.replace(/&gt;/g, ">"), e = e.replace(/&nbsp;/g, " "), e = e.replace(/&#39;/g, "'"), e = e.replace(/&quot;/g, '"'), e = e.replace(/<br\/>/g, `
`), e);
    }, y = (n, e) => {
      if (!n)
        return "";
      const t = new RegExp(
        e.map((l) => N(String(l).trim())).join("|"),
        "gi"
      );
      return n.replace(/\t/g, "").replace(t, "	$&	").split(/\t/).map((l, s) => s % 2 === 0 ? l : `<span style="color: ${i.color}">${l}</span>`).join("");
    }, C = async (n) => {
      let e = d(r.value) + f, t = T(n);
      p.value = y(t, i.keywords), await O(), D(r.value, e), f = 0;
    }, d = (n) => {
      var o;
      n.focus();
      let e = (o = document.getSelection()) == null ? void 0 : o.getRangeAt(0), t = e == null ? void 0 : e.cloneRange();
      return t == null || t.selectNodeContents(n), t == null || t.setEnd(e == null ? void 0 : e.endContainer, e == null ? void 0 : e.endOffset), S(t.cloneContents());
    };
    function S(n) {
      for (var e = "", t = n.childNodes, o = 0; o < t.length; o++) {
        var l = t[o];
        l.nodeType === Node.TEXT_NODE ? e += l.textContent : l.nodeType === Node.ELEMENT_NODE && (e += v(l));
      }
      return e.length;
    }
    function v(n) {
      var e = "";
      if (n.nodeName === "BR")
        return e + " ";
      for (var t = n.childNodes, o = 0; o < t.length; o++) {
        var l = t[o];
        l.nodeType === Node.TEXT_NODE ? e += l.textContent : l.nodeType === Node.ELEMENT_NODE && (l.nodeName === "BR" ? e += " " : e += v(l));
      }
      return e;
    }
    const D = (n, e) => {
      let t = getSelection(), o = h(r.value, { pos: e });
      o && (o.collapse(!1), t == null || t.removeAllRanges(), t == null || t.addRange(o));
    }, h = (n, e, t) => {
      if (t || (t = document.createRange(), t.selectNode(n), t.setStart(n, 0)), e.pos === 0)
        t.setEnd(n, e.pos);
      else if (n && e.pos > 0)
        if (n.nodeType === Node.TEXT_NODE) {
          let l = n.textContent || "";
          l.length < e.pos ? e.pos -= l.length : (t.setEnd(n, e.pos), e.pos = 0);
        } else if (n.nodeName === "BR")
          e.pos -= 1, e.pos === 0 && t.setEnd(n.nextSibling || n, 0);
        else
          for (var o = 0; o < n.childNodes.length && (t = h(n.childNodes[o], e, t), e.pos !== 0); o++)
            ;
      return t;
    }, B = () => {
      u = !0;
    }, R = (n) => {
      u = !1, E(n);
    }, E = (n) => {
      if (!u) {
        let e = n.target.innerText;
        c("update:modelValue", g(e || ""));
      }
    }, w = (n) => {
      if (!n.shiftKey) {
        n.preventDefault();
        var e = window.getSelection(), t = e.getRangeAt(0);
        let s = t.endContainer, m = s.parentNode || r.value;
        if (d(r.value) === r.value.innerText.length) {
          var o = document.createElement("br"), l = document.createElement("br");
          s.nodeName === "BR" ? (m.insertBefore(o, s.nextSibling), m.insertBefore(l, s.nextSibling), t.setStartBefore(l), t.setEndBefore(l)) : (t.insertNode(o), t.insertNode(l), t.setStartAfter(l), t.setEndAfter(l));
        } else {
          var o = document.createElement("br");
          s.nodeName === "BR" ? (m.insertBefore(o, s.nextSibling), t.setStartBefore(o), t.setEndBefore(o)) : (t.insertNode(o), t.setStartAfter(o), t.setEndAfter(o));
        }
      }
    };
    let f = 0;
    return H(() => {
      r.value.addEventListener("paste", (n) => {
        if (n.preventDefault(), !n.clipboardData)
          return;
        const t = n.clipboardData.getData("text").replace(/\r/g, "");
        let o = d(r.value), l = r.value.innerText, s = l.substr(0, o) + t + l.substr(o);
        f = t.length, c("update:modelValue", g(s || ""));
      });
    }), (n, e) => (L(), I("div", {
      ref_key: "inputDom",
      ref: r,
      innerHTML: p.value,
      class: "highlight-input",
      onInput: E,
      onCompositionstart: B,
      onCompositionend: R,
      contenteditable: "true",
      onKeydown: M(w, ["enter"])
    }, null, 40, V));
  }
});
const K = (a, c) => {
  const i = a.__vccOpts || a;
  for (const [p, r] of c)
    i[p] = r;
  return i;
}, _ = /* @__PURE__ */ K(b, [["__scopeId", "data-v-a2ad3b79"]]), X = [_], P = {
  install(a) {
    X.forEach((c) => {
      a.component(c.name, _);
    });
  }
};
export {
  _ as HighlightInput,
  P as default
};
