// src/components/orderStorage.js

export function saveLocalOrder(orderData) {
  try {
    // 1. Recover current data layers or initialize a clean array fallback
    const rawOrders = localStorage.getItem('design_print_orders');
    let existingOrders = [];
    
    if (rawOrders) {
      try {
        const parsed = JSON.parse(rawOrders);
        existingOrders = Array.isArray(parsed) ? parsed : [];
      } catch {
        existingOrders = [];
      }
    }
    
    // 2. Format the custom client record structure cleanly
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      status: 'New / Unreviewed',
      clientName: orderData.clientName || 'Anonymous Client',
      clientEmail: orderData.clientEmail || '',
      clientPhone: orderData.clientPhone || '',
      serviceType: orderData.serviceType || 'Not Specified',
      productCategory: orderData.productCategory || 'General Project',
      quantity: orderData.quantity || '',
      paperFinish: orderData.paperFinish || 'standard',
      description: orderData.description || '',
      assetDownloadUrl: orderData.assetDownloadUrl || ''
    };

    // 3. Unshift to top of pile and force string mapping execution
    existingOrders.unshift(newOrder);
    localStorage.setItem('design_print_orders', JSON.stringify(existingOrders));
    
    console.log("🌟 Order stored successfully in localStorage:", newOrder);
    return newOrder;
  } catch (err) {
    console.error("⛔ Local storage critical tracking failure:", err);
    return null;
  }
}

export function getLocalOrders() {
  try {
    const orders = localStorage.getItem('design_print_orders');
    return orders ? JSON.parse(orders) : [];
  } catch (err) {
    console.error("Could not fetch orders from localStorage:", err);
    return [];
  }
}

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
