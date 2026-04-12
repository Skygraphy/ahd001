import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core';

export const settings = pgTable('settings', {
  key:   text('key').primaryKey(),
  value: text('value').notNull(),
});

export const products = pgTable('products', {
  id:          serial('id').primaryKey(),
  name:        text('name').notNull(),
  description: text('description').notNull(),
  price_cents: integer('price_cents').notNull(),
  type:        text('type').notNull(),
  sort_order:  integer('sort_order').notNull().default(0),
  visible:     boolean('visible').notNull().default(true),
});

export const productImages = pgTable('product_images', {
  id:         serial('id').primaryKey(),
  product_id: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url:        text('url').notNull(),
  alt:        text('alt').notNull().default(''),
  sort_order: integer('sort_order').notNull().default(0),
});
