import {
  createMachine,
  InterpreterFrom,
  interpret,
  TransitionConfig,
  MachineConfig,
  StatesConfig,
  DoneInvokeEvent,
  SingleOrArray,
} from 'xstate';
import { StateNames, TEvents} from '.'

// Below is how to force Typescript to have state and events
// https://github.com/statelyai/xstate/discussions/2406
//
export type StateTypes = typeof StateNames[number];

type TContext = {};

type TStates = {
  states: Record<typeof StateNames[number], {}>;
};

type TransitionConfigExtracted<T> = TransitionConfig<
  TContext,
  Extract<TEvents, { type: T }>
>;

type TransitionConfigExtended = {
  [N in TEvents['type']]?: SingleOrArray<
    { target: StateTypes } & TransitionConfigExtracted<N>
  >;
};

type StateConfigExtended = {
  on?: TransitionConfigExtended;
  invoke?: {
    onDone: SingleOrArray<
      { target: StateTypes } & TransitionConfig<TContext, DoneInvokeEvent<any>>
    >;
    onError: SingleOrArray<
      { target: StateTypes } & TransitionConfig<TContext, DoneInvokeEvent<any>>
    >;
  };
};

export type MachineConfigExtended = MachineConfig<
  TContext,
  TStates,
  TEvents
> & {
  states: StatesConfig<TContext, TStates, TEvents> & {
    // same for states
    [K in StateTypes]: StateConfigExtended;
  };
};
