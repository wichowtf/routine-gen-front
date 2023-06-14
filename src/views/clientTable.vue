<template>
<v-row class="ma-0 pa-0" justify="center" >
    <v-container>
        <h1 class="mb-2">Lista de Clientes</h1>
    <v-data-table
        class="elevation-1"
        :search="search"
        :items="clients"
        :headers="headers"
        :no-data-text= "'No hay datos disponibles'"
        :footer-props="{
        itemsPerPageOptions:[5,10,15,-1],
        itemsPerPageText: 'Pacientes por pagina',
        itemsPerPageAllText: 'Todo',
        }">
      <template v-slot:top >
        <center>
            <v-toolbar class="py-4" flat color="white" max-width="100%" >
                <v-text-field v-model="search" label="Buscar" single-line class="mr-4" append-icon="mdi-magnify"></v-text-field>
                <v-btn color="#002366" dark class="mb-4 text-none" rounded @click="OpenClientDialog">
                    Agregar cliente
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
                    <v-icon  class="detailIcon" @click="viewTraining(item._id)">
                        mdi-dumbbell
                    </v-icon>
            </v-btn>
        </template>
        <span>Editar Entrenamiento</span>
    </v-tooltip>
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon  class="detailIcon" @click="EditOpenClientDialog(item)">
                        mdi-pencil
                    </v-icon>
            </v-btn>
        </template>
        <span>Editar Cliente</span>
    </v-tooltip>
    <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
                <v-icon   class="detailIcon" @click="deleteItem(item)" color="red">
                    mdi-delete-forever-outline
                </v-icon>
            </v-btn>
    </template>
        <span>Eliminar Cliente</span>
    </v-tooltip>
    </template>
      </v-data-table>           
      <clientDialog :accion2="accion2" ref="clientDialog"></clientDialog>
    </v-container>
</v-row>
</template>

<script>
import clientDialog from "@/components/NewClientDialog"
import {mapActions,mapMutations,mapState} from 'vuex';
import Swal from 'sweetalert2';
//import {generatePDF} from '@/store/modules/pdf'
export default {
    name: 'clients-view',
    components: {
        clientDialog
    },
    data() {
        return {
            accion2: false,
            search: "",
            headers: [
            {text:"Nombre del paciente",value: "nombre"},
            {text:"Telefono",value: "telefono"},
            {text:"Edad",value: "edad" ,sortable:false},
            {text:"Peso",value: "peso",sortable:false},
            {text:"Acciones",value: "actions",sortable:false},
            ],
        }
  },
  methods:{
    ...mapActions("clients", ["getClients", "deleteClient"/* , "getMuscularGroups" */]),
    ...mapMutations("clients"),

    viewTraining(id){
        this.$store.state.clientID = id;
        this.$router.push({ path: '/home'})
    },
    OpenClientDialog() {
        this.accion2 = true;
                this.$refs.clientDialog.dialog = true;
                this.$refs.clientDialog.accion = "add"
            },
    EditOpenClientDialog(item) {
        this.accion2 = false;
        /* console.log(item) */
        let editObject = {_id:item._id, nombre:item.nombre, telefono:item.telefono, edad:item.edad,  peso:item.peso}
        this.$refs.clientDialog.dialog = true;
        this.$refs.clientDialog.accion = "edit"
        this.$refs.clientDialog.client = editObject
        //generatePDF(this.clients)
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
                this.deleteClient(item).then(codigoRespuesta => {
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
...mapState("clients", ["clients"/* , "MuscGroups" */])
},
async created(){
   await this.getClients();
},
mounted(){
    /* this.getMuscularGroups();  */
}
}
</script>

<style>

</style>