// app/(admin)/dashboard/packages/new/page.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PackageForm } from "../components/package-form";

export default function NewPackagePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link 
          href="/dashboard/packages" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Receive New Package</h1>
      </div>

      <PackageForm />
    </div>
  );
}