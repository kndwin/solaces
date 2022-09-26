import { db } from './schema';
import { useLiveQuery } from 'dexie-react-hooks';

export * from './schema';

const isSSR = () => typeof window === 'undefined';

export type TCreateOnePost = z.infer<typeof createOnePostZodSchema>;

export const createOnePost = async (post: TCreateOnePost) => {
  return await db.posts.add({
    title: post.title,
    body: post.body,
  });
};

export type TUpdateOnePost = TCreateOnePost & { id: string };
export const updateOnePost = async (post: TUpdateOnePost) => {
  await db.posts.put({
    id: post.id,
    title: post.title,
    body: post.body,
  });
};

export const deleteOnePost = async (id: string) => {
  await db.posts.delete(id);
};

export const useRxPosts = () => {
  const isBrowser = typeof window !== 'undefined';
  const posts = useLiveQuery(
    () => {
      if (isBrowser) {
        return db.posts.toArray();
      }
    },
    [isBrowser],
    []
  );
  return { posts };
};

export const useRxPost = ({ id }: { id: string }) => {
  const isBrowser = typeof window !== 'undefined';
  const post = useLiveQuery(
    () => {
      if (isBrowser) {
        return db.posts.where('id').equals(id).first();
      }
    },
    [id, isBrowser],
  );
  return { post };
};
