"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      router.replace("/auth");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSignOut}>
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
        </>
      ) : (
        "Sair"
      )}
    </Button>
  );
}
