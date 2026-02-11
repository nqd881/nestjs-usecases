import { Command } from "@nestjs/cqrs";
import { Class } from "type-fest";
import { ClassStatic } from "./util-types";

export class UseCaseCommand<
  TPayload = any,
  TResult = any,
> extends Command<TResult> {
  constructor(
    public readonly id: string,
    public readonly timestamp: number,
    public readonly payload: TPayload,
    public readonly causationId?: string,
    public readonly correlationIds?: Record<string, string>,
  ) {
    super();
  }
}

export type InferredCommandPayload<T extends UseCaseCommand> =
  T extends UseCaseCommand<infer P> ? P : never;

export type InferredCommandResult<T extends UseCaseCommand> =
  T extends UseCaseCommand<any, infer R> ? R : never;

export type ExplicitUseCaseCommandClass<TPayload = any, TResult = any> = Class<
  UseCaseCommand<TPayload, TResult>,
  ConstructorParameters<typeof UseCaseCommand<TPayload, TResult>>
> &
  ClassStatic<typeof UseCaseCommand<TPayload, TResult>>;

export type InferredUseCaseCommandClass<T extends UseCaseCommand> =
  ExplicitUseCaseCommandClass<
    InferredCommandPayload<T>,
    InferredCommandResult<T>
  >;

export type UseCaseCommandClass<T extends UseCaseCommand = UseCaseCommand> =
  InferredUseCaseCommandClass<T>;
