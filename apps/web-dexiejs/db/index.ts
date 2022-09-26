import { useLiveQuery } from 'dexie-react-hooks';
import Dexie, { Table } from 'dexie';
import * as z from 'zod';

export const createOnePostZodSchema = z.object({
  title: z.string().min(1, {
    // @ts-ignore
    message: {
      title: 'Title required',
      description: 'Please enter a title before submitting.',
      type: 'info',
    },
  }),
  body: z.string(),
});

export type Post = {
  id?: string;
  title: string;
  body: string;
};

export class CustomDexie extends Dexie {
  posts!: Table<Post>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      posts: '++id, name, age', // Primary key and indexed props
    });
  }
}

export const db = new CustomDexie();

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
  const post = useLiveQuery(() => {
    if (isBrowser) {
      return db.posts.where('id').equals(id).first();
    }
  }, [id, isBrowser]);
  return { post };
};
