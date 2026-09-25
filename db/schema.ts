import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const contributions=sqliteTable('contributions',{
  id:text('id').primaryKey(), workId:text('work_id').notNull(), kind:text('kind').notNull(),
  message:text('message').notNull(), observedOn:text('observed_on'), sourceUrl:text('source_url'),
  status:text('status').notNull().default('pending'), createdAt:integer('created_at').notNull(),
  reporterHash:text('reporter_hash').notNull(), reviewedAt:integer('reviewed_at'), reviewNote:text('review_note'),
},table=>[index('contributions_queue').on(table.status,table.createdAt),index('contributions_rate').on(table.reporterHash,table.createdAt)]);
