// app/(public)/track/[trackingId]/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, Package, Truck, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TrackingPage({ params }: { params: Promise<{ trackingId: string }> }) {
  const { trackingId } = await params;

  const pkg = await prisma.package.findUnique({
    where: { trackingId },
    include: { shipment: true }
  });

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-600 text-lg mb-8">Tracking ID <span className="font-mono font-bold text-black">{trackingId}</span> not found.</p>
          <Link href="/" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Status Stepper Logic
  const steps = [
    { id: 'WAREHOUSE_RECEIVED', label: 'Received', icon: Package },
    { id: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
    { id: 'CUSTOMS', label: 'Customs', icon: MapPin },
    { id: 'READY_FOR_PICKUP', label: 'Ready', icon: CheckCircle2 },
    { id: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === pkg.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tracking Results</h1>
            <p className="text-sm text-gray-500 font-mono">{pkg.trackingId}</p>
          </div>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <h2 className="text-lg font-medium opacity-90">Current Status</h2>
            <p className="text-3xl font-bold mt-1">{pkg.status.replace(/_/g, ' ')}</p>
            {pkg.shipment && (
              <p className="mt-2 text-blue-100 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4" /> Shipment Ref: {pkg.shipment.reference}
              </p>
            )}
          </div>

          <div className="p-6">
            {/* Stepper */}
            <div className="relative flex justify-between">
              {/* Progress Line */}
              <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 -z-0"></div>
              <div 
                className="absolute top-4 left-0 h-1 bg-blue-600 -z-0 transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              ></div>

              {steps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex flex-col items-center z-10 relative group">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] md:text-xs font-medium mt-2 absolute -bottom-6 w-20 text-center ${
                      isCurrent ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-100 grid grid-cols-2 gap-6">
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Description</span>
                <p className="font-medium text-gray-900">{pkg.description}</p>
              </div>
              <div>
                <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Weight / Vol</span>
                <p className="font-medium text-gray-900">
                  {pkg.weight ? `${pkg.weight} KG` : `${pkg.volumeCBM} CBM`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-gray-500 font-medium text-sm uppercase">Total Amount Due</h3>
            <p className="text-3xl font-bold text-gray-900">
              {(pkg.priceXAF || 0).toLocaleString('fr-CM')} <span className="text-lg text-gray-500">FCFA</span>
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
            pkg.isPaid 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {pkg.isPaid ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            {pkg.isPaid ? "PAID" : "PAYMENT PENDING"}
          </div>
        </div>

      </div>
    </div>
  );
}