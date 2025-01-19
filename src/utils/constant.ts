export interface FoodDetailsProps {
    name: string;
    foodWikiId?: string; // Optional reference to FoodWiki
    quantity: number;
    purchaseDate: string; // ISO date string
    expiryDate: string; // ISO date string
    consumed: boolean;
    category: string;
    shared: boolean;
    createdBy: string; // User ID reference
    freshnessScore: number;
    storagePlace: 'Fridge' | 'Freezer' | 'Pantry';
    cost: number;
    groceryStore: string;
    updatedByUser: string; // User ID reference
    consumedAt: string | null; // ISO date string or null
    foodPhoto: string; // URL to the food photo
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    foodID: string;
    selected?: boolean;
    predictedFreshDurations: {
      fridge?: number;
      freezer?: number;
      room?: number;
    };
    foodName?: string;
    imageName?: string;
  }

  export interface UserInfo {
    age: string;
    email: string;
    gender: string;
    name: string;
    phoneNumber: string;
    zipCode: string;
  }
  
  export const COLLECTION_WIKI = 'FoodWiki3';