import { Product } from '@org/models';
import styles from './product-card.module.css';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick }: ProductCardProps) {
  const getStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < Math.floor(product.rating));
    }
    return stars;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onProductClick(product);
    }
  };

  return (
    <div
      className={`${styles['product-card']} ${!product.inStock ? styles['out-of-stock'] : ''}`}
      onClick={() => onProductClick(product)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      <div className={styles['product-image']}>
        <img src={product.imageUrl} alt={product.name} />
        {!product.inStock && (
          <div className={styles['out-of-stock-overlay']}>Out of Stock</div>
        )}
      </div>
      <div className={styles['product-info']}>
        <h3 className={styles['product-name']}>{product.name}</h3>
        <p className={styles['product-category']}>{product.category}</p>
        <div className={styles['product-rating']}>
          <span className={styles['stars']}>
            {getStars().map((filled, index) => (
              <span key={index} className={filled ? styles['filled'] : ''}>
                ★
              </span>
            ))}
          </span>
          <span className={styles['review-count']}>({product.reviewCount})</span>
        </div>
        <div className={styles['product-price']}>
          ${product.price.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;