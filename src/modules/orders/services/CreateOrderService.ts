import { inject, injectable } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import IProductsRepository from '@modules/products/repositories/IProductsRepository'
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository'
import Order from '../infra/typeorm/entities/Order'
import IOrdersRepository from '../repositories/IOrdersRepository'

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customer_id: string
  products: IProduct[]
}

@injectable()
class CreateProductService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const existsCustomer = await this.customersRepository.findById(customer_id)

    if (!existsCustomer) {
      throw new AppError('O cliente não existe.')
    }

    const existsProducts = await this.productsRepository.findAllById(products)

    if (existsProducts.length !== products.length) {
      throw new AppError('Algum produto não existe.')
    }

    const order = await this.ordersRepository.create({
      customer: existsCustomer,

      products: existsProducts.map(({ id, quantity, price }) => {
        const getQuantity = (products.find(i => i.quantity)
          ?.quantity as unknown) as number

        if (getQuantity > quantity) {
          throw new AppError('Quantidade insuficiente.')
        }

        return {
          product_id: id,
          price,
          quantity: getQuantity,
        }
      }),
    })

    await this.productsRepository.updateQuantity(products)

    return order
  }
}

export default CreateProductService
