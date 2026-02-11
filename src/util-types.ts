import { Class, AbstractClass } from "type-fest";

export type AnyClass<T = any> = Class<T> | AbstractClass<T>;

export type ClassStatic<T extends AnyClass<any>> = Omit<
  T,
  "constructor" | "prototype"
>;
