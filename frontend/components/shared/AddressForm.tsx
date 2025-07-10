import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddressForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Shipping Address</h2>
      <Input placeholder="Full Name" />
      <Textarea placeholder="Full Address with Pin Code" />
      <Input placeholder="Phone Number" type="tel" />
    </div>
  );
}
