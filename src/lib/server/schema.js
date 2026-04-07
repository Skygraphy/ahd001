import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id:          serial('id').primaryKey(),
  name:        text('name').notNull(),
  description: text('description').notNull(),
  price_cents: integer('price_cents').notNull(),
  type:        text('type').notNull(),
  sort_order:  integer('sort_order').notNull().default(0),
  visible:     boolean('visible').notNull().default(true),
});
