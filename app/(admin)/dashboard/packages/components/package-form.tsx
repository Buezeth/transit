// app/(admin)/dashboard/packages/components/package-form.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { PackageCategory, ShippingMethod } from "@prisma/client";
import { calculateBasePrice, getCustomerByPhone, createPackage } from "@/app/actions/package.actions";
import { Loader2, Calculator, User, Box, AlertCircle } from "lucide-react";

export function PackageForm() {
  const [isPending, startTransition] = useTransition();
  
  // Form State
  const [method, setMethod] = useState<ShippingMethod>('AIR');
  const [category, setCategory] = useState<PackageCategory>('AIR_NORMAL');
  const [measurement, setMeasurement] = useState<number>(1); // Weight (kg) or Volume (cbm)
  const [price, setPrice] = useState<number>(0);
  const [isOverride, setIsOverride] = useState(false);
  
  // Customer Lookup State
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);

  // Constants for dropdowns
  const AIR_CATEGORIES = ['AIR_NORMAL', 'AIR_BATTERY_LIQUID_POWDER'];
  const SEA_CATEGORIES = ['SEA_NORMAL', 'SEA_CARTON', 'SEA_BIG_BALE', 'SEA_MACHINE', 'SEA_CHEMICAL'];

  // Effect: Auto-calculate price when inputs change
  useEffect(() => {
    if (!isOverride) {
      const fetchPrice = async () => {
        const result = await calculateBasePrice(category, measurement);
        setPrice(result.price);
      };
      fetchPrice();
    }
  }, [category, measurement, isOverride]);

  // Handler: Customer Phone Lookup
  const handlePhoneBlur = async () => {
    if (phone.length < 9) return;
    setIsCheckingPhone(true);
    const customer = await getCustomerByPhone(phone);
    if (customer) {
      setCustomerName(customer.name);
    }
    setIsCheckingPhone(false);
  };

  // Handler: Method Toggle (Resets category to first available)
  const handleMethodChange = (newMethod: ShippingMethod) => {
    setMethod(newMethod);
    setCategory(newMethod === 'AIR' ? 'AIR_NORMAL' : 'SEA_NORMAL');
    setMeasurement(1);
    setIsOverride(false);
  };

  return (
    <form action={createPackage} className="space-y-8 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      
      {/* 1. Customer Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" /> Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <input 
                name="phone"
                type="text" 
                required
                placeholder="6XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={handlePhoneBlur}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {isCheckingPhone && <Loader2 className="w-4 h-4 absolute right-3 top-3 animate-spin text-gray-400" />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              name="name"
              type="text" 
              required
              placeholder="Enter name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. Package Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Box className="w-5 h-5 text-blue-600" /> Package Info
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID (Internal)</label>
          <input 
            name="trackingId"
            type="text" 
            required
            defaultValue={`TRK-${Math.floor(100000 + Math.random() * 900000)}`} // Simple auto-gen
            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md font-mono text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input 
            name="description"
            type="text" 
            required
            placeholder="e.g. 2 Cartons of Shoes"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Shipping Method Toggle */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="method" 
              value="AIR" 
              checked={method === 'AIR'} 
              onChange={() => handleMethodChange('AIR')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium text-gray-700">Air Freight</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="method" 
              value="SEA" 
              checked={method === 'SEA'} 
              onChange={() => handleMethodChange('SEA')}
              className="w-4 h-4 text-blue-600"
            />
            <span className="font-medium text-gray-700">Sea Freight</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PackageCategory)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {(method === 'AIR' ? AIR_CATEGORIES : SEA_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {method === 'AIR' ? 'Weight (KG)' : 'Volume (CBM)'}
            </label>
            <input 
              name={method === 'AIR' ? 'weight' : 'volumeCBM'}
              type="number" 
              step="0.01"
              min="0.1"
              required
              value={measurement}
              onChange={(e) => setMeasurement(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 3. Pricing Section */}
      <div className="space-y-4 bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" /> Pricing
        </h3>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isOverride}
              onChange={(e) => setIsOverride(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500" 
            />
            <span className="text-sm font-medium text-gray-700">Management Override</span>
          </label>
          
          {isOverride && (
            <span className="text-xs text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Custom pricing enabled
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (FCFA)</label>
          <input 
            name="priceXAF"
            type="number" 
            value={price}
            readOnly={!isOverride}
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            className={`w-full p-3 text-lg font-bold rounded-md border ${
              isOverride 
                ? 'bg-white border-orange-300 text-orange-700 focus:ring-orange-500' 
                : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center"
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Receive Package"}
      </button>

    </form>
  );
}