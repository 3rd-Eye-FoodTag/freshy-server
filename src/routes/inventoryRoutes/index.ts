import { Router, Request, Response } from 'express';
import { db } from '../../firebase/config';
import { addFoodItems, getInventoryByUserId, updateInventory } from '../../utils/utils';
import { COLLECTION_WIKI, FoodDetailsProps } from '../../utils/constant';

const router = Router();

router.get('/foodwiki', async (req: Request, res: Response): Promise<any> => {
    try {
      // Query the Firestore collection
      const querySnapshot = await db.collection(COLLECTION_WIKI).get();
  
      // Map through the documents and extract data
      const fruitsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).json(fruitsData);
    } catch (error: any) {
      console.error(`Error fetching ${COLLECTION_WIKI} data:`, error.message);
      res.status(500).json({
        message: `Failed to fetch data from ${COLLECTION_WIKI}`,
        error: error.message,
      });
    }
  });

  router.post('/addFoodItems', async (req: Request, res: Response): Promise<any> => {
    const { items }: { items: any[] } = req.body;
  
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      // Add food items using the helper function
      const addedItems = await addFoodItems(items);
  
      return res.status(201).json({
        message: 'Food items added successfully',
        addedItems,
      });
    } catch (error) {
      console.error('Error adding food items:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/userInventory/:uid', async (req: Request, res: Response): Promise<any> => {
    const { uid } = req.params;
  
    try {
      console.log(`Fetching inventory for user: ${uid}`);
      
      // Reference the document in the "Inventory" collection
      const docRef = db.collection('Inventory').doc(uid);
      const docSnap = await docRef.get();
  
      if (!docSnap.exists) {
        return res.status(404).json({ message: `Inventory for user with UID ${uid} not found` });
      }
  
      // Return the inventory data
      const inventoryData = docSnap.data();
  
      res.status(200).json(inventoryData);
    } catch (error: any) {
      console.error('Error fetching inventory data:', error.message);
      res.status(500).json({ message: 'Failed to fetch inventory data', error: error.message });
    }
});

router.post('/add-item/:uid', async (req: Request, res: Response): Promise<any> => {
  const { uid } = req.params;
  const { newItem } = req.body;

  if (!newItem || !Array.isArray(newItem)) {
    return res.status(400).json({
      message: 'Invalid request body. "newItem" must be an array of items.',
    });
  }

  try {
    console.log(`Updating inventory for user: ${uid}`);

    // Reference the document in the "Inventory" collection
    const docRef = db.collection('Inventory').doc(uid);

    // Get the current inventory data
    const docSnap = await docRef.get();
    const currentData = docSnap.exists ? docSnap?.data()?.data || [] : [];

    // Merge the new items with the existing inventory
    const updatedInventory = [...currentData, ...newItem];

    // Update the Firestore document
    await docRef.set({ data: updatedInventory }, { merge: true });

    console.log('Successfully updated inventory');
    res.status(200).json(updatedInventory);
  } catch (error: any) {
    console.error('Error updating inventory:', error.message);
    res.status(500).json({ message: 'Failed to update inventory', error: error.message });
  }
});

router.put('/updateFoodItem', async (req: Request, res: Response): Promise<any>  => {
    const { currentUid, newItem }: { currentUid: string; newItem: FoodDetailsProps } = req.body;
  
    if (!currentUid || !newItem || !newItem.foodID) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      // Fetch the user's inventory
      const inventory = await getInventoryByUserId(currentUid);
  
      if (!inventory) {
        return res.status(404).json({ error: `Inventory for user ${currentUid} not found` });
      }
  
      // Update the item in the inventory
      const updatedData = inventory.data.map((item: FoodDetailsProps) =>
        item.foodID === newItem.foodID ? { ...item, ...newItem } : item
      );
  
      // Update the inventory in the database
      await updateInventory(currentUid, updatedData);
  
      return res.status(200).json({
        message: `Item with foodID ${newItem.foodID} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating food item:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/remove-item',  async (req: Request, res: Response): Promise<any> => {
    console.log('removing')
    const { currentUid, foodID }: { currentUid: string; foodID: string } = req.body;

    if (!currentUid || !foodID) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
  
    try {
      // Fetch the user's inventory
      const inventory = await getInventoryByUserId(currentUid);
  
      if (!inventory) {
        return res.status(404).json({ error: `Inventory for user ${currentUid} not found` });
      }
  
      // Filter out the item with the given foodID
      const updatedData = inventory.data.filter(
        (item: { foodID: string }) => item.foodID !== foodID
      );
  
      // Update the inventory in the database
      await updateInventory(currentUid, updatedData);
  
      return res
        .status(200)
        .json({ message: `Item with foodID ${foodID} has been removed successfully.` });
    } catch (error) {
      console.error('Error updating inventory:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;
