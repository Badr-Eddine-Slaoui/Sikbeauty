import ProductDetails from "@/pages/products/ProductDetails";

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const res = await fetch(`http://back-end:3000/api/v1/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const product = data?.data || data;

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
    }
  } catch (error) {
    console.error("Failed to fetch product for metadata:", error);
  }

  return {
    title: "Product Details",
    description: "View product details.",
  };
}

export default function Page() {
  return (
    <ProductDetails />
  );
}
