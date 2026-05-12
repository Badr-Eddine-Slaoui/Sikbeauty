import prisma               from '../db/setup';
import { CreateBlog, UpdateBlog } from '../schemas/blog.schema';
import { AppError }         from '../utils/AppErros';
import { deleteFileFromStorage, saveFileToStorage } from './admin.products.service';

// Generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Create new blog
export const createBlog = async (
    body: CreateBlog,
    thumbnailFile: Express.Multer.File
) => {
    const slug = generateSlug(body.title);
    
    // Check if slug already exists
    const existingBlog = await prisma.blog.findUnique({
        where: { slug },
    });
    
    if (existingBlog) {
        throw new AppError('A blog with this title already exists', 400);
    }
    
    // Save thumbnail
    const thumbnailUrl = await saveFileToStorage(thumbnailFile, 'uploads/images');
    
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            slug,
            content: body.content,
            excerpt: body.excerpt || null,
            thumbnailUrl,
            isPublished: body.isPublished === true || body.isPublished === 'true' as unknown as boolean,
        },
    });
    
    return blog;
};

// Get all blogs with pagination (admin)
export const getAllBlogs = async (
    page: number,
    limit: number,
    publishedFilter: 'true' | 'false' | 'all'
) => {
    const skip = (page - 1) * limit;
    
    const where = publishedFilter === 'all' 
        ? {} 
        : { isPublished: publishedFilter === 'true' };
    
    const [total, blogs] = await Promise.all([
        prisma.blog.count({ where }),
        prisma.blog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
        pageInfo: {
            currentPage: page,
            pageSize: limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
        },
        data: blogs,
    };
};

// Get published blogs (public)
export const getPublishedBlogs = async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    
    const [total, blogs] = await Promise.all([
        prisma.blog.count({ where: { isPublished: true } }),
        prisma.blog.findMany({
            where: { isPublished: true },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                excerpt: true,
                thumbnailUrl: true,
                createdAt: true,
            },
        }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
        pageInfo: {
            currentPage: page,
            pageSize: limit,
            totalItems: total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            previousPage: page > 1 ? page - 1 : null,
        },
        data: blogs,
    };
};

// Get blog by ID (admin)
export const getBlogById = async (id: number) => {
    const blog = await prisma.blog.findUnique({
        where: { id },
    });
    
    if (!blog) {
        throw new AppError('Blog not found', 404);
    }
    
    return blog;
};

// Get blog by slug (public)
export const getBlogBySlug = async (slug: string) => {
    const blog = await prisma.blog.findUnique({
        where: { slug, isPublished: true },
    });
    
    if (!blog) {
        throw new AppError('Blog not found', 404);
    }
    
    return blog;
};

// Update blog
export const updateBlog = async (id: number, body: UpdateBlog) => {
    // Check blog exists
    await getBlogById(id);
    
    // If title is being updated, update slug too
    let updateData: any = { ...body };
    
    // Convert isPublished string to boolean if present
    if (updateData.isPublished !== undefined) {
        updateData.isPublished = updateData.isPublished === true || updateData.isPublished === 'true';
    }
    
    if (body.title) {
        const newSlug = generateSlug(body.title);
        
        // Check if new slug already exists (excluding current blog)
        const existingBlog = await prisma.blog.findFirst({
            where: {
                slug: newSlug,
                NOT: { id },
            },
        });
        
        if (existingBlog) {
            throw new AppError('A blog with this title already exists', 400);
        }
        
        updateData.slug = newSlug;
    }
    
    const blog = await prisma.blog.update({
        where: { id },
        data: updateData,
    });
    
    return blog;
};

// Update blog thumbnail
export const updateBlogThumbnail = async (
    id: number,
    thumbnailFile: Express.Multer.File
) => {
    const blog = await getBlogById(id);
    
    // Delete old thumbnail
    await deleteFileFromStorage(blog.thumbnailUrl);
    
    // Save new thumbnail
    const thumbnailUrl = await saveFileToStorage(thumbnailFile, 'uploads/images');
    
    const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { thumbnailUrl },
    });
    
    return updatedBlog;
};

// Delete blog
export const deleteBlog = async (id: number) => {
    const blog = await getBlogById(id);
    
    // Delete thumbnail from storage
    await deleteFileFromStorage(blog.thumbnailUrl);
    
    await prisma.blog.delete({
        where: { id },
    });
};

// Get latest published blogs (for slider)
export const getLatestBlogs = async (limit: number = 6) => {
    const blogs = await prisma.blog.findMany({
        where: { isPublished: true },
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            thumbnailUrl: true,
            createdAt: true,
        },
    });
    
    return blogs;
};
