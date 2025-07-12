import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import { toJsonSchema } from '@valibot/to-json-schema';

/**
 * Helper to wrap any non-object JSON schema into an empty object schema.
 */
function wrapSchemaToObject(schema: v.BaseSchema<any, any, any>): any {
  let jsonSchema = toJsonSchema(schema);
  if (jsonSchema.type !== 'object') {
    jsonSchema = {
      type: 'object',
      properties: {},
      additionalProperties: false,
    };
  } else {
    // Ensure additionalProperties is set for object schemas
    if (!('additionalProperties' in jsonSchema)) {
      jsonSchema.additionalProperties = false;
    }
  }
  return jsonSchema;
}

describe('Schema conversion wrapper', () => {
  it('wraps primitive and non-object schemas into object schemas', () => {
    const testSchemas = [
      v.string(),
      v.number(),
      v.boolean(),
      v.literal('foo'),
      v.array(v.string()),
    ];

    for (const schema of testSchemas) {
      const converted = wrapSchemaToObject(schema);
      expect(converted).toEqual({
        type: 'object',
        properties: {},
        additionalProperties: false,
      });
    }
  });

  it('preserves original object schemas', () => {
    const schema = v.object({
      foo: v.string(),
      bar: v.number(),
    });
    const converted = wrapSchemaToObject(schema);
    expect(converted.type).toBe('object');
    expect(converted.properties).toHaveProperty('foo');
    expect(converted.properties).toHaveProperty('bar');
    expect(converted.additionalProperties).toBe(false);
  });
});
