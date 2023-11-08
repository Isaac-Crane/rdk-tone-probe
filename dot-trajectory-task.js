// Use the timestamp as a unique id (specific to the second)
var timestamp = Math.floor(Date.now() / 1000);

workerId = "workerId_" + timestamp;
assignmentId = "assignmentId_" + timestamp;
hitId = "hitId_" + timestamp;

//Print out to console
console.log("workerId: " + workerId);
console.log("assignmentId: " + assignmentId);
console.log("hitId: " + hitId);

/************************
 dot trajectory task code below
************************/
var timeline_dot_trajectory = [];

// var fullscreen_mode = {
//     type: 'fullscreen',
//     fullscreen_mode: true,
//     message: `
//         Welcome to the next task.<br>
//         Ready to begin?<br>
//         The experiment will switch to full screen mode when you press the button below.<br>`,
// };
// timeline_dot_trajectory.push(fullscreen_mode);


var mac_mouse_instruction = {
    type: "html-keyboard-response",
    stimulus: `
<p>If you are a
<strong>MAC</strong> user, please read the following instructions carefully. (Users of other systems can press any key to continue)</p>
<p>This experiment requires you to disable the 'Shake mouse pointer to locate' and the 'Hot corners' function. It can be done with several simple steps.</p>
<p>STEP1: go to the Apple menu and choose 'System Preference', select 'Accessibility'.</p>
<p>STEP2: go to 'Display', uncheck the box next to 'Shake mouse pointer to locate'. </p>
<p>STEP3: go back to 'System Preference', go to 'Mission Control' and click on 'Hot Corners' button in the corner of the preference panel</p>
<p>STEP4: pull down each of the four hot corner submenus and choose '-'</p>
<p>STEP5: come back to this page and <strong>switch to full-screen mode</strong> by selecting the green circle at the top-left corner of your browser.</p>
<p>STEP6: continue to the next page.</p>

<br>
<br>
<p>Press any key to continue.</p>
`,
    on_finish: function() {
        document.body.style.cursor = 'none'
    }
};
timeline_dot_trajectory.push(mac_mouse_instruction);

var instructions = {
    type: "html-keyboard-response",
    stimulus: `
<p>
<strong>INSTRUCTIONS</strong>
</p>
<p>On each trial, you will see two independent moving dots.</p>
<p>The movement of your mouse can influence the trajectory of one of them.</p>
<p>The dot that can be controlled by your mouse movement (A or B) will be randomly selected on each trial.</p>
<p>Your goal is to report which dot are you better able to control and how confident are you on your decision.</p>
<p>In each trial, you will have 2.5 seconds to interact with the dots.</p>
<p>After that, you will answer two questions. You have 2 seconds to answer each question.</p>
<p>If you failed to provide answer to any of the questions, the trial will be aborted.</p>
<p>The aborted trials will NOT count. Hence, skipping trials will
<strong>NOT</strong> help you finish the task.
</p>
<br>
<br>
<p>Press any key to continue.</p>
`,
};
timeline_dot_trajectory.push(instructions);

var borderInstruc = {
    type: "html-keyboard-response",
    stimulus: `
<p>
<strong>BORDER INSTRUCTIONS</strong>
</p><br>
<p>During the experiment, your cursor will be hidden. However, the mouse movement will only be counted as valid when the cursor is moving inside the screen.</p>
<p>To help you locate the cursor, a RECTANGULAR border will be displayed around the stimuli on the screen.</p>
<p>When the cursor moves outside of the screen, the corresponding side of the rectangle will turn to red until the cursor is moved back inside the screen.</p>
<p>Please use this signal to adjust the location of your cursor.</p>
<p>Press any key to continue.</p>
`,
}
timeline_dot_trajectory.push(borderInstruc);


var keypressInstruc = {
    type: "html-keyboard-response",
    stimulus: `
<p>
<strong>KEY-PRESS INSTRUCTIONS</strong>
</p><br>
<p>You will be asked two questions on each trial.</p>
<p>For the first question, you will be asked to report the label of the dot you were able to control on the current trial.</p>
<p>Press Q for dot A, or R for dot B</p>
<br>
<p>For the second question, you will be asked to indicate your confidence in the choice you just made about which dot you were able to control.</p>
<p>Press 1 if the judgment is a mere guess.</p>
<p>Press 2 if the judgment is better than a mere guess but you are still quite unsure about it.</p>
<p>Press 3 if you are almost certain.</p>
<p>Press 4 if you have no doubt in your answer.</p>
<br>
<br>
<p>Press any key to start the practice trials.</p>
`,
}
timeline_dot_trajectory.push(keypressInstruc);

var answerRecorder = true;
var practiceNum = 0;
var practiceControl = [0.7, 0.3];
var failTrialDetect = false;
var practice = {
    type: "dot-motion-recordCursor",
    controlLevel: 500,
    trial_duration: jsPsych.timelineVariable('trial_duration'),
    controlLevel1: 1,
    controlLevel2: 1,  
    data: {
        test_part: 'dot_practice'
    },

    on_start: function(trial) {
        if (Math.floor(Math.random() * 2) == 0){
            trial.controlLevel1 = practiceControl[0];
            trial.controlLevel2 = practiceControl[1];
        }
        else{
            trial.controlLevel1 = practiceControl[1];
            trial.controlLevel2 = practiceControl[0];
        }
    },
    on_finish: function(data) {
        if (data.controlLevel == -1) {
            data.test_part = 'fail_trial';
            failTrialDetect = true;
        } else {
            answerRecorder = data.correct;
            practiceNum++;
            if (answerRecorder == true){
                practiceControl[0] -= 0.025;
                practiceControl[1] += 0.025;
            }
            else {
                practiceControl[0] += 0.075;
                practiceControl[1] -= 0.075
            }
        }
    }
};

var practiceWrong = 0;
var feedback = {
    type: "html-keyboard-response",
    stimulus: function() {
        if (failTrialDetect == true) {
            failTrialDetect = false;
            return `
<p>Remember, you only have 2 seconds to enter your answer for each question.</p>
<p>The trial you missed will NOT count. Hence, skipping trials will
    <strong>NOT</strong> help you finish the task.
</p>
<p>Let's try again.</p>
<br>
    <br>
        <p>Press any key to continue.</p>`
        } else if (practiceNum < 5) {
            if (answerRecorder == true)
                return `
        <p>Your answer is CORRECT</p>
        <p>Press any key to continue</p>`
            else {
                practiceWrong++;
                return `
        <p>Your answer is WRONG</p>
        <p>Press any key to continue</p>`
            }
        } else {
            if (answerRecorder == true && practiceWrong < 2)
                return `
        <p>Your answer is CORRECT</p>
        <p>Press any key to continue</p>`
            else if (answerRecorder == true && practiceWrong > 1)
                return `
        <p>Your answer is CORRECT</p><br>
        <p>Accuracy = ${(practiceNum - practiceWrong)}/${practiceNum} </p>"
        <p>Practice trials need to be repeated.</p>
        <p>Press any key to continue</p>`
            else if (answerRecorder == false && practiceWrong < 1) {
                practiceWrong++;
                return `
        <p>Your answer is WRONG</p>
        <p>Press any key to continue</p>`
            } else if (answerRecorder == false && practiceWrong > 0) {
                practiceWrong++;
                return `
        <p>Your answer is WRONG</p>
        <p>Accuracy = ${(practiceNum - practiceWrong)}/${practiceNum} </p>
        <p>Practice trials need to be repeated.</p>
        <p>Press any key to continue</p>`
            }
        }
    }
};

var practice_procedure = {
    timeline: [practice, feedback],
    timeline_variables: [{
        trial_duration: 2500
    }],
    loop_function: function() {
        if (practiceNum < 5)
            return true;
        if (practiceNum == 5 && practiceWrong > 1) {
            practiceControl = [0.7, 0.3];
            practiceNum = 0;
            practiceWrong = 0;
            return true;
        } else {
            return false;
        }
    }
};
timeline_dot_trajectory.push(practice_procedure);

var start = {
    type: "html-keyboard-response",
    stimulus: `
        <p>Practice finished. Good job!</p>
        <p>Press any key to start the experiment.</p>`
};
timeline_dot_trajectory.push(start);


var totalTrial = 100; //the actual number of times the participant will be presented with dot-stimulus is 2 times this. this is the number of times they will evaluate the difference.


var test = {
    type: "dot-motion-recordCursor",
    controlLevel: 500,
    controlLevel1: Math.random(),
    controlLevel2: Math.random(),
    trial_duration: jsPsych.timelineVariable('trial_duration'),
    data: {
        test_part: 'dot_stimulus'
    },

   
    
    
    on_finish: function(data) {
        if (data.controlLevel == -1) {
            data.test_part = 'fail_trial';
            failTrialDetect = true;
        }
        else{
            
        }
    }
}

//fixation cross
var fixation = {
    type: "html-keyboard-response",
    stimulus: `
        <div style="font-size:60px;">+</div>`,
    choices: jsPsych.NO_KEYS,
    trial_duration: 500,
    data: {
        
        test_part: 'dot_fixation'
    },
};

//participants evaluate the difference between their control of the previous two tests
var differencePerception = {
    type: "html-keyboard-response",
    stimulus: `
    <p> Of the previous two tests, over which controlled dot did you have more control? </p><p>Press 1 for the first. Press 2 for the second</p>
        `,
    choices: ['1', '2'],
    data: {
        correct_response: function(){
            var priorData = jsPsych.data.get().filter({test_part: 'dot_stimulus'}).values()
            firstDifference = Math.abs(priorData[priorData.length-2].controlLevel1-priorData[priorData.length-2].controlLevel2)
            secondDifference = Math.abs(priorData[priorData.length-1].controlLevel1-priorData[priorData.length-1].controlLevel2)
            if (firstDifference>secondDifference){
                return '1'
            }
            else{
                return '2'
            }
        },
        test_part: 'perceived_difference'
    },
    on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
    }
};

/*******************************************************
         let the experiment begin
********************************************************/
//control the timeline
var test_procedure = {
    timeline: [fixation, test, fixation, test, differencePerception],
    timeline_variables: [{
        trial_duration: 2500
    }],
    repetitions: totalTrial
};
timeline_dot_trajectory.push(test_procedure);

// end screen
var end = {
    type: 'html-keyboard-response',
    stimulus: `
                    <p>This part of the experiment is finished.</p>
                    <p>Press any key to move on to the next part.</p>`,
    on_finish: function() {
        document.body.style.cursor = 'default';
    },
};
timeline_dot_trajectory.push(end);

// var exitFullscreen = {
//     type: "fullscreen",
//     fullscreen_mode: false,
// }
// timeline_dot_trajectory.push(exitFullscreen);

//create the overall timeline
var dot_trajectory_task = {
    timeline: timeline_dot_trajectory
}
