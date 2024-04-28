import { Table, Column, Model, DataType, BelongsTo, ForeignKey, PrimaryKey, AutoIncrement, AllowNull, Unique, Default} from 'sequelize-typescript';
import Usuario from './usuario.model';


@Table({
  modelName: 'UsuarioResetPassword',
  tableName: 'usuarios_reset_password',
  timestamps: false
})
export default class UsuarioResetPassword extends Model {

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  token!: string;

  @ForeignKey(() => Usuario)
  @Unique
  @AllowNull(false)
  @Column
  usuario_id!: number;

  @Column
  expiryDate!: Date;

  @Default(DataType.NOW)
  @Column
  createdAt!: Date;


  @BelongsTo(() => Usuario, 'usuario_id')
  usuario!: Usuario;
}