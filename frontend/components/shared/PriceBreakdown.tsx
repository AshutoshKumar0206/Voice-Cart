export default function PriceBreakdown({ items }: { items: any[] }) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const totalDiscount = items.reduce(
    (acc, item) =>
      acc +
      item.product.price *
        item.quantity *
        ((item.discount ?? 0) / 100),
    0
  );

  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal - totalDiscount + shipping;

  return (
    <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
      <h3 className="text-lg font-semibold">Price Summary</h3>

      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>₹{subtotal.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Discount</span>
        <span>- ₹{totalDiscount.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
      </div>

      <hr />

      <div className="flex justify-between font-bold text-base">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
