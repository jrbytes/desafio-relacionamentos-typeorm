import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm'

import Order from '@modules/orders/infra/typeorm/entities/Order'
import Product from '@modules/products/infra/typeorm/entities/Product'

@Entity()
class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column()
  order_id: string

  @Column()
  product_id: string

  @Column()
  quantity: number

  @Column()
  price: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

export default OrdersProducts
