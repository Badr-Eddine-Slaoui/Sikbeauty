export default async function sitemap() {
  const baseUrl = "https://sikbeauty.com";
  // We use the internal Docker host 'back-end' because this runs in the Next.js server container
  const apiUrl = "http://back-end:3000/api/v1";

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/client/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    // Fetch products
    const productsRes = await fetch(`${apiUrl}/products`, { cache: 'no-store' });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      const products = Array.isArray(productsData?.data) ? productsData.data : [];

      products.forEach((product) => {
        const id = product.id || product._id;
        if (id) {
          routes.push({
            url: `${baseUrl}/products/${id}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }

    // Fetch blogs
    const blogsRes = await fetch(`${apiUrl}/blogs`, { cache: 'no-store' });
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json();
      const blogs = Array.isArray(blogsData?.data) ? blogsData.data : (Array.isArray(blogsData) ? blogsData : []);

      blogs.forEach((blog) => {
        const slug = blog.slug || blog.id || blog._id;
        if (slug) {
          routes.push({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return routes;
}
