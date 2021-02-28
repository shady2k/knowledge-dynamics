import Vue from "vue";
import App from "./App.vue";
import store from './store';
import VueLogger from "vuejs-logger";
import AsyncComputed from 'vue-async-computed';
import VueTextareaAutogrowDirective from "vue-textarea-autogrow-directive";
import "./assets/css/tailwind.css";

Vue.config.productionTip = false;

const isProduction = process.env.NODE_ENV === "production";

const options = {
    isEnabled: true,
    logLevel: isProduction ? "error" : "debug",
    stringifyArguments: false,
    showLogLevel: true,
    showMethodName: true,
    separator: "|",
    showConsoleColors: true,
};
Vue.use(VueLogger, options);

Vue.use(AsyncComputed);
Vue.use(VueTextareaAutogrowDirective);

new Vue({
    render: (h) => h(App),
    store,
}).$mount("#app");
