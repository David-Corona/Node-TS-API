import { Table, Column, Model, HasOne, PrimaryKey, AutoIncrement, AllowNull, Unique, IsEmail, Default, IsIn, DataType } from 'sequelize-typescript';
import UsuarioToken from './usuarioToken.model';
import UsuarioResetPassword from './usuarioResetPassword.model';


@Table({
  modelName: 'Usuario',
  timestamps: false
})
export default class Usuario extends Model {

  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  id!: number;

  @AllowNull(false)
  @Column
  nombre!: string;

  @Unique
  @AllowNull(false)
  @IsEmail
  @Column
  email!: string;

  @Default("user")
  @AllowNull(false)
  @IsIn([['user', 'admin']])
  @Column
  role!: string;

  @AllowNull(false)
  @Column
  password!: string;

  @Default(false)
  @AllowNull(false)
  @Column
  is_active!: boolean;

  @Default(DataType.NOW)
  @Column
  createdAt!: Date;

  @Default(DataType.NOW)
  @Column
  updatedAt!: Date;


  @HasOne(() => UsuarioToken, "usuario_id")
  usuarioToken!: UsuarioToken;

  @HasOne(() => UsuarioResetPassword, "usuario_id")
  usuarioResetPassword!: UsuarioResetPassword;
}