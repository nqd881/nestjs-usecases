import { UseCaseClass } from "./usecase";

export const createUseCaseProviders = (useCaseClasses: UseCaseClass[]) =>
  useCaseClasses.flatMap((useCaseClass) => [
    useCaseClass,
    useCaseClass.Handler(),
  ]);
