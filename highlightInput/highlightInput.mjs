import { defineComponent as w, ref as d, watch as k, nextTick as E, openBlock as S, createElementBlock as H } from "vue";
const I = ["innerHTML"], $ = {
  name: "HighlightInput"
}, A = /* @__PURE__ */ w({
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
  setup(n, { emit: c }) {
    const o = n, r = d(""), s = d();
    let a = !1;
    k(() => o.modelValue, (e) => {
      p(e);
    });
    const g = (e) => e.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&"), _ = (e, t) => {
      if (!e)
        return "";
      const l = new RegExp(
        t.map((i) => g(String(i).trim())).join("|"),
        "gi"
      );
      return e.replace(/\t/g, "").replace(l, "	$&	").split(/\t/).map((i, C) => C % 2 === 0 ? i : `<span style="color: ${o.color}">${i}</span>`).join("");
    }, h = (e) => {
      if (window.getSelection) {
        e.focus();
        let t = window.getSelection();
        t.selectAllChildren(e), t.collapseToEnd();
      } else if (document.selection) {
        let t = document.selection.createRange();
        t.moveToElementText(e), t.collapse(!1), t.select();
      }
    }, x = (e, t) => {
      let l = null;
      return (...m) => {
        l && (clearTimeout(l), l = null), l = setTimeout(() => {
          e.apply(this, m);
        }, t);
      };
    }, p = async (e) => {
      r.value = _(e, o.keywords), await E(), h(s.value);
    }, y = x(p, 300), T = () => {
      a = !0;
    }, v = (e) => {
      a = !1, u(e);
    }, u = (e) => {
      if (!a) {
        let t = e.target.textContent;
        c("update:modelValue", String(t)), y(t);
      }
    };
    return (e, t) => (S(), H("div", {
      ref_key: "inputDom",
      ref: s,
      innerHTML: r.value,
      class: "highlight-input",
      onInput: u,
      onCompositionstart: T,
      onCompositionend: v,
      contenteditable: "true"
    }, null, 40, I));
  }
});
const V = (n, c) => {
  const o = n.__vccOpts || n;
  for (const [r, s] of c)
    o[r] = s;
  return o;
}, f = /* @__PURE__ */ V(A, [["__scopeId", "data-v-0cec6f78"]]), L = [f], B = {
  install(n) {
    L.forEach((c) => {
      n.component(c.name, f);
    });
  }
};
export {
  f as HighlightInput,
  B as default
};
