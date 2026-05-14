import BlogListPage from "@/pages/blog/BlogListPage";

const API_URL = process.env.INTERNAL_API_URL || "http://back-end:3000/api/v1";

async function getBlogs(page = 1) {
  try {
    const res = await fetch(`${API_URL}/blogs?page=${page}&limit=9`, { next: { revalidate: 3600 } });
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
