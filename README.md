## To make prisma schema changes in sync with database you should:

-   run migration
    npx prisma migrate dev --name add-role-to-user
-   update Prisma Client
    npx prisma generate
