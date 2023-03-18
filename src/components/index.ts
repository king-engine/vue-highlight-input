import HighlightInput from "./HighlightInput.vue";
import type { App } from "vue";

// 按需引入
export { HighlightInput };

const component = [HighlightInput];

const inpoutComponent = {
	install(vue:App) {
		component.forEach((item) => {
			vue.component(item.name, HighlightInput);
		});
	},
};

export default inpoutComponent;

