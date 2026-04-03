import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";

import { db } from "@/app/db";
import * as schema from "@/app/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const clinics = await db.query.usersClinicsTable.findMany({
        where: (usersClinics, { eq }) => eq(usersClinics.userId, user.id),
        with: {
          clinic: true,
        },
      });
      return {
        user: {
          ...user,
          clinics: clinics?.map((uc) => uc?.clinic).filter(Boolean) || [],
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "usersTable",
  },
  session: {
    modelName: "sessionsTable",
  },
  account: {
    modelName: "accountsTable",
  },
  verification: {
    modelName: "verificationsTable",
  },
  emailAndPassword: {
    enabled: true,
  },
});
