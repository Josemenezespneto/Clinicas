import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { db } from "../db";
import { usersClinicsTable } from "../db/schema";
import SignOutButton from "./components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth");
  }

  const { user } = session;

  const clinics = await db.query.usersClinicsTable.findMany({
    where: eq(usersClinicsTable.userId, user.id),
  });

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>DashBoard</h1>
      <h1>Bem-vindo, {user.name}</h1>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
