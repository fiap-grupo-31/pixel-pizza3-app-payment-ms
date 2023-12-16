import { Table, Column, Model, PrimaryKey, DataType, Default, UpdatedAt } from 'sequelize-typescript';

@Table
class Payments extends Model<Payments> {
  @PrimaryKey
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true
  })
    id!: bigint;

  @Column
    orderId!: string;

  @Column
    broker!: string;

  @Default('NONE')
  @Column
    payment!: string;

  @Column
    quantity!: bigint;

  @Column({
    type: DataType.DECIMAL(10, 2)
  })
    amount!: number;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
    createdAt!: Date;

  @UpdatedAt
  @Column
    updatedAt!: Date;
}

export { Payments };
