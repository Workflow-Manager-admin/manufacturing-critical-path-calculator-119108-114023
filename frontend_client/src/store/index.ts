import { createStore } from 'vuex';
import jwtDecode from 'jwt-decode';
import { loginUser, registerUser } from '../utils/api';

interface State {
  token: string | null;
  user: any | null;
  authError: string | null;
}

const store = createStore<State>({
  state: {
    token: localStorage.getItem('token'),
    user: null,
    authError: null
  },
  mutations: {
    setToken(state, token: string) {
      state.token = token;
      localStorage.setItem('token', token);
      state.user = jwtDecode(token);
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.authError = null;
      localStorage.removeItem('token');
    },
    setAuthError(state, message: string) {
      state.authError = message;
    }
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const { access_token } = await loginUser(email, password);
        commit('setToken', access_token);
        commit('setAuthError', null);
      } catch (e: any) {
        commit('setAuthError', e?.message || 'Login failed');
      }
    },
    async register({ commit }, { email, password }) {
      try {
        await registerUser(email, password);
        // Auto-login after registration
        const { access_token } = await loginUser(email, password);
        commit('setToken', access_token);
        commit('setAuthError', null);
      } catch (e: any) {
        commit('setAuthError', e?.message || 'Registration failed');
      }
    },
    logout({ commit }) {
      commit('clearAuth');
    }
  }
});

export default store;
