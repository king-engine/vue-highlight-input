import { defineComponent, ref, watch, nextTick, openBlock, createElementBlock, withKeys } from "vue";
const _hoisted_1 = ["innerHTML", "onKeydown"];
const __default__ = {
  name: "HighlightInput"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
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
  setup(__props, { emit }) {
    const props = __props;
    const inputHtml = ref("");
    const inputDom = ref();
    let isLock = false;
    watch(() => props.modelValue, (val) => {
      formatText(val);
    });
    const escapeRegExp = (text) => {
      return text.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, "\\$&");
    };
    const htmlEncode = (str) => {
      var s = "";
      if (str.length == 0)
        return "";
      s = str.replace(/&/g, "&amp;");
      s = s.replace(/</g, "&lt;");
      s = s.replace(/>/g, "&gt;");
      s = s.replace(/ /g, "&nbsp;");
      s = s.replace(/\'/g, "&#39;");
      s = s.replace(/\"/g, "&quot;");
      s = s.replace(/\n/g, "<br/>");
      return s;
    };
    const htmlDecode = (str) => {
      var s = "";
      if (str.length == 0)
        return "";
      s = str.replace(/&amp;/g, "&");
      s = s.replace(/&lt;/g, "<");
      s = s.replace(/&gt;/g, ">");
      s = s.replace(/&nbsp;/g, " ");
      s = s.replace(/&#39;/g, "'");
      s = s.replace(/&quot;/g, '"');
      s = s.replace(/<br\/>/g, "\n");
      return s;
    };
    const htmlText = (text, keywords) => {
      if (!text)
        return "";
      const regexp = new RegExp(
        keywords.map((keyword) => escapeRegExp(String(keyword).trim())).join("|"),
        "gi"
      );
      let textArr = text.replace(/\t/g, "").replace(regexp, "	$&	").split(/\t/);
      return textArr.map((str, i) => {
        return i % 2 === 0 ? str : `<span style="color: ${props.color}">${str}</span>`;
      }).join("");
    };
    const formatText = async (text) => {
      let pos = getCaretPos(inputDom.value);
      let encodeText = htmlEncode(text);
      inputHtml.value = htmlText(encodeText, props.keywords);
      await nextTick();
      setCaretPos(inputDom.value, pos);
    };
    const getCaretPos = (el) => {
      var _a;
      el.focus();
      let range = (_a = document.getSelection()) == null ? void 0 : _a.getRangeAt(0);
      let rangeClone = range == null ? void 0 : range.cloneRange();
      rangeClone == null ? void 0 : rangeClone.selectNodeContents(el);
      rangeClone == null ? void 0 : rangeClone.setEnd(range == null ? void 0 : range.endContainer, range == null ? void 0 : range.endOffset);
      return countDocumentFragment(rangeClone.cloneContents());
    };
    function countDocumentFragment(fragment) {
      var text = "";
      var childNodes = fragment.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          text += countCharacterElement(node);
        }
      }
      return text.length;
    }
    function countCharacterElement(element) {
      var text = "";
      if (element.nodeName === "BR") {
        return text + " ";
      }
      var childNodes = element.childNodes;
      for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.nodeName === "BR") {
            text += " ";
          } else {
            text += countCharacterElement(node);
          }
        }
      }
      return text;
    }
    const setCaretPos = (el, pos) => {
      let selection = getSelection();
      let range = createRange(inputDom.value, { pos });
      if (range) {
        range.collapse(false);
        selection == null ? void 0 : selection.removeAllRanges();
        selection == null ? void 0 : selection.addRange(range);
      }
    };
    const createRange = (node, obj, range) => {
      if (!range) {
        range = document.createRange();
        range.selectNode(node);
        range.setStart(node, 0);
      }
      if (obj.pos === 0) {
        range.setEnd(node, obj.pos);
      } else if (node && obj.pos > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          let text = node.textContent || "";
          if (text.length < obj.pos) {
            obj.pos -= text.length;
          } else {
            range.setEnd(node, obj.pos);
            obj.pos = 0;
          }
        } else {
          if (node.nodeName === "BR") {
            obj.pos -= 1;
            if (obj.pos === 0) {
              range.setEnd(node.nextSibling || node, 0);
            }
          } else {
            for (var lp = 0; lp < node.childNodes.length; lp++) {
              range = createRange(node.childNodes[lp], obj, range);
              if (obj.pos === 0) {
                break;
              }
            }
          }
        }
      }
      return range;
    };
    const onCompositionStart = () => {
      isLock = true;
    };
    const onCompositionEnd = (e) => {
      isLock = false;
      onInput(e);
    };
    const onInput = (e) => {
      if (!isLock) {
        let text = e.target.innerText;
        emit("update:modelValue", htmlDecode(text || ""));
      }
    };
    const onEnterDown = (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        let pos = getCaretPos(inputDom.value);
        if (pos === inputDom.value.innerText.length) {
          var br1 = document.createElement("br");
          var br2 = document.createElement("br");
          range.insertNode(br1);
          range.insertNode(br2);
          range.setStartAfter(br2);
          range.setEndAfter(br2);
        } else {
          var br1 = document.createElement("br");
          range.insertNode(br1);
          range.setStartAfter(br1);
          range.setEndAfter(br1);
        }
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "inputDom",
        ref: inputDom,
        innerHTML: inputHtml.value,
        class: "highlight-input",
        onInput,
        onCompositionstart: onCompositionStart,
        onCompositionend: onCompositionEnd,
        contenteditable: "true",
        onKeydown: withKeys(onEnterDown, ["enter"])
      }, null, 40, _hoisted_1);
    };
  }
});
const HighlightInput_vue_vue_type_style_index_0_scoped_8a1b4a05_lang = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const HighlightInput = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8a1b4a05"]]);
const component = [HighlightInput];
const inpoutComponent = {
  install(vue) {
    component.forEach((item) => {
      vue.component(item.name, HighlightInput);
    });
  }
};
export {
  HighlightInput,
  inpoutComponent as default
};
//# sourceMappingURL=highlightInput.mjs.map
