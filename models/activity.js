const mongoose = require('mongoose');
const { Schema } = mongoose;

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    activityThumbnail: {
        type: String,
        // required: true
       
    },
    style: {
        type: String,
        // required: true,
        enum:  ['Stretch', 'Indoorbike', 'Jogging', 'Meditate', 'Running', 'Skate', 'Soccer', 'Travel', 'Weight', 'Yoga']
    },
    duration: {  //set min
        type: Number,
        required: true,
        min: 0
    },
    isDone: {
        type: Boolean,
        
    },

    date : {
        type: Date
    }
})

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

