// app/[lang]/(admin)/dashboard/packages/components/package-form.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { PackageCategory, ShippingMethod } from "@prisma/client";
import { calculateBasePrice, getCustomerByPhone, createPackage } from "@/app/actions/package.actions";
import { Loader2, Calculator, User, Box, AlertCircle } from "lucide-react";

export function PackageForm({ dict }: { dict: any }) {
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<ShippingMethod>('AIR');
  const [category, setCategory] = useState<PackageCategory>('AIR_NORMAL');
  const [measurement, setMeasurement] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [isOverride, setIsOverride] = useState(false);
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  const AIR_CATEGORIES = ['AIR_NORMAL', 'AIR_BATTERY_LIQUID_POWDER'];
  const SEA_CATEGORIES = ['SEA_NORMAL', 'SEA_CARTON', 'SEA_BIG_BALE', 'SEA_MACHINE', 'SEA_CHEMICAL'];

  useEffect(() => {
    if (!isOverride) {
      calculateBasePrice(category, measurement).then(res => setPrice(res.price));
    }
  }, [category, measurement, isOverride]);

  const handlePhoneBlur = async () => {
    if (phone.length < 9) return;
    setIsCheckingPhone(true);
    const customer = await getCustomerByPhone(phone);
    if (customer) setCustomerName(customer.name);
    setIsCheckingPhone(false);
  };

  const handleMethodChange = (newMethod: ShippingMethod) => {
    setMethod(newMethod);
    setCategory(newMethod === 'AIR' ? 'AIR_NORMAL' : 'SEA_NORMAL');
    setMeasurement(1);
    setIsOverride(false);
  };

  return (
    <form action={createPackage} className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> {dict.customerDetails}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.phone}</label>
            <div className="relative">
              <input name="phone" type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={handlePhoneBlur} className="w-full p-2 border border-gray-300 rounded-md" />
              {isCheckingPhone && <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-gray-400" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.fullName}</label>
            <input name="name" type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-600" /> {dict.packageInfo}
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{dict.trackingId}</label>
          <input name="trackingId" type="text" placeholder={dict.trackingPlaceholder} className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md font-mono" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{dict.descPlaceholder}</label>
          <input name="description" type="text" required className="w-full p-2 border border-gray-300 rounded-md" />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="method" value="AIR" checked={method === 'AIR'} onChange={() => handleMethodChange('AIR')} />
            <span className="font-medium text-gray-700">{dict.air}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="method" value="SEA" checked={method === 'SEA'} onChange={() => handleMethodChange('SEA')} />
            <span className="font-medium text-gray-700">{dict.sea}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.pricing}</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value as PackageCategory)} className="w-full p-2 border border-gray-300 rounded-md">
              {(method === 'AIR' ? AIR_CATEGORIES : SEA_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {method === 'AIR' ? dict.weight : dict.volume}
            </label>
            <input name={method === 'AIR' ? 'weight' : 'volumeCBM'} type="number" step="0.01" required value={measurement} onChange={(e) => setMeasurement(parseFloat(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" /> {dict.pricing}
        </h3>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isOverride} onChange={(e) => setIsOverride(e.target.checked)} className="rounded" />
            <span className="text-sm font-medium text-gray-700">{dict.override}</span>
          </label>
          {isOverride && <span className="text-xs text-orange-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {dict.overrideWarn}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{dict.totalPrice}</label>
          <input name="priceXAF" type="number" value={price} readOnly={!isOverride} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} className={`w-full p-3 text-lg font-bold rounded-md border ${isOverride ? 'bg-white border-orange-300' : 'bg-gray-100 border-gray-200'}`} />
        </div>
      </div>

      <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 flex justify-center">
        {isPending ? <Loader2 className="animate-spin" /> : dict.submit}
      </button>
    </form>
  );
}