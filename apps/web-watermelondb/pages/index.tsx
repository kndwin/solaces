import { useState, useContext, useEffect, ReactNode } from 'react';
import {
  Text,
  TextField,
  TextArea,
  Form,
  Kbd,
  Dashboard,
  Button,
  Tooltip,
  Box,
  DialogContentControlled,
  DrawerContentControlled,
  useToast,
  TSendToast,
} from '@solaces/react-ui';

import {
  Shortcuts as s,
  State as xs,
  ShortcutContext,
  ShortcutType,
  useShortcut,
  useShortcutStateSelector,
} from '@solaces/features/shortcuts';
import { useKeyboardPress } from '@solaces/react/hooks';
import clsx from 'clsx';
import {
  createOnePost,
  useRxPosts,
  TCreateOnePost,
  createOnePostZodSchema,
} from '../db';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Posts } from '../features/posts';
import { WysiwygEditor } from 'apps/web-watermelondb/features/wysiwyg-editor';

const t = {
  title: 'Solace',
  database: 'with WatermelonDB',
};

export default function Index() {
  const { send } = useShortcut();
  const { posts } = useRxPosts();

  useEffect(() => {
    send('LOAD_DASHBOARD_PAGE');
  }, []);

  return (
    <Layout>
      <Dashboard.Header>
        <Text className="font-bold">{t.database}</Text>
      </Dashboard.Header>

      <Dashboard.Main>
        {posts.length === 0 && <CreatePostInfo />}
        {posts.length > 0 && <Posts />}
      </Dashboard.Main>
      <DialogCreateNewEntry />
    </Layout>
  );
}

const CreatePostInfo = () => {
  const { send } = useShortcut();
  return (
    <Box className="flex flex-col m-auto w-60 h-60 bg-[#303030] p-4 rounded-sm shadow-lg">
      <Text className="text-lg font-bold">Welcome to Solace!</Text>
      <Text className="mt-2 text-sm">
        So glad that you're trying this app out, feel free to have some fun!
      </Text>
      <Button onClick={() => send('ADD_NEW_ENTRY')} className="mt-auto">
        Create a new entry
      </Button>
    </Box>
  );
};

export const LoadingSplashScreen = () => {
  return (
    <Box center className="min-h-screen min-w-screen bg-[#282828]">
      <Text className="text-2xl">Loading...</Text>
    </Box>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => {
  const { send } = useShortcut();
  return (
    <Dashboard>
      <Dashboard.Sidebar className="justify-between">
        <Text className="font-bold">{t.title}</Text>
        <Tooltip>
          <Tooltip.Trigger
            className="flex w-fit gap-2"
            onClick={() => send('SHOW_AVAILABLE_SHORTCUTS')}
          >
            <Kbd>{s.SHOW_AVAILABLE_SHORTCUTS.value}</Kbd>
            <Text className="text-xs">{s.SHOW_AVAILABLE_SHORTCUTS.label}</Text>
          </Tooltip.Trigger>
          <Tooltip.Content side="right" sideOffset={6} className="gap-2">
            <Text className="text-xs">
              {s.SHOW_AVAILABLE_SHORTCUTS.description}
            </Text>
            <Kbd>{s.SHOW_AVAILABLE_SHORTCUTS.value}</Kbd>
          </Tooltip.Content>
        </Tooltip>
      </Dashboard.Sidebar>
      <Box className="flex flex-col w-full min-h-full">{children}</Box>

      <DrawerHelpPanel />
    </Dashboard>
  );
};

const DialogCreateNewEntry = () => {
  const { send } = useShortcut();
  const { send: sendToast } = useToast();

  const isDashboardState = useShortcutStateSelector('dashboardPage');
  const isDialogOpenedState = useShortcutStateSelector('dialogNewEntryOpened');

  useKeyboardPress(
    {
      key: s.ADD_NEW_ENTRY.value,
      onKeyDown: (event) => {
        if (isDashboardState) {
          event.preventDefault();
          send('ADD_NEW_ENTRY');
        }
      },
    },
    [isDashboardState]
  );

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      send('ADD_NEW_ENTRY');
    } else {
      send('CLOSE_NEW_ENTRY_DIALOG');
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createOnePostZodSchema) });

  const onSubmit = async (data: TCreateOnePost) => {
    await createOnePost({
      title: data.title,
			body: data.body,
    });
    send('CLOSE_NEW_ENTRY_DIALOG');
    reset();
    sendToast({
      title: 'Post created',
      description: `"${data.title}" has been successfully created`,
      type: 'success',
    });
  };

  useEffect(() => {
    if (errors?.title?.type === 'too_small') {
      sendToast(errors.title.message as TSendToast);
    }
  }, [errors]);

  return (
    <DialogContentControlled
      open={isDialogOpenedState}
      onOpenChange={onOpenChange}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextArea
          {...register('title')}
          placeholder="Entry title"
          className="w-full text-2xl"
        />
        <Controller
          name="body"
          control={control}
          render={({ field }) => {
            return (
              <WysiwygEditor
                disableFocus
                disablePadding
                placeholder=""
                onChange={(markdown) => {
									field.onChange(markdown)
                }}
              />
            );
          }}
        />
        <Box className="flex justify-end w-full pt-2">
          <Button type="submit">Save entry</Button>
        </Box>
      </Form>
    </DialogContentControlled>
  );
};

const DrawerHelpPanel = () => {
  const { send } = useShortcut();

  const isDashboardState = useShortcutStateSelector('dashboardPage');
  const isDrawerOpenedState = useShortcutStateSelector('drawerHelpOpened');

  useKeyboardPress(
    {
      key: s.SHOW_AVAILABLE_SHORTCUTS.value,
      onKeyDown: (event) => {
        send('SHOW_AVAILABLE_SHORTCUTS');
      },
    },
    [isDashboardState]
  );

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      send('SHOW_AVAILABLE_SHORTCUTS');
    } else {
      send('CLOSE_HELP_DRAWER');
    }
  };

  return (
    <DrawerContentControlled
      open={isDrawerOpenedState}
      onOpenChange={onOpenChange}
    >
      <Text className="text-lg font-bold">Help</Text>
      <Box className="flex flex-col mt-4 gap-2">
        {Object.keys(s).map((shortcutKey) => {
          const shortcut = s[shortcutKey] as ShortcutType;
          return (
            <Box
              className={clsx(
                'justify-between grid grid-cols-[6em_1fr_1em]',
                'gap-2 items-center'
              )}
              key={shortcutKey}
            >
              <Text className="text-sm font-bold text-stone-300">
                {shortcut.label}
              </Text>
              <Text className="text-sm text-stone-300">
                {shortcut.description}
              </Text>
              <Kbd className="text-sm text-stone-300">{shortcut.value}</Kbd>
            </Box>
          );
        })}
      </Box>
    </DrawerContentControlled>
  );
};
