/**
 * Desc: Listens to replys from main.js
 * Acts as a Library of helper functions for executing primacy pipeline commands
 *
 * Authors:
 *      - Austin Kelly <ak678@nau.edu>
 *      - Chance Nelson <chance-nelson@nau.edu>
 */
const os            = require('os');
const {ipcRenderer} = require('electron');


const module1            = document.getElementById("module1");
const module2            = document.getElementById("module2");
const module3            = document.getElementById("module3");
const submit_button      = document.getElementById("submitButton");
const module_1_sum       = document.getElementById('result');

const iterations           = document.getElementById("iterations");
const amplicon_slider      = document.getElementById("ampliconSlider");
const opt_amplicon_size    = document.getElementById("optimumAmpliconSize");
const optimum_check        = document.getElementById("optimumAmpliconCheck");
const max_distance         = document.getElementById("maxDistance");
const max_distance_check   = document.getElementById("maxDistanceCheck");
const move_forward         = document.getElementById("moveForward");
const background_primers   = document.getElementById("backgroundPrimers");

const sim_melt_temp_slider = document.getElementById("simMeltTempSlider");
const sim_melt_temp        = document.getElementById("simMeltTemp");
const primer_scores_slider = document.getElementById("primerScoresSlider");
const primer_scores        = document.getElementById("primerScores");
const cross_dim_slider     = document.getElementById("crossDimerizationSlider");
const cross_dimerization   = document.getElementById("crossDimerization");
const amplicon_size_slider = document.getElementById("ampliconSizeSlider");
const amplicon_size        = document.getElementById("ampliconSize");
const amplicon_check       = document.getElementById("ampliconCheck");
const target_dist_slider   = document.getElementById("targetDistanceSlider");
const target_distance      = document.getElementById("targetDistance");
const target_dist_check    = document.getElementById("targetDistanceCheck");

const opt_amp_row          = document.getElementById("optAmpRow");
const max_distance_row     = document.getElementById("maxDistanceRow");
const amplicon_size_row    = document.getElementById("ampliconSizeRow");
const target_distance_row  = document.getElementById("targetDistanceRow");


// Current module state
var state = null;


function sendMessage(channel, message){
    ipcRenderer.send(channel, message);
}


class Module3 {
    /**
     * @brief Initialize the page state
     *
     * @param json JSON object indicating current pipeline state
     */
    constructor(json=null) {
        // set the defaults
        this.json = json;
        this.iter = 100;
        this.amp_size = {
            min: null,
            max: null
        };

        this.target_distance = {
            forward: null,
            reverse: null,
            any: null,
            both: null
        };

        this.background = {
            //primer_id: {seq: ''}
        };

        this.weights = {
            tm: 1,
            scores: 1,
            cross_dimerization: 1,
            size: 1,
            target_dist: 1
        };

        this.include = {
            //seq_id: {
            //    forward: {
            //        primer_ids: [
            //            type: array
            //            description: array of primer ids that should be included
            //        ]},
            //    reverse: {
            //        ...
            //    }
            //},
        };

        // If a previous state is available, bootstrap our internal state to 
        // match
        if(json && json['set_optimization']) {
            let set_optimization = json['set_optimization'];
            this.iter            = set_optimization['iter'];
            this.amp_size        = set_optimization['amp_size'];
            this.target_distance = set_optimization['target_distance'];
            this.background      = set_optimization['background'];
            this.weights         = set_optimization['weights'];
            this.include         = set_optimization['include'];
        }

        // set all inputs to reflect the current module state
        iterations.value = this.iter;
        sim_melt_temp.value = this.weights.tm;
        primer_scores.value = this.weights.scores;
        cross_dimerization.value = this.weights.cross_dimerization;
        amplicon_size.value = this.weights.amplicon_size;
        target_distance.value = this.weights.target_dist;
    }

    /**
     * @brief generate a json args string based on the current args and
     *        previous pipeline state.
     */
    toJSON() {
        let out = this.jsob;
        out['set_optimization'] = {};
        out['set_optimization']['params'] = {};

        let params = out['set_optimization']['params'];
        params['iter'] = this.iter;
        params['amp_size'] = this.amp_size;
        params['target_distance'] = this.target_distance;
        params['background'] = this.background;
        params['weights'] = this.weights;
        params['include'] = this.include;

        return out;
    }
}


//listening
ipcRenderer.on('EXECUTE', (event, arg) =>{
    if(arg != null){
        console.log("error received");
    } else {
        console.log("sending load message");
        sendMessage('LOADMODULE', 3);
    }
});

ipcRenderer.on('NEW', (event, arg) =>{
    console.log("NEW received");
    state = new Module3(JSON.parse(arg));
});

ipcRenderer.on('LOADMODULE', (event, arg) =>{
    console.log("DENIED");
});

//loads tab on click
module1.addEventListener('click', function (){
    console.log("click");
    sendMessage('LOADMODULE', 1);
});

module2.addEventListener('click', function (){
    console.log("click");
    sendMessage('LOADMODULE', 2);
});

optimumAmpliconCheck.addEventListener('change', function() {
    if(this.checked) {
        opt_amp_row.style.backgroundColor = "rgb(0, 36, 56)";
    } else {
        opt_amp_row.style.backgroundColor = "initial";
        opt_amplicon_size.value = 0;
        amplicon_slider.value = 0;
        state.amp_size = {
            min: null, 
            max: null
        };
    }
});

maxDistanceCheck.addEventListener('change', function() {
    if(this.checked) {
        max_distance_row.style.backgroundColor = "rgb(1, 32, 53)";
    } else {
        max_distance_row.style.backgroundColor = "initial";
        max_distance.value = "None";
        state.target_distance = {
            forward: null,
            reverse: null,
            any: null,
            both: null
        };
    }
});

ampliconCheck.addEventListener('change', function() {
    if(this.checked) {
        amplicon_size_row.style.backgroundColor = "rgb(0, 36, 56)";
    } else {
        amplicon_size_row.style.backgroundColor = "initial";
        amplicon_size.value = 0;
        amplicon_size_slider.value = 0;
    }

    // fire the change event to finilize changes in the state
    amplicon_size_slider.dispatchEvent(new Event('change'));
});

targetDistanceCheck.addEventListener('change', function() {
    if(this.checked) {
        target_distance_row.style.backgroundColor = "rgb(1, 32, 53)";
    } else {
        target_distance_row.style.backgroundColor = "initial";
        target_distance.value = 0;
        target_dist_slider.value = 0;
    }

    // fire the change event to finilize changes in the state
    target_distance_slider.dispatchEvent(new Event('change'));
});

amplicon_slider.addEventListener('change', function() {
    opt_amplicon_size.value = this.value;

    // fire the change event on the amplicon size element
    opt_amplicon_size.dispatchEvent(new Event('change'));
});

opt_amplicon_size.addEventListener('change', function() {
    console.log('nigger')
    amplicon_slider.value = this.value;
    // TODO: set amplicon size
});


sim_melt_temp_slider.addEventListener('change', function() {
    sim_melt_temp.value = this.value;

    // fire the change event on the temperature element
    sim_melt_temp.dispatchEvent(new Event('change'));
});

sim_melt_temp.addEventListener('change', function() {
    sim_melt_temp_slider.value = this.value;
    state.weights.tm = parseInt(this.value);
});


primer_scores_slider.addEventListener('change', function() {
    primer_scores.value = this.value;

    // fire the change event on the primer scores element
    sim_melt_temp.dispatchEvent(new Event('change'));
});

primer_scores.addEventListener('change', function() {
    primer_scores_slider.value = this.value;
    state.weights.scores = parseInt(this.value);
});


cross_dim_slider.addEventListener('change', function() {
    cross_dimerization.value = this.value;

    // fire the change event on the cross-dimerization element 
    cross_dimerization.dispatchEvent(new Event('change'));
});

cross_dimerization.addEventListener('change', function() {
    cross_dim_slider.value = this.value;
    state.weights.cross_dimerization = parseInt(this.value);
});


amplicon_size_slider.addEventListener('change', function() {
    amplicon_size.value = this.value;

    // fire the change event on the amplicon size event 
    amplicon_size.dispatchEvent(new Event('change'));
});

amplicon_size.addEventListener('change', function() {
    amplicon_size_slider.value = this.value;
    state.weights.amplicon_size = parseInt(this.value);
});


target_dist_slider.addEventListener('change', function() {
    if(targetDistanceCheck.checked) {
        target_distance.value = this.value;

        // fire the change event on the target distance event 
        target_distance.dispatchEvent(new Event('change'));
    }
});

target_distance.addEventListener('change', function() {
    if(targetDistanceCheck.checked) {
        target_dist_slider.value = this.value;
        state.weights.target_dist = parseInt(this.value);
    }
});

if(!state) {
    state = new Module3();
}
