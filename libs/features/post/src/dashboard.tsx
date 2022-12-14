import { usePostStore } from './store';
import { useEffect, useCallback, useRef } from 'react';
import {
  Text,
  Kbd,
  Tooltip,
  Box,
  useAlert,
  ContextMenu,
} from '@solaces/react/ui';

import {
  Shortcuts as s,
  State as xs,
  useShortcut,
  useShortcutStateSelector,
} from '@solaces/features/shortcuts';
import { useKeyboardPress } from '@solaces/react/hooks';
import { HiPlus, HiOutlineTrash } from 'react-icons/hi';
import clsx from 'clsx';
import Link from 'next/link';
// import { useRxPosts, deleteOnePost } from '../../db';
import { TPost } from './types';

export const PostsComponent = ({
  posts,
  deleteOnePost,
}: {
  posts: TPost[];
  deleteOnePost: (id: string) => void;
}) => {
  // const { posts } = useRxPosts();
  const { send } = useShortcut();

  const focusIndex = usePostStore.use.focusIndex();
  const setFocusIndex = usePostStore.use.setFocusIndex();
  const postIds = usePostStore.use.postIds();
  const setPostIds = usePostStore.use.setPostIds();
  const incrementFocusIndex = usePostStore.use.incrementFocusIndex();
  const decrementFocusIndex = usePostStore.use.decrementFocusIndex();
  const isDashboardPage = useShortcutStateSelector('dashboardPage');

  useEffect(() => {
    const postIdsToSet = (posts.map((p) => p.id) ?? []) as string[];
    setPostIds(postIdsToSet);
  }, [posts.length]);

  const { send: sendAlert } = useAlert();

  const deletePostWithAlert = useCallback(() => {
    const isPostFocused = posts.length > 0 && typeof focusIndex === 'number';
    if (isPostFocused) {
      const focusedPost = posts[focusIndex];
      sendAlert({
        title: `"Delete Post": ${focusedPost.title}?`,
        description: `Are you you sure you want to delete "${focusedPost.title}"?`,
        onConfirm: async () => {
          deleteOnePost(focusedPost?.id as string);
          decrementFocusIndex();
        },
      });
    }
  }, [posts.length, focusIndex]);

  useKeyboardPress(
    {
      key: 'j',
      onKeyDown: () => {
        if (isDashboardPage) {
          incrementFocusIndex();
        }
      },
    },
    [isDashboardPage]
  );

  useKeyboardPress(
    {
      key: 'k',
      onKeyDown: () => {
        if (isDashboardPage) {
          decrementFocusIndex();
        }
      },
    },
    [isDashboardPage]
  );

  useKeyboardPress(
    {
      key: 'Delete',
      onKeyDown: () => {
        if (isDashboardPage) {
          deletePostWithAlert();
        }
      },
    },
    [isDashboardPage]
  );

  return (
    <Box className="flex flex-col divide-y divide-stone-700 border-y border-stone-700">
      <Box className="flex justify-end w-full p-2 bg-[#333333]">
        <Tooltip>
          <Tooltip.Trigger onClick={() => send('ADD_NEW_ENTRY')}>
            <HiPlus className="text-stone-300" />
          </Tooltip.Trigger>
          <Tooltip.Content side="left" sideOffset={6}>
            <Text className="text-xs">{s.ADD_NEW_ENTRY.label}</Text>
            <Kbd className="ml-2">{s.ADD_NEW_ENTRY.value}</Kbd>
          </Tooltip.Content>
        </Tooltip>
      </Box>
      {posts.map((post, index) => {
        const isFocused =
          typeof focusIndex == 'number' && post.id === postIds[focusIndex];

        return (
          <ContextMenu key={post.id}>
            <ContextMenu.Trigger>
              <PostComponent
                post={post}
                isFocused={isFocused}
                setFocusCurrentIndex={() => setFocusIndex(index)}
              />
            </ContextMenu.Trigger>
            <ContextMenu.Portal>
              <ContextMenu.Content>
                <ContextMenu.Item onClick={() => deletePostWithAlert()}>
                  <HiOutlineTrash />
                  <Text className="text-sm ">{s.DELETE_POST.label}</Text>
                  <Kbd className="ml-auto">{s.DELETE_POST.value}</Kbd>
                </ContextMenu.Item>
              </ContextMenu.Content>
            </ContextMenu.Portal>
          </ContextMenu>
        );
      })}
    </Box>
  );
};

const PostComponent = ({
  post,
  isFocused,
  setFocusCurrentIndex,
}: {
  post: TPost;
  isFocused?: boolean;
  setFocusCurrentIndex: () => void;
}) => {
  const focusRef = useRef(null);

  useEffect(() => {
    if (isFocused && Boolean(focusRef?.current)) {
      focusRef?.current.focus();
    }
  }, [isFocused]);

  return (
    <Link key={post.id} href={`/post/${post.id}`}>
      <a
        ref={focusRef}
        tabIndex={0}
        onMouseOver={() => setFocusCurrentIndex()}
        className={clsx(
          'w-full p-2 bg-[#282828] hover:bg-[#303030]',
          'focus:outline-none',
          'focus:ring-2 focus:ring-inset',
          'focus:ring-stone-500',
          isFocused && 'bg-[#303030]'
        )}
      >
        <Text className="text-base font-bold">{post.title}</Text>
      </a>
    </Link>
  );
};
