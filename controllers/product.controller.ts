import { Request, Response } from "express";
import * as _ from "lodash";
import productData from "../DATA/product";

class VideoController {
  public getProducts(req: Request, res: Response): void {
    res.json(productData);
  }

  public getProduct(req: Request, res: Response): void {
    const product = _.find(productData, { id: Number(req.params.id) });

    console.log(product)
    res.json(product);
  }
}

export default new VideoController();
