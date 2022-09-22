import { useEffect, useState } from 'react';
import { Text, Box, TextField } from '@solaces/react-ui';
import { HiX, HiOutlineArrowSmUp, HiOutlineArrowSmDown } from 'react-icons/hi';
import {
  Shortcuts as s,
  State as xs,
  useShortcut,
	useActor, 
  useShortcutStateSelector,
} from '@solaces/features/shortcuts';
import { useKeyboardPress } from '@solaces/react/hooks';
import { Layout, LoadingSplashScreen } from '..';
import { useRouter } from 'next/router';
import { useRxPost, updateOnePost } from '../../db';
import { usePostStore } from 'apps/web-watermelondb/features/posts';
import { WysiwygEditor } from 'apps/web-watermelondb/features/wysiwyg-editor';
import clsx from 'clsx';

export default function PostPage() {
  const focusIndex = usePostStore.use.focusIndex();
  const postIds = usePostStore.use.postIds();
  const incrementFocusIndex = usePostStore.use.incrementFocusIndex();
  const decrementFocusIndex = usePostStore.use.decrementFocusIndex();
  const { send, service } = useShortcut();
	const [state] = useActor(service)
  const isPostState = useShortcutStateSelector('postPage');
  const isEditing = useShortcutStateSelector('editing');
  const router = useRouter();

  const isFinalPost = focusIndex === postIds.length - 1;
  const isFirstPost = focusIndex === 0;
	console.log({ isEditing, state: state.value })

  const handlePostPageIncrement = () => {
    if (!isFinalPost && !isEditing) {
      incrementFocusIndex();
      router.push(`/post/${postIds[focusIndex + 1]}`);
    }
  };

  const handlePostPageDecrement = () => {
    if (!isFirstPost && !isEditing) {
      decrementFocusIndex();
      router.push(`/post/${postIds[focusIndex - 1]}`);
    }
  };

  const handleClosePostPage = () => {
    if (isPostState && !isEditing) {
      send('CLOSE_POST');
      router.push('/');
    }
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
      onKeyDown: () => handleClosePostPage(),
    },
    [isPostState, isEditing]
  );

  useKeyboardPress(
    {
      key: 'j',
      onKeyDown: () => handlePostPageIncrement(),
    },
    [focusIndex, postIds.length, isEditing]
  );

  useKeyboardPress(
    {
      key: 'k',
      onKeyDown: () => handlePostPageDecrement(),
    },
    [focusIndex, postIds.length, isEditing]
  );

  if (router.query?.id == null) {
    return <LoadingSplashScreen />;
  }

  const postId = postIds[focusIndex];
  return (
    <Layout>
      <Box className="flex-1 bg-[#333333] p-4 rounded-md m-4">
        <Box className="flex mb-4 gap-2 text-stone-300">
          <HiX onClick={() => handleClosePostPage()} />
          <HiOutlineArrowSmUp
            onClick={() => handlePostPageDecrement()}
            className={clsx(isFirstPost && 'text-stone-600')}
          />
          <HiOutlineArrowSmDown
            onClick={() => handlePostPageIncrement()}
            className={clsx(isFinalPost && 'text-stone-600')}
          />
        </Box>
        <Post key={postId} id={postId} />
      </Box>
    </Layout>
  );
}

const Post = ({ id }: { id: string }) => {
  const { send } = useShortcut();
  const { post } = useRxPost({ id });

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
          await updateOnePost({
            id: post.id,
            title: titleToSet,
            body: post.body,
          });
        }}
      />
      <WysiwygEditor
        key={id}
        onBlur={async (markdown) => {
          send('EDITTED_POST');
          await updateOnePost({
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
