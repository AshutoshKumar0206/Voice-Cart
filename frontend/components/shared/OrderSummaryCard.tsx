import Image from 'next/image';

export default function OrderSummaryCard({ item }: { item: any }) {
  const { product, quantity, discount } = item;

  const finalPrice = product.price * quantity * ((100 - discount) / 100);

  return (
    <div className="flex gap-4 border-b pb-4">
      {product.image && (
        <Image
          src={product.image}
          alt={product.product_name}
          width={80}
          height={80}
          className="rounded object-contain"
        />
      )}
      <div className="flex-1">
        <h3 className="font-semibold">{product.product_name}</h3>
        <p className="text-sm text-muted-foreground">Quantity: {quantity}</p>
        <p className="text-sm text-green-700 font-medium">
          ₹{finalPrice.toFixed(2)} ({discount}% off)
        </p>
      </div>
    </div>
  );
}
