"use client";

import { useEffect, useState } from "react";
import {
  getAllAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} from "@/lib/services/address.service";
import { IAddress, IAddressRequest } from "@/lib/interfaces/address";
import toast from "react-hot-toast";
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MapPinIcon,
  X,
  Check,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  details: z.string().min(5, "Address details are required"),
  phone: z.string().regex(/^01[0-9]{9}$/, "Invalid Egyptian phone number"),
  city: z.string().min(2, "City is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressManagerProps {
  token: string;
}

export default function AddressManager({ token }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAddresses(token);
      setAddresses(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      if (editingId) {
        await updateAddress(token, editingId, data);
        toast.success("Address updated successfully");
        setEditingId(null);
      } else {
        await addAddress(token, data);
        toast.success("Address added successfully");
      }
      reset();
      setShowForm(false);
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    }
  };

  const handleEdit = (address: IAddress) => {
    setEditingId(address._id);
    setValue("name", address.name);
    setValue("details", address.details);
    setValue("phone", address.phone);
    setValue("city", address.city);
    setShowForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await deleteAddress(token, addressId);
      toast.success("Address deleted successfully");
      await fetchAddresses();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <MapPin className="h-8 w-8 text-red-500" />
          My Addresses
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Add Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Address" : "Add New Address"}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  placeholder="Address Name (e.g., Home, Office)"
                  {...register("name")}
                  className="w-full h-12 px-4 rounded-lg border border-blue-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <input
                  type="text"
                  placeholder="City"
                  {...register("city")}
                  className="w-full h-12 px-4 rounded-lg border border-blue-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (01xxxxxxxxx)"
                  {...register("phone")}
                  className="w-full h-12 px-4 rounded-lg border border-blue-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Details */}
              <div>
                <input
                  type="text"
                  placeholder="Address Details"
                  {...register("details")}
                  className="w-full h-12 px-4 rounded-lg border border-blue-300 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                {errors.details && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.details.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:opacity-90 transition transform hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="h-5 w-5" />
                {editingId ? "Update Address" : "Add Address"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 h-12 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No addresses yet</p>
            <p className="text-gray-500 text-sm mt-1">
              Add your first address to get started
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-300 group animate-in fade-in"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {address.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                      {address.city}
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-700">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p>{address.details}</p>
                    </div>
                    <div className="flex items-center gap-2 pl-7">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{address.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Edit address"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                    title="Delete address"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
