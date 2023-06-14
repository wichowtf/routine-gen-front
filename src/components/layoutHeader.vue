<template>
<v-app-bar app height="76px" color="#27B2FD" elevation="0" class="ma-0 pa-0 px-10">
    <v-row justify="space-between" align="center" class="ma-0 pa-0">
        <v-img src="@/assets/header-logo.svg" max-height="32px" max-width="175px"></v-img>
        <v-spacer></v-spacer>
        <v-app-bar-title class="ma-0 pa-0 ">Hola {{name}}! Bienvenido</v-app-bar-title>
        <!-- <v-row align="center"><p class="title">Hola {{$store.state.user.name}}! Bienvenido</p></v-row> -->
        
        
        <v-divider class="mx-8" color="#002366" vertical></v-divider>
        <v-btn class="text-none mr-3" rounded outlined color="#000080" @click="$router.push({ path: '/clientes'})">Clientes</v-btn>
        <v-btn class="text-none" rounded outlined color="#000080" @click="$router.push({ path: '/training'})">Ejercicios</v-btn>
        <!-- <v-btn class=" text-none v-btnTrain mx-8" rounded color="#000080" @click="$router.push({ path: '/home'})"><v-icon icon="md:info">mdi-plus-circle-outline</v-icon> Entrenamiento</v-btn> -->
    </v-row>
</v-app-bar>
</template>

<script>
export default {
name: "my-component",
  components: {
    
  },
  data() {
    return {
       name:'Ricardo',
    }
  }
}
</script>

<style scoped>
.v-toolbar>>>.v-toolbar__content{
    padding: 0px !important;
    
}
.v-app-bar{
    color: #27B2FD;
}
.v-btnTrain{
    color: #27B2FD;
}
.v-app-bar-title{
    color:#002366;
}
.title{
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    /* line-height: 32px; */
    color: #002366;
}
</style>