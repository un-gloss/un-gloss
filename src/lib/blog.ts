import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkJargon from './remark-jargon';

const postsDirectory = path.join(process.cwd(), 'content', 'blog');

export interface BlogPostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    category: string;
    contentHtml?: string;
}

export function getSortedPostsData(): BlogPostData[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    // Get file names under /content/blog
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the slug
            return {
                slug,
                title: matterResult.data.title,
                date: matterResult.data.date,
                excerpt: matterResult.data.excerpt,
                category: matterResult.data.category,
            } as BlogPostData;
        });

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            return {
                slug: fileName.replace(/\.md$/, '')
            };
        });
}

export async function getPostData(slug: string): Promise<BlogPostData | null> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string, passing it through our custom auto-linker first
    const processedContent = await remark()
        .use(remarkJargon)
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the slug and contentHtml
    return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt,
        category: matterResult.data.category,
        contentHtml,
    };
}
