# vue3 组件模拟input，可以一边输入，一边高亮匹配关键字
示例效果：
![image](https://github.com/king-engine/vue-highlight-input/blob/master/readme/demo_img.png)

## npm使用
```sh 
npm i vue3-highlight-input
```

## 在vue main.js中
```sh 
import highlightInput from 'vue3-highlight-input'
import 'vue3-highlight-input/style.css'
app.use(highlightInput)
```

## 单组件中
```sh 
<highlightInput v-model="myText" :keywords="keywords" :color="color" placeholder="请输入关键字"></highlightInput>
```

## 参数：   
`keywords: 关键字数组    ['关键字1', '关键字2']`  
`color: 高亮颜色   #F56C6C`



## 项目运行

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
