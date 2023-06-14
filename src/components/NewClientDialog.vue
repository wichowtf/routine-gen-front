<template >
    <div ref="clientDialog">
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        width="600"
        
      >
        <v-card>
          <v-card-title>
            <span class="text-h5">{{title}}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Nombre del cliente*"
                    v-model="client.nombre"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Telefono*"
                    v-model="client.telefono"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Edad*"
                    type="number"
                    v-model="client.edad"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Peso*"
                    type="number"
                    v-model="client.peso"
                    required
                  ></v-text-field>
                </v-col>
                <!-- <v-col cols="6">
                  <v-autocomplete
                    label="Grupo Muscular *"
                    required
                    v-model="client.grupoMuscularName"
                    :items= exerciseName
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Link*"
                    v-model="client.link"
                    required
                  ></v-text-field>
                </v-col> -->
              </v-row>
            </v-container>
            <small>*Indica que es requerido</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="close"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="submit()"
            >
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</div>
</template>

<script>
import {mapActions,mapMutations,mapState} from 'vuex';
import Swal from 'sweetalert2';
export default {
  props:{accion2: Boolean},
    data() {
        return {
            dialog: false,
            client:{
              nombre:"",
              telefono:"",
              peso:"",
              edad:""
            },
            accion:"",
            titulo:"",
        }
  },
  created(){
  },
  methods:{
    ...mapActions("clients", ["addClient","editClient"/* , "getMuscularGroups" */]),
    ...mapMutations("clients"/* ,["setCurrentExercise"] */),
     submit(){
      /* const grupoMuscularObj = this.MuscGroups.find(objeto => objeto.nombre == this.client.grupoMuscularName);
      const grupoMuscularId = grupoMuscularObj._id; */
      if(this.accion === "add"){
          let newClient = {nombre:this.client.nombre, telefono:this.client.telefono, peso:parseInt(this.client.peso),  edad:parseInt(this.client.edad)/* , entrenamiento:{} */}
          this.addClient(newClient).then(codigoRespuesta => {
                if(codigoRespuesta == 200){
                Swal.fire('Agregado', this.client.nombre + ' agregado correctamente', 'success')
                    this.close()
                  }
            }).catch(error => {
                Swal.fire('Surgio un error', 'La operacion no pudo ser concretada', 'error')
                console.error(error);
                this.close()
            });
      } else if(this.accion === "edit"){
        let EditClient = {_id:this.client._id, nombre:this.client.nombre, telefono:this.client.telefono, peso:this.client.peso,  edad:this.client.edad }
        this.editClient(EditClient).then(codigoRespuesta => {
              if(codigoRespuesta == 200){
              Swal.fire('Editado', this.client.nombre + ' editado correctamente', 'success')
                  this.close()
                }
          }).catch(error => {
              Swal.fire('Surgio un error', 'La operacion no pudo ser concretada', 'error')
              console.error(error);
              this.close()
          });
      }
        },
        close(){
          this.client={nombre:"", grupoMuscular:"", link:""}
          this.dialog = false
        },
        
  },
  computed:{
  ...mapState("clients"),
  title(){
    //console.log('refs',this.accion2)
    if(this.accion2){
      return "Agregar Cliente"
    }else{
      return "Editar Cliente"
    }
  }
  /* exerciseName(){
          const data = this.MuscGroups.map(obj => ({text:obj.nombre, value: obj.nombre}));
          return data
        } */

},

}

</script>

<style>

</style>