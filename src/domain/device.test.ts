import { describe, it, expect } from 'vitest';
import { createProduct, ProductError } from './product';

describe('createProduct', () => {
  describe('valid product creation', () => {
    it('should create a product with valid parameters', () => {
      const params = {
        id: 'prod-123',
        name: 'Test Product',
        pricePence: 1999,
        description: 'A great test product',
        updatedAt: new Date('2025-01-01'),
      };

      const product = createProduct(params);

      expect(product).toEqual(params);
    });

    it('should allow a price of zero pence', () => {
      const params = {
        id: 'prod-zero',
        name: 'Freebie',
        pricePence: 0,
        description: 'Free product',
        updatedAt: new Date(),
      };

      const product = createProduct(params);

      expect(product.pricePence).toBe(0);
    });
  });

  describe('id validation', () => {
    it('should throw ProductError when id is only whitespace', () => {
      const params = {
        id: '   ',
        name: 'Test Product',
        pricePence: 1999,
        description: 'A test product',
        updatedAt: new Date(),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });

    it('should include the field name on ProductError for invalid id', () => {
      const params = {
        id: '',
        name: 'Test Product',
        pricePence: 100,
        description: 'A test product',
        updatedAt: new Date(),
      };

      try {
        createProduct(params as any);
        // If no error thrown, fail the test explicitly
        expect(false).toBe(true);
      } catch (err) {
        expect(err).toBeInstanceOf(ProductError);
        expect((err as ProductError).field).toBe('id');
      }
    });
  });

  describe('name and description validation', () => {
    it('should throw ProductError when name is only whitespace', () => {
      const params = {
        id: 'prod-1',
        name: '   ',
        pricePence: 100,
        description: 'Valid description',
        updatedAt: new Date(),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });

    it('should throw ProductError when description is only whitespace', () => {
      const params = {
        id: 'prod-2',
        name: 'Valid Name',
        pricePence: 100,
        description: '   ',
        updatedAt: new Date(),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });
  });

  describe('pricePence validation', () => {
    it('should throw ProductError when price is negative', () => {
      const params = {
        id: 'prod-neg',
        name: 'Bad Price',
        pricePence: -1,
        description: 'Negative price',
        updatedAt: new Date(),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });

    it('should throw ProductError when price is not an integer', () => {
      const params = {
        id: 'prod-float',
        name: 'Float Price',
        pricePence: 9.99 as any,
        description: 'Float price',
        updatedAt: new Date(),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });
  });

  describe('updatedAt validation', () => {
    it('should throw ProductError when updatedAt is not a Date', () => {
      const params = {
        id: 'prod-date',
        name: 'Bad Date',
        pricePence: 100,
        description: 'Invalid updatedAt',
        updatedAt: '2025-01-01' as any,
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });

    it('should throw ProductError when updatedAt is an invalid Date', () => {
      const params = {
        id: 'prod-invalid-date',
        name: 'Invalid Date',
        pricePence: 100,
        description: 'Invalid date object',
        updatedAt: new Date('not-a-date'),
      };

      const act = () => createProduct(params as any);

      expect(act).toThrow(ProductError);
    });
  });
});
