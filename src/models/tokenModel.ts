import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.js';
interface TokenType {
  refreshToken: string;
  userId: string;
  createdAt: Date;
  expiredAt: Date;
  oldRefreshToken?: string;
  oldExpiredAt?: Date;
}
export class Token extends Model<TokenType> implements TokenType {
  public refreshToken!: string;
  public userId!: string;
  public createdAt!: Date;
  public expiredAt!: Date;
  public oldRefreshToken?: string;
  public oldExpiredAt?: Date;
}
Token.init(
  {
    refreshToken: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userId: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    oldRefreshToken: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    oldExpiredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'token',
    timestamps: false,
    sequelize,
  }
);
