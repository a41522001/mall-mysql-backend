import { DataTypes, Sequelize } from "sequelize";
import dotenv from 'dotenv';
import mysql from "mysql2/promise";
dotenv.config();
export const sequelize = new Sequelize(
  process.env.DB_DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false, // 是否顯示 SQL，開發用可打開 true
  }
);

// 測試連線
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 成功連線到 MySQL 資料庫');
  } catch (err) {
    console.error('❌ 連線失敗:', err);
  }
}
export const UserInfo = sequelize.define('UserInfo', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  tableName: 'UserInfo',
  timestamps: false
}
)

export const Products = sequelize.define('Products', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(100),
  }
}, {
  tableName: 'Products',
  timestamps: false
}
)
export const Carts = sequelize.define('Carts', {
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Carts',
  timestamps: false
}
)
export const Orders = sequelize.define('Orders', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  createdDate: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  createdTime: {
    type: DataTypes.STRING(8),
    allowNull: false
  }
}, {
  tableName: 'Orders',
  timestamps: false
}
)
export const OrderItems = sequelize.define('OrderItems', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  orderId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'OrderItems',
  timestamps: false
}
)
// 關聯
UserInfo.hasMany(Orders, {
  foreignKey: 'userId',
  sourceKey: 'id'
});
Orders.belongsTo(UserInfo, {
  foreignKey: 'userId',
  targetKey: 'id'
});
// Orders -> OrderItems 一對多
Orders.hasMany(OrderItems, {
  foreignKey: 'orderId',
  sourceKey: 'id'
});
OrderItems.belongsTo(Orders, {
  foreignKey: 'orderId',
  targetKey: 'id'
});

// Products -> OrderItems 一對多
Products.hasMany(OrderItems, {
  foreignKey: 'productId',
  sourceKey: 'id'
});
OrderItems.belongsTo(Products, {
  foreignKey: 'productId',
  targetKey: 'id'
});