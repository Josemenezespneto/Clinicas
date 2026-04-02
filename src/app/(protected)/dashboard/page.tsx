import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { db } from "../../db";
import { usersClinicsTable } from "../../db/schema";
import SignOutButton from "./_components/sign-out-button";

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
      {/*  <div className="flex items-center gap-2">
        <Image
          src={user?.image || "/user-circle.svg"}
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1>Bem-vindo, {user.name}</h1>
      </div>
      <div className="mt-4">
        <SignOutButton />
      </div> */}
    </div>
  );
};

export default DashboardPage;
