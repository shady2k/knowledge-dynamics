import Vue from "vue";
import App from "./App.vue";
import store from './store';
import VueLogger from "vuejs-logger";
import VueTextareaAutogrowDirective from "vue-textarea-autogrow-directive";
import VueNeo4j from 'vue-neo4j';
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
Vue.use(VueTextareaAutogrowDirective);
Vue.use(VueNeo4j);
Vue.prototype.$eventHub = new Vue();

new Vue({
    render: (h) => h(App),
    store,
}).$mount("#app");
