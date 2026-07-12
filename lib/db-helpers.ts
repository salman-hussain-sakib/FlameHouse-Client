

import fs from 'fs';
import path from 'path';
import { Collection, Db, Document } from 'mongodb';
import { getMongoDb } from './mongodb';

let cachedLocalData: {
  menuItems: DBMenuItem[];
  reviews: DBReview[];
  users: DBUser[];
  orders: DBOrder[];
  contacts: DBContact[];
} | null = null;

function getLocalData() {
  if (!cachedLocalData) {
    try {
      const seedPath = path.join(process.cwd(), 'lib', 'db.json');
      const raw = fs.readFileSync(seedPath, 'utf-8');
      cachedLocalData = JSON.parse(raw);
    } catch {
      cachedLocalData = { menuItems: [], reviews: [], users: [], orders: [], contacts: [] };
    }
  }
  return cachedLocalData!;
}


export interface DBMenuItem {
  id: string;
  name: string;
  category: 'Pizza' | 'Burgers' | 'Fried Chicken' | 'Sides' | 'Drinks';
  price: number;
  stock?: number;
  description: string;
  longDescription: string;
  rating: number;
  images: string[];
  spicyLevel: number;
  isVeg: boolean;
  isFeatured: boolean;
  calories: number;
  ingredients: string[];
  createdBy?: string;
}

export interface DBReview {
  id: string;
  itemId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DBUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
}

export interface DBCartItem {
  item: DBMenuItem;
  quantity: number;
}

export interface DBOrder {
  id: string;
  userId: string;
  items: DBCartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  date: string;
}

export interface DBContact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db: Db = await getMongoDb();
  return db.collection<T>(name);
}

async function seedDefaultsIfNeeded(): Promise<void> {
  const db = await getMongoDb();
  const counts = await Promise.all([
    db.collection('menuItems').countDocuments(),
    db.collection('reviews').countDocuments(),
    db.collection('users').countDocuments(),
    db.collection('orders').countDocuments(),
    db.collection('contacts').countDocuments(),
  ]);

  if (counts.some((count) => count > 0)) return;

  const seedPath = path.join(process.cwd(), 'lib', 'db.json');
  const raw = fs.readFileSync(seedPath, 'utf-8');
  const seed = JSON.parse(raw) as {
    menuItems: DBMenuItem[];
    reviews: DBReview[];
    users: DBUser[];
    orders: DBOrder[];
    contacts: DBContact[];
  };
  const normalizedMenuItems = seed.menuItems.map((item) => ({
    ...item,
    stock: typeof item.stock === 'number' ? item.stock : 25,
  }));

  await Promise.all([
    db.collection('menuItems').insertMany(normalizedMenuItems),
    db.collection('reviews').insertMany(seed.reviews),
    db.collection('users').insertMany(seed.users),
    db.collection('orders').insertMany(seed.orders),
    db.collection('contacts').insertMany(seed.contacts),
  ]);
}



export async function getMenuItems(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<DBMenuItem[]> {
  let items: DBMenuItem[] = [];

  try {
    await seedDefaultsIfNeeded();
    const collection = await getCollection<DBMenuItem>('menuItems');
    let query: Record<string, unknown> = {};

    if (filters?.featured) {
      query.isFeatured = true;
    }
    if (filters?.category) {
      query.category = filters.category;
    }
    if (filters?.search) {
      query = {
        $or: [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { category: { $regex: filters.search, $options: 'i' } },
        ],
      };
    }

    items = (await collection.find(query).sort({ name: 1 }).toArray()).map((item) => ({
      ...item,
      stock: typeof item.stock === 'number' ? item.stock : 25,
    })) as DBMenuItem[];

    if (items.length > 0) return items;
  } catch {
    // MongoDB fallback
  }

  let localItems = getLocalData().menuItems;

  if (filters?.featured) {
    localItems = localItems.filter((i) => i.isFeatured);
  }
  if (filters?.category) {
    localItems = localItems.filter((i) => i.category === filters.category);
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    localItems = localItems.filter(
      (i) =>
        i.name.toLowerCase().includes(searchLower) ||
        i.description.toLowerCase().includes(searchLower) ||
        i.category.toLowerCase().includes(searchLower)
    );
  }

  return localItems
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => ({
      ...item,
      stock: typeof item.stock === 'number' ? item.stock : 25,
    })) as DBMenuItem[];
}

export async function getMenuItemById(id: string): Promise<DBMenuItem | null> {
  try {
    await seedDefaultsIfNeeded();
    const collection = await getCollection<DBMenuItem>('menuItems');
    const item = await collection.findOne({ id });
    if (item) {
      return {
        ...item,
        stock: typeof item.stock === 'number' ? item.stock : 25,
      } as DBMenuItem;
    }
  } catch {
    // MongoDB fallback
  }

  const localData = getLocalData();
  const localItem = localData.menuItems.find((item) => item.id === id);
  if (localItem) {
    return {
      ...localItem,
      stock: typeof localItem.stock === 'number' ? localItem.stock : 25,
    } as DBMenuItem;
  }
  return null;
}

export async function addMenuItem(item: DBMenuItem): Promise<DBMenuItem> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBMenuItem>('menuItems');
  await collection.insertOne(item);
  return item;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBMenuItem>('menuItems');
  const result = await collection.deleteOne({ id });
  return result.deletedCount > 0;
}



export async function getReviewsForItem(itemId: string): Promise<DBReview[]> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBReview>('reviews');
  return collection.find({ itemId }).toArray() as Promise<DBReview[]>;
}

export async function addReview(review: DBReview): Promise<DBReview> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBReview>('reviews');
  await collection.insertOne(review);
  return review;
}



export async function findUserByEmail(email: string): Promise<DBUser | null> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBUser>('users');
  return collection.findOne({ email }) as Promise<DBUser | null>;
}

export async function findUserById(id: string): Promise<DBUser | null> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBUser>('users');
  return collection.findOne({ id }) as Promise<DBUser | null>;
}

export async function createUser(user: DBUser): Promise<DBUser> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBUser>('users');
  await collection.insertOne(user);
  return user;
}

export async function updateUserProfile(userId: string, updates: Partial<DBUser>): Promise<DBUser | null> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBUser>('users');
  const updated = await collection.findOneAndUpdate(
    { id: userId },
    { $set: updates },
    { returnDocument: 'after' }
  );
  return updated as DBUser | null;
}

export async function getAllUsers(): Promise<Omit<DBUser, 'password'>[]> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBUser>('users');
  const users = await collection.find({}).toArray();
  return users.map(({ password: _p, ...rest }) => rest);
}



export async function getOrdersByUserId(userId: string): Promise<DBOrder[]> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBOrder>('orders');
  return collection.find({ userId }).sort({ date: -1 }).toArray() as Promise<DBOrder[]>;
}

export async function getAllOrders(): Promise<DBOrder[]> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBOrder>('orders');
  return collection.find({}).sort({ date: -1 }).toArray() as Promise<DBOrder[]>;
}

export async function createOrder(order: DBOrder): Promise<DBOrder> {
  await seedDefaultsIfNeeded();
  const menuCollection = await getCollection<DBMenuItem>('menuItems');
  for (const entry of order.items) {
    const existing = await menuCollection.findOne({ id: entry.item.id });
    const currentStock = typeof existing?.stock === 'number' ? existing.stock : 25;
    const nextStock = Math.max(0, currentStock - entry.quantity);
    await menuCollection.updateOne(
      { id: entry.item.id },
      { $set: { stock: nextStock } },
      { upsert: true }
    );
  }

  const collection = await getCollection<DBOrder>('orders');
  await collection.insertOne(order);
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  status: DBOrder['status']
): Promise<DBOrder | null> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBOrder>('orders');
  const updated = await collection.findOneAndUpdate(
    { id: orderId },
    { $set: { status } },
    { returnDocument: 'after' }
  );
  return updated as DBOrder | null;
}



export async function addContact(contact: DBContact): Promise<DBContact> {
  await seedDefaultsIfNeeded();
  const collection = await getCollection<DBContact>('contacts');
  await collection.insertOne(contact);
  return contact;
}
