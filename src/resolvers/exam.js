import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isExamOwner, isAdmin, isTest } from './authorization';
import { stat } from 'fs';


const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {

    exams: async (parent, args, { models }) => {


      return await models.Exam.find();

    },

    examSolutions: async (parent, args, { models }) => {


      return await models.ExamSolution.find();

    },


    examsByBook: async (parent, { name }, { models }) => {

      return await models.Exam.find({ book: name });
    },
    exam: async (parent, { id }, { models }) => {
      return await models.Exam.findById(id);
    },

  },
  /*
  Question: {
      author: async (question, args, {models})=>{
          return await models.User.findById(question.author)
      }
  }
  */
  Exam: {
    async __resolveReference(parent, { me, models }) {
      return await models.Exam.findById(parent.id)
    },
    author(exam) {
      return { __typename: "User", id: exam.author };
    },

    questions(exam) {
      return exam.questions.map(question => {
        return question.question;
      })
    },
    examQuestions(exam) {
      //console.log('exam', exam.questions);
      return exam.questions.map(question => {
        return {
          question: { __typename: "Question", id: question.question },
          marks: question.marks
        }
      })

      /*return {
        questions: {
          __typename: "Questions", ids: exam.questions.map(question => {
            return question.question;
          })
        },
        marks: exam.questions.map(question=>{
          return question.marks
        })
      }*/

    }
  },

  StudentAnswer: {

    question(answer){
      return { __typename: "Question", id: answer.question };
    }

  },

  ExamSolution: {
    async __resolveReference(parent, { me, models }) {
      return await models.ExamSolution.findById(parent.id)
    },
    userId(exam) {
      return { __typename: "User", id: exam.userId };
    }, 
    async examId(exam, args, {models, me}) {
      return await models.Exam.findById(exam.examId)
    }, 
    studentAnswers(exam) {
      return [...exam.studentAnswers.values()];
    },   
  },





  Mutation: {
    createExam: combineResolvers(
      isTest, async (parent, { examInput }, { me, models }) => {
        const exam = await models.Exam.create(examInput);
        return exam;
      }
    ),
    initializeExamSolution: combineResolvers(
      isTest, async (parent, {examId, userId}, { me, models }) => {
        console.log("hello");
        const solution = {examId, userId, status: "Initialized", studentAnswers: new Map()};        
        const examSolution = await models.ExamSolution.create(solution);
        return examSolution;
      }
    ),
    saveAnswer: combineResolvers(
      isTest, async (parent, {examId, userId, question, marks, answer, time}, { me, models }) => {
       const exam = await models.ExamSolution.findOne({_id: examId});
       exam.studentAnswers.set(question, {question, answer, marks, time});
       if (await exam.save()){
         return true;
       } else {
         return false;
       }
        
      }
    ),
    publishExam: combineResolvers(
      isTest, async (parent, { examId, examDateAndTime, duration }, { me, models }) => {
        const exam =  await models.Exam.findOneAndUpdate(
          {_id: examId}, { $set: {duration: duration, startTime: examDateAndTime}}, 
          {returnNewDocument : true});    
        return exam;
      }
    ),
  }
}