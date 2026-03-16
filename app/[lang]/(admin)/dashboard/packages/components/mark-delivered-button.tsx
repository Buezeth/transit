// app/(admin)/dashboard/packages/components/mark-delivered-button.tsx
'use client';

import { markPackageDelivered } from "@/app/actions/package.actions";
import { CheckCheck, Loader2 } from "lucide-react";
import { useTransition } from "react";

export function MarkDeliveredButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => markPackageDelivered(id))}
      disabled={isPending}
      className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded-md hover:bg-green-50"
      title="Mark as Delivered & Paid"
    >
      {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCheck className="w-5 h-5" />}
    </button>
  );
}