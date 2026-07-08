import fs from 'fs';
import path from 'path';

// Odoo Configuration
const ODOO_URL = process.env.ODOO_URL || '';
const ODOO_DB = process.env.ODOO_DB || '';
const ODOO_USERNAME = process.env.ODOO_USERNAME || '';
const ODOO_PASSWORD = process.env.ODOO_API_KEY || process.env.ODOO_PASSWORD || '';

export interface OdooProductImage {
  id: number;
  name: string;
  image_url: string;
}

export interface OdooProduct {
  id: number;
  name: string;
  list_price: number;
  description_sale: string | boolean;
  categ_id: [number, string] | boolean;
  image_url: string;
  product_template_image_ids?: number[];
  extra_images?: OdooProductImage[];
}

async function callOdoo(service: string, method: string, args: any[]): Promise<any> {
  if (!ODOO_URL) {
    throw new Error('ODOO_URL environment variable is missing.');
  }
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
    body: JSON.stringify(body),
    next: { revalidate: 300 } // Cache API response for 5 minutes (300 seconds)
  });

  const json = await response.json();
  if (json.error) {
    throw new Error(JSON.stringify(json.error));
  }
  return json.result;
}

let cachedUidPromise: Promise<number> | null = null;

async function getUid(): Promise<number> {
  if (cachedUidPromise !== null) return cachedUidPromise;
  if (!ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
    throw new Error('Odoo credentials (DB, Username, Password/API key) are missing.');
  }
  cachedUidPromise = callOdoo('common', 'authenticate', [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_PASSWORD,
    {}
  ]).catch(err => {
    cachedUidPromise = null;
    throw err;
  });
  return cachedUidPromise;
}

export interface FilterOptions {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  sort?: string;
}

export interface OdooCategory {
  id: number;
  name: string;
}

// Maps client-side sort keys to Odoo order string
function getOdooOrder(sortKey?: string): string {
  switch (sortKey) {
    case 'price_asc':
      return 'list_price asc';
    case 'price_desc':
      return 'list_price desc';
    case 'name_asc':
      return 'name asc';
    case 'name_desc':
      return 'name desc';
    case 'id_asc':
      return 'id asc';
    case 'id_desc':
    default:
      return 'id desc';
  }
}

// Construct search domain based on filters
function getSearchDomain(categoryId?: number, search?: string): any[] {
  const domain: any[] = [['is_published', '=', true]];
  if (categoryId) {
    domain.push(['categ_id', '=', categoryId]);
  }
  if (search && search.trim() !== '') {
    domain.push(['name', 'ilike', search.trim()]);
  }
  return domain;
}

export async function getFilteredProducts(options: FilterOptions): Promise<OdooProduct[]> {
  try {
    const uid = await getUid();
    const page = options.page || 1;
    const limit = options.limit || 9;
    const offset = (page - 1) * limit;

    const domain = getSearchDomain(options.categoryId, options.search);
    const order = getOdooOrder(options.sort);

    const products = await callOdoo('object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'product.template',
      'search_read',
      [domain],
      {
        fields: ['id', 'name', 'list_price', 'description_sale', 'categ_id'],
        offset,
        limit,
        order
      }
    ]);

    // Map to construct public CDN URLs instead of downloading binary base64
    return (products as any[]).map(product => ({
      ...product,
      image_url: `${ODOO_URL}/web/image/product.template/${product.id}/image_512`
    })) as OdooProduct[];
  } catch (error) {
    console.error('Error fetching filtered products from Odoo:', error);
    return [];
  }
}

export async function getFilteredProductsCount(options: FilterOptions): Promise<number> {
  try {
    const uid = await getUid();
    const domain = getSearchDomain(options.categoryId, options.search);

    const count = await callOdoo('object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'product.template',
      'search_count',
      [domain]
    ]);
    return count;
  } catch (error) {
    console.error('Error fetching filtered product count from Odoo:', error);
    return 0;
  }
}

export async function getAllCategories(): Promise<OdooCategory[]> {
  try {
    const uid = await getUid();
    // Retrieve categories. In Odoo, we only want to show categories that exist.
    const categories = await callOdoo('object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'product.category',
      'search_read',
      [[]],
      {
        fields: ['id', 'name'],
        order: 'name asc'
      }
    ]);
    return categories as OdooCategory[];
  } catch (error) {
    console.error('Error fetching categories from Odoo:', error);
    return [];
  }
}

// Keep backward compatibility if anything else imports it
export async function getPublishedProducts(page: number = 1, limit: number = 9): Promise<OdooProduct[]> {
  return getFilteredProducts({ page, limit });
}

export async function getPublishedProductsCount(): Promise<number> {
  return getFilteredProductsCount({});
}

export async function getProductById(id: number): Promise<OdooProduct | null> {
  try {
    const uid = await getUid();
    const products = await callOdoo('object', 'execute_kw', [
      ODOO_DB,
      uid,
      ODOO_PASSWORD,
      'product.template',
      'read',
      [[id]],
      {
        fields: ['id', 'name', 'list_price', 'description_sale', 'categ_id', 'product_template_image_ids']
      }
    ]);
    if (Array.isArray(products) && products.length > 0) {
      const product = products[0] as OdooProduct;
      product.image_url = `${ODOO_URL}/web/image/product.template/${product.id}/image_1920`;

      if (product.product_template_image_ids && product.product_template_image_ids.length > 0) {
        try {
          const extraImages = await callOdoo('object', 'execute_kw', [
            ODOO_DB,
            uid,
            ODOO_PASSWORD,
            'product.image',
            'read',
            [product.product_template_image_ids],
            { fields: ['id', 'name'] }
          ]);
          product.extra_images = (extraImages as any[]).map(img => ({
            id: img.id,
            name: img.name,
            image_url: `${ODOO_URL}/web/image/product.image/${img.id}/image_512`
          }));
        } catch (err) {
          console.error("Error fetching extra images from Odoo:", err);
          product.extra_images = [];
        }
      } else {
        product.extra_images = [];
      }
      return product;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id} from Odoo:`, error);
    return null;
  }
}
