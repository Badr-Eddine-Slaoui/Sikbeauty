import BlogDetailsPage from "@/pages/blog/BlogDetailsPage";

async function getBlog(slug) {
  try {
    const res = await fetch(`http://back-end:3000/api/v1/blogs/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data || data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (blog) {
    const title = blog.title || "Blog Post";
    const description = blog.excerpt || blog.description || `Lire ${title} sur Sikbeauty.`;
    const image = blog.thumbnailUrl || "/og-image.jpg";

    return {
      title: `${title} | Sikbeauty Blog`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        type: "article",
        images: [{ url: image }],
      },
    };
  }

  return {
    title: "Blog Details | Sikbeauty",
    description: "Découvrez nos articles sur la beauté coréenne.",
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  return (
    <BlogDetailsPage initialBlog={blog} />
  );
}
