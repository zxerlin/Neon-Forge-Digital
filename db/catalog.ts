import { DigitalProduct } from '../src/types';
import { INITIAL_PRODUCTS } from '../src/data/mockData';

export const SEED_CATALOG: DigitalProduct[] = INITIAL_PRODUCTS;

export function getProductBySku(sku: string): DigitalProduct | undefined {
  return SEED_CATALOG.find(p => p.sku.toLowerCase() === sku.toLowerCase());
}

export function getProductById(id: string): DigitalProduct | undefined {
  return SEED_CATALOG.find(p => p.id === id);
}

export function getAllActiveProducts(): DigitalProduct[] {
  return SEED_CATALOG.filter(p => p.status === 'active');
}
