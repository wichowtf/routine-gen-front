import axios from "axios";

const base_url= "https://scienceandhealthapp.herokuapp.com/api"
const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

export default{
    namespaced: true,
    state: {
        clients: [],
        /* currentExercise: [], */
        /* MuscGroups:[] */
    },
    mutations: {
        setExercise(state, payload) {
            state.clients = payload;
        },
        /* setCurrentExercise(state, payload) {
            state.currentExercise = payload;
        }, */
        /* setMuscGroups(state, payload) {
            state.MuscGroups = payload;
        } */
    },

    actions: {

        async getClients({ commit, state }) {
            try {
                if (state.clients.length === 0) {
                    const res = await axios.get(base_url + "/clientes");//https://run.mocky.io/v3/a267d457-612f-4eff-9672-12336c3e39a8
                    commit('setExercise', res.data);
                }
            } catch (error) {
                console.error(error)
            }
        },

        /* async getMuscularGroups({ commit, state }) {
            try {
                if (state.MuscGroups.length === 0) {
                    const res = await axios.get(base_url + "/grupos-musculares");
                    commit('setMuscGroups', res.data);
                }
            } catch (error) {
                console.error(error)
            }
        }, */
        async editClient({state, commit}, editClient){
            /* let EditExerciseApi = {}; */
            /* if(editClient.hasOwnProperty('entrenamiento')){ */
                /* EditExerciseApi = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso , entrenamiento: editClient.entrenamiento  } */
            /* }else{ */
            let EditExerciseApi = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso  }
            /* } */
            
            const res =  await axios.put(base_url + "/clientes/" + editClient._id , EditExerciseApi,  config);
            return new Promise((resolve, reject) => {
                if (res.status === 200) {
                    let EditExerciseLocal = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso }
                    commit("setExercise", state.clients.filter(exercise => exercise._id !== editClient._id))
                    state.clients.push(EditExerciseLocal);
                    resolve(200);
                } else {
                    // Rechazar la promesa con un mensaje de error
                    console.log(res)
                    reject("Error en la petición HTTP");
                }
        });
        },

        async editTraining({state, commit}, editClient){
            /* let EditExerciseApi = {}; */
            /* if(editClient.hasOwnProperty('entrenamiento')){ */
                /* EditExerciseApi = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso , entrenamiento: editClient.entrenamiento  } */
            /* }else{ */
            /* let EditExerciseApi = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso  } */
            /* } */
            console.log( state, commit)
            const res =  await axios.put(base_url + "/entrenamientos/" + editClient.id , editClient.entrenamiento,  config);
            return new Promise((resolve, reject) => {
                if (res.status === 200) {
                    /* let EditExerciseLocal = {_id:editClient._id, nombre:editClient.nombre, telefono:editClient.telefono, edad:editClient.edad, peso:editClient.peso }
                    commit("setExercise", state.clients.filter(exercise => exercise._id !== editClient._id))
                    state.clients.push(EditExerciseLocal); */
                    resolve(200);
                } else {
                    // Rechazar la promesa con un mensaje de error
                    console.log(res)
                    reject("Error en la petición HTTP");
                }
        });
        },

        async addClient({ state}, NewClient) {
            /* let aux = {...NewClient, entrenamiento: 'resp._id'}
            console.log(aux); */
            return new Promise((resolve, reject) => {
                axios.post(base_url + "/entrenamientos", [[]], config)
                    .then(res2 => {
                        if (res2.status === 200) {
                            console.log(res2.data);
                            axios.post(base_url + "/clientes", {...NewClient, entrenamiento: res2.data._id}, config)
                                .then(res => {
                                    if (res.status === 200) {
                                        console.log(res.data);
                                        state.clients.push(res.data);
                                        resolve(200);
                                    } else {
                                        console.log(res);
                                        reject("Error en la petición HTTP");
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    reject("Error en la petición HTTP");
                                });
                        } else {
                            console.log(res2);
                            reject("Error en la petición HTTP");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        reject("Error en la petición HTTP");
                    });
            });
        },
         async deleteClient({ state }, deleteClient) {
            const res = await axios.delete(base_url + "/clientes/" + deleteClient._id,  config);
            return new Promise((resolve, reject) => {
                //const res = await axios.delete(base_url + "/clientes/" + deleteClient._id,  config);
                if (res.status === 200) {
                    let DelExercise = state.clients.findIndex(exercise => exercise._id === deleteClient._id)
                        if (DelExercise !== -1) {
                            state.clients.splice(DelExercise, 1);
                          }
                    resolve(200);
                } else {
                // Rechazar la promesa con un mensaje de error
                console.log(res)
                reject("Error en la petición HTTP");
                }
        });
        },
    }
}