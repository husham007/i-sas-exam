import examResolvers from './exam';
import { merge } from 'lodash';

const resolvers = {};
export default merge(resolvers, examResolvers);

