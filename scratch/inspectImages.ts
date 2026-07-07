// Odoo Configuration
const ODOO_URL = process.env.ODOO_URL || '';
const ODOO_DB = process.env.ODOO_DB || '';
const ODOO_USERNAME = process.env.ODOO_USERNAME || '';
const ODOO_PASSWORD = process.env.ODOO_API_KEY || process.env.ODOO_PASSWORD || '';

async function callOdoo(service: string, method: string, args: any[]): Promise<any> {
  const url = `${ODOO_URL}/jsonrpc`;
  const body = {
    jsonrpc: '2.0',
    method: 'call',
    params: { service, method, args },
    id: Math.floor(Math.random() * 1000000)
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await response.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result;
}

async function run() {
  console.log("Authenticating...");
  const uid = await callOdoo('common', 'authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}]);
  console.log("UID:", uid);

  console.log("Fetching fields of product.template containing 'image'...");
  const fields = await callOdoo('object', 'execute_kw', [
    ODOO_DB,
    uid,
    ODOO_PASSWORD,
    'product.template',
    'fields_get',
    [],
    { attributes: ['string', 'type', 'relation'] }
  ]);

  for (const name in fields) {
    if (name.includes('image') || fields[name].type === 'one2many' || fields[name].type === 'many2many') {
      console.log(`- ${name}: type=${fields[name].type}, string=${fields[name].string}, relation=${fields[name].relation}`);
    }
  }

  // Let's query product 93, 67, or any product to check their image fields
  console.log("\nReading product image fields for some products...");
  const products = await callOdoo('object', 'execute_kw', [
    ODOO_DB,
    uid,
    ODOO_PASSWORD,
    'product.template',
    'search_read',
    [[['is_published', '=', true]]],
    {
      fields: ['id', 'name', 'product_template_image_ids', 'image_512'],
      limit: 10
    }
  ]);

  for (const p of products) {
    console.log(`\nProduct ${p.id}: ${p.name}`);
    console.log(`product_template_image_ids:`, p.product_template_image_ids);
    
    // If there are extra images, let's query them
    if (p.product_template_image_ids && p.product_template_image_ids.length > 0) {
      console.log(`Fetching extra images:`, p.product_template_image_ids);
      const extraImages = await callOdoo('object', 'execute_kw', [
        ODOO_DB,
        uid,
        ODOO_PASSWORD,
        'product.image', // Let's check if model exists
        'read',
        [p.product_template_image_ids],
        { fields: ['id', 'name', 'image_1920', 'image_512'] }
      ]);
      console.log(`Found ${extraImages.length} extra images for product ${p.id}:`);
      extraImages.forEach((img: any) => {
        console.log(`- Image ID: ${img.id}, Name: ${img.name}, HasImage1920: ${typeof img.image_1920 === 'string' ? img.image_1920.length : false}, HasImage512: ${typeof img.image_512 === 'string' ? img.image_512.length : false}`);
      });
    }
  }
}

run().catch(console.error);
