<template>
<v-row class="ma-0 pa-0" justify="center" >
    <v-container>
        <h1>Lista de Ejercicios</h1>
    <v-data-table
        class="elevation-1"
        :search="search"
        :items="Exercise"
        :headers="headers"
        :no-data-text= "'No hay datos disponibles'"
        :footer-props="{
        itemsPerPageOptions:[5,10,15,-1],
        itemsPerPageText: 'Ejercicios por pagina',
        itemsPerPageAllText: 'Todo',
        }">
      <template v-slot:top >
        <center>
            <v-toolbar flat color="white" max-width="100%" >
                <v-text-field v-model="search" label="Buscar" single-line class="mr-4" append-icon="mdi-magnify"></v-text-field>
                <v-btn color="#002366" dark class="mb-4 text-none" rounded @click="OpenMuscleDialog">
                    Agregar ejercicio
                </v-btn>
            </v-toolbar>
        </center>
    </template>
    <template v-slot:[`item.link`]="{ item }">
      <a :href="item.link" target="_blank">{{ item.link }}</a>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon  class="detailIcon" @click="EditOpenMuscleDialog(item)">
                        mdi-pencil
                    </v-icon>
            </v-btn>
        </template>
        <span>Editar</span>
    </v-tooltip>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <v-icon   class="detailIcon" @click="deleteItem(item)" color="red">
                    mdi-delete-forever-outline
                </v-icon>
            </v-btn>
    </template>
        <span>Eliminar</span>
    </v-tooltip>
    </template>
      </v-data-table>           
      <MusculesDialog v-if="musculos.length > 0 && categorias.length > 0" :musculos="musculos" :categorias="categorias" :accion2="accion2" ref="MusculesDialog"></MusculesDialog>
    </v-container>
</v-row>
</template>

<script>
import MusculesDialog from "@/components/NewExerciseDialog"
import {mapActions,mapMutations,mapState} from 'vuex';
import Swal from 'sweetalert2';
//import {generatePDF} from '@/store/modules/pdf'
export default {
    name: 'training-view',
    components: {
        MusculesDialog
    },
    data() {
        return {
            musculos: [],
            categorias:[],
            accion2: false,
            search: "",
            headers: [
            {text:"Nombre del ejercicio",value: "nombre"},
            {text:"Link del video",value: "link"},
            {text:"Acciones",value: "actions",sortable:false},
            ],
        }
  },
  methods:{
    ...mapActions("exercises", ["getExercise", "deleteExercise", "getMuscularGroups"]),
    ...mapMutations("exercises",["setCurrentExercise"]),

    OpenMuscleDialog() {
        this.accion2 = true;
                this.$refs.MusculesDialog.dialog = true;
                this.$refs.MusculesDialog.accion = "add"
            },
    EditOpenMuscleDialog(item) {
        this.accion2 = false;
        console.log(item)
        let editObject = {_id:item._id, nombre:item.nombre, grupoMuscularName:item.grupoMuscular.nombre, link:item.link }
        this.$refs.MusculesDialog.dialog = true;
        this.$refs.MusculesDialog.accion = "edit"
        this.$refs.MusculesDialog.exercise = editObject
        this.$refs.MusculesDialog.musculoSelect = item.musculo ? item.musculo.nombre : ''
        console.log(editObject)
        //generatePDF(this.Exercise)
            },
    deleteItem(item){
        Swal.fire({
            title: 'Confirma para eliminar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            reverseButtons: true
            }).then((result) => {
            if (result.isConfirmed) {
                this.deleteExercise(item).then(codigoRespuesta => {
                    if(codigoRespuesta === 200){
                    Swal.fire('Eliminado', item.nombre + ' se eliminó correctamente', 'success')}
                }).catch(error => {
                    Swal.fire('Surgio un error', 'La operacion no pudo ser concretada', 'error')
                console.error(error);
                });
               
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss ===  Swal.DismissReason.cancel
            ) {
                Swal.fire('Cancelado', 'Se canceló la operacion', 'error')
            }
            })
    }
  },
  computed:{
...mapState("exercises", ["Exercise", "MuscGroups"])
},
async created(){
   await this.getExercise();
   this.$store.dispatch("GET", '/musculos')
    .then(response => { 
        /* console.log(response) */
        this.musculos = response.data;
    }).catch( error => { 
        console.log(`%cERROR`, 'color: red; font-weight: bold;', error);
    });

    this.$store.dispatch("GET", '/grupos-musculares')
    .then(response => { 
        /* console.log(response) */
        this.categorias = response.data;
    }).catch( error => { 
        console.log(`%cERROR`, 'color: red; font-weight: bold;', error);
    });
},
mounted(){
    this.getMuscularGroups(); 
}
}
</script>

<style>

</style>