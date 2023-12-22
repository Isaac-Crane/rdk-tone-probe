duration = 20000

var practice = {
    type: "rdk", 
    choices: ['ArrowLeft', 'ArrowRight'],
    display_photodiode: true,
    correct_choice: function(){
        if (jsPsych.timelineVariable('direction') == 0){
            return 'ArrowRight'
        }
        else{
            return 'ArrowLeft'
        }
    },
    coherent_direction: jsPsych.timelineVariable('direction'),
    coherence: jsPsych.timelineVariable('coherence'),
    trial_duration: duration,
    data: {task: 'rdkPractice'},
    on_finish: function(data){
        console.log(data.correct)
    }
}

var test = {
    type: "rdk", 
    choices: ['ArrowLeft', 'ArrowRight', ' '],
    display_photodiode: true,
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
        var priorData = jsPsych.data.get().filter({task: 'rdkPractice'}).values()
        priorData = priorData.concat(jsPsych.data.get().filter({task: 'rdkProbe'}).values())
        sum = 0
        previousTrials = 0
        for (i = 0; i < priorData.length; i++){
            if (priorData[i].coherence == jsPsych.timelineVariable('coherence')){
                if (priorData[i].rt != -1 && priorData[i].response != ' '){
                    sum = sum + priorData[i].rt
                    previousTrials = previousTrials + 1
                }
            }
        }
        mean = sum/previousTrials
        uniform =  Math.random()*(mean*2)
        return uniform
    },
    play_sound: true,
    coherent_direction: jsPsych.timelineVariable('direction'),
    coherence: jsPsych.timelineVariable('coherence'),
    data: {task: 'rdkProbe'},
    on_finish: function(data){
        if (data.response == 'arrowleft' || data.reponse == 'arrowright'){
            data.stoppedByProbe = false
        }
        if (data.response == ' '){
            data.answered = true
        }
        if (((data.time_to_sound < data.rt)||data.rt==-1) && data.play_sound){
            data.playedTone = true
        }
        else{
            data.playTone = false
        }
    }
};

var followUp = {
    type: "html-keyboard-response",
    stimulus: "<p>What would you have answered if you hadn't heard the tone?<p>",
    choices: ['ArrowLeft', 'ArrowRight'],
    trial_duration: 10000,
    response_ends_trial: true,
    data: {task: 'followUp'},
    on_finish: function(data){
        var priorData = jsPsych.data.get().filter({task: 'rdkProbe'}).values()
		lastTrial = priorData[priorData.length-1]
        data.correct_choice = lastTrial.correct_choice
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, lastTrial.correct_choice)
        console.log(data.correct)
    }
}

var fixation = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS",
    trial_duration: 250,
    data: {task: 'fixation'}
};


practiceTrials = 30//total practice trials
practice_info = []
for (i = 0; i<practiceTrials; i++){
    if (Math.random() > 0.5){
        practice_info.push({direction: 0})
    }
    else{
        practice_info.push({direction: 180})
    }
}
for (j = 0; j<10; j++){
    practice_info[j].coherence = 0.45
}
for (j = 10; j<20; j++){
    practice_info[j].coherence = 0.3
}
for (j = 20; j<30; j++){
    practice_info[j].coherence = 0.15
}

testTrials = 100
test_info = []
for (i = 0; i<testTrials; i++){
    if (Math.random() > 0.5){
        test_info.push({direction: 0})
    }
    else{
        test_info.push({direction: 180})
    }
}
for (j = 0; j<testTrials; j++){
    value = Math.floor(Math.random()*3)
    if (value == 0){
        test_info[j].coherence = 0.15
    }
    else if (value == 1){
        test_info[j].coherence = 0.3
    }
    else{
        test_info[j].coherence = 0.45
    }
}
var between = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;">Now with probes</div>',
    choices: "NO_KEYS",
    trial_duration: 1000,
    data: {task: 'fixation'}
}



var loop_node_test = {
    timeline: [test],
    loop_function: function(data){
        if(jsPsych.pluginAPI.compareKeys(data.values()[data.values().length-1].rt, -1)){
            return true;
        } else {
            return false;
        }
    }
}

var loop_node_practice = {
    timeline: [practice],
    loop_function: function(data){
        if(jsPsych.pluginAPI.compareKeys(data.values()[data.values().length-1].rt, -1)){
            alert('You must respond to each trial. The previous trial timed out. It will be repeated.')
            return true;
        } else {
            return false;
        }
    }
}

var if_node = {
    timeline: [followUp],
    conditional_function: function(){
        data = jsPsych.data.get()
        if(jsPsych.pluginAPI.compareKeys(data.values()[data.values().length-1].response, ' ')){
            return true;
        } else {
            return false;
        }
    }
}

var feedback = {
    type: "html-keyboard-response",
    stimulus: function(){
        var priorData = jsPsych.data.get().filter({task: 'rdkPractice'}).values()
        lastTrial = priorData[priorData.length-1]
        if (lastTrial.correct){
            return "<p>Correct!<p>"
        }
        else{
            return "<p>Incorrect<p>"
        }
    },
    trial_duration: 1000,
    choices: []
}

var practice_procedure = {
    timeline: [fixation, loop_node_practice, feedback],
    timeline_variables: practice_info,
}

var test_procedure = {
    timeline: [fixation, loop_node_test, if_node],
    timeline_variables: test_info,
};

timeline_rdk_probe = []
timeline_rdk_probe.push(practice_procedure);
timeline_rdk_probe.push(between)
timeline_rdk_probe.push(test_procedure);



var rdk_probe_task = {
    timeline: timeline_rdk_probe
}
