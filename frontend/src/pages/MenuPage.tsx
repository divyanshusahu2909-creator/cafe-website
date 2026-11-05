import React, { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Category, Product } from '../types';
import { menuService } from '../services/menuService';
import { ProductCard } from '../components/menu/ProductCard';
import { ProductModal } from '../components/menu/ProductModal';

export const MenuPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name' | ''>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    menuService
      .getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to load categories:', err));
  }, []);

  const loadProducts = () => {
    setLoading(true);
    const params: any = {};
    if (selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }
    if (onlyFeatured) {
      params.featured = true;
    }
    if (sortBy) {
      params.sort = sortBy;
    }

    menuService
      .getProducts(params)
      .then((res) => setProducts(res.results))
      .catch((err) => console.error('Failed to load menu products:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, searchTerm, onlyFeatured, sortBy]);

  return (
    <div
      className="aa-container aa-section"
      style={{ paddingTop: 'clamp(7rem, 14vh, 9rem)', minHeight: '100vh' }}
    >
      {/* Page Header */}
      <div className="aa-section-head">
        <span className="aa-eyebrow">Aesthetic Aroma Culinary</span>
        <h1 className="aa-display gold-gradient-text">Our Artisan Menu</h1>
        <p className="aa-lede" style={{ margin: '0 auto' }}>
          Every creation is 100% pure vegetarian, handcrafted with premium ingredients, precision extraction, and European finesse.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="aa-panel"
        style={{
          padding: 'clamp(1rem, 2.6vw, 1.4rem)',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Box */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 'min(100%, 400px)' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '0.9rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <input
            type="text"
            className="aa-input"
            placeholder="Search coffee, pizza, desserts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.6rem' }}
          />
        </div>

        {/* Sort & Quick Filter Toggles */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`aa-chip${onlyFeatured ? ' is-active' : ''}`}
          >
            <Sparkles size={16} /> Signature Only
          </button>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="aa-input"
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="aa-tabstrip" style={{ marginBottom: '2.5rem' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`aa-chip${selectedCategory === 'all' ? ' is-active' : ''}`}
        >
          All Categories ({products.length})
        </button>

        {categories.map((cat) => {
          const active = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`aa-chip${active ? ' is-active' : ''}`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="aa-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aa-card"
              style={{ height: 'clamp(19rem, 30vw, 24rem)', animation: 'pulse 1.5s infinite' }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="aa-empty">
          <h3 className="aa-subtitle">No culinary items matched your filters</h3>
          <p className="aa-lede" style={{ marginBottom: '0.75rem' }}>
            Try searching for a different item or clear your active filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
              setOnlyFeatured(false);
              setSortBy('');
            }}
            className="btn-outline-gold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="aa-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
