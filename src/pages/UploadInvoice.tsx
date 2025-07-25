import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout'; // adjust path as needed
import { Layout } from "@/components/Layout/Layout";

interface InvoiceItem {
  qty: string;
  itemId: string;
  name: string;
  unitPrice: string;
  lineTotal: string;
}

interface Invoice {
  date: string;
  invoiceNumber: string;
  customerId: string;
  salesperson: string;
  job: string;
  paymentTerms: string;
  dueDate: string;
  billTo: string;
  items: InvoiceItem[];
  subtotal: string;
  salesTax: string;
  total: string;
}

export default function UploadInvoice() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('invoice', file);
    const res = await fetch('/api/upload-invoice', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const parsed = parseInvoiceText(data.text);
    setInvoice(parsed);
    setLoading(false);
  };

  function parseInvoiceText(text: string): Invoice {
    const invoice: Invoice = {
      date: '',
      invoiceNumber: '',
      customerId: '',
      salesperson: '',
      job: '',
      paymentTerms: '',
      dueDate: '',
      billTo: '',
      items: [],
      subtotal: '',
      salesTax: '',
      total: '',
    };

    invoice.date = text.match(/DATE:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1] || '';
    invoice.invoiceNumber = text.match(/INVOICE\s*#\s*(\d+)/)?.[1] || '';
    invoice.customerId = text.match(/CUSTOMER ID:\s*(\w+)/)?.[1] || '';
    invoice.salesperson = text.match(/SALESPERSON\s*([\w\s]+)/)?.[1]?.trim() || '';
    invoice.job = text.match(/JOB\s*(\w+)/)?.[1] || 'Sales';
    invoice.paymentTerms = text.match(/PAYMENT TERMS\s*([\w\s]+)/)?.[1]?.trim() || 'Due on receipt';
    invoice.dueDate = invoice.date;
    invoice.billTo = text.match(/TO:\s*([\s\S]*?)JOB/)?.[1]?.replace(/\s+/g, ' ').trim() || '';

    invoice.subtotal = text.match(/SUBTOTAL\s*(\d+)/)?.[1] || '';
    invoice.salesTax = text.match(/SALES TAX\s*(\d+)/)?.[1] || '';
    invoice.total = text.match(/TOTAL\s*(\d+)\s*$/m)?.[1] || '';

    // Extract items
    const itemsBlock = text.match(/QTY[\s\S]*?UNIT PRICE/)?.[0] || '';
    const pricesBlock = text.match(/UNIT PRICE LINE TOTAL([\s\S]*)/)?.[1] || '';

    const itemLines = itemsBlock.split(/\n/).map(l => l.trim()).filter(Boolean);
    const prices = pricesBlock.split(/\n/).map(l => l.trim()).filter(Boolean);

    const itemData = itemLines.slice(2); // Skip header

    const items: InvoiceItem[] = [];
    for (let i = 0; i < itemData.length; i += 3) {
      const qty = itemData[i]?.replace(/\D/g, '') || '';
      const id = itemData[i + 1] || '';
      const name = itemData[i + 2] || '';

      const priceIndex = (i / 3) * 2;
      const unitPrice = prices[priceIndex] || '';
      const lineTotal = prices[priceIndex + 1] || '';

      if (qty && id && name) {
        items.push({ qty, itemId: id, name, unitPrice, lineTotal });
      }
    }

    invoice.items = items;
    return invoice;
  }

  return (
      <Layout>
    <div className="max-w-3xl mx-auto p-6 font-sans">
          <h1 className="text-3xl font-bold mb-4">Upload Invoice</h1>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2" />
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upload & Extract'}
            </button>
          </div>

      {invoice && (
        <div className="mt-8 border rounded-lg shadow p-6 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Invoice</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><strong>Date:</strong> {invoice.date}</div>
          <div><strong>Invoice #:</strong> {invoice.invoiceNumber}</div>
          <div><strong>Customer ID:</strong> {invoice.customerId}</div>
          <div><strong>Salesperson:</strong> {invoice.salesperson}</div>
          <div><strong>Job:</strong> {invoice.job}</div>
          <div><strong>Payment Terms:</strong> {invoice.paymentTerms}</div>
          <div><strong>Due Date:</strong> {invoice.dueDate}</div>
          <div><strong>Bill To:</strong> {invoice.billTo}</div>
        </div>
          <h3 className="text-xl font-bold mb-2">Items</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1 text-left">Qty</th>
                <th className="border px-2 py-1 text-left">Item ID</th>
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Unit Price</th>
                <th className="border px-2 py-1 text-left">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{item.qty}</td>
                    <td className="border px-2 py-1">{item.itemId}</td>
                    <td className="border px-2 py-1">{item.name}</td>
                    <td className="border px-2 py-1">{item.unitPrice}</td>
                    <td className="border px-2 py-1">{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">


          <p><strong>Subtotal:</strong> {invoice.subtotal}</p>
          <p><strong>Sales Tax:</strong> {invoice.salesTax}</p>
          <p><strong>Total:</strong> {Number(invoice.subtotal) + Number(invoice.salesTax)}</p>
        </div>
        </div>
      )}
    </div>
    </Layout>
  );
}

