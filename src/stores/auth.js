import axios from 'axios';
import { defineStore } from 'pinia';
import { show_alerta } from '../functions';

export const useAuthStore = defineStore('auth', {
  state: () => ({ authUser: null, authToken: null }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken
  },
  actions: {
    async login(form) {
      try {
        const res = await axios.post('https://peliculas-qeag.onrender.com/api/login', {
          correo: form.email,
          password: form.password
        });
        const responseData = res.data;
        if (responseData.status) {
          this.authToken = responseData.data.token;
          this.authUser = responseData.data;
          await this.router.push('/peliculas');
        } else {
          show_alerta('Login fallido. Verifica tus credenciales.', 'error', '');
        }
      } catch (error) {
        let desc = 'Error inesperado';
        if (error.response && error.response.data && error.response.data.errors) {
          desc = error.response.data.errors.join(' ');
        }
        show_alerta(desc, 'error', '');
      }
    },
    async register(form) {
      try {
        const res = await axios.post('https://peliculas-qeag.onrender.com/api/usuarios', {
          nombre: form.name,
          correo: form.email,
          password: form.password
        });
        const responseData = res.data;
        if (responseData.status) {
          show_alerta(responseData.message, 'success', '');
          setTimeout(async () => await this.router.push('/login'), 2000);
        } else {
          show_alerta('Registro fallido. Verifica los datos ingresados.', 'error', '');
        }
      } catch (error) {
        let desc = 'Error inesperado';
        if (error.response && error.response.data && error.response.data.errors) {
          desc = error.response.data.errors.join(' ');
        }
        show_alerta(desc, 'error', '');
      }
    },
    async logout() {
      try {
        await axios.get('https://peliculas-qeag.onrender.com/api/logout', {
          headers: { Authorization: `Bearer ${this.authToken}` }
        });
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        this.authToken = null;
        this.authUser = null;
        await this.router.push('/login');
      }
    }
  },
  persist: true
});
