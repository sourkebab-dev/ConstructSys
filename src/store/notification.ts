import type { InjectionKey } from "vue";
import { createStore, Store, type ActionTree, type MutationTree } from 'vuex'

export interface NotificationData {
  isShown: boolean;
  type: 'SUCCESS' | 'ERROR';
  message: string;
}

enum MutationTypes {
  SET_NOTIFICATION = 'SET_NOTIFICATION',
  RESET_NOTIFICATION = 'RESET_NOTIFICATION',
}

export const key: InjectionKey<Store<NotificationData>> = Symbol();

const state: NotificationData = {
  isShown: false,
  type: 'SUCCESS',
  message: ''
}

const mutations: MutationTree<NotificationData> = {
  [MutationTypes.SET_NOTIFICATION]: (state, payload: NotificationData) => {
    state.isShown = payload.isShown;
    state.type = payload.type;
    state.message = payload.message;
  },
  [MutationTypes.RESET_NOTIFICATION]: (state) => {
    state.isShown = false;
    state.type = 'SUCCESS';
    state.message = '';
  }
}

const actions: ActionTree<NotificationData, NotificationData> = {
  showSuccess: ({ commit }, message: string) => {
    commit(MutationTypes.SET_NOTIFICATION, { type: 'SUCCESS', message, isShown: true })
    setTimeout(() => {
      commit(MutationTypes.RESET_NOTIFICATION);
    }, 3500);
  },
  showError: ({ commit }, message: string) => {
    commit(MutationTypes.SET_NOTIFICATION, { type: 'ERROR', message, isShown: true })
    setTimeout(() => {
      commit(MutationTypes.RESET_NOTIFICATION);
    }, 3500);
  },
}

export default createStore<NotificationData>({
  state,
  actions,
  mutations,
})