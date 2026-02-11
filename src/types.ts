import { ICommandHandler } from "@nestjs/cqrs";
import {
  InferredCommandPayload,
  InferredCommandResult,
  UseCaseCommand,
} from "./command";
import { Class } from "type-fest";

export type ExplicitUseCaseHandlerClass<TPayload = any, TResult = any> = Class<
  ICommandHandler<UseCaseCommand<TPayload, TResult>>
>;

export type InferredUseCaseHandlerClass<T extends UseCaseCommand> =
  ExplicitUseCaseHandlerClass<
    InferredCommandPayload<T>,
    InferredCommandResult<T>
  >;

export type UseCaseHandlerClass<T extends UseCaseCommand = UseCaseCommand> =
  InferredUseCaseHandlerClass<T>;
