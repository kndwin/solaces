import * as z from 'zod';
import Dexie, { Table } from 'dexie';

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
