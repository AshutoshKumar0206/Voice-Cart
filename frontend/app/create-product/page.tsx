'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import axiosClient from '@/lib/axios';
import { toast } from 'sonner';

export default function CreateProductPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    subCategory: '',
    brand: '',
    quantity: '',
    price: '',
    discount: '',
    description: '',
    tags: '',
    metadata: '',
    inStock: true,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append('product_name', formData.product_name);
      data.append('category', formData.category);
      data.append('subCategory', formData.subCategory);
      data.append('brand', formData.brand);
      data.append('quantity', formData.quantity);
      data.append('price', formData.price);
      data.append('discount', formData.discount);
      data.append('description', formData.description);
      data.append('inStock', String(formData.inStock));

      // tags = comma separated → convert to array
      if (formData.tags) {
        data.append('tags', JSON.stringify(formData.tags.split(',').map(t => t.trim())));
      }

      // metadata is JSON text → must parse before sending
      if (formData.metadata) {
        data.append('metadata', formData.metadata);
      }

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await axiosClient.post('/products/createProduct', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Product created successfully');
      console.log(res.data);

      setFormData({
        product_name: '',
        category: '',
        subCategory: '',
        brand: '',
        quantity: '',
        price: '',
        discount: '',
        description: '',
        tags: '',
        metadata: '',
        inStock: true,
      });
      setImageFile(null);
      setPreviewUrl(null);

    } catch (err) {
      console.error(err);
      toast.error('Failed to create product');
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">🛒 Create New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Upload Image */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <div className="flex justify-center">
              <Image
                src={previewUrl}
                alt="Preview"
                width={180}
                height={180}
                className="object-contain rounded-md"
              />
            </div>
          ) : (
            <p className="text-gray-500">Drag & drop an image here, or click to select</p>
          )}
        </div>

        {/* Product Name */}
        <InputField label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} />

        {/* Category */}
        <InputField label="Category" name="category" value={formData.category} onChange={handleChange} />

        {/* SubCategory */}
        <InputField label="Sub Category" name="subCategory" value={formData.subCategory} onChange={handleChange} />

        {/* Brand */}
        <InputField label="Brand" name="brand" value={formData.brand} onChange={handleChange} />

        {/* Quantity */}
        <InputField type="number" label="Quantity" name="quantity" value={formData.quantity} onChange={handleChange} />

        {/* Price */}
        <InputField type="number" label="Price (₹)" name="price" value={formData.price} onChange={handleChange} />

        {/* Discount */}
        <InputField type="number" label="Discount (%)" name="discount" value={formData.discount} onChange={handleChange} />

        {/* Tags */}
        <InputField label="Tags (comma separated)" name="tags" value={formData.tags} onChange={handleChange} />

        {/* Metadata */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Metadata (JSON)</label>
          <Textarea
            name="metadata"
            value={formData.metadata}
            onChange={handleChange}
            placeholder='{"color":"Black", "model":"S23", "battery":"4000mAh"}'
          />
        </div>

        {/* In Stock Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">In Stock</label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">Create Product</Button>

      </form>
    </section>
  );
}

function InputField({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <Input type={type} name={name} value={value} onChange={onChange} required />
    </div>
  );
}
