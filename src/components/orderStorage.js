// src/utils/orderStorage.js

/**
 * Persists a new customer brief into the local storage pipeline
 */
export function saveLocalOrder(orderData) {
  try {
    const existingOrders = getLocalOrders();
    
    const newOrder = {
      id: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'New / Unreviewed', // New, Quoted, In Production, Completed, Cancelled
      notes: '',
      ...orderData
    };

    existingOrders.unshift(newOrder); // Add to the top of the queue
    localStorage.setItem('design_print_orders', JSON.stringify(existingOrders));
    return newOrder;
  } catch (err) {
    console.error("Failed to cache lead locally:", err);
    return null;
  }
}

/**
 * Retrieves all stored leads
 */
export function getLocalOrders() {
  try {
    const orders = localStorage.getItem('design_print_orders');
    return orders ? JSON.parse(orders) : [];
  } catch {
    return [];
  }
}

/**
 * Updates the status or notes of an existing customer record
 */
export function updateLocalOrder(orderId, updatedFields) {
  try {
    const orders = getLocalOrders();
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, ...updatedFields } : order
    );
    localStorage.setItem('design_print_orders', JSON.stringify(updatedOrders));
    return true;
  } catch {
    return false;
  }
}
