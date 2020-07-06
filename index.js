const store = new Vuex.Store({
    // state object to keep track of every data in a single source      
    state: {
        randomBeerInfo: [],
        allBeers: [],
        generalInfo: ['All beers', 'Random beers', 'Query results', 'Oldest query brew'],
        queryResults: [],
    },
    // when state values change, they go through mutations, 
    // better for debugging and keeping in state in guidance
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
            // update state property with new query results, which is payload array
            state.queryResults = payload;
        },
        resetRandomBeer(state) {
            state.randomBeerInfo = [];
        }
    },
    // this is where async calls take place, once the method is called in components,
    // it dispatches info to actions in our state
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

// there are several components created, each one of them is working seperately to form the web app

const navigationComponent = {
    template: `
    <v-app-bar app color="white" id="navbar" height="100">
        <v-avatar class="mr-3" color="grey lighten-5" size="70">
            <v-img contain max-height="100%" src="assets/logo.png" @click="$vuetify.goTo('#navbar')">
            </v-img>
        </v-avatar>
        <v-toolbar-title class="font-weight-black headline" @click="$vuetify.goTo('#navbar')">
            Beer Factory 
        </v-toolbar-title>
    </v-app-bar>`
}

const heroComponent = {
    template: `
    <section id="hero">
        <v-row no-gutters>
            <v-img :min-height="'calc(100vh - ' + $vuetify.application.top + 'px)'"
                src="https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80%20750w">
                <v-theme-provider dark>
                    <v-container fill-height>
                        <v-row align="center" class="white--text mx-auto" justify="center">
                            <v-col class="white--text text-center" cols="12" tag="h1">
                                <span :class="[$vuetify.breakpoint.smAndDown ? 'display-1' : 'display-2']"
                                    class="font-weight-light">
                                    WELCOME TO
                                </span>
                                <br>
                                <span :class="[$vuetify.breakpoint.smAndDown ? 'display-3': 'display-4']"
                                    class="font-weight-black">
                                    Beer Factory
                                </span>
                            </v-col>
                            <v-btn class="align-self-end" fab outlined @click="$vuetify.goTo('#about')">
                                <v-icon>mdi-chevron-double-down</v-icon>
                            </v-btn>
                        </v-row>
                    </v-container>
                </v-theme-provider>
            </v-img>
        </v-row>
    </section>`
}

const aboutComponent = {
    template: `          
    <section id="about">
        <div class="py-12"></div>
        <v-container class="text-center">
            <h2 class="display-2 font-weight-bold mb-3">ABOUT BEER FACTORY </h2>
            <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
                Beer Factory uses Punk API which is an awesome API that allows beer lovers to search
                Brewdog's catalog of
                beers
                programmatically. Users can search beers by ABV, IBU, EBC, brew date,food pairing, and ID.
            </v-responsive>
            <v-btn color="grey" href="https://punkapi.com/documentation/v2" outlined large target="_blank">
                <span class="black--text text--darken-1 font-weight-bold">
                    Documentation
                </span>
            </v-btn>
            <v-btn color="blue" href="" large @click="$vuetify.goTo('#info')">
                <span class="white--text text--darken-1 font-weight-bold">
                    Start exploring
                </span>
            </v-btn>
        </v-container>
        <div class="py-12"></div>
    </section>`
}

const randomBeersComponent = {
    computed: {
        randomBeer: function () {
            return this.$store.state.randomBeerInfo;
        },
    },
    methods: {
        getRandomBeer: function () {
            // once get beers function is clicked, dispatch info to get random beer api call
            this.$store.dispatch("getRandomBeer");
        },
        resetRandomBeer: function () {
            this.$store.commit("resetRandomBeer");
        }
    },
    template: ` 
    <section id="info" class="grey lighten-3">
        <div class="py-12"></div>
        <v-container class="text-center">
            <div>
                <h2 class="display-2 font-weight-bold mb-3">LETS GIVE YOU FACTS</h2>
                <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720" v-if="randomBeer.length < 3">
                    Click on the button to get random beers from the database, learn a few useful things about
                    them,
                    you can thank me later 🙂
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
                    <v-btn color="orange" href="" large @click="resetRandomBeer">
                        <span class="white--text text--darken-1 font-weight-bold ">
                            Reset
                        </span>
                    </v-btn>                    
                </div>
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
            </div>
        </v-container>
        <div class="py-12"></div>
    </section>`
}

const queryFormComponent = {
    data: () => ({
        // while valid is true, users can query, otherwise it is disabled
        valid: true,
        abv_min: '',
        ebc: '',
        ibu_max: '15',
        first_brewed: '',
        beer_name: '',
        food_name: '',
        // checking if input is a valid number, otherwise show error
        numberRules: [
            v => v === '' || !isNaN(v) || 'Invalid number',
        ],
        // checking if input is a valid date, otherwise show error
        dateRules: [
            v => v === '' || (v >= 1000 && v <= new Date().getFullYear()) || 'Invalid date',
        ],
        nameRules: [
            v => v === '' || (v.length <= 10) || 'Name must be less or equal to 10 characters'
        ],
    }),
    methods: {
        validate() {
            // ibu needs to have a value for comparison, if users chooses not to write anything,
            // default value will be 15
            this.ibu_max = this.ibu_max || '15';

            // two options for validate button,
            // first, ebc with a value
            if (this.ebc !== '') {
                let result = this.$store.state.allBeers.filter(beer => beer.first_brewed.includes(this.first_brewed) &&
                    beer.abv >= this.abv_min && beer.ebc == this.ebc && beer.ibu <= this.ibu_max &&
                    beer.food_pairing[0].toLowerCase().includes(this.food_name.toLowerCase()) &&
                    beer.name.toLowerCase().includes(this.beer_name.toLowerCase()
                    ));
                this.queryResults(result);
            }
            // second, ebc without a value (default)
            else {
                let result = this.$store.state.allBeers.filter(beer => beer.first_brewed.includes(this.first_brewed) &&
                    beer.abv >= this.abv_min && beer.ibu <= this.ibu_max &&
                    beer.food_pairing[0].toLowerCase().includes(this.food_name.toLowerCase()) &&
                    beer.name.toLowerCase().includes(this.beer_name.toLowerCase()
                    ));
                this.queryResults(result);
            }
        },
        // in either case for validation, we have to commit to make mutation in state object
        queryResults(payload) {
            this.$store.commit("setQueryresults", payload);
        }
    },
    template: ` 
    <v-form ref="form" v-model="valid" lazy-validation id="advanced-query">
        <div class="py-12"></div>
        <v-container>
            <v-responsive class="mx-auto title font-weight-light mb-8" max-width="720">
                This is the query section, fill the inputs to see what's coming... 
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
                    <v-text-field v-model="ibu_max" :rules="numberRules" label="maximum ibu (15 by default)">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="first_brewed" :rules="dateRules" label="brew date">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="beer_name" :rules="nameRules" label="beer name">
                    </v-text-field>
                </v-flex>
                <v-flex xs12 sm6 class="pl-5">
                    <v-text-field v-model="food_name" :rules="nameRules" label="food name">
                    </v-text-field>
                </v-flex>
                <v-btn class="pl-5 ml-5" :disabled="!valid" color="info" @click="validate" @click="$vuetify.goTo('#query-table')">
                    Query
                </v-btn>
                <div class="py-12"></div>
            </v-layout>
        </v-container>
    </v-form>`
}

const queryTableComponent = {
    computed: {
        queryResults: function () {
            return this.$store.state.queryResults;
        },
    },
    template: `
    <section id="query-table">
        <v-responsive justify="center" align="center" class="title font-weight-light mb-8 pl-5" v-if="queryResults.length !== 0">
            Query results
        </v-responsive>
        <v-simple-table height="300px" class="py-6">
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
                <v-responsive justify="center" align="center" class="title font-weight-light mb-8 pl-5" v-if="queryResults.length === 0">
                    No results 🙁
                </v-responsive>
            </template>
        </v-simple-table>
    </section>`
}

const statsComponent = {
    // this is what happens before the component is mounted,
    // allbeers property is filled with all the data from the API
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
        oldestBrewfromQuery: function () {
            // search queryResult: first map each beer element, 
            // slice their brew date part and sort, 
            // finally take the oldest year
            let oldestBrewDate = this.$store.state.queryResults.map(beer => beer.first_brewed.slice(-4)).sort((a, b) => a - b)[0] || 'no data';
            return oldestBrewDate;
        },
        generalInfo: function () {
            return this.$store.state.generalInfo;
        },
        queryResults: function () {
            return this.$store.state.queryResults;
        },
    },
    template: `
    <section id="stats" class="white"> 
        <v-parallax
            :height="$vuetify.breakpoint.smAndDown ? 700 : 500"
            src="https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=751&amp;q=80%20751w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1051&amp;q=80%201051w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1351&amp;q=80%201351w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1502&amp;q=80%201502w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1651&amp;q=80%201651w,%20https://images.unsplash.com/photo-1436262513933-a0b06755c784?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80%201951w">
            <div class="py-3"></div>
            <v-responsive align="center"  class="font-weight-bold title font-weight-light mb-8 pl-5">
                STATS INFO
            </v-responsive>
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
                    <v-col cols="12" md="3" >
                        <div class="text-center">
                            <div
                                class="title font-weight-regular text-uppercase"
                                v-text="oldestBrewfromQuery"> 
                            </div>
                            <div
                                class="title font-weight-regular text-uppercase"
                                v-text="generalInfo[3]">
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-parallax>
    </section>`
}

const footerComponent = {
    template: `
    <v-footer class="justify-center" color="#white" height="100">
        <div class="title font-weight-light grey--black text--lighten-1 text-center">
            &copy;{{ (new Date()).getFullYear() }} by Ali Bayramli &nbsp
        </div>
        <div class="title font-weight-light black--text text--lighten-1 text-center">
            — Credit: <a href="https://twitter.com/samjbmason"
                target='_blank' style="text-decoration: none;">Sam Mason</a>
        </div>
    </v-footer>`
}

new Vue({
    el: '#app',
    store: store,
    vuetify: new Vuetify(),
    components: { navigationComponent, heroComponent, aboutComponent, randomBeersComponent, statsComponent, queryFormComponent, queryTableComponent, footerComponent },
})