import { defineConfig } from '@prisma/config';

export default defineConfig({
  
  schema: 'prisma/schema.prisma',
  // Define your database connection URL here for Prisma 7
  datasource: {
    url: 'postgresql://postgres:aashif%40123@localhost:5432/rideel?schema=public',
  },
});