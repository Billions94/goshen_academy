import { capitalize } from 'lodash';

const Getters =
  () =>
  <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const props = Reflect.ownKeys(this);
        props.forEach((prop: string) => {
          const capitalizedKey = capitalize(prop);
          const methodName = `get${capitalizedKey}`;
          Object.defineProperty(this, methodName, {
            value: () => (this as any)[prop],
          });
        });
      }
    };
  };
const Setters =
  () =>
  <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const props = Reflect.ownKeys(this);
        props.forEach((prop: string) => {
          const capitalizedKey = capitalize(prop);
          const methodName = `set${capitalizedKey}`;
          Object.defineProperty(this, methodName, {
            value: (newValue: any) => {
              (this as any)[prop] = newValue;
            },
          });
        });
      }
    };
  };

export { Getters, Setters };
