import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

class OrderService {
  // Orders collection
  async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date(),
        status: 'processing'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getUserOrders(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Returns collection
  async createReturn(returnData) {
    try {
      const docRef = await addDoc(collection(db, 'returns'), {
        ...returnData,
        createdAt: new Date(),
        status: 'requested'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating return:', error);
      throw error;
    }
  }

  async getUserReturns(userId) {
    try {
      const q = query(
        collection(db, 'returns'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting returns:', error);
      throw error;
    }
  }

  async updateReturnStatus(returnId, status) {
    try {
      await updateDoc(doc(db, 'returns', returnId), {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating return status:', error);
      throw error;
    }
  }

  // Check if order is eligible for return (within 30 days)
  isEligibleForReturn(orderDate) {
    const orderDateObj = new Date(orderDate);
    const now = new Date();
    const diffTime = Math.abs(now - orderDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }
}

export default new OrderService();