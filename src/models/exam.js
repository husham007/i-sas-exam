import mongoose from 'mongoose';
//import uniqueValidator from 'mongoose-unique-validator';

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
    },
    instructions: {
        type: String,
        required: true,
    },
    noOfquestions: {
        type: String,
        
    },
    startTime: {
        type: String,
        
    },
    timeTaken: {
        type: String,
    },
    duration: {
        type: String,
        
    }, 
    questions: {
        type: Array,
        of: Object,
        
    },
    author: {
        //type: mongoose.Schema.Types.ObjectId, ref: 'User'
        type: Object,
        
    },
    book: {
        type: String,
        required: true,
    }
},
    {
        timestamps: true,
    }); 
   // questionSchema.plugin(uniqueValidator, {message: 'Question Statement already Exist'});
    const Exam = mongoose.model('Exam', examSchema);

    export default Exam;