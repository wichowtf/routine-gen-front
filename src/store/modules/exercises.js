import axios from "axios";

const base_url= "https://scienceandhealthapp.herokuapp.com/api"
//const base_url= "http://localhost:4000/api"
const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

export default{
    namespaced: true,
    state: {
        Exercise: [],
        currentExercise: [],
        MuscGroups:[]
    },
    mutations: {
        setExercise(state, payload) {
            state.Exercise = payload;
        },
        setCurrentExercise(state, payload) {
            state.currentExercise = payload;
        },
        setMuscGroups(state, payload) {
            state.MuscGroups = payload;
        }
    },

    actions: {

        async getExercise({ commit, state }) {
            try {
                if (state.Exercise.length === 0) {
                    const res = await axios.get(base_url + "/ejercicios");//https://run.mocky.io/v3/a267d457-612f-4eff-9672-12336c3e39a8
                    commit('setExercise', res.data);
                }
            } catch (error) {
                console.error(error)
            }
        },
        async getMuscularGroups({ commit, state }) {
            try {
                if (state.MuscGroups.length === 0) {
                    const res = await axios.get(base_url + "/grupos-musculares");
                    commit('setMuscGroups', res.data);
                }
            } catch (error) {
                console.error(error)
            }
        },
        async editExercise({state, commit}, editExercise){
            //console.log(editExercise)
            let EditExerciseApi = {_id:editExercise._id, nombre:editExercise.nombre, musculo: editExercise.musculo, grupoMuscular:editExercise.grupoMuscular, link:editExercise.link }
            //xgconsole.log(EditExerciseApi)
            const res =  await axios.put(base_url + "/ejercicios/" + editExercise._id , EditExerciseApi,  config);
            let EditExerciseLocal = res.data
            return new Promise((resolve, reject) => {
                if (res.status === 200) {
                    //let EditExerciseLocal = {_id:editExercise._id, nombre:editExercise.nombre, musculo: editExercise.musculo, grupoMuscular:editExercise.grupoMuscularObj, link:editExercise.link }
                    console.log(EditExerciseLocal)
                    commit("setExercise", state.Exercise.filter(exercise => exercise._id !== EditExerciseLocal._id))
                    state.Exercise.push(EditExerciseLocal);
                    resolve(200);
                } else {
                    // Rechazar la promesa con un mensaje de error
                    console.log(res)
                    reject("Error en la petición HTTP");
                }
        });
        },
        async addExercise({ state}, NewExercise) {
            const res = await axios.post(base_url + "/ejercicios", NewExercise,  config);
            return new Promise((resolve, reject) => {
                if (res.status === 200) {
                    console.log(res.data)
                    state.Exercise.push(res.data);
                    resolve(200);
                } else {
                // Rechazar la promesa con un mensaje de error
                console.log(res)
                reject("Error en la petición HTTP");
                }
        });
        },
         async deleteExercise({ state }, deleteExercise) {
            const res = await axios.delete(base_url + "/ejercicios/" + deleteExercise._id,  config);
            return new Promise((resolve, reject) => {
                //const res = await axios.delete(base_url + "/ejercicios/" + deleteExercise._id,  config);
                if (res.status === 200) {
                    let DelExercise = state.Exercise.findIndex(exercise => exercise._id === deleteExercise._id)
                        if (DelExercise !== -1) {
                            state.Exercise.splice(DelExercise, 1);
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
