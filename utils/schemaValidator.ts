import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv();

export function validateSchema(schemaName: string, data: any) {
  const schemaPath = path.join(process.cwd(), 'schemas', `${schemaName}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(validate.errors);
    throw new Error('API schema validation failed');
  }
}
