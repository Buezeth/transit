// app/[lang]/(admin)/dashboard/settings/components/tariff-row.tsx
'use client';

import { useState, useTransition } from 'react';
import { updateTariffPrice } from '@/app/actions/settings.actions';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { Tariff } from '@prisma/client';

export function TariffRow({ tariff, dict }: { tariff: Tariff, dict: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(tariff.unitPrice);
  const [isActive, setIsActive] = useState(tariff.isActive);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateTariffPrice(tariff.id, price, isActive);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setPrice(tariff.unitPrice);
    setIsActive(tariff.isActive);
    setIsEditing(false);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">{tariff.method}</td>
      <td className="px-6 py-4">{tariff.category.replace(/_/g, ' ')}</td>
      <td className="px-6 py-4 font-mono font-medium">
        {isEditing ? (
          <input
            type="number" min="0" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} disabled={isPending}
            className="w-32 p-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        ) : (
          tariff.unitPrice === 0 ? <span className="text-orange-600">{dict.consult}</span> : `${tariff.unitPrice.toLocaleString('fr-CM')} FCFA`
        )}
      </td>
      <td className="px-6 py-4 text-gray-500">
        {tariff.unitType} {tariff.isFlatRate && <span className="text-xs text-gray-400 ml-1">(Flat)</span>}
      </td>
      <td className="px-6 py-4">
        {isEditing ? (
          <select value={isActive ? "true" : "false"} onChange={(e) => setIsActive(e.target.value === "true")} disabled={isPending} className="p-1.5 border border-gray-300 rounded-md outline-none bg-white">
            <option value="true">{dict.active}</option>
            <option value="false">{dict.inactive}</option>
          </select>
        ) : (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${tariff.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {tariff.isActive ? dict.active : dict.inactive}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <button onClick={handleSave} disabled={isPending} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"><Check className="w-4 h-4" /></button>
            <button onClick={handleCancel} disabled={isPending} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"><X className="w-4 h-4" /></button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Edit2 className="w-4 h-4" /></button>
        )}
      </td>
    </tr>
  );
}