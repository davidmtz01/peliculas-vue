<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { confirmation } from '../../functions';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer ' + authStore.authToken;

const peliculas = ref([]);
const load = ref(false);
const BASE_URL = 'https://peliculas-qeag.onrender.com';

const getPeliculas = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/pelicula`);
        peliculas.value = response.data.data;
    } catch (error) {
        console.error('Error fetching peliculas:', error);
    } finally {
        load.value = true;
    }
};

const deletePelicula = async (id, name) => {
    try {
        await confirmation(name, `${BASE_URL}/api/pelicula/${id}`);
        await getPeliculas();
    } catch (error) {
        console.error('Error deleting pelicula:', error);
    }
};

onMounted(() => {
    getPeliculas();
});
</script>

<template>
    <div class="row">
        <div class="col-md-4 offset-md-4">
            <div class="d-grid col-10 mx-auto">
                <router-link :to="{ path: 'create' }" class="btn btn-dark">
                    <i class="fa-solid fa-circle-plus"> Add</i>
                </router-link>
            </div>
        </div>
    </div>
    <div class="row mt-3">
        <div class="col-md-6 offset-md-3">
            <div class="card border border-white text-center" v-if="!load">
                <div class="card-body">
                    <img src="/200.gif" class="img-fluid" alt="Loading...">
                </div>
            </div>
            <div class="table-responsive" v-else>
                <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NOMBRE</th>
                            <th>CLASIFICACION</th>
                            <th>GENERO</th>
                            <th>DESCRIPCION</th>
                            <th>DIRECTOR</th>
                            <th>IMAGEN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(pel, i) in peliculas" :key="pel._id">
                            <td>{{ i + 1 }}</td>
                            <td>{{ pel.nombre }}</td>
                            <td>{{ pel.clasificacion }}</td>
                            <td>{{ pel.genero }}</td>
                            <td>{{ pel.descripcion }}</td>
                            <td>{{ pel.director }}</td>
                            <td><img :src="BASE_URL + pel.imagen" alt="Imagen" width="50"></td>
                            <td>
                                <router-link :to="{ path: 'edit/' + pel._id }" class="btn btn-warning">
                                    <i class="fa-solid fa-edit"></i>
                                </router-link>
                            </td>
                            <td>
                                <button class="btn btn-danger" @click="$event => deletePelicula(pel._id, pel.nombre)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
