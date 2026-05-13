import BlogDetailsPage from "@/pages/blog/BlogDetailsPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const res = await fetch(`http://back-end:3000/api/v1/blogs/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const blog = data?.data || data;

      if (blog) {
        const title = blog.title || blog.name || "Blog Post";
        const description = blog.description || blog.excerpt || `Read ${title} at Sikbeauty.`;
        const image = blog.thumbnailUrl || blog.image || "/og-image.jpg";

        return {
          title: title,
          description: description,
          openGraph: {
            title: title,
            description: description,
            type: "article",
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
    console.error("Failed to fetch blog for metadata:", error);
  }

  return {
    title: "Blog Details",
    description: "Read blog post details.",
  };
}

export default function Page() {
  return (
    <BlogDetailsPage />
  );
}
