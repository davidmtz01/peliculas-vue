<template>
    <div class="row mt-5">
        <div class="col-md-4 offset-md-4">
            <div class="card border border-success">
                <div class="card-header bg-success border border-success"></div>
                <div class="card-body">
                    <form @submit.prevent="save">
                        <div class="input-group mb-3">
                            <span class="input-group-text">
                                <i class="fa-solid fa-film"></i>
                            </span>
                            <input autofocus type="text" v-model="form.nombre" placeholder="Nombre de la película" class="form-control" required ref="nameInput">
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">C</span>
                            <input type="text" v-model="form.clasificacion" placeholder="Clasificación" class="form-control" required>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">G</span>
                            <input type="text" v-model="form.genero" placeholder="Género" class="form-control" required>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">D</span>
                            <textarea v-model="form.descripcion" placeholder="Descripción" class="form-control" required></textarea>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">D</span>
                            <input type="text" v-model="form.director" placeholder="Director" class="form-control" required>
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text">I</span>
                            <input type="file" @change="onFileChange" class="form-control">
                        </div>
                        <div class="d-grid col-10 mx-auto">
                            <button class="btn btn-dark">
                                <i class="fa-solid fa-save"></i> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { ref, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import Swal from 'sweetalert2';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const peliculas = ref([]);
const load = ref(false);
const router = useRouter();

const getPeliculas = async () => {
    try {
        const response = await axios.get('https://peliculas-qeag.onrender.com/api/pelicula');
        peliculas.value = response.data.data;
    } catch (error) {
        console.error('Error fetching peliculas:', error);
    } finally {
        load.value = true;
    }
};

onMounted(() => {
    getPeliculas();
});

const form = ref({
    nombre: '',
    clasificacion: '',
    genero: '',
    descripcion: '',
    director: '',
    imagen: null
});
const nameInput = ref(null);

const onFileChange = (event) => {
    const file = event.target.files[0];
    form.value.imagen = file;
};

const save = async () => {
    const formData = new FormData();
    formData.append('nombre', form.value.nombre);
    formData.append('clasificacion', form.value.clasificacion);
    formData.append('genero', form.value.genero);
    formData.append('descripcion', form.value.descripcion);
    formData.append('director', form.value.director);
    if (form.value.imagen) {
        formData.append('imagen', form.value.imagen);
    }

    try {
        const response = await axios.post('https://peliculas-qeag.onrender.com/api/pelicula', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
            form.value.nombre = '';
            form.value.clasificacion = '';
            form.value.genero = '';
            form.value.descripcion = '';
            form.value.director = '';
            form.value.imagen = null;
            nextTick(() => nameInput.value.focus());
            Swal.fire({
                icon: 'success',
                title: 'Película agregada',
                text: 'La película ha sido agregada exitosamente.',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            router.push('/peliculas');
        } else {
            console.error('Error al guardar pelicula:', response.statusText);
        }
    } catch (error) {
        console.error('Error al guardar pelicula:', error);
    }
};
</script>
