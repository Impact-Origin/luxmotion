import { SignIn } from "@clerk/nextjs";
import * as React from "react";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary hover:bg-primary/90 text-sm normal-case",
          },
        }}
        path="/admin/sign-in"
      />
    </div>
  );
}

