import { db } from "../firebase/config";
import { COLLECTION_WIKI, UserInfo } from "./constant";

import { collection, addDoc } from 'firebase/firestore';

export const calculateDaysDifference = (
  expirationDate: string,
  createdAt?: string,
): number => {
  const expDate = new Date(expirationDate);
  let createdDate: Date;

  if (createdAt) {
    createdDate = new Date(createdAt);
  } else {
    createdDate = new Date();
  }

  createdDate.setHours(0, 0, 0, 0);

  const differenceInMilliseconds = expDate.getTime() - createdDate.getTime();

  const millisecondsInADay = 24 * 60 * 60 * 1000;
  const differenceInDays = Math.floor(
    differenceInMilliseconds / millisecondsInADay,
  );

  return differenceInDays > 0 ? differenceInDays : 0;
};

export const calculateExpiredFoods = async (userId: string): Promise<number> => {
  try {
    const userInventoryRef = db.collection('Inventory').doc(userId);
    const inventorySnapshot = await userInventoryRef.get();

    if (!inventorySnapshot.exists) {
      throw new Error(`Inventory not found for user ID: ${userId}`);
    }

    const inventoryData = inventorySnapshot.data();
    const items = inventoryData?.data || []; // Assuming `items` contains the array of foods

    // // Count expired foods
    const expiredCount = items.reduce((count: number, item: any) => {
      const daysLeft = calculateDaysDifference(item.expiryDate);
      return daysLeft < 1 ? count + 1 : count; // Increment count if expired
    }, 0);

    return expiredCount
  } catch (error) {
    console.error('Error calculating expired foods:', error);
    throw error;
  }
};

// Add multiple food items to Firebase
export async function addFoodItems(items: any[]): Promise<any[]> {
  try {
    // Create an array of promises to add each item
    console.log('Adding food items to Firebase...');
    const addItemPromises = items.map(async (item) => {
        const docRef = await db.collection(COLLECTION_WIKI).add(item); // Use the Admin SDK method
        return { id: docRef.id, ...item };
    });

    // Wait for all items to be added
    const addedItems = await Promise.all(addItemPromises);
    console.log('All items added successfully:', addedItems);

    return addedItems; // Return all added items with their IDs
  } catch (error) {
    console.error('Error adding items to Firebase:', error);
    throw new Error('Failed to add items');
  }
}

export async function getInventoryByUserId(userId: string): Promise<any> {
    try {
      // Replace with your actual query logic (e.g., Firebase, SQL)
      // Example for Firebase:
      const docRef = db.collection('Inventory').doc(userId);
      const docSnap = await docRef.get();
  
      if (!docSnap.exists) {
        return null;
      }
  
      return docSnap.data();
    } catch (error) {
      console.error(`Error fetching inventory for user ${userId}:`, error);
      throw new Error('Failed to fetch inventory');
    }
  }
  
// Update the inventory in the database
export async function updateInventory(userId: string, updatedData: any): Promise<void> {
    try {
      // Replace with your actual update logic (e.g., Firebase, SQL)
      // Example for Firebase:
      const docRef = db.collection('Inventory').doc(userId);
      await docRef.update({ data: updatedData });
  
      console.log(`Inventory updated successfully for user ${userId}`);
    } catch (error) {
      console.error(`Error updating inventory for user ${userId}:`, error);
      throw new Error('Failed to update inventory');
    }
}

export async function updateUserInfo(
    userId: string,
    updatedData: Partial<UserInfo>
  ): Promise<void> {
    try {
      const docRef = db.collection('Users').doc(userId);
      await docRef.update({ ...updatedData });
  
      console.log(`User information updated successfully for userId ${userId}`);
    } catch (error) {
      console.error(`Error updating user information for userId ${userId}:`, error);
      throw new Error('Failed to update user information');
    }
}