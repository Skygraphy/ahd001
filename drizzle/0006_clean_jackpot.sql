CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "public_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "nummer" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "beschreibung" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "besonderheiten" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "materialien" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "masse" text;