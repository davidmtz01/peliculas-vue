<script setup>
import {ref,onMounted} from 'vue';
import { useAuthStore } from '../../stores/auth';
import SelectInput from '../..components/SelectInput.vue';
import DataTable from 'datatables.net-vue3';
import 'datatables.net-dt/css/jquery.dataTables.css';
import ButtonsHtml5 from 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-responsive-dt';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';
import JsZip from 'jszip';
import pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfmake.vfs;
window.JSZip = JsZip;
DataTable.use(ButtonsHtml5);
const authStore = useAuthStore();
axios.defaults.headers.common['Authorization'] = 'Bearer '+authStore.authToken;

const peliculas = ref([]);
const column1 = ref([]);
const column2 = ref([]);
const column3 = ref([]);
const column4 = ref([]);
const column5 = ref([]);
const column6 = ref([]);
const column7 = ref([]);

onMounted( async () =>{
    const d = await axios.get('/api/pelicula');
    peliculas.value = d.data;
});

solumns1

</script>
<templade></templade>