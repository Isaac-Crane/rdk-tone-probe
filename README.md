## Organization

* Task code is in `dot-trajectory-task.js`
* Task code depends on plugin `jspsych-6.3.1/plugins/dot-motion.js`, but that plugin can be swapped out for `jspsych-6.3.1/plugins/dot-motion-recordCursor.js`
* As usual, task code is run from `index.html`

## To-do

Currently, the dot motion plugin allows you to set the percentage of control the subject has (via their mouse movements) over one of two otherwise randomly moving dots.

* `dot-trajectory-task.js` should be made to depend on `dot-motion-recordCursor.js` instead of `dot-motion.js` so that we record mouse movements. (Alternatively, you could update the plugin to be JSPsych 7+ compatible so mouse tracking can be added with [the mouse tracking extension](https://www.jspsych.org/7.1/extensions/mouse-tracking/) but that sounds mildly more difficult to me.)
* We made some minor changes to `dot-motion.js` (which is originally from [another study](https://doi.org/10.1371/journal.pone.0244113)) that haven't been made in `dot-motion-recordCursor.js`, so those need to be mirrored. The git change log is shown in `Screenshot from 2023-11-01 12-50-24.png`. (I know this is a silly way to communicate the changes, but the git version history only exists in a private repository that contains non-anonymous data so meh.)
* `dot-motion-recordCursor.js` should be further modified so control level can be specified for both dots instead of one dot having no control. The control level for each dot should be recorded in the logged data for posterity.
* `dot-trajectory-task.js` should be modified so that control is set to random Uniform(0, 1) for each of the two dots on each trial instead of all the complicated adaptive staircase stuff it has going on now. 
* The uncertainty rating after each binary response can be removed from each trial in `dot-trajectory-task.js`.
* After every two trials, subjects should be asked in which of the two previous trials was the difference between the two dots' control levels larger. If you're curious, this is for [perceptual difference scaling](https://www.djmannion.net/diff_scaling/).

