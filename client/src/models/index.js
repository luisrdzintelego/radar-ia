// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Ranking } = initSchema(schema);

export {
  Ranking
};