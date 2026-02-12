import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import "reflect-metadata";
import { UseCaseCommand } from "./command";
import {
  USE_CASE_COMMAND_CLASS,
  USE_CASE_HANDLER_CLASS,
  USE_CASE_HANDLER_METHOD,
} from "./consts";
import {
  ExplicitUseCaseClass,
  InferredUseCasePayload,
  InferredUseCaseResult,
  UseCase,
  UseCaseHandlerFn,
} from "./usecase";

export const RegisterUseCase = <TPayload, TResult>(
  target: ExplicitUseCaseClass<TPayload, TResult>,
) => {
  class GeneratedUseCaseCommand extends UseCaseCommand<TPayload, TResult> {}

  @CommandHandler(GeneratedUseCaseCommand)
  class GeneratedUseCaseCommandHandler implements ICommandHandler<GeneratedUseCaseCommand> {
    constructor(@Inject(target) private useCase: InstanceType<typeof target>) {}

    execute(command: GeneratedUseCaseCommand): Promise<TResult> {
      const { payload } = command;

      // Use getMetadata instead of getOwnMetadata, so we can have hierarchical effect
      const handler = Reflect.getMetadata(
        USE_CASE_HANDLER_METHOD,
        target.prototype,
      ) as UseCaseHandlerFn<TPayload, TResult> | undefined;

      if (!handler) throw new Error("Handler method is not defined");

      return handler.call(this.useCase, payload);
    }
  }

  Reflect.defineMetadata(
    USE_CASE_COMMAND_CLASS,
    GeneratedUseCaseCommand,
    target,
  );
  Reflect.defineMetadata(
    USE_CASE_HANDLER_CLASS,
    GeneratedUseCaseCommandHandler,
    target,
  );

  Injectable()(target);
};

export const UseCaseHandler = <T extends UseCase>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<
    UseCaseHandlerFn<InferredUseCasePayload<T>, InferredUseCaseResult<T>>
  >,
) => {
  Reflect.defineMetadata(USE_CASE_HANDLER_METHOD, descriptor.value, target);
};
