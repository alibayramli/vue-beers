const store = new Vuex.Store({
    state: {
        randomBeerInfo: [],
        allBeers: [],
        generalInfo: ['All beers', 'Random beers', 'Query results'],
        queryResults: [],
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
        setQueryresults(state, payload) {
            state.queryResults = payload;
            console.log('hey in set')
            console.log(state.queryResults)
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
    beforeMount() {
        this.$store.dispatch("getAllBeers");
    },
    computed: {
        randomBeer: function () {
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
        <h2 class="display-2 font-weight-bold mb-3">LETS GIVE YOU FACTS</h2>
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
                Great! Seems you enjoy viewing, click on advanced query button to start filtering values or go to stats to see what you have logged so far
            </v-responsive>
            <v-btn color="blue" class='my-2' href="" large @click="$vuetify.goTo('#advanced-query')" >
                <span class="white--text text--darken-1 font-weight-bold ">
                    Advanced query
                </span>
            </v-btn>
            <v-btn color="green" href="" large @click="$vuetify.goTo('#stats')" >
                <span class="white--text text--darken-1 font-weight-bold ">
                    Check your stats
                </span>
            </v-btn>
        </div>
        <v-responsive class="mx-auto mb-12" width="56"></v-responsive>
        <v-row>
            <v-col v-for="({ icon, name, description, tips }, i) in randomBeer" :key="i" cols="12" md="4">
                <v-card class="py-12 px-4" color="grey lighten-5" flat  height="100%">
                    <v-theme-provider dark>
                        <v-avatar color="primary" size="88">
                            <v-icon large v-text="icon"></v-icon>
                        </v-avatar>
                    </v-theme-provider>
                    <v-card-title class="justify-center text-uppercase" v-text="name"></v-card-title>   
                    <hr>
                    <v-card-text class="subtitle-1" v-text="description"></v-card-text> <hr>
                    <h4 class="title" style="color:grey"><b>tips:</b> <span class="subtitle-1" v-text="tips"></span></h4>
                </v-card>
            </v-col>
        </v-row>
    </div>`
}

const queryFormComponent = {
    data: () => ({
        valid: true,
        abv_min: '',
        ebc: '',
        ibu_max: '8',
        first_brewed: '',
        numberRules: [
            v => v === '' || !isNaN(v) || 'Invalid number',
        ],
        dateRules: [
            v => v === '' || (v >= 2000 && v <= new Date().getFullYear()) || 'Invalid number',
        ],
    }),
    methods: {
        validate() {
            if (this.ebc !== '') {
                let result = this.$store.state.allBeers.filter(beer => beer.first_brewed.includes(this.first_brewed) && beer.abv >= this.abv_min && beer.ebc == this.ebc && beer.ibu <= this.ibu_max);
                this.queryResults(result);
            } else {
                let result = this.$store.state.allBeers.filter(beer => beer.first_brewed.includes(this.first_brewed) && beer.abv >= this.abv_min && beer.ibu <= this.ibu_max);
                this.queryResults(result);
            }
        },
        queryResults(payload) {
            this.$store.commit("setQueryresults", payload);
        }
    },
    template: ` 
    <v-form ref="form" v-model="valid" lazy-validation>
        <v-container>
        <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
            This is the query section, fill the inputs to see what's coming
        </v-responsive>
            <v-layout row wrap>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="abv_min" :rules="numberRules" label="minimum abv">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="ebc" :rules="numberRules" label="ebc">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="ibu_max" :rules="numberRules" label="maximum ibu">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="first_brewed" :rules="dateRules" label="Brew date">
                    </v-text-field>
                </v-flex>
                <v-btn class="pl-5 ml-5" :disabled="!valid" color="info" @click="validate">
                    Query
                </v-btn>
            </v-layout>
            <div class="py-12"></div>
        </v-container>
</v-form>`
}

const statsComponent = {
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
        queryResults: function () {
            return this.$store.state.queryResults;
        },
    },
    template: ` 
    <v-parallax
          :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
          src="https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=751&amp;q=80%20751w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80%201051w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1351&amp;q=80%201351w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1502&amp;q=80%201502w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1651&amp;q=80%201651w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80%201951w">
          <v-container fill-height>
            <v-row class="mx-auto">
                <v-col cols="12" md="3">
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
              <v-col cols="12" md="3">
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
              <v-col cols="12" md="3" >
                    <div class="text-center">
                        <div
                            class="title font-weight-regular text-uppercase"
                            v-text="queryResults.length"> 
                        </div>
                        <div
                            class="title font-weight-regular text-uppercase"
                            v-text="generalInfo[2]">
                        </div>
                    </div>
              </v-col>
            </v-row>
        </v-container>
    </v-parallax>`
}

const queryCardComponent = {
    computed: {
        queryResults: function () {
            return this.$store.state.queryResults;
        },
    },
    template: `
        <v-simple-table height="300px" >
            <template v-slot:default>
                <thead v-if="queryResults.length !== 0">
                    <tr>
                    <th class="text-left">Row</th>
                    <th class="text-left">Id</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">Abv</th>
                    <th class="text-left">Ebc</th>
                    <th class="text-left">Ibu</th>
                    <th class="text-left">Year brewed</th>
                    <th class="text-left">Food Match</th>
                    <th class="text-left">Image</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in queryResults" :key="item.name">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.abv }}</td>
                    <td>{{ item.ebc || 0 }}</td>
                    <td>{{ item.ibu || 0 }}</td>
                    <td>{{ item.first_brewed }}</td>
                    <td>{{ item.food_pairing[0] }}</td>
                    <td v-if="item.image_url"> <a v-bind:href="item.image_url" style='text-decoration:none' target='_blank'>url</a></td>
                    </tr>
                </tbody>
                <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720" v-if="queryResults.length === 0">
                    Fetching no data :((
                </v-responsive>
            </template>
        </v-simple-table>
   `
}

new Vue({
    el: '#app',
    store: store,
    vuetify: new Vuetify(),
    components: { randomBeersComponent, statsComponent, queryFormComponent, queryCardComponent },
})