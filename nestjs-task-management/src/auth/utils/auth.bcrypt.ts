import * as bcrypt from 'bcrypt';

export async function bcryptCompare(value: string, valueCompared: string) {
  return await bcrypt.compare(value, valueCompared);
}