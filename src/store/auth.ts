import type { InjectionKey } from "vue";
import { createStore, Store, type ActionTree, type MutationTree } from 'vuex'
import { USER_DATA, USER_SESSION_KEY, type UserAuth } from "@/constants";
import { generateRandString } from "@/utils/crypto";

export interface UserData {
  userName: string;
  userToken: string;
}

enum MutationTypes {
  SET_LOGIN = 'SET_LOGIN',
}

export const key: InjectionKey<Store<UserData>> = Symbol();

const state: UserData = {
  userName: '',
  userToken: ''
};

const mutations: MutationTree<UserData> = {
  [MutationTypes.SET_LOGIN]: (state, payload: UserData) => {
    state.userName = payload.userName;
    state.userToken = payload.userToken
  }
}

const actions: ActionTree<UserData, UserData> = {
  login: async ({ commit }, { userName, password }: UserAuth) => {
    // mock login
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser: UserAuth | undefined = USER_DATA
          .find((val) => val.userName === userName && val.password === password);
        if (foundUser) {
          const generatedToken = generateRandString(16);

          // would probably use cookie but for the sake of simplicity, and since this is a mock login i'll use session storage
          sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify({ userName: foundUser.userName, userToken: generatedToken }));
          commit(MutationTypes.SET_LOGIN, { userName: foundUser.userName, userToken: generatedToken });
          resolve();
        } else {
          reject()
        }
      }, 1000);
    })
  },
  logout: async ({ commit }) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        sessionStorage.removeItem(USER_SESSION_KEY);
        commit(MutationTypes.SET_LOGIN, { userName: '', userToken: '' });
        resolve();
      }, 1000);
    })
  },
  syncAuth: async ({ commit }) => {
    const session = sessionStorage.getItem(USER_SESSION_KEY);
    if (!session) return;
    commit(MutationTypes.SET_LOGIN, JSON.parse(session));
  }
}

export default createStore<UserData>({
  state,
  actions,
  mutations,
})