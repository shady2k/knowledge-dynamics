import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import VueLogger from "vuejs-logger";
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

Vue.use(Vuex);
Vue.use(VueLogger, options);
Vue.use(VueTextareaAutogrowDirective);

const store = new Vuex.Store({
    state: {
        count: 0,
        element: {
            id: 1,
            title: "test",
            blocks: [
                {
                    id: 2,
                    title: "test1",
                    data: "test test test",
                },
                {
                    id: 3,
                    title: "test2",
                    data: "test2 test2 test2",
                },
            ],
        },
    },
    mutations: {
        changeBlock(state, obj) {
            let block = null;
            block = state.element.blocks.find((item) => {
                return item.id === obj.id;
            });
            block.data = obj.data;
        },
    },
    actions: {
    },
});

new Vue({
    render: (h) => h(App),
    store,
}).$mount("#app");
