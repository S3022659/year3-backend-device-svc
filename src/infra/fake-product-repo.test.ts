import { describe, it, expect } from 'vitest';
import { FakeProductRepo } from './fake-product-repo';
import { Product } from '../domain/product';

describe('FakeProductRepo', () => {
  it('getById should return null when product not found', async () => {
    const repo = new FakeProductRepo();

    const res = await repo.getById('nope');

    expect(res).toBeNull();
  });

  it('getById should return a cloned product when present', async () => {
    const product: Product = {
      id: 'p1',
      name: 'Product 1',
      pricePence: 100,
      description: 'desc',
      updatedAt: new Date('2025-01-01'),
    };

    const repo = new FakeProductRepo([product]);

    const a = await repo.getById('p1');
    expect(a).toEqual(product);

    // mutate returned object and ensure repo copy is unchanged
    if (a) a.name = 'MUTATED';

    const b = await repo.getById('p1');
    expect(b && b.name).toBe('Product 1');
  });

  it('save should insert and return saved product as clone', async () => {
    const repo = new FakeProductRepo();

    const product: Product = {
      id: 'p2',
      name: 'New',
      pricePence: 200,
      description: 'new product',
      updatedAt: new Date(),
    };

    const saved = await repo.save(product);
    expect(saved).toEqual(product);

    // mutate returned and ensure repo copy unchanged
    saved.name = 'MUTATED';
    const fromRepo = await repo.getById('p2');
    expect(fromRepo && fromRepo.name).toBe('New');
  });

  it('save should update existing product', async () => {
    const product: Product = {
      id: 'p3',
      name: 'Old',
      pricePence: 300,
      description: 'old',
      updatedAt: new Date(),
    };

    const repo = new FakeProductRepo([product]);

    const updated: Product = { ...product, name: 'Updated', pricePence: 350 };
    const saved = await repo.save(updated);
    expect(saved).toEqual(updated);

    const fromRepo = await repo.getById('p3');
    expect(fromRepo).toEqual(updated);
  });

  it('delete should remove a product', async () => {
    const product: Product = {
      id: 'p4',
      name: 'ToDelete',
      pricePence: 400,
      description: 'delete me',
      updatedAt: new Date(),
    };

    const repo = new FakeProductRepo([product]);

    await repo.delete('p4');

    const res = await repo.getById('p4');
    expect(res).toBeNull();
  });
});
