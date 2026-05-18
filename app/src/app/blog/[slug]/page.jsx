import BlogDetailsPage from "@/views/blog/BlogDetailsPage";
import { internalFetch } from "@/utils/internalFetch";

async function getBlog(slug) {
  try {
    const res = await internalFetch(`/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
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
