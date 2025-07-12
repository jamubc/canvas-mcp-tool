import * as v from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';

const schema = v.object({
  enrollment_type: v.optional(v.picklist(['teacher', 'student'])),
  include: v.optional(v.array(v.picklist(['term', 'teachers'])))
});

const jsonSchema = toJsonSchema(schema);
console.log(JSON.stringify(jsonSchema, null, 2));