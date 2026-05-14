import ClientDashboard from "@/pages/client/ClientDashboard";

const API_URL = process.env.INTERNAL_API_URL || "http://back-end:3000/api/v1";

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : (data?.data || []);
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
  return [];
}

async function getCategoryProducts(categories) {
  const productsMap = {};
  const promises = categories.map(async (category) => {
    try {
      const res = await fetch(`${API_URL}/categories/${category.id}/products?page=1&limit=100`, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        productsMap[category.id] = data?.data || [];
      }
    } catch (error) {
      console.error(`Failed to fetch products for category ${category.id}:`, error);
      productsMap[category.id] = [];
    }
  });
  await Promise.all(promises);
  return productsMap;
}

export const metadata = {
  title: "Notre Catalogue - Sikbeauty",
  description: "Découvrez notre sélection de produits de beauté. Skincare, maquillage et accessoires pour une routine parfaite.",
};

export default async function Page() {
  const categories = await getCategories();
  const activeCategories = categories.filter(cat => cat.isActive !== false);
  const categoryProducts = await getCategoryProducts(activeCategories);

  return (
    <ClientDashboard 
      initialCategories={activeCategories} 
      initialCategoryProducts={categoryProducts} 
    />
  );
}
