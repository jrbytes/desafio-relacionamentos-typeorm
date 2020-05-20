import { getRepository, Repository } from 'typeorm'

import IProductsRepository from '@modules/products/repositories/IProductsRepository'
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO'
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO'
import Product from '../entities/Product'

interface IFindProducts {
  id: string
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = getRepository(Product)
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = await this.ormRepository.create({ name, price, quantity })

    await this.ormRepository.save(product)

    return product
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findName = await this.ormRepository.findOne({
      where: {
        name,
      },
    })

    return findName
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const findProducts = await this.ormRepository.findByIds(products)

    return findProducts
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    products.map(product => {
      return this.ormRepository
        .createQueryBuilder()
        .update(Product)
        .set({ quantity: () => `quantity - ${product.quantity}` })
        .where('id = :id', { id: `${product.id}` })
        .execute()
    })

    const getQuantity = await this.findAllById(products)

    return getQuantity
  }
}

export default ProductsRepository
