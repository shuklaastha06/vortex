'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';

export default function AdminProductsPage() {
  const { showToast } = useApp();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Electronics',
    image: ''
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load products list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: 'Electronics',
      image: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      category: prod.category,
      image: prod.image
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock || !form.image || !form.category) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    try {
      const url = '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const body = editingProduct 
        ? { id: editingProduct.id, ...form } 
        : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product.');

      showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully', 'success');
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product.');

      showToast('Product deleted successfully', 'info');
      loadProducts();
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container">
      {/* Header breadcrumb */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <div>
          <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Product Inventory</h1>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Loading spinners */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <Loader2 className="spinner" />
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-secondary)' }}>
          <Package size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <h2>No products found in database.</h2>
          <p style={{ fontSize: '0.95rem', marginTop: '6px' }}>Click &ldquo;Add New Product&rdquo; to populate the catalog.</p>
        </div>
      ) : (
        /* Inventory Table */
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 8px' }}>Product</th>
                <th style={{ padding: '10px 8px' }}>Category</th>
                <th style={{ padding: '10px 8px' }}>Price</th>
                <th style={{ padding: '10px 8px' }}>Stock</th>
                <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  {/* Name and Image info */}
                  <td style={{ padding: '12px 8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>{prod.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.description}
                      </span>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td style={{ padding: '12px 8px' }}>
                    <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {prod.category}
                    </span>
                  </td>
                  
                  {/* Price */}
                  <td style={{ padding: '12px 8px', fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                  
                  {/* Stock */}
                  <td style={{ padding: '12px 8px' }}>
                    <span className={`badge ${prod.stock <= 5 ? 'badge-cancelled' : 'badge-paid'}`} style={{ padding: '4px 8px' }}>
                      {prod.stock} units
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button onClick={() => openEditModal(prod)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                        <Edit size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(prod.id, prod.name)} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Editor Modal Overlay Drawer */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            border: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ cursor: 'pointer', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Product Name */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Product Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Mechanical Keyboard"
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Describe your premium item details..."
                  style={{ height: '80px', resize: 'vertical' }}
                />
              </div>

              {/* Price & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Price (USD)</label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="99.99"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Initial Stock</label>
                  <input
                    type="number"
                    name="stock"
                    required
                    value={form.stock}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="input-field"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Home Decor">Home Decor</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Product Image URL</label>
                <div style={{ position: 'relative' }}>
                  <ImageIcon size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="image"
                    required
                    value={form.image}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://images.unsplash.com/..."
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
