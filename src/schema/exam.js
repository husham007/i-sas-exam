import { gql } from 'apollo-server-express';

export default gql `
extend type Query {
   
    exams: [Exam]
    examsByBook (name: String!): [Exam]
    exam(id: ID!): Exam
    
    # Fetches a Question Object given its ID.
    # question(id: ID!): Question!
    # searchQuestion (searchInput: SearchInput!): [Question]

    
}

extend type Mutation {
    

    createExam (examInput: ExamInput!): Exam!
    

    
}

type Exam @key (fields: "id questions"){
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