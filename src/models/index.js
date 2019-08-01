import mongoose from 'mongoose';
import Exam from './exam';
import ExamSolution from './examSolution';



const connectDb = () => {
  if (process.env.TEST_DATABASE_URL) {
    console.log(process.env.TEST_DATABASE_URL);
    return mongoose.connect(
      process.env.TEST_DATABASE_URL,
      { useNewUrlParser: true },
    );
  }

  if (process.env.DATABASE_URL) {
    
    
    return mongoose.connect(
      process.env.DATABASE_URL,
      { useNewUrlParser: true },
    );
  }
};





  export { connectDb };
  const models = {Exam, ExamSolution};

  export default models;