const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://joycwdtkknrjwqazwqnv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpveWN3ZHRra25yandxYXp3cW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDE4OTksImV4cCI6MjEwMzk3Nzg5OX0.0NYLdYb7MTeZuRCoArijXZPj-ZZFCXgBQooAJgwXkRc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error('Fetch error:', error);
    return;
  }
  
  const product = data[0];
  console.log('Product ID:', product.id);
  console.log('Current Joined:', product.preorderInfo?.joinedCount);
}

run();
