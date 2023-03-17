<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
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
// 转义
const escapeRegExp = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
// 光标移动最后
const caretToEnd = (obj: HTMLElement) => {
  if (window.getSelection) {//ie11 10 9 ff safari
    obj.focus(); //解决ff不获取焦点无法定位问题
    let range: any = window.getSelection();//创建range
    range.selectAllChildren(obj);//range 选择obj下所有子内容
    range.collapseToEnd();//光标移至最后
  } else if ((document as any).selection) {//ie10 9 8 7 6 5
    let range = (document as any).selection.createRange();//创建选择对象
    range.moveToElementText(obj);//range定位到obj
    range.collapse(false);//光标移至最后
    range.select();
  }
}

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
  inputHtml.value = htmlText(text, props.keywords)
  await nextTick()
  caretToEnd(inputDom.value)
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
    let text = (e.target as HTMLElement).textContent
    emit('update:modelValue', String(text))
    deFormatText(text)
  }
}
</script>

<template>
  <div ref="inputDom" v-html="inputHtml" class="highlight-input" @input="onInput" @compositionstart="onCompositionStart"
    @compositionend="onCompositionEnd" contenteditable="true"></div>
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
    width: 0!important;
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
}</style>