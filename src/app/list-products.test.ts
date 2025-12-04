import { describe, it, expect } from 'vitest';
import { listProducts } from './list-products';
import { FakeProductRepo } from '../infra/fake-product-repo';
import { Product } from '../domain/product';

describe('listProducts', () => {
  it('should return empty array when no products exist', async () => {
    // Arrange
    const productRepo = new FakeProductRepo();

    // Act
    const result = await listProducts({ productRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('should return all products from the repository', async () => {
    // Arrange
    const products: Product[] = [
      {
        id: 'prod-1',
        name: 'Product 1',
        pricePence: 1000,
        description: 'First product',
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'prod-2',
        name: 'Product 2',
        pricePence: 2000,
        description: 'Second product',
        updatedAt: new Date('2025-01-02'),
      },
    ];
    const productRepo = new FakeProductRepo(products);

    // Act
    const result = await listProducts({ productRepo });

    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.data).toEqual(products);
  });

  describe('error scenarios', () => {
    // Error scenario tests can be added here
    it.todo('should handle repository errors gracefully');

    it('should return failure when repository.list throws', async () => {
      // Arrange: create a repo that throws from `list`
      const throwingRepo = {
        list: async () => {
          throw new Error('repository unavailable');
        },
        // satisfy interface - not used in this test
        getById: async (id: string) => null,
        save: async (p: any) => p,
        delete: async (id: string) => undefined,
      } as any;

      // Act
      const result = await listProducts({ productRepo: throwingRepo });

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('repository unavailable');
    });

    it('should not allow mutating returned products to affect repository', async () => {
      // Arrange
      const products: Product[] = [
        {
          id: 'prod-1',
          name: 'Product 1',
          pricePence: 1000,
          description: 'First product',
          updatedAt: new Date('2025-01-01'),
        },
      ];
      const productRepo = new FakeProductRepo(products);

      // Act
      const first = await listProducts({ productRepo });
      expect(first.success).toBe(true);
      // mutate the returned object
      if (first.data && first.data[0]) {
        first.data[0].name = 'MUTATED';
      }

      // fetch again from repo
      const second = await listProducts({ productRepo });

      // Assert: repo should still hold original name
      expect(second.success).toBe(true);
      expect(second.data && second.data[0].name).toBe('Product 1');
    });
  });
});
