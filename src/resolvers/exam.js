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



  Mutation: {
    createExam: combineResolvers(
      isTest, async (parent, { examInput }, { me, models }) => {
        const exam = await models.Exam.create(examInput);
        return exam;
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