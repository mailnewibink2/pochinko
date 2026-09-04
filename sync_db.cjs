const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joycwdtkknrjwqazwqnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWN3ZHRra25yandxYXp3cW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDE4OTksImV4cCI6MjEwMzk3Nzg5OX0.0NYLdYb7MTeZuRCoArijXZPj-ZZFCXgBQooAJgwXkRc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('Fetching all products...');
  const { data: products, error: pError } = await supabase.from('products').select('*');
  if (pError) throw pError;
  
  console.log('Fetching all orders...');
  const { data: orders, error: oError } = await supabase.from('orders').select('*');
  if (oError) throw oError;
  
  // Calculate correct joined counts
  const joinedCounts = {};
  
  for (const order of orders) {
    for (const item of order.items) {
      if (item.product && item.product.id) {
        if (!joinedCounts[item.product.id]) joinedCounts[item.product.id] = 0;
        joinedCounts[item.product.id] += item.quantity;
      }
    }
  }
  
  console.log('Calculated joined counts from orders:', joinedCounts);
  
  // Update products
  for (const product of products) {
    const correctCount = joinedCounts[product.id] || 0;
    const currentCount = product.preorderInfo?.joinedCount || 0;
    
    if (currentCount !== correctCount) {
      console.log(`Product ${product.id} mismatch: DB has ${currentCount}, calculated ${correctCount}. Updating...`);
      const newPreorderInfo = {
        ...(product.preorderInfo || {}),
        joinedCount: correctCount
      };
      
      const { error } = await supabase
        .from('products')
        .update({ preorderInfo: newPreorderInfo })
        .eq('id', product.id);
        
      if (error) {
        console.error(`Failed to update ${product.id}:`, error);
      } else {
        console.log(`Updated ${product.id} successfully.`);
      }
    }
  }
  
  console.log('Sync complete!');
}

sync().catch(console.error);
