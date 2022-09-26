import { useEffect, useState } from 'react';
import { Text, Box, TextField, LoadingSplashScreen } from '@solaces/react/ui';
import { HiX, HiOutlineArrowSmUp, HiOutlineArrowSmDown, HiDocument } from 'react-icons/hi';
import { useRouter } from 'next/router';
import {
  Shortcuts as s,
  State as xs,
  useShortcut,
  useShortcutStateSelector,
} from '@solaces/features/shortcuts';
import { useKeyboardPress } from '@solaces/react/hooks';
import { Layout } from 'apps/web-watermelondb/pages';
import {
  useRxPost,
  updateOnePost,
  TUpdateOnePost,
} from 'apps/web-watermelondb/db';
import { usePostStore } from 'apps/web-watermelondb/features/posts';
import { WysiwygEditor } from '@solaces/features/wysiwyg-editor';
import clsx from 'clsx';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { match } from 'ts-pattern';
import { HiCheck, HiOutlineDotsHorizontal, HiXCircle, HiOutlineDocumentText } from 'react-icons/hi';

export default function PostPage() {
  const focusIndex = usePostStore.use.focusIndex();
  const postIds = usePostStore.use.postIds();
  const incrementFocusIndex = usePostStore.use.incrementFocusIndex();
  const decrementFocusIndex = usePostStore.use.decrementFocusIndex();
  const { send, service } = useShortcut();

  const isPostPage = useShortcutStateSelector('postPage');
  const isEditing = useShortcutStateSelector('editing');

  const router = useRouter();

  const isFinalPost = focusIndex === postIds.length - 1;
  const isFirstPost = focusIndex === 0;

  const handlePostPageIncrement = () => {
    incrementFocusIndex();
    router.push(`/post/${postIds[focusIndex + 1]}`);
  };

  const handlePostPageDecrement = () => {
    decrementFocusIndex();
    router.push(`/post/${postIds[focusIndex - 1]}`);
  };

  const handleClosePostPage = () => {
    send('CLOSE_POST');
    router.push('/');
  };

  useEffect(
    function loadPostState() {
      if (router.pathname.includes('post')) {
        send('LOAD_POST_PAGE');
      }
    },
    [router.pathname]
  );

  useEffect(function prefetchDashboardPage() {
    router.prefetch('/');
  }, []);

  useKeyboardPress(
    {
      key: 'Escape',
      onKeyDown: () => {
        if (isPostPage && !isEditing) {
          handleClosePostPage();
        }
      },
    },
    [isPostPage, isEditing]
  );

  useKeyboardPress(
    {
      key: 'j',
      onKeyDown: () => {
        if (!isFinalPost && !isEditing) {
          handlePostPageIncrement();
        }
      },
    },
    [focusIndex, postIds.length, isEditing]
  );

  useKeyboardPress(
    {
      key: 'k',
      onKeyDown: () => {
        if (!isFirstPost && !isEditing) {
          handlePostPageDecrement();
        }
      },
    },
    [focusIndex, postIds.length, isEditing]
  );

  if (router.query?.id == null) {
    return <LoadingSplashScreen />;
  }

  const postId = postIds[focusIndex];

  const updateOnePostMutation = useMutation(
    async (postUpdate: TUpdateOnePost) => {
      await updateOnePost(postUpdate);
    }
  );
  const postStatuses = match(updateOnePostMutation.status)
    .with('success', () => (
      <>
        <HiCheck className='text-green-100' />
        <Text className="text-sm">Changes saved</Text>
      </>
    ))
    .with('error', () => (
      <>
        <HiXCircle className='text-red-100' />
        <Text className="text-sm">Something went wrong</Text>
      </>
    ))
    .with('idle', () => (
      <>
        <HiOutlineDocumentText className='text-stone-100' />
        <Text className="text-sm">Document ready</Text>
      </>
		))
    .with('loading', () => (
      <>
        <HiOutlineDotsHorizontal className='text-stone-100' />
        <Text className="text-sm">Saving changes...</Text>
      </>
    ))
    .exhaustive();

  useEffect(() => {
    console.log({ status: updateOnePostMutation.status });
  }, [updateOnePostMutation.status]);

  return (
    <Layout>
      <Box className="flex-1 bg-[#333333] p-4 rounded-md m-4">
        <Box className="flex items-center mb-4 gap-2 text-stone-300">
          <HiX onClick={() => handleClosePostPage()} />
          <HiOutlineArrowSmUp
            onClick={() => handlePostPageDecrement()}
            className={clsx(isFirstPost && 'text-stone-600')}
          />
          <HiOutlineArrowSmDown
            onClick={() => handlePostPageIncrement()}
            className={clsx(isFinalPost && 'text-stone-600')}
          />
          <Box className="flex items-center ml-2 gap-2 py-1 px-2 bg-[#282828]">
            {postStatuses}
          </Box>
        </Box>
        <Post key={postId} id={postId} mutation={updateOnePostMutation} />
      </Box>
    </Layout>
  );
}

type PostProps = {
  id: string;
  mutation: UseMutationResult;
};
const Post = (props: PostProps) => {
  const { send } = useShortcut();
  const { post } = useRxPost({ id: props.id });

  const [title, setTitle] = useState('');
  useEffect(() => post?.title && setTitle(post?.title), [post?.title]);

  return (
    <Box className="flex flex-col w-full">
      <TextField
        className="pl-4 text-lg font-bold text-stone-300 bg-[transparent]"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        onFocus={() => {
          send('EDITING_POST');
        }}
        onBlur={async (e) => {
          send('EDITTED_POST');
          const titleToSet = e.target.value;
          await props.mutation.mutateAsync({
            id: post.id,
            title: titleToSet,
            body: post.body,
          });
        }}
      />
      <WysiwygEditor
        onBlur={async (markdown) => {
          send('EDITTED_POST');
          await props.mutation.mutateAsync({
            id: post?.id,
            title: post?.title,
            body: markdown,
          });
        }}
        initialContent={post?.body}
        onFocus={() => {
          send('EDITING_POST');
        }}
      />
    </Box>
  );
};
