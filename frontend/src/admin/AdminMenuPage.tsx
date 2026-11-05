import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { adminService } from '../services/adminService';
import { menuService } from '../services/menuService';
import { Product, Category } from '../types';
import { FeaturedBadge } from '../components/ui/Badge';

export const AdminMenuPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit / Create Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<number>(1);
  const [price, setPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [prepTime, setPrepTime] = useState('15');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        adminService.getProducts(),
        menuService.getCategories(),
      ]);
      const list = Array.isArray(prodsRes) ? prodsRes : prodsRes.results || [];
      setProducts(list);
      setCategories(catsRes);
    } catch (err: any) {
      console.error('Failed to load menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setCategory(categories[0]?.id || 1);
    setPrice('149.00');
    setDiscountedPrice('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80');
    setIsAvailable(true);
    setIsFeatured(false);
    setPrepTime('15');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setCategory(p.category);
    setPrice(p.price);
    setDiscountedPrice(p.discounted_price || '');
    setDescription(p.description);
    setImage(p.image);
    setIsAvailable(p.is_available);
    setIsFeatured(p.is_featured);
    setPrepTime(String(p.preparation_time_minutes || 15));
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload: Partial<Product> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      price,
      discounted_price: discountedPrice ? discountedPrice : null,
      description,
      image,
      is_vegetarian: true,
      is_available: isAvailable,
      is_featured: isFeatured,
      preparation_time_minutes: parseInt(prepTime, 10) || 15,
    };

    try {
      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        await adminService.createProduct(payload);
      }
      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="aa-stack">
      <div className="aa-row" style={{ justifyContent: 'space-between' }}>
        <div>
          <span className="aa-eyebrow">Catalog Management</span>
          <h1 className="aa-title gold-gradient-text" style={{ margin: '0.5rem 0 0' }}>
            Menu &amp; Products ({products.length})
          </h1>
        </div>

        <button onClick={openCreateModal} className="btn-gold">
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Search Input */}
      <div style={{ maxWidth: '400px', position: 'relative' }}>
        <Search size={18} color="var(--text-dim)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
        <input
          type="text"
          className="aa-input"
          placeholder="Filter by product or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Product Table */}
      <div className="aa-table-wrap">
        <table className="aa-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price (INR)</th>
              <th>Status</th>
              <th>Featured</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div style={{ textAlign: 'center', color: 'var(--gold-accent)', padding: '1rem 0' }}>
                    Loading catalog items...
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="aa-empty">No products found.</div>
                </td>
              </tr>
            ) : (
              filtered.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={prod.image}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', flexShrink: 0 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{prod.name}</div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>/{prod.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--gold-accent)' }}>
                    {prod.category_name || prod.category}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    ₹{prod.price} {prod.discounted_price && <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 400 }}>(Disc: ₹{prod.discounted_price})</span>}
                  </td>
                  <td>
                    <span className={`aa-badge ${prod.is_available ? 'aa-badge--success' : 'aa-badge--danger'}`}>
                      {prod.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    {prod.is_featured ? <FeaturedBadge /> : <span style={{ color: 'var(--text-faint)' }}>—</span>}
                  </td>
                  <td>
                    <div className="aa-row" style={{ justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="aa-icon-btn"
                        style={{ width: '36px', height: '36px' }}
                        title="Edit Product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="aa-icon-btn"
                        style={{
                          width: '36px',
                          height: '36px',
                          color: 'var(--danger)',
                          borderColor: 'var(--danger)',
                          backgroundColor: 'var(--danger-wash)',
                        }}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="aa-scrim" onClick={() => setModalOpen(false)}>
          <div className="aa-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="aa-subtitle font-serif" style={{ margin: '0 0 1.25rem' }}>
              {editingProduct ? 'Edit Product' : 'Create New Menu Product'}
            </h3>

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="aa-label">Product Name *</label>
                <input
                  type="text"
                  className="aa-input"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                <div>
                  <label className="aa-label">Category *</label>
                  <select
                    className="aa-input"
                    value={category}
                    onChange={(e) => setCategory(parseInt(e.target.value, 10))}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="aa-label">Price (INR) *</label>
                  <input
                    type="number"
                    className="aa-input"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="aa-label">Image URL</label>
                <input
                  type="url"
                  className="aa-input"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div>
                <label className="aa-label">Description</label>
                <textarea
                  className="aa-input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="aa-row">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-ivory)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--gold-accent)' }}
                  />
                  Is Available
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-ivory)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--gold-accent)' }}
                  />
                  Mark as Signature / Featured
                </label>
              </div>

              <div className="aa-row" style={{ justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
