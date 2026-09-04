const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joycwdtkknrjwqazwqnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWN3ZHRra25yandxYXp3cW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDE4OTksImV4cCI6MjEwMzk3Nzg5OX0.0NYLdYb7MTeZuRCoArijXZPj-ZZFCXgBQooAJgwXkRc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching first product...');
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  
  if (!data || data.length === 0) {
    console.log('No products found');
    return;
  }
  
  const product = data[0];
  console.log('Product ID:', product.id);
  
  const currentJoined = product.preorderInfo?.joinedCount || 0;
  console.log('Current Joined:', currentJoined);
  
  const newPreorderInfo = {
    ...(product.preorderInfo || {}),
    joinedCount: currentJoined + 1
  };
  
  console.log('Updating product with:', newPreorderInfo);
  const { data: updateData, error: updateError } = await supabase
    .from('products')
    .update({ preorderInfo: newPreorderInfo })
    .eq('id', product.id);
    
  if (updateError) {
    console.error('Update error:', updateError);
  } else {
    console.log('Update success!', updateData);
  }
}

run();
