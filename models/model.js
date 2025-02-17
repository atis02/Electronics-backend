const sequelize = require("../database");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем функцию для генерации UUID
    },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user", allowNull: true },
    // after developing let phoneNumber allowNull false
    phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    surname: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    isActive: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
  },

  {
    tableName: "users",
    timestamps: true, // автоматически добавит createdAt и updatedAt
  }
);
const UserForAdminPage = sequelize.define(
  "userForAdminPage",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "user", allowNull: true },
    phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
  },

  {
    tableName: "userForAdminPage",
    timestamps: true,
  }
);
const Product = sequelize.define("products", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },

  barcode: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  segmentId: { type: DataTypes.UUID, allowNull: false },
  brandId: { type: DataTypes.UUID, allowNull: false },
  statusId: { type: DataTypes.UUID, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  descriptionTm: { type: DataTypes.STRING, allowNull: true },
  descriptionRu: { type: DataTypes.STRING, allowNull: true },
  descriptionEn: { type: DataTypes.STRING, allowNull: true },
  totalSelling: { type: DataTypes.INTEGER, defaultValue: 0 },
  sellPrice: { type: DataTypes.FLOAT, allowNull: false },
  incomePrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  discount_priceTMT: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  discount_pricePercent: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  imageOne: { type: DataTypes.STRING, allowNull: true },
  imageTwo: { type: DataTypes.STRING, allowNull: true },
  imageThree: { type: DataTypes.STRING, allowNull: true },
  imageFour: { type: DataTypes.STRING, allowNull: true },
  imageFive: { type: DataTypes.STRING, allowNull: true },
  productQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});
const ProductProperties = sequelize.define("productProperties", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "products",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// const ProductColorDetails = sequelize.define("ProductColorDetails", {
//   id: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//     defaultValue: Sequelize.literal("gen_random_uuid()"), // Auto-generate UUID
//   },
//   nameTm: { type: DataTypes.STRING, allowNull: false },
//   nameRu: { type: DataTypes.STRING, allowNull: false },
//   nameEn: { type: DataTypes.STRING, allowNull: false },
//   descriptionTm: { type: DataTypes.STRING, allowNull: true },
//   descriptionRu: { type: DataTypes.STRING, allowNull: true },
//   descriptionEn: { type: DataTypes.STRING, allowNull: true },
//   sellPrice: { type: DataTypes.INTEGER, allowNull: false },
//   incomePrice: { type: DataTypes.INTEGER, allowNull: false },
//   discount_priceTMT: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0,
//   },
//   discount_pricePercent: {
//     type: DataTypes.INTEGER,
//     allowNull: true,
//     defaultValue: 0,
//   },
//   sizeTableId: { type: DataTypes.UUID, allowNull: false },
//   sizeId: { type: DataTypes.UUID, allowNull: false },

//   sizesWithQuantities: {
//     type: DataTypes.JSONB, // You can use JSONB for better flexibility
//     allowNull: false,
//     defaultValue: [],
//   },

//   isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//   minImage: { type: DataTypes.STRING, allowNull: true },
//   hoverImage: { type: DataTypes.STRING, allowNull: true },
//   fullImages: {
//     type: DataTypes.ARRAY(DataTypes.STRING), // Array of image paths
//     allowNull: true,
//     defaultValue: [],
//   },
//   productQuantity: { type: DataTypes.INTEGER, allowNull: false },
// });
const Status = sequelize.define("status", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Basket = sequelize.define(
  "basket",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // UUID for unique basket ID
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", // Assuming you have a `users` model
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

const BasketProduct = sequelize.define(
  "basketProduct",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // UUID for unique basketProduct ID
    },
    basketId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "baskets", // Reference to Basket model
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "products", // Reference to Product model
        key: "id",
      },
    },

    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    imageOne: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
// orders

//defaultValue: Sequelize.literal("gen_random_uuid()"),
const Order = sequelize.define("order", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: { type: DataTypes.INTEGER, unique: true, allowNull: false },
  deliveryDate: { type: DataTypes.STRING, allowNull: true },
  deliveryType: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.UUID, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  orderStatusId: { type: DataTypes.UUID, allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  notes: { type: DataTypes.STRING, allowNull: true },
  customerName: { type: DataTypes.STRING, allowNull: false },
  customerSurname: { type: DataTypes.STRING, allowNull: false },
  customerPhoneNumber: { type: DataTypes.STRING, allowNull: false },
  orderRegion: { type: DataTypes.STRING, allowNull: false },
  orderDeliveryCityPaymentId: { type: DataTypes.UUID, allowNull: false },
  shippingAddress: { type: DataTypes.STRING, allowNull: false },
});
const OrderDeliveryCityPayment = sequelize.define(
  "orderDeliveryCityPayment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
    },
    nameTm: { type: DataTypes.STRING, allowNull: false },
    nameRu: { type: DataTypes.STRING, allowNull: false },
    nameEn: { type: DataTypes.STRING, allowNull: false },
    deliveryPrice: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "orderDeliveryCityPayment" }
);
const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const OrderStatus = sequelize.define("orderStatus", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, allowNull: false },
  nameRu: { type: DataTypes.STRING, allowNull: false },
  nameEn: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

const Auction = sequelize.define("auction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  auctionID: { type: DataTypes.INTEGER, allowNull: false },
  startDateAuction: { type: DataTypes.DATE, allowNullL: false },
  endDateAuction: { type: DataTypes.DATE, allowNullL: false },
  auctionProductPriceStart: { type: DataTypes.FLOAT, allowNull: false },
  auctionProductPriceCurrent: { type: DataTypes.INTEGER, defaultValue: 0 },
  productId: { type: DataTypes.UUID, allowNull: false },
  lastBidderId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: "users", key: "id" },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
const UserAuction = sequelize.define("userAuction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  auctionId: {
    type: DataTypes.UUID,
    references: { model: "auction", key: "id" },
  },
  userId: {
    type: DataTypes.UUID,
    references: { model: "users", key: "id" },
  },
  joinedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
});

const SizeTable = sequelize.define("sizeTable", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  name: { type: DataTypes.STRING, allowNull: false },
});

const SizeTableType = sequelize.define("sizeTableType", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  sizeTableId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "sizeTables", // Assuming your SizeTable model uses this table name
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  nameTm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameEn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define relationships

const Size = sequelize.define("size", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"),
  },
  // order: { type: DataTypes.INTEGER, allowNull: false },
  sizeTableId: { type: DataTypes.UUID, allowNull: false },
  size: { type: DataTypes.STRING, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false },
  colorDetailId: { type: DataTypes.UUID, allowNull: false },

  descTm: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descRu: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descEn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Category = sequelize.define("category", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  image: { type: DataTypes.STRING, allowNull: true },
});
const SubCategory = sequelize.define("subCategory", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Segment = sequelize.define("segment", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  subCategoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Brand = sequelize.define("brand", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Banner = sequelize.define("banner", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  // categoryId: { type: DataTypes.UUID, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const Partner = sequelize.define("partner", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal("gen_random_uuid()"), // Используем UUID
  },
  nameTm: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameRu: { type: DataTypes.STRING, unique: true, allowNull: false },
  nameEn: { type: DataTypes.STRING, unique: true, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});
const ProductOfWeek = sequelize.define("productOfWeek", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  productId: { type: DataTypes.UUID, allowNull: false },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
// relationships
ProductProperties.belongsTo(Product, {
  foreignKey: "productId",
  as: "products",
});
Product.hasMany(ProductProperties, {
  foreignKey: "productId",
  as: "properties",
  onDelete: "CASCADE",
});

ProductOfWeek.belongsTo(Product, {
  foreignKey: "productId",
  as: "products",
});

Product.hasOne(ProductOfWeek, {
  foreignKey: "productId",
  as: "productOfWeek",
});

Auction.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasOne(Auction, { foreignKey: "productId" });

Auction.belongsToMany(User, {
  through: UserAuction,
  foreignKey: "auctionId",
  as: "participants",
});
User.belongsToMany(Auction, {
  through: UserAuction,
  foreignKey: "userId",
  as: "joinedAuctions",
});
Auction.belongsTo(User, { as: "lastBidder", foreignKey: "lastBidderId" });

BasketProduct.belongsTo(Basket, { foreignKey: "basketId" });
Basket.hasMany(BasketProduct, { foreignKey: "basketId" });

BasketProduct.hasMany(SizeTable);

// A Brand can have many Products
Brand.hasMany(Product, {
  foreignKey: "brandId",
  as: "products", // Alias for related products
  onDelete: "CASCADE",
});

// A Product belongs to a single Brand
Product.belongsTo(Brand, {
  foreignKey: "brandId",
  as: "brand", // Alias for the related brand
});

// SizeTable ↔ Size
SizeTable.hasMany(Size, {
  foreignKey: "sizeTableId",
  as: "sizes",
});
Size.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
  as: "sizeTable",
});

SizeTable.hasMany(SizeTableType, {
  foreignKey: "sizeTableId",
  as: "types",
});

SizeTableType.belongsTo(SizeTable, {
  foreignKey: "sizeTableId",
  as: "sizeTable",
});

Product.belongsTo(Category, {
  as: "productCategory",
  foreignKey: "categoryId",
});
Category.hasMany(Product, {
  as: "products",
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});

Product.belongsTo(Segment, {
  as: "segment",
  foreignKey: "segmentId",
});
Segment.hasMany(Product, {
  as: "products",
  foreignKey: "segmentId",
  onDelete: "CASCADE",
});

// Define the relationship
Product.belongsTo(Status, {
  foreignKey: "statusId",
  as: "status",
});

Status.hasMany(Product, {
  foreignKey: "statusId",
  as: "products",
});

Product.belongsTo(SubCategory, {
  as: "subCategory",
  foreignKey: "subCategoryId",
});
SubCategory.hasMany(Product, {
  as: "products",
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});

Category.hasMany(SubCategory, {
  as: "subCategories",
  foreignKey: "categoryId",
  onDelete: "CASCADE",
});
SubCategory.belongsTo(Category, {
  as: "parentCategory",
  foreignKey: "categoryId",
});

// SizeTable.hasMany(Size, { as: 'sizes', foreignKey: 'categoryId' });
// SubCategory.belongsTo(Category, { as: 'parentCategory', foreignKey: 'categoryId' });
SubCategory.hasMany(Segment, {
  as: "segments",
  foreignKey: "subCategoryId",
  onDelete: "CASCADE",
});
Segment.belongsTo(SubCategory, {
  as: "parentSubCategory",
  foreignKey: "subCategoryId",
});

// Basket
Basket.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Basket, {
  foreignKey: "userId",
  as: "baskets",
});
Basket.belongsToMany(Product, {
  through: "BasketProduct",
  foreignKey: "basketId",
  as: "products",
});

Product.belongsToMany(Basket, {
  through: "BasketProduct",
  foreignKey: "productId",
  as: "baskets",
});

Basket.belongsTo(Size, {
  foreignKey: "sizeId",
  as: "size",
});

Size.hasMany(Basket, {
  foreignKey: "sizeId",
  as: "baskets",
});

OrderDeliveryCityPayment.hasMany(Order, {
  foreignKey: "orderDeliveryCityPaymentId",
  onDelete: "SET NULL",
});
Order.belongsTo(OrderDeliveryCityPayment, {
  foreignKey: "orderDeliveryCityPaymentId",
});

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

Order.belongsTo(OrderStatus, {
  foreignKey: "orderStatusId", // Foreign key in Order model
  as: "orderStatusDetails", // Rename alias to avoid collision
});

// In OrderStatus model
OrderStatus.hasMany(Order, {
  foreignKey: "orderStatusId", // Corresponding foreign key in OrderStatus model
});

Product.belongsTo(OrderStatus, {
  foreignKey: "order_statusId",
  as: "order_status",
});

OrderStatus.hasMany(Product, {
  foreignKey: "order_statusId",
  as: "products",
});

module.exports = {
  User,
  Basket,
  BasketProduct,
  Product,
  ProductProperties,
  SizeTable,
  Size,
  Category,
  SubCategory,
  Segment,
  Status,
  Brand,
  OrderStatus,
  Order,
  OrderItem,
  SizeTableType,
  Banner,
  Partner,
  Auction,
  UserAuction,
  ProductOfWeek,
  OrderDeliveryCityPayment,
  UserForAdminPage,
};
