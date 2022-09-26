import { Database, Collection } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema, Post, TableName } from './schema';
import { useObservable } from 'rxjs-hooks';
import * as z from 'zod';

const adapter = new LokiJSAdapter({
  schema,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: 'myapp',
  // --- Optional, but recommended event handlers:
  onQuotaExceededError: (error) => {},
  onSetUpError: (error) => {},
  extraIncrementalIDBOptions: {
    onDidOverwrite: () => {},
    onversionchange: () => {},
  },
});

const database = new Database({
  adapter,
  modelClasses: [Post],
});

const postsCollection = database.get<Post>(TableName.POST);

export type TErrorMessage = {
  title: string;
  description: string;
  type: 'error' | 'info';
};
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

export type TCreateOnePost = z.infer<typeof createOnePostZodSchema>;

export const createOnePost = async (post: TCreateOnePost) => {
  await database.write(async () => {
    await postsCollection.create((p: Post) => {
      p.title = post.title;
      p.body = post.body;
    });
  });
};

export type TUpdateOnePost = TCreateOnePost & { id: string };
export const updateOnePost = async (post: TUpdateOnePost) => {
  await database.write(async () => {
    const postToUpdate = await postsCollection.find(post.id);
    await postToUpdate.update(() => {
      postToUpdate.title = post.title;
      postToUpdate.body = post.body;
    });
  });
};

export const deleteOnePost = async (id: string) => {
  const post = await postsCollection.find(id);
  await database.write(async () => {
    await post.markAsDeleted();
  });
};

export const useRxPosts = () => {
  const posts = useObservable(() => postsCollection.query().observe(), [], []);
  return { posts };
};

export const useRxPost = ({ id }: { id: string }) => {
  const post = useObservable(() => postsCollection.findAndObserve(id));
  return { post };
};
