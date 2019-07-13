import examResolvers from './exam';
import { merge } from 'lodash';
import { GraphQLDateTime } from 'graphql-iso-date';

const resolvers = {};

const customScalarResolver = {
    Date: GraphQLDateTime,
  };


export default merge(resolvers, examResolvers, customScalarResolver);

