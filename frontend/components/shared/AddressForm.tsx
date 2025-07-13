import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddressForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shipping Address</h2>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Input
          placeholder="Full Name"
          className="bg-transparent focus:bg-white"
        />
      </div>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Textarea
          placeholder="Full Address with Pin Code"
          className="bg-transparent focus:bg-white"
        />
      </div>

      <div className="focus-within:bg-white bg-gray-50 rounded-md transition">
        <Input
          placeholder="Phone Number"
          type="tel"
          className="bg-transparent focus:bg-white"
        />
      </div>
    </div>
  );
}
