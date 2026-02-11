import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";
import { CommandBus, CqrsModule, ICommandPublisher } from "@nestjs/cqrs";
import { COMMAND_BUS } from "./tokens";
import { UseCaseClass } from "./usecase";

export type UseCasesModuleOptions = Pick<
  ModuleMetadata,
  "imports" | "providers" | "exports"
> & {
  useCaseClasses?: UseCaseClass[];
  commandPublisher?: ICommandPublisher;
  global?: boolean;
};

@Module({})
export class UseCasesModule {
  static forRoot(options: UseCasesModuleOptions): DynamicModule {
    const {
      imports,
      providers,
      exports,
      useCaseClasses,
      commandPublisher,
      global,
    } = options;

    const useCaseProviders: Provider[] =
      useCaseClasses?.flatMap((useCase) => [useCase, useCase.Handler()]) ?? [];

    return {
      module: UseCasesModule,
      imports: [
        ...(imports ?? []),
        {
          ...CqrsModule.forRoot({
            commandPublisher,
          }),
          global: false,
        },
      ],
      providers: [
        ...(providers ?? []),
        ...useCaseProviders,
        {
          provide: COMMAND_BUS,
          useExisting: CommandBus,
        },
      ],
      exports: [COMMAND_BUS, ...useCaseProviders, ...(exports ?? [])],
      global,
    };
  }
}
