import { combineResolvers } from 'graphql-resolvers';
import { ForbiddenError } from 'apollo-server';
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
    examSolution: async (parent, { id }, { models }) => {
      return await models.ExamSolution.findById(id);
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

    question(answer) {
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
    async examId(exam, args, { models, me }) {
      return await models.Exam.findById(exam.examId)
    },
    studentAnswers(exam) {
      return [...exam.studentAnswers.values()];
    },
  },





  Mutation: {
    createExam: combineResolvers(
      isAdmin, async (parent, { examInput }, { me, models }) => {
        const exam = await models.Exam.create(examInput);
        return exam;
      }
    ), deleteExam: combineResolvers(
      isTest, async (parent, { id }, { me, models }) => {
        let del = null;
        await models.Exam.deleteOne({ _id: id }, function (err,res) {
          if (err) {return del = false} else if (res) {return del = true} ;
         
        });
        return del;
      }
    ),
    initializeExamSolution: combineResolvers(
      isTest, async (parent, { examId, userId }, { me, models }) => {

        const solution = { examId, userId, status: "initialized", studentAnswers: new Map() };
        const examSolution = await models.ExamSolution.create(solution);
        return examSolution;
      }
    ),

    initializeMarkingExamSolution: combineResolvers(
      isTest, async (parent, { examId }, { me, models }) => {

        const examSolution = await models.ExamSolution.findOne({ _id: examId });
        examSolution.marked = "initialized";
        examSolution.markedAnswers = new Map();

        if (await examSolution.save()) {
          return true;
        } else {
          return false;

        }

      }
    ),

    finalizeMarkingExamSolution: combineResolvers(
      isTest, async (parent, { examId }, { me, models }) => {

        const examSolution = await models.ExamSolution.findOne({ _id: examId });
        examSolution.marked = "finalized";

        if (await examSolution.save()) {
          return true;
        } else {
          return false;

        }

      }
    ),

    saveExaminerRemarks: combineResolvers(
      isTest, async (parent, { examId, remarks }, { me, models }) => {

        const examSolution = await models.ExamSolution.findOne({ _id: examId });
        examSolution.examinerRemarks = remarks;

        if (await examSolution.save()) {
          return true;
        } else {
          return false;

        }

      }
    ),

    finalizeExamSolution: combineResolvers(
      isTest, async (parent, { examId, timeTaken }, { me, models }) => {

        const exam = await models.ExamSolution.findOne({ _id: examId });
        if (exam) {

          exam.status = "finalized";
          exam.timeTaken = timeTaken;

          if (await exam.save()) {
            return true;
          } else {
            return false;

          }
        } else {
          return false;

        }
      }
    ),
    saveAnswer: combineResolvers(
      isTest, async (parent, { examId, questionId, marks, answer, time }, { me, models }) => {
        const exam = await models.ExamSolution.findOne({ _id: examId });
        exam.studentAnswers.set(questionId, { questionId, answer, marks, time });
        if (await exam.save()) {
          return true;
        } else {
          return false;
        }

      }
    ),

    markAnswer: combineResolvers(
      isTest, async (parent, { examId, questionId, obtainedMarks, remarks }, { me, models }) => {
        const exam = await models.ExamSolution.findOne({ _id: examId });
        exam.markedAnswers.set(questionId, { questionId, obtainedMarks, remarks });
        if (await exam.save()) {
          return true;
        } else {
          return false;
        }

      }
    ),
    publishExam: combineResolvers(
      isTest, async (parent, { examId, examDateAndTime, duration }, { me, models }) => {
        const exam = await models.Exam.findOneAndUpdate(
          { _id: examId }, { $set: { duration: duration, startTime: examDateAndTime } },
          { returnNewDocument: true });
        return exam;
      }
    ),
  }
}