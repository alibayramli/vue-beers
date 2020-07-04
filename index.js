const store = new Vuex.Store({
    state: {
        randomBeerInfo: [],
        allBeers: [],
        generalInfo: ['All beers', 'Random beers']
    },
    mutations: {
        setRandomBeerInfo(state, payload) {
            state.randomBeerInfo.push({
                icon: 'mdi-dialpad',
                name: payload.name,
                description: payload.description,
                id: payload.id,
                tips: payload.brewers_tips,
            })
        },
        setAllBeers(state, payload) {
            state.allBeers.push(...payload);
            // once beers are fetched, attach them to the state
        },
    },
    actions: {
        async getRandomBeer({ commit }) {
            const response = await fetch("https://api.punkapi.com/v2/beers/random");
            const beers = await response.json();
            commit("setRandomBeerInfo", beers[0]);
        },
        async getAllBeers({ commit }) {
            for (let pageNumber = 1; pageNumber <= 5; pageNumber++) {
                const response = await fetch(`https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=80`);
                // since request is maximum 80 items per page, it loops through all pages and fetchs items
                const beers = await response.json();
                commit("setAllBeers", beers);
                // fetching is completed per one page, committing for mutations in store object
            }
        },
    }
})

const randomBeersComponent = {
    computed: {
        randomBeer: function () {
            console.log(`length is: ${this.$store.state.randomBeerInfo.length}`)
            return this.$store.state.randomBeerInfo;
        },
    },
    methods: {
        getRandomBeer: function () {
            this.$store.dispatch("getRandomBeer");
        },
    },
    template: ` 
    <div>
        <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720" v-if="randomBeer.length < 3">
            Click on the button to get random beers from the database, learn a few useful things about
            them,
            you can thank me later 😉
        </v-responsive>
        <v-btn color="blue" href="" large @click="getRandomBeer" v-if = "randomBeer.length < 3">
            <span class="white--text text--darken-1 font-weight-bold ">
                Get beers
            </span>
        </v-btn>
        <div class="py-2"></div>
        <div v-if="randomBeer.length === 3">
            <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
                Great! Seems you enjoy searching, click on advanced query button to start searching based on above mentioned values
            </v-responsive>
            <v-btn color="blue" href="" large @click="" >
                <span class="white--text text--darken-1 font-weight-bold ">
                    Advanced query
                </span>
            </v-btn>
        </div>

        <v-responsive class="mx-auto mb-12" width="56"></v-responsive>
        <v-row>
            <v-col v-for="({ icon, name, description, id, tips }, i) in randomBeer" :key="i" cols="12" md="4">
                <v-card class="py-12 px-4" color="grey lighten-5" flat  height="100%">
                    <v-theme-provider dark>
                        <v-avatar color="primary" size="88">
                            <v-icon large v-text="icon"></v-icon>
                        </v-avatar>
                    </v-theme-provider>
                    <v-card-title class="justify-center text-uppercase" v-text="name"></v-card-title>   
                    <p style="color:blue">id: <span class="subtitle-1" v-text="id"></span></p><hr>
                    <v-card-text class="subtitle-1" v-text="description"></v-card-text> <hr>
                    <h4 class="title" style="color:grey"><b>tips:</b> <span class="subtitle-1" v-text="tips"></span></h4>
                </v-card>
            </v-col>
        </v-row>
    </div>`
}
const statsComponent = {
    beforeMount() {
        this.$store.dispatch("getAllBeers");
    },
    computed: {
        randomBeerInfo: function () {
            return this.$store.state.randomBeerInfo;
        },
        allBeers: function () {
            return this.$store.state.allBeers;
        },
        generalInfo: function () {
            return this.$store.state.generalInfo;
        },
    },
    template: ` 
    <v-parallax v-if="randomBeerInfo.length !==0"
          :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
          src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
        >
          <v-container fill-height>
            <v-row class="mx-auto">
              <v-col
                cols="12"
                md="3"
              >
                <div class="text-center">
                    <div
                        class="title font-weight-regular text-uppercase"
                        v-text="allBeers.length"> 
                    </div>
                    <div
                        class="title font-weight-regular text-uppercase"
                        v-text="generalInfo[0]">
                    </div>
                    </div>
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <div class="text-center">
                    <div
                        class="title font-weight-regular text-uppercase"
                        v-text="randomBeerInfo.length"> 
                    </div>
                    <div
                        class="title font-weight-regular text-uppercase"
                        v-text="generalInfo[1]">
                    </div>
                </div>
              </v-col>
             
            </v-row>
          </v-container>
        </v-parallax>`
}

new Vue({
    el: '#app',
    store: store,
    vuetify: new Vuetify(),
    components: { randomBeersComponent, statsComponent },
})