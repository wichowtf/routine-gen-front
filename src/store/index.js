import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import exercises from './modules/exercises'
import clients from './modules/clients'
Vue.use(Vuex)

 const base_url= "https://scienceandhealthapp.herokuapp.com/api" 

export default new Vuex.Store({
  state: {
    clientID: null,
    user: null,
    sessions:[
      /* [{}, {}, {}],
      [{}, {}] */
    ],
    excError: false,
    excError2: false,
    disablePDF: false,
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    LOGIN: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
          axios.post(base_url + "/auth/login", JSON.stringify(data), {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {
              resolve(response);
              commit
          }).catch(err => { reject(err); })
      })
    },
    GET: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
          axios.get(base_url + data/* , JSON.stringify(data) */, {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {
              resolve(response);
              commit
          }).catch(err => { reject(err); })
      })
    },
    GET_CLIENT: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
          axios.get(base_url + data.url + data.id/* , JSON.stringify(data) */, {headers: {
            'Content-Type': 'application/json'
          }}).then(response => {
              resolve(response);
              commit
          }).catch(err => { reject(err); })
      })
    },
  },
  modules: {
    exercises,
    clients
  }
})
