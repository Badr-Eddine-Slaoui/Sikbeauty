import BlogListPage from "@/views/blog/BlogListPage";
import { internalFetch } from "@/utils/internalFetch";

async function getBlogs(page = 1) {
  try {
    const res = await internalFetch(`/blogs?page=${page}&limit=9`, { next: { revalidate: 3600 } });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }
  return null;
}

export const metadata = {
  title: "Le Blog Beauté - Sikbeauty",
  description: "Découvrez nos astuces, tutoriels et nouveautés beauté sur le blog officiel de Sikbeauty.",
};

export default async function Page() {
  const blogsData = await getBlogs(1);
  
  return (
    <BlogListPage initialBlogsData={blogsData} />
  );
}
