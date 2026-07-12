



export interface MenuItem {
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


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';    
  avatar?: string;            
  phone?: string;             
  address?: string;           
}


export interface StoredUser extends User {
  password: string;
}


export interface CartItem {
  item: MenuItem;
  quantity: number;          
}


export interface Review {
  id: string;
  userName: string;
  rating: number;            
  comment: string;
  date: string;              
}


export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Delivered';
  date: string;              
}
