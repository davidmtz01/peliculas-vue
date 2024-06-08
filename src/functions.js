import Swal from 'sweetalert2';
import { nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';

export function show_alerta(msj, icon, focus = null) {
    if (focus !== null && focus !== undefined) {
        nextTick(() => {
            if (focus.value !== undefined && focus.value !== null) {
                focus.value.focus();
            }
        });
    }

    Swal.fire({
        title: msj,
        icon: icon
    });
}

export const confirmation = async (name, url, redirectPath) => {
    const result = await Swal.fire({
        title: `¿Estás seguro de que quieres eliminar ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            await axios.delete(url);
            Swal.fire('Eliminado', `${name} ha sido eliminado.`, 'success');
            // Redirigir a la página especificada después de eliminar
            if (redirectPath) {
                window.location.href = redirectPath;
            }
        } catch (error) {
            Swal.fire('Error', 'Hubo un problema al eliminar.', 'error');
            console.error('Error deleting:', error);
        }
    }
};


export async function sendRequest(method, params, url, redirect = '') {
    const authStore = useAuthStore();
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

    try {
        const response = await axios({ method, url, data: params });
        show_alerta(response.data.message, 'success');

        if (redirect) {
            setTimeout(() => {
                window.location.href = redirect;
            }, 2000);
        }

        return response.data.status;
    } catch (error) {
        let desc = 'An error occurred';
        if (error.response && error.response.data) {
            if (Array.isArray(error.response.data.errors)) {
                desc = error.response.data.errors.join(' ');
            } else {
                desc = error.response.data.message || 'An error occurred';
            }
        }
        show_alerta(desc, 'error');
        return error.response ? error.response.data.status : null;
    }
}
