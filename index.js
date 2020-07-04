const store = new Vuex.Store({
    state: {
        features: [],
        beer: {},
    },
    mutations: {
        setBeer(state, payload) {
            state.beer = payload;
        },
        setFeatures(state, payload) {
            state.features.push({
                icon: 'mdi-dialpad',
                name: payload.name,
                description: payload.description,
                id: payload.id,
                tips: payload.brewers_tips,
            })
        }
    },
    actions: {
        async getBeer({ commit }) {
            const response = await fetch("https://api.punkapi.com/v2/beers/random");
            const beers = await response.json();
            commit("setBeer", beers[0]);
            commit("setFeatures", beers[0]);
        },
    }
})

const randomBeersComponent = {
    computed: {
        features: function () {
            return this.$store.state.features;
        },
    },
    methods: {
        getBeer: function () {
            this.$store.dispatch("getBeer");
        },
    },
    template: ` 
    <div>
        <v-btn color="blue" href="" large @click="getBeer">
            <span class="white--text text--darken-1 font-weight-bold ">
                Get beers
            </span>
        </v-btn>
        <v-responsive class="mx-auto mb-12" width="56"></v-responsive>
        <v-row>
            <v-col v-for="({ icon, name, description, id, tips }, i) in features" :key="i" cols="12" md="4">
                <v-card class="py-12 px-4" color="grey lighten-5" flat  height="100%">
                    <v-theme-provider dark>
                        <v-avatar color="primary" size="88">
                            <v-icon large v-text="icon"></v-icon>
                        </v-avatar>
                    </v-theme-provider>
                    <v-card-title class="justify-center text-uppercase" v-text="name"></v-card-title>   
                    <p style="color:blue">id: <span class="subtitle-1" v-text="id"></span></p>
                    <v-card-text class="subtitle-1" v-text="description"></v-card-text>
                    <h4 class="title" style="color:grey"><b>tips:</b> <span class="subtitle-1" v-text="tips"></span></h4>
                </v-card>
            </v-col>
        </v-row>
    </div>`
}

new Vue({
    el: '#app',
    store: store,
    vuetify: new Vuetify(),
    components: { randomBeersComponent },
})





