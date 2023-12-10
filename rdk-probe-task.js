var initialFixation = {
    type: "html-keyboard-response",
    stimulus: '',
    trial_duration: 10000,
    choices: [' '],
    response_ends_trial: true
}

duration = 5000
var test = {
    type: "rdk", 
    coherent_direction: 0,
    choices: ['ArrowLeft', 'ArrowRight', ' '],
    correct_choice: function(){
        if (jsPsych.timelineVariable('direction') == 0){
            return 'ArrowRight'
        }
        else{
            return 'ArrowLeft'
        }
    },
    ///audio: string,
    trial_duration: duration,
    time_to_sound: function(){
        val =  Math.floor(0.1*duration) + Math.floor(Math.random()*duration*0.8) /// sound must be at least 1/10th of the duration in and no more than 9/10ths
        return val    
    },
    play_sound: function(){//if unspecified no sound will play
        val = Math.random()
        if (val > 0.5){
            return true
        }
        else{
            return false
        }
    },
    coherent_direction: jsPsych.timelineVariable('direction'),
    data: {task: 'rdkProbe'},
    on_finish: function(data){
        if (data.response == 'arrowleft' || data.reponse == 'arrowright'){
            data.answered = true
        }
        if (data.response == ' '){
            data.answered = false
        }
        if (((data.time_to_sound < data.rt)||data.rt==-1) && data.play_sound){
            data.playedTone = true
        }
        else{
            data.playTone = false
        }
        console.log(data.correct)
    }
};

var followUp = {
    type: "html-keyboard-response",
    stimulus: function(){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1] 
        if (lastTrial.response == ' '){
            return "<p>What would you have answered if you hadn't heard the tone?<p>"
        }
        else{
            return '<div style="font-size:60px;">+</div>'
        }
    },
    choices: ['ArrowLeft', 'ArrowRight'],
    trial_duration: function(){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1]
        if (lastTrial.response == ' '){ //we only want to ask this question if they answered space
            return 10000 
        }
        else{
            return 0
        }
    },
    response_ends_trial: true,
    on_finish: function(data){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1]
        data.correct_choice = lastTrial.correct_choice
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, lastTrial.correct_choice)
    }
}

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500,
  };


totalTrials = 5
test_info = []
directionRandomized = []
for (i = 0; i<totalTrials; i++){
    if (Math.random() > 0.5){
        test_info.push({direction: 0})
    }
    else{
        test_info.push({direction: 180})
    }
}

var test_procedure = {
    timeline: [fixation, test, followUp],
    timeline_variables: test_info,
};


timeline_rdk_probe = [initialFixation]
timeline_rdk_probe.push(test_procedure);


var rdk_probe_task = {
    timeline: timeline_rdk_probe
}
