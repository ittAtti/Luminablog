
import { Article } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Future of Web Development in 2025',
    excerpt: 'Exploring how AI and edge computing are reshaping the digital landscape as we know it.',
    content: 'The web is evolving faster than ever. From serverless architectures to the rise of specialized AI models integrated directly into front-end frameworks, the tools at our disposal are becoming incredibly powerful. We are moving toward a world where the distinction between client and server is blurred, and performance is measured in microseconds at the edge.',
    author: 'Elena Vance',
    date: 'Oct 24, 2024',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/seed/tech/800/450',
    readTime: '6 min read'
  },
  {
    id: '2',
    title: 'Minimalism: A Path to Mental Clarity',
    excerpt: 'How reducing our physical and digital clutter can lead to a more focused and fulfilling creative life.',
    content: 'Minimalism is not just about having fewer things; it is about making room for what truly matters. In an age of information overload, the ability to selectively ignore is a superpower. By decluttering our workspaces and our minds, we unlock new levels of creativity and peace.',
    author: 'Julian Moore',
    date: 'Oct 22, 2024',
    category: 'Lifestyle',
    imageUrl: 'https://picsum.photos/seed/minimal/800/450',
    readTime: '4 min read'
  },
  {
    id: '3',
    title: 'Designing with Empathy',
    excerpt: 'Why user-centric design starts with understanding human emotions and accessibility needs.',
    content: 'Good design is invisible. It works so well that the user doesnt even notice it. But reaching that level of simplicity requires deep empathy. We must understand not just what the user wants to do, but how they feel when they are doing it.',
    author: 'Sarah Chen',
    date: 'Oct 20, 2024',
    category: 'Design',
    imageUrl: 'https://picsum.photos/seed/design/800/450',
    readTime: '8 min read'
  }
];

export const CATEGORIES: string[] = ['All', 'Technology', 'Lifestyle', 'Design', 'AI', 'Health'];
