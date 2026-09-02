import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { 
  ChevronLeft, 
  FileText, 
  Clock, 
  Tag, 
  ExternalLink,
  Github
} from 'lucide-react'

const DOCS_DIR = path.join(process.cwd(), '../docs')

interface DocMeta {
  title: string
  description: string
  category: string
  startHere?: boolean
  order?: number
}

async function getDoc(slug: string) {
  const filePath = path.join(DOCS_DIR, `${slug}.md`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const { data, content: markdownContent } = matter(content)
  
  const processedContent = await remark().use(html).process(markdownContent)
  const contentHtml = processedContent.toString()
  
  return {
    slug,
    meta: data as DocMeta,
    contentHtml,
    rawContent: markdownContent,
  }
}

export async function generateStaticParams() {
  if (!fs.existsSync(DOCS_DIR)) return []
  
  const files = fs.readdirSync(DOCS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''))
  
  return files.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const doc = await getDoc(params.slug)
  
  if (!doc) {
    return { title: 'Not Found' }
  }
  
  return {
    title: `${doc.meta.title} | Beli MVP Docs`,
    description: doc.meta.description,
  }
}

export default async function DocPage({ params }: { params: { slug: string } }) {
  const doc = await getDoc(params.slug)
  
  if (!doc) {
    notFound()
  }
  
  const { slug, meta, contentHtml } = doc
  
  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Docs
            </Link>
            <a 
              href={`https://github.com/edit/main/beli-mvp/docs/${slug}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Github className="w-4 h-4" />
              Edit
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta */}
        <header className="mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {meta.startHere && (
              <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full">
                Start Here
              </span>
            )}
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full capitalize">
              {meta.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {meta.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            {meta.description}
          </p>
        </header>

        {/* Markdown Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        
        {/* Footer Navigation */}
        <nav className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <ChevronLeft className="w-4 h-4" />
            All Documents
          </Link>
          <a 
            href={`https://github.com/edit/main/beli-mvp/docs/${slug}.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Edit on GitHub
          </a>
        </nav>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Part of the Beli MVP Specification</p>
        </div>
      </footer>
    </article>
  )
}