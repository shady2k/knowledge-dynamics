import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger';
import "./assets/css/tailwind.css"

Vue.config.productionTip = false

const isProduction = process.env.NODE_ENV === 'production';
 
const options = {
    isEnabled: true,
    logLevel : isProduction ? 'error' : 'debug',
    stringifyArguments : false,
    showLogLevel : true,
    showMethodName : true,
    separator: '|',
    showConsoleColors: true
};
 
Vue.use(VueLogger, options);

new Vue({
  render: h => h(App),
}).$mount('#app')
