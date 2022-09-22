import { createContext, useContext } from 'react';
import { createMachine, InterpreterFrom, assign } from 'xstate';
export { useInterpret, useActor } from '@xstate/react';
import { useSelector } from '@xstate/react';
import { MachineConfigExtended } from './type';

export type ShortcutType = {
  label: string;
  description: string;
  value: string;
  code: string;
};

// Shortcut follow the following format {Action}_{State}_{Object}
// e.g. SHOW_AVAILABLE_SHORTCUTS
// - Actions - SHOW, HIDE, ADD, EDIT, REMOVE
export const Shortcuts = {
  SHOW_AVAILABLE_SHORTCUTS: {
    label: 'Help',
    description: 'Shows all available shortcuts',
    value: '?',
    code: 'Slash',
  },
  ADD_NEW_ENTRY: {
    label: 'Add new entry',
    description: 'Add a new entry to your journal',
    value: 'c',
    code: 'KeyC',
  },
  DELETE_POST: {
    label: 'Delete post',
    description: 'Delete a post permenantly',
    value: 'Delete',
    // code: 'KeyC',
  },
} as const;

export const StateNames = [
  'pageLoad',
  'dashboardPage',
  'postPage',
  'editing',
  'drawerHelpOpened',
  'dialogNewEntryOpened',
] as const;

export const State = StateNames.reduce(
  (a, v) => ({ ...a, [v]: v }),
  {}
) as Record<typeof StateNames[number], string>;

// Below is how to force Typescript to have state and events
// https://github.com/statelyai/xstate/discussions/2406
// TODO(knd): Don't how to autogenerate this from the Shortcut
// Object above, might ask typescript community?
export type TEvents =
  | { type: 'ADD_NEW_ENTRY' }
  | { type: 'SHOW_AVAILABLE_SHORTCUTS' }
  | { type: 'DELETE_POST' }
  | { type: 'EDITING_POST' }
  | { type: 'EDITTED_POST' }
  | { type: 'LOAD_DASHBOARD_PAGE' }
  | { type: 'LOAD_POST_PAGE' }
  | { type: 'CLOSE_HELP_DRAWER' }
  | { type: 'CLOSE_POST' }
  | { type: 'CLOSE_NEW_ENTRY_DIALOG' };

type TContext = {
  page: 'dashboardPage' | 'postPage' | null;
};

const config: MachineConfigExtended = {
  id: 'keyboard-shortcuts',
  initial: 'pageLoad',
  predictableActionArguments: true,
  schema: {
    context: {} as TContext,
  },
  context: {
    page: 'dashboardPage',
  },
  states: {
    pageLoad: {
      on: {
        LOAD_DASHBOARD_PAGE: {
          target: 'dashboardPage',
          actions: assign(() => ({
            page: 'dashboardPage',
          })),
        },
        LOAD_POST_PAGE: {
          target: 'postPage',
          actions: assign(() => ({
            page: 'postPage',
          })),
        },
      },
    },
    dashboardPage: {
      on: {
        ADD_NEW_ENTRY: { target: 'dialogNewEntryOpened' },
        SHOW_AVAILABLE_SHORTCUTS: {
          target: 'drawerHelpOpened',
          actions: assign(() => ({
            page: 'dashboardPage',
          })),
        },
        LOAD_POST_PAGE: { target: 'postPage' },
        EDITING_POST: { target: 'editing' },
      },
    },
    drawerHelpOpened: {
      on: {
        CLOSE_HELP_DRAWER: [
          {
            target: 'dashboardPage',
            cond: (ctx) => ctx.page === 'dashboardPage',
          },
          { target: 'postPage', cond: (ctx) => ctx.page === 'postPage' },
        ],
      },
    },
    dialogNewEntryOpened: {
      on: {
        CLOSE_NEW_ENTRY_DIALOG: { target: 'dashboardPage' },
      },
    },
    postPage: {
      on: {
        SHOW_AVAILABLE_SHORTCUTS: {
          target: 'drawerHelpOpened',
          actions: assign(() => ({
            page: 'postPage',
          })),
        },
        CLOSE_POST: { target: 'dashboardPage' },
        EDITING_POST: {
          target: 'editing',
          actions: assign(() => ({
            page: 'postPage',
          })),
        },
      },
    },
    editing: {
      on: {
        EDITTED_POST: [
          { target: 'postPage', cond: (ctx) => ctx.page === 'postPage' },
          {
            target: 'dashboardPage',
            cond: (ctx) => ctx.page === 'dashboardPage',
          },
        ],
      },
    },
  },
};

export const shortcutMachine = createMachine(config);

export const ShortcutContext = createContext({
  shortcutService: {} as InterpreterFrom<typeof shortcutMachine>,
});

export const useShortcut = () => {
  const service = useContext(ShortcutContext).shortcutService;

  return {
    service,
    send: service.send,
  };
};

export const useShortcutStateSelector = (state: typeof StateNames[number]) => {
  const service = useContext(ShortcutContext).shortcutService;
  const isState = useSelector(service, (s) => s.matches(state));
  return isState;
};
