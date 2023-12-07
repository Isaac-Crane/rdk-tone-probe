var initialFixation = {
    type: "html-keyboard-response",
    stimulus: '',
    trial_duration: 10000,
    choices: [' '],
    response_ends_trial: true
}

duration = 1000
var test = {
    type: "rdk", 
    coherent_direction: 0,
    choices: ['leftarrow', 'rightarrow', ' '],
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
        console.log(val)
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
    data: {task: 'rdkProbe'}
};

var followUp = {
    type: "html-keyboard-response",
    stimulus: function(){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1] 
        console.log(lastTrial)
        if (lastTrial.response = ' '){
            return "<p>What would you have answered if you hadn't heard the tone?<p>"
        }
        else{
            return '<div style="font-size:60px;">+</div>'
        }
    },
    choices: ['l', 'r'],
    trial_duration: function(){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1] 
        if (lastTrial.response = ' '){ //we only want to ask this question if they answered space
            return 2000 
        }
        else{
            return 0
        }
    },
    response_ends_trial: true
}

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 500,
  };


totalTrials = 100
var test_procedure = {
    timeline: [fixation, test, followUp],
    timeline_variables: [{
        direction: function(){
            if (Math.random() > 0.5){
                return 0
            }
            else{
                return 180
            }
        }
    }],
    repetitions: totalTrials
};

timeline_rdk_probe = [initialFixation]
timeline_rdk_probe.push(test_procedure);


var rdk_probe_task = {
    timeline: timeline_rdk_probe
}
