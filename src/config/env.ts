import dotenv from 'dotenv';
import {IEnv, EnvVariable} from '@/types/envTypes';

console.log(`Loading environment variables for ${process.env.NODE_ENV}`);

dotenv.config({path: `.env.${process.env.NODE_ENV || 'development'}`});

export class Env {
  private readonly _variables = process.env as NodeJS.ProcessEnv & IEnv;

  constructor(defaultValues?: Partial<IEnv>) {
    if (defaultValues) {
      this._variables = { ...defaultValues, ...this._variables };
    }

    Object.assign(this, this._variables);
  }

  setDefaultValue(name: EnvVariable, defaultValue?: string) {
    if (this._variables[name]) return;
    if (!defaultValue) return undefined;

    Object.defineProperty(this, name, defaultValue);

    return defaultValue;
  }

  get(name: EnvVariable, defaultValue?: string) {
    return this._variables[name] || this.setDefaultValue(name, defaultValue);
  }

  getOrFail(name: EnvVariable) {
    const value = this.get(name);

    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }

  getInt(name: EnvVariable, defaultValue?: number) {
    const value = this.get(name);
    return value ? parseInt(value, 10) || undefined : defaultValue;
  }

  getIntOrFail(name: EnvVariable) {
    const value = this.getInt(name);

    if (value === undefined) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }

  getFloat(name: EnvVariable, defaultValue?: number) {
    const value = this.get(name);
    return value ? parseFloat(value) || undefined : defaultValue;
  }

  getFloatOrFail(name: EnvVariable) {
    const value = this.getFloat(name);

    if (value === undefined) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }

  getBool(name: EnvVariable, defaultValue?: boolean) {
    const value = this.get(name);
    return value ? value === 'true' : defaultValue;
  }

  getBoolOrFail(name: EnvVariable) {
    const value = this.getBool(name);

    if (value === undefined) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }

  getArray(name: EnvVariable, defaultValue?: string[]) {
    const value = this.get(name);
    return value ? value.split(',') : defaultValue;
  }

  getArrayOrFail(name: EnvVariable) {
    const value = this.getArray(name);

    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }

  getObject<T>(name: EnvVariable, defaultValue?: T) {
    const value = this.get(name);
    return value ? JSON.parse(value) : defaultValue;
  }

  getObjectOrFail<T>(name: EnvVariable) {
    const value = this.getObject<T>(name);

    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
  }
}

export const env = new Env({NODE_ENV: 'development'});
