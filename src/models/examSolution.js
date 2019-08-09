import mongoose from 'mongoose';
//import uniqueValidator from 'mongoose-unique-validator';

const examSolutionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
       
    },
    examId: {
          type: mongoose.Schema.Types.ObjectId, ref: 'Exam',
          required: true,          
       
    }, 
    studentAnswers: {
        type: Map,
        of: Object,
        
    },

    status: {
        type: String,
        required: true,
       
    },

    markedAnswers: {
        type: Map,
        of: Object,
        
    },

    examinerRemarks: {
        type: String,       
       
    },

    marked: {
        type: String,        
    }
    
},
    {
        timestamps: true,
    }); 
   // questionSchema.plugin(uniqueValidator, {message: 'Question Statement already Exist'});
    const ExamSolution = mongoose.model('ExamSolution', examSolutionSchema);

    export default ExamSolution;