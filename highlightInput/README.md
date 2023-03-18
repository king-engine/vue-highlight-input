# vue3 组件模拟input，可以一边输入，一边高亮匹配关键字
示例效果：
![image](https://github.com/king-engine/vue-highlight-input/blob/master/readme/demo_img.png)



## 使用
`npm i vue3-highlight-input`

## 在vue main.js中
`import highlightInput from 'vue3-highlight-input'`

`app.use(highlightInput)`

## 单组件中
`<highlightInput v-model="myText" :keywords="keywords" :color="color" placeholder="请输入关键字"></highlightInput>`

## 参数：   
`keywords: 关键字数组    ['关键字1', '关键字2']`
`color: 高亮颜色   #F56C6C`