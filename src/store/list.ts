import type { InjectionKey } from "vue";
import { createStore, Store, type ActionTree, type MutationTree } from 'vuex';
import { MOCK_LIST } from "@/constants";

export type ProjectStage = 'CONCEPT' | 'DESIGN' | 'PRE_CONSTRUCTION' | 'CONSTRUCTION'

export interface ListData {
  projectId: string;
  projectName: string;
  projectLocation: string;
  projectStage: ProjectStage;
  projectCategory: string;
  startDate: string;
  description: string;
  creatorId: string;
}

export interface SearchParameters {
  projectName?: string;
  projectId?: string;
  page: number;
}

interface State {
  list: ListData[],
  totalData: number;
  isLoading: boolean;
  appliedFilters?: Omit<SearchParameters, 'page'>;
}

enum MutationTypes {
  SET_LIST = 'SET_LIST',
  SET_TOTAL = 'SET_TOTAL',
  SET_LOADING = 'SET_LOADING',
  SET_APPLIED_FILTER = 'SET_APPLIED_FILTER',
}

export const key: InjectionKey<Store<State>> = Symbol();

const state: State = {
  list: [],
  totalData: 0,
  isLoading: false,
  appliedFilters: {},
}

const mutations: MutationTree<State> = {
  [MutationTypes.SET_LIST]: (state, payload: ListData[]) => {
    state.list = payload;
  },
  [MutationTypes.SET_TOTAL]: (state, payload: number) => {
    state.totalData = payload;
  },
  [MutationTypes.SET_LOADING]: (state, payload: boolean) => {
    state.isLoading = payload;
  },
  [MutationTypes.SET_APPLIED_FILTER]: (state, payload: Omit<SearchParameters, 'page'>) => {
    state.appliedFilters = payload;
  },
}

const actions: ActionTree<State, State> = {
  loadList: async ({ commit }, payload: SearchParameters) => {
    return new Promise<void>((resolve) => {
      commit(MutationTypes.SET_LOADING, true);
      setTimeout(() => {
        const result = MOCK_LIST.filter((data) => {
          let criteriaId = true;
          let criteriaName = true;
          if (payload.projectId) criteriaId = payload.projectId === data.projectId;
          if (payload.projectName) criteriaName = data.projectName.toLowerCase().includes(payload.projectName.toLowerCase());

          return criteriaId && criteriaName;
        });

        const paginatedResult = result.slice((payload.page - 1) * 10, 10 * payload.page);


        const { page: _, ...searchParams } = payload;

        commit(MutationTypes.SET_TOTAL, Math.ceil(result.length / 10));
        commit(MutationTypes.SET_LIST, paginatedResult);
        commit(MutationTypes.SET_APPLIED_FILTER, searchParams);
        resolve();
        commit(MutationTypes.SET_LOADING, false);
      }, 1000);
    })
  },
  addList(_, payload: ListData) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        MOCK_LIST.unshift(payload);
        resolve();
      }, 1000);
    })
  },
  deleteList({ commit }, payload: string) {
    commit(MutationTypes.SET_LOADING, true);

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_LIST.findIndex((data) => data.projectId === payload);
        if (idx === -1) {
          reject();
          return;
        }

        MOCK_LIST.splice(idx, 1);
        resolve();
      }, 1000);
    })
  },
  updateList(_, { id, data }: { id: string, data: ListData }) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const idx = MOCK_LIST.findIndex((data) => data.projectId === id);
        if (idx === -1) {
          reject();
          return;
        }
        MOCK_LIST[idx] = data;
        resolve();
      }, 1000);
    })
  },
}

export default createStore<State>({
  state,
  actions,
  mutations,
})