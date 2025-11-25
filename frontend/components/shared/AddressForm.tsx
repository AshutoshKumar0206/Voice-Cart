import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AddressFormProps {
  fullName: string;
  address: string;
  phone: string;
  setFullName: (value: string) => void;
  setAddress: (value: string) => void;
  setPhone: (value: string) => void;
}

export default function AddressForm({
  fullName,
  address,
  phone,
  setFullName,
  setAddress,
  setPhone,
}: AddressFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shipping Address</h2>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-transparent focus:bg-white"
        />
      </div>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Textarea
          placeholder="Full Address with Pin Code"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-transparent focus:bg-white"
        />
      </div>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Input
          placeholder="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-transparent focus:bg-white"
        />
      </div>
    </div>
  );
}
