<script lang="ts" setup>
/**
 * 接收组件参数
 * @params modelValue v-model双向绑定输入值
 * @params kewords 匹配关键字数组，例：['关键字1', '关键字2']
 * @params color 匹配关键字高亮颜色 例：#333333
 */
import { nextTick, ref, watch, onMounted } from 'vue'
const inputHtml = ref('')
const inputDom = ref()
let isLock = false

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  keywords: {
    type: Array,
    default: []
  },
  color: {
    type: String,
    default: '#F56C6C'
  }
})
const emit = defineEmits(['update:modelValue'])
watch(() => props.modelValue, (val) => {
  formatText(val)
})
// 正则转义
const escapeRegExp = (text: string) => {
  return text.replace(/[\-\/\\\^\$\*\+\?\.\(\)\|\[\]\{\}]/g, '\\$&');
}
// html转义
const htmlEncode = (str: string) => {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/ /g, "&nbsp;");
  s = s.replace(/\'/g, "&#39;");
  s = s.replace(/\"/g, "&quot;");
  s = s.replace(/\n/g, "<br/>");
  return s;
}
// html反转义
const htmlDecode = (str: string) => {
  var s = "";
  if (str.length == 0) return "";
  s = str.replace(/&amp;/g, "&");
  s = s.replace(/&lt;/g, "<");
  s = s.replace(/&gt;/g, ">");
  s = s.replace(/&nbsp;/g, " ");
  s = s.replace(/&#39;/g, "\'");
  s = s.replace(/&quot;/g, "\"");
  s = s.replace(/<br\/>/g, "\n");
  return s;
}

//关键字包裹
const htmlText = (text: string | null, keywords: any[]) => {
  if (!text) return ''
  const regexp = new RegExp(
    keywords
      .map((keyword) => escapeRegExp(String(keyword).trim()))
      .join('|'),
    'gi'
  )
  let textArr: string[] = text.replace(/\t/g, '').replace(regexp, '\t$&\t').split(/\t/)
  return textArr.map((str, i) => {
    return i % 2 === 0 ? str : `<span style="color: ${props.color}">${str}</span>`
  }).join('')
}

// 防抖
const debounce = (fn: Function, delay: number) => {
  let timer: null | number = null
  return (...arg: any[]) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, delay)
  }
}

const formatText = async (text: string) => {

  let pos = getCaretPos(inputDom.value) + caretOffset

  let encodeText = htmlEncode(text)

  inputHtml.value = htmlText(encodeText, props.keywords)

  await nextTick()

  setCaretPos(inputDom.value, pos)
  caretOffset = 0
}

// 获取光标偏移，包含换行符
const getCaretPos = (el: HTMLInputElement) => {
  el.focus()
  let range = document.getSelection()?.getRangeAt(0) as Range
  let rangeClone = range?.cloneRange()
  rangeClone?.selectNodeContents(el)
  rangeClone?.setEnd(range?.endContainer, range?.endOffset)
  // return rangeClone?.toString().length
  return countDocumentFragment(rangeClone.cloneContents())
}

// 计算range所有子节点字符数
function countDocumentFragment(fragment: DocumentFragment) {
  var text = '';
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
// 元素节点
function countCharacterElement(element: Node) {
  var text = '';
  if (element.nodeName === 'BR') {
    return text + ' '
  }
  var childNodes = element.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    var node = childNodes[i];
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.nodeName === 'BR') {
        text += ' '
      } else {
        text += countCharacterElement(node);
      }
    }
  }
  return text;
}

// 还原光标位置
const setCaretPos = (el: HTMLElement, pos: number) => {
  let selection = getSelection()
  let range = createRange(inputDom.value, { pos })
  if (range) {
    range.collapse(false)
    selection?.removeAllRanges()
    selection?.addRange(range)
  }
}

const createRange = (node: Node, obj: { pos: number }, range?: Range): Range => {
  if (!range) {
    range = document.createRange()
    range.selectNode(node)
    range.setStart(node, 0)
  }
  if (obj.pos === 0) {
    range.setEnd(node, obj.pos)
  } else if (node && obj.pos > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent || ''
      if (text.length < obj.pos) {
        obj.pos -= text.length
      } else {
        range.setEnd(node, obj.pos)
        obj.pos = 0
      }
    } else {
      if (node.nodeName === 'BR') {
        obj.pos -= 1
        if (obj.pos === 0) {
          range.setEnd(node.nextSibling || node, 0)
        }
      } else {
        for (var lp = 0; lp < node.childNodes.length; lp++) {
          range = createRange(node.childNodes[lp], obj, range)
          if (obj.pos === 0) {
            break
          }
        }
      }
    }
  }
  return range
}

const deFormatText = debounce(formatText, 300)


const onCompositionStart = () => {
  // 中文输入锁定
  isLock = true
}
const onCompositionEnd = (e: Event) => {
  isLock = false
  onInput(e)
}
const onInput = (e: Event) => {
  if (!isLock) {
    let text = (e.target as HTMLElement).innerText
    emit('update:modelValue', htmlDecode(text || ''))
    // deFormatText(text)
  }
}
const onEnterDown = (event: KeyboardEvent) => {
  // enter 和 shift+enter 表现不一致，需要单独处理换行逻辑
  if (!event.shiftKey) {
    event.preventDefault()
    var selection = window.getSelection() as Selection
    var range = selection.getRangeAt(0)
    let endContainer = range.endContainer
    let parentNode = endContainer.parentNode || inputDom.value

    let pos = getCaretPos(inputDom.value)
    if (pos === inputDom.value.innerText.length) {
      var br1 = document.createElement("br")
      var br2 = document.createElement("br")

      if (endContainer.nodeName === 'BR') {

        parentNode.insertBefore(br1, endContainer.nextSibling)
        parentNode.insertBefore(br2, endContainer.nextSibling)
        range.setStartBefore(br2)
        range.setEndBefore(br2)
      } else {
        range.insertNode(br1)
        range.insertNode(br2)
        range.setStartAfter(br2)
        range.setEndAfter(br2)
      }

    } else {
      var br1 = document.createElement("br");

      if (endContainer.nodeName === 'BR') {
        parentNode.insertBefore(br1, endContainer.nextSibling)
        range.setStartBefore(br1)
        range.setEndBefore(br1)
      } else {
        range.insertNode(br1)
        range.setStartAfter(br1)
        range.setEndAfter(br1)
      }

    }
  }
}
let caretOffset = 0
onMounted(() => {
  inputDom.value.addEventListener("paste", (e: ClipboardEvent) => {
    e.preventDefault()
    if(!e.clipboardData) return
    const text = e.clipboardData.getData('text')
    const cleanedText = text.replace(/\r/g, '')
    let pos = getCaretPos(inputDom.value)
    let innerText = inputDom.value.innerText
    let inputText = innerText.substr(0, pos) + cleanedText + innerText.substr(pos)
    caretOffset = cleanedText.length
    emit('update:modelValue', htmlDecode( inputText|| ''))
  });
})

</script>

<script lang="ts">
export default {
  name: 'HighlightInput'
}
</script>
<template>
  <div ref="inputDom" v-html="inputHtml" class="highlight-input" @input="onInput" @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd" contenteditable="true" @keydown.enter="onEnterDown"></div>
</template>

<style scoped lang='scss'>
.highlight-input {
  height: 30px;
  width: 100%;
  outline: #c0c4cc 1px solid;
  border-radius: 2px;
  padding: 2px 11px 1px 11px;
  overflow: auto;
  // white-space: nowrap;
  // 隐藏滚动条
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  &:focus-visible {
    outline-color: #409eff;
  }

  &:empty:before {
    content: attr(placeholder);
    color: #999;
  }

  &:focus:before {
    content: '';
  }
}
</style>