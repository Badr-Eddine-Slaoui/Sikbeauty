import ProductDetails from "@/pages/products/ProductDetails";
import StructuredData from "@/components/SEO/StructuredData";

const API_URL = process.env.INTERNAL_API_URL || "http://back-end:3000/api/v1";

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      const products = data?.data || data || [];
      return products.map((product) => ({
        id: product.id.toString(),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch products for static params:", error);
  }
  return [];
}

async function getProduct(id) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      return data?.data || data;
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (product) {
    const title = product.title || product.name || "Product Details";
    const description = product.description || `Buy ${title} at Sikbeauty.`;
    const image = product.thumbnailUrl || product.primaryImage || product.image || "/og-image.jpg";

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [
          {
            url: image,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
      },
      twitter: {
        title: title,
        description: description,
        images: [image],
      },
    };
  }

  return {
    title: "Product Details",
    description: "View product details.",
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title || product.name,
    "description": product.description,
    "image": product.thumbnailUrl,
    "offers": {
      "@type": "Offer",
      "price": product.finalPrice || product.price,
      "priceCurrency": "USD",
      "availability": product.status ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

  return (
    <>
      {jsonLd && <StructuredData data={jsonLd} />}
      <ProductDetails initialProduct={product} />
    </>
  );
}
