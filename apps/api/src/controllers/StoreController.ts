import { Request, Response } from 'express';

export class StoreController {
  async list(_req: Request, res: Response) {
    // TODO: Implement store listing
    res.json({
      stores: [],
      total: 0,
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    // TODO: Implement get store by ID with locations
    res.json({
      store: null,
      message: `Store ${id} not found`,
    });
  }

  async getProducts(req: Request, res: Response) {
    const { id } = req.params;
    // TODO: Implement get products for a store
    res.json({
      storeId: id,
      products: [],
      total: 0,
    });
  }
}
