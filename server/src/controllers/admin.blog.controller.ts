import { Request, Response }    from 'express';
import { StatusCodes }          from 'http-status-codes';

import {
    createBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    getLatestBlogs,
    getPublishedBlogs,
    updateBlog,
    updateBlogThumbnail,
}                               from '../services/admin.blog.service';
import { BlogPagination, CreateBlog, UpdateBlog } from '../schemas/blog.schema';
import { ParamId }              from '../utils/schemas.util';
import { AppError }             from '../utils/AppErros';

// Create new blog (Admin)
export const createBlogController = async (req: Request, res: Response) => {
    const body = req.body as CreateBlog;
    const file = req.file;
    
    if (!file) {
        throw new AppError('Thumbnail image is required', 400);
    }
    
    const blog = await createBlog(body, file);
    
    res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Blog created successfully',
        data: blog,
    });
};

// Get all blogs with pagination (Admin)
export const getAllBlogsController = async (req: Request, res: Response) => {
    const query = req.query as BlogPagination;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const published = query.published || 'all';
    
    const result = await getAllBlogs(page, limit, published as 'true' | 'false' | 'all');
    
    res.status(StatusCodes.OK).json(result);
};

// Get blog by ID (Admin)
export const getBlogByIdController = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as ParamId;
    
    const blog = await getBlogById(Number(id));
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: blog,
    });
};

// Update blog (Admin)
export const updateBlogController = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as ParamId;
    const body = req.body as UpdateBlog;
    
    if (Object.keys(body).length === 0) {
        res.status(StatusCodes.OK).json({
            status: 'success',
            message: 'No changes were made',
        });
        return;
    }
    
    const blog = await updateBlog(Number(id), body);
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Blog updated successfully',
        data: blog,
    });
};

// Update blog thumbnail (Admin)
export const updateBlogThumbnailController = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as ParamId;
    const file = req.file;
    
    if (!file) {
        throw new AppError('Thumbnail image is required', 400);
    }
    
    const blog = await updateBlogThumbnail(Number(id), file);
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Blog thumbnail updated successfully',
        data: blog,
    });
};

// Delete blog (Admin)
export const deleteBlogController = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as ParamId;
    
    await deleteBlog(Number(id));
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Blog deleted successfully',
    });
};

// Get published blogs with pagination (Public)
export const getPublishedBlogsController = async (req: Request, res: Response) => {
    const query = req.query as BlogPagination;
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    
    const result = await getPublishedBlogs(page, limit);
    
    res.status(StatusCodes.OK).json(result);
};

// Get blog by slug (Public)
export const getBlogBySlugController = async (req: Request, res: Response) => {
    const { slug } = req.params;
    
    const blog = await getBlogBySlug(slug);
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: blog,
    });
};

// Get latest blogs for slider (Public)
export const getLatestBlogsController = async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string || '6', 10);
    
    const blogs = await getLatestBlogs(limit);
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        data: blogs,
    });
};
