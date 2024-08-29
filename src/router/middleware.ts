import type { Router } from "vue-router";
import { useStore } from "vuex";
import { key } from '@/store/auth'
import { USER_SESSION_KEY } from "@/constants";


export default function authMiddleware(router: Router) {
  router.beforeEach((to, from, next) => {
    const store = useStore(key);

    const token = store.state.userToken;
    if (!token) {
      store.dispatch('syncAuth');
    }

    if (to.name !== 'login' && !store.state.userToken) {
      next({ name: 'login' });
      return;
    }

    if (to.name === 'login' && store.state.userToken) {
      next({ name: 'home' });
      return;
    }

    next();
  });
}