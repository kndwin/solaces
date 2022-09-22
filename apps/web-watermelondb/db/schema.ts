import { appSchema, tableSchema, Model } from '@nozbe/watermelondb';
import { text, date } from '@nozbe/watermelondb/decorators';

export const TableName = { POST: 'posts' } as const;
export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: TableName.POST,
      columns: [
        { name: 'title', type: 'string' },
        { name: 'body', type: 'string' },
      ],
    }),
  ],
});

export class Post extends Model {
  static table = TableName.POST;

  @text('title') title!: string;
  @text('body') body!: string;
}
