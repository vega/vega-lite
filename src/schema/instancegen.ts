import * as schema from './schema';
import * as schemaUtil from './schemautil';

process.stdout.write(JSON.stringify(schemaUtil.instantiate(schema)) + '\n');
