import { getPublishedProducts } from './app/utils/odoo';

async function test() {
  console.log("Testing Odoo connection...");
  try {
    const products = await getPublishedProducts(1, 3);
    console.log("Products:", products);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
