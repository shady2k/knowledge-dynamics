import Vue from 'vue'
import Vuex from 'vuex'
import { createLogger } from 'vuex'
//import blocks from './modules/blocks'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import { state } from './state'

const isProduction = process.env.NODE_ENV === "production";
Vue.use(Vuex);

const loggerOptions = {
  collapsed: false, // auto-expand logged mutations
  filter (mutation /*, stateBefore, stateAfter*/) {
    console.table(mutation);
    // returns `true` if a mutation should be logged
    // `mutation` is a `{ type, payload }`
    return mutation.type !== "aBlocklistedMutation"
  },
  actionFilter (action /*, state*/) {
    // same as `filter` but for actions
    // `action` is a `{ type, payload }`
    return action.type !== "aBlocklistedAction"
  },
  transformer (state) {
    // transform the state before logging it.
    // for example return only a specific sub-tree
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutations are logged in the format of `{ type, payload }`
    // we can format it any way we want.
    return mutation.type
  },
  actionTransformer (action) {
    // Same as mutationTransformer but for actions
    return action.type
  },
  logActions: true, // Log Actions
  logMutations: true, // Log mutations
  logger: console, // implementation of the `console` API, default `console`
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
  },
  strict: true,
  plugins: !isProduction ? [createLogger(loggerOptions)] : []
});

