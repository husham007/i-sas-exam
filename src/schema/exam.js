import { gql } from 'apollo-server-express';

export default gql `
extend type Query {
   
    exams: [Exam!]
    examSolutions: [ExamSolution!]
    examsByBook (name: String!): [Exam!]
    exam(id: ID!): Exam
    examSolution(id: ID!): ExamSolution

    # Fetches a Question Object given its ID.
    # question(id: ID!): Question!
    # searchQuestion (searchInput: SearchInput!): [Question]

    
}

extend type Mutation {
    

    createExam (examInput: ExamInput!): Exam!
    deleteExam(id: ID!): Boolean!
    publishExam (examId: ID!, examDateAndTime: Date!, duration: String!): Exam!
    initializeExamSolution (examId: ID!, userId: ID!): ExamSolution!
    saveAnswer(examId: ID!, questionId: ID!, marks: String!, answer: String!, time: String!): Boolean!
    markAnswer(examId: ID!, questionId: ID!, obtainedMarks: String!, remarks: String): Boolean
    initializeMarkingExamSolution(examId: ID!): Boolean! 
    finalizeMarkingExamSolution(examId: ID!): Boolean! 
    saveExaminerRemarks(examId: ID!, remarks: String!): Boolean!
    finalizeExamSolution(examId: ID!, timeTaken: String): Boolean   

    
}


scalar Date

type Exam @key (fields: "id"){
    id: ID!
    author: User!
    name: String!
    type: String!
    instructions: String!
    startTime: String
    duration: String
    book: String!
    questions: [String]
    examQuestions: [QuestionWithMarks]      
}

type ExamSolution @key (fields: "id"){
  id: ID!
  userId: User!
  examId: Exam!
  studentAnswers: [StudentAnswer]
  markedAnswers: [MarkedAnswer]
  status: String!
  examRemarks: String

}


type StudentAnswer {
  question: Question!
  marks: String!
  answer: String!  
  time: String
}

type MarkedAnswer {
  question: Question!
  marks: String!
  candidateAnswer: String! 
  obtainedMarks: String!
  teacherRemarks: String 
}



input ExamInput {
    name: String!
    type: String!
    instructions: String!
    startTime: String
    duration: String
    book: String!
    author: ID!
    questions: [QuestionInput]
}

input QuestionInput {
  question: ID
  marks: String
}

type QuestionWithMarks {
  question: Question
  marks: String
}

extend type User @key(fields: "id") {
    id: ID! @external    
  }

  extend type Question @key(fields: "id") {
    id: ID! @external    
  }


  extend type Questions @key(fields: "ids") {
    ids: [ID] @external        
  }
 
`;