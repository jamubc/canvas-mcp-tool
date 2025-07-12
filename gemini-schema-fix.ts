/**
 * Fixes JSON Schema for Google Vertex AI compatibility
 * Adds missing 'type' fields to enum properties
 */
export function fixSchemaForGemini(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  // Clone to avoid mutating the original
  const fixed = JSON.parse(JSON.stringify(schema));

  // Fix properties recursively
  function fixProperties(obj: any): void {
    if (obj.properties) {
      for (const [key, prop] of Object.entries(obj.properties)) {
        if (prop && typeof prop === 'object') {
          // If it has enum but no type, add type: string
          if (prop.enum && !prop.type) {
            prop.type = 'string';
          }
          // If it has items (array), ensure items have type
          if (prop.items) {
            if (prop.items.enum && !prop.items.type) {
              prop.items.type = 'string';
            }
            fixProperties(prop.items);
          }
          // Recurse into nested objects
          fixProperties(prop);
        }
      }
    }
  }

  fixProperties(fixed);
  return fixed;
}