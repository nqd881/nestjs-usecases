import { Class } from "type-fest";
import { USE_CASE_COMMAND_CLASS, USE_CASE_HANDLER_CLASS } from "./consts";
import { ExplicitUseCaseHandlerClass } from "./types";
import { ExplicitUseCaseCommandClass } from "./command";
import { ClassStatic } from "./util-types";
import { v4 } from "uuid";

const PAYLOAD_TYPE_SYMBOL = Symbol("PAYLOAD_TYPE");
const RESULT_TYPE_SYMBOL = Symbol("RESULT_TYPE");

export type UseCaseHandlerFn<TPayload = any, TResult = any> = (
  payload: TPayload,
) => Promise<TResult>;

export class UseCase<TPayload = any, TResult = any> {
  readonly [PAYLOAD_TYPE_SYMBOL]: TPayload;
  readonly [RESULT_TYPE_SYMBOL]: TResult;

  static Command<TPayload = any, TResult = any>(
    this: ExplicitUseCaseClass<TPayload, TResult>,
  ): ExplicitUseCaseCommandClass<TPayload, TResult> {
    const commandType = Reflect.getOwnMetadata(USE_CASE_COMMAND_CLASS, this);

    if (!commandType) throw new Error("Command class not found");

    return commandType;
  }

  static Handler<TPayload = any, TResult = any>(
    this: ExplicitUseCaseClass<TPayload, TResult>,
  ): ExplicitUseCaseHandlerClass<TPayload, TResult> {
    const commandHandlerType = Reflect.getOwnMetadata(
      USE_CASE_HANDLER_CLASS,
      this,
    );

    if (!commandHandlerType) throw new Error("Command handler class not found");

    return commandHandlerType;
  }

  static newCommand<TPayload = any, TResult = any>(
    this: ExplicitUseCaseClass<TPayload, TResult>,
    payload: TPayload,
    id?: string,
    causationId?: string,
    correlationIds?: Record<string, string>,
  ) {
    const commandClass = this.Command();

    return new commandClass(
      id ?? v4(),
      Date.now(),
      payload,
      causationId,
      correlationIds,
    );
  }
}

export type InferredUseCasePayload<T extends UseCase> =
  T extends UseCase<infer P> ? P : never;

export type InferredUseCaseResult<T extends UseCase> =
  T extends UseCase<any, infer R> ? R : never;

export type ExplicitUseCaseClass<TPayload = any, TResult = any> = Class<
  UseCase<TPayload, TResult>
> &
  ClassStatic<typeof UseCase<TPayload, TResult>>;

export type InferredUseCaseClass<T extends UseCase> = ExplicitUseCaseClass<
  InferredUseCasePayload<T>,
  InferredUseCaseResult<T>
>;

export type UseCaseClass<T extends UseCase = UseCase> = InferredUseCaseClass<T>;
