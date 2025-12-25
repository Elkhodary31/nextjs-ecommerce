"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IAddress, IAddressRequest } from "@/lib/interfaces/address";

interface AddressSectionProps {
  addresses: IAddress[];
  selectedAddressId: string | null;
  onAddressChange: (id: string) => void;
  loadingAddresses: boolean;
  showAddressForm: boolean;
  onShowAddressForm: (show: boolean) => void;
  newAddress: IAddressRequest;
  onNewAddressChange: (address: IAddressRequest) => void;
  onAddAddress: (e: React.FormEvent) => Promise<void>;
  savingAddress: boolean;
}

export function AddressSection({
  addresses,
  selectedAddressId,
  onAddressChange,
  loadingAddresses,
  showAddressForm,
  onShowAddressForm,
  newAddress,
  onNewAddressChange,
  onAddAddress,
  savingAddress,
}: AddressSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">Shipping Address</h2>

      {loadingAddresses ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" />
        </div>
      ) : addresses.length === 0 && !showAddressForm ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No addresses available</p>
          <Button
            variant="outline"
            onClick={() => onShowAddressForm(true)}
          >
            Add New Address
          </Button>
        </div>
      ) : (
        <>
          {/* Address List */}
          {!showAddressForm && addresses.length > 0 && (
            <div className="space-y-3 mb-4">
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition"
                >
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    checked={selectedAddressId === address._id}
                    onChange={(e) => onAddressChange(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.details}</p>
                    <p className="text-sm text-gray-600">
                      {address.city} • {address.phone}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Add Address Button */}
          {!showAddressForm && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onShowAddressForm(true)}
            >
              + Add New Address
            </Button>
          )}

          {/* Address Form */}
          {showAddressForm && (
            <form onSubmit={onAddAddress} className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <Input
                placeholder="Full Name"
                value={newAddress.name}
                onChange={(e) =>
                  onNewAddressChange({ ...newAddress, name: e.target.value })
                }
              />
              <Input
                placeholder="Address Details"
                value={newAddress.details}
                onChange={(e) =>
                  onNewAddressChange({ ...newAddress, details: e.target.value })
                }
              />
              <Input
                placeholder="Phone Number"
                value={newAddress.phone}
                onChange={(e) =>
                  onNewAddressChange({ ...newAddress, phone: e.target.value })
                }
              />
              <Input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  onNewAddressChange({ ...newAddress, city: e.target.value })
                }
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={savingAddress}
                  className="flex-1"
                >
                  {savingAddress ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Address"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onShowAddressForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
