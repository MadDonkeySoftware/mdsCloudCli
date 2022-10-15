// type ArgumentsCamelCase<T = {}> = { [key in keyof T as key | CamelCaseKey<key>]: T[key] } & {
export type Options<T = Record<string, unknown>> = {
  [key in keyof T as key];
} & {
  env: string;
};
