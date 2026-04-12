CREATE TABLE IF NOT EXISTS "settings" (
  "key" text PRIMARY KEY NOT NULL,
  "value" text NOT NULL
);

INSERT INTO "settings" ("key", "value")
VALUES ('maintenance_mode', 'false')
ON CONFLICT ("key") DO NOTHING;
