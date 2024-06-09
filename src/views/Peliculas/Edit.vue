<template>
  <div class="row mt-5">
    <div class="col-md-4 offset-md-4">
      <div class="card border border-success">
        <div class="card-header bg-success border border-success"></div>
        <div class="card-body">
          <form @submit.prevent="save">
            <input type="hidden" v-model="form.id">
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
            <div v-if="form.imagenUrl" class="mb-3">
              <img :src="form.imagenUrl" alt="Imagen actual" class="img-fluid">
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
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const form = ref({
  id: '',
  nombre: '',
  clasificacion: '',
  genero: '',
  descripcion: '',
  director: '',
  imagen: null,
  imagenUrl: ''
});

const nameInput = ref(null);
const id = ref(route.params.id);
const BASE_URL = 'https://peliculas-qeag.onrender.com';

const getPelicula = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/pelicula/${id.value}`);
    const pelicula = response.data.data;
    form.value.id = pelicula.id;
    form.value.nombre = pelicula.nombre;
    form.value.clasificacion = pelicula.clasificacion;
    form.value.genero = pelicula.genero;
    form.value.descripcion = pelicula.descripcion;
    form.value.director = pelicula.director;
    form.value.imagenUrl = BASE_URL + pelicula.imagen;
  } catch (error) {
    console.error('Error fetching película:', error);
  }
};

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
    const response = await axios.put(`${BASE_URL}/api/pelicula/${id.value}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.status === 200) {
      form.value.id = '';
      form.value.nombre = '';
      form.value.clasificacion = '';
      form.value.genero = '';
      form.value.descripcion = '';
      form.value.director = '';
      form.value.imagen = null;
      form.value.imagenUrl = '';
      nextTick(() => nameInput.value.focus());
      Swal.fire({
        icon: 'success',
        title: 'Película editada',
        text: 'La película ha sido editada exitosamente.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      router.push('/peliculas');
    }
  } catch (error) {
    console.error('Error saving película:', error);
  }
};

onMounted(() => {
  getPelicula();
});
</script>
