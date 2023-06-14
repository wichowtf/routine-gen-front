<template>
<div>
    <v-snackbar color="#C62828"  v-model="$store.state.excError" timeout="5000" top>
        <v-row class="ma-0 pa-0">
            <v-icon color="#EEEEEE" dense>mdi-alert-circle-outline</v-icon>
            <p style="color: #EEEEEE" class="ma-0 pa-0 ml-3">Ejercicio Invalido</p>
        </v-row>
        <template v-slot:action="{ attrs }">
            <v-icon color="#EEEEEE" v-bind="attrs" @click="$store.state.excError = false">mdi-close</v-icon>
        </template>
    </v-snackbar>
    <v-row class="ml-4 v-card__title">Entrenamiento de {{clientName}}</v-row>
    <!-- <addExcersise :musculos="musculos" :grupos="filteredCat" :ejercicios="filteredExc" @changeMuscle="changeMuscle($event)" @changeCat="changeCat($event)"/> -->
    <v-col v-if="ejercicios.length > 0" class="ma-0 pa-0">
        <addUserData ref="UserData"></addUserData>

        <addSession v-for="(session, index) in $store.state.sessions" :session="session" :key="index" :musculos="musculos" :categorias="categorias" :ejercicios="ejercicios" :sessionIndex="index"/>
        <v-row class="ma-0 pa-0" align="center" justify="center">
            <v-btn class="my-4" color="transparent" elevation="0" rounded @click="addSession()"><v-icon icon="md:info">mdi-plus-circle-outline</v-icon>Agregar sesion</v-btn>
        </v-row>
        <v-row class="ma-0 pa-0" align="center" justify="start">
            <v-btn append-icon="mdi-check-circle" :disabled="$store.state.excError2" class="my-4"  color="transparent" elevation="2" rounded  :loading="loading" @click="loading = true; imprimir()">
                <v-icon>mdi-file-outline</v-icon>Generar Documento
            </v-btn>
            <v-btn append-icon="mdi-check-circle" :disabled="$store.state.excError2" class="my-4" color="transparent" elevation="2" rounded   @click=" save()"><v-icon>mdi-content-save</v-icon>
                Guardar entrenamiento
            </v-btn>
        </v-row>
    </v-col>
     <v-overlay :value="loading">
        <v-progress-circular
        :size="50"
        color="#18FFFF"
        indeterminate
        ></v-progress-circular>
    </v-overlay>
</div>
</template>

<script>
//:disabled="$store.state.disablePDF"
/* import addExcersise from '../components/addExcersise.vue'; */
import addSession from '../components/addSession.vue';
import addUserData from '@/components/addUserData.vue';
import {generatePDF} from '@/store/modules/pdf'
import {mapActions} from 'vuex';
import Swal from 'sweetalert2';
export default {
    name: 'home-view',
    components: {/* addExcersise */addSession, addUserData},
    data(){
        return{
            clientName:'',
            routineId: null,
            musculos:[],
            categorias:[],
            /* filteredCat:[], */
            ejercicios: [],
            /* filteredExc:[], */
            selectedFile: null,
            loading: false
        }
    },
    created(){
        this.$store.state.sessions = [];
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

        this.$store.dispatch("GET", '/ejercicios')
        .then(response => { 
            /* console.log(response) */
            this.ejercicios = response.data;
        }).catch( error => { 
            console.log(`%cERROR`, 'color: red; font-weight: bold;', error);
        });

        this.$store.dispatch("GET_CLIENT", {url:'/clientes/' , id: /* '6456ba32adae87e70b55e40a' */ this.$store.state.clientID})
        .then(response => { 
            /* this.$store.state.sessions = response.data.entrenamiento.sesiones */
            this.clientName = response.data.nombre;
            this.routineId = response.data.entrenamiento._id;
            response.data.entrenamiento.sesiones.forEach(element => {
                this.$store.state.sessions.splice(element.number, 0 , element.sesion)
            });
            this.$store.state.sessions.forEach(session => {
                session.forEach(exc => {
                    exc.id = crypto.randomUUID()
                })
            })
            console.log(this.$store.state.sessions)
        }).catch( error => { 
            console.log(`%cERROR`, 'color: red; font-weight: bold;', error);
        });
    },
    methods:{
        ...mapActions("clients", ["editTraining"/* , "getMuscularGroups" */]),
        /* changeMuscle(musculo){
            this.filteredCat = this.categorias.filter(e => e.musculo == musculo._id);
        },
        changeCat(ejercicio){
            this.filteredExc = this.ejercicios.filter(e => e.grupoMuscular._id == ejercicio._id)
        }, */
        save(){
            let EditClient = {id:this.routineId , entrenamiento:this.$store.state.sessions }
            this.editTraining(EditClient).then(codigoRespuesta => {
              if(codigoRespuesta == 200){
                Swal.fire('Editado','Se guardó correctamente', 'success')
                console.log(codigoRespuesta)
                }
            }).catch(error => {
                Swal.fire('Surgio un error', 'La operacion no pudo ser concretada', 'error')
                console.error(error);
            });
        },
        addSession(){
            this.$store.state.sessions.push([])
        },
        async imprimir(){
            console.log(this.$refs.UserData.InitialData);
            this.loading = true // activar el loader
            await generatePDF(this.$store.state.sessions, this.$refs.UserData.InitialData, this.clientName)/* .then(() => {
          this.loading = false // desactivar el loader cuando se complete la generación del PDF
        }) */
        setTimeout(()=> {this.loading = false}, 4000)
        /* console.log('val',aux) */
        },
    },
}
</script>

<style scoped>
</style>