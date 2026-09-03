import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { 
  FileText, 
  BookOpen, 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Layout, 
  Settings,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

const DOCS_DIR = path.join(process.cwd(), 'docs')

interface DocMeta {
  title: string
  description: string
  category: string
  startHere?: boolean
  order?: number
}

interface DocFile {
  slug: string
  meta: DocMeta
}

const CATEGORIES = [
  { key: 'start', label: 'Start Here', icon: Zap, color: 'text-amber-500' },
  { key: 'product', label: 'Product', icon: BookOpen, color: 'text-blue-500' },
  { key: 'architecture', label: 'Architecture', icon: Layout, color: 'text-purple-500' },
  { key: 'data', label: 'Data & API', icon: Database, color: 'text-green-500' },
  { key: 'logic', label: 'Logic & Algorithms', icon: Code, color: 'text-orange-500' },
  { key: 'implementation', label: 'Implementation', icon: Settings, color: 'text-pink-500' },
  { key: 'quality', label: 'Quality & Future', icon: Shield, color: 'text-red-500' },
] as const

const DOC_CATEGORIES: Record<string, string> = {
  'EXECUTIVE_SUMMARY': 'start',
  'PRODUCT_SUMMARY': 'product',
  'MVP_SCOPE': 'product',
  'USER_FLOWS': 'product',
  'SCREENS': 'product',
  'TECH_STACK': 'architecture',
  'BACKEND_ARCHITECTURE': 'architecture',
  'FRONTEND_ARCHITECTURE': 'architecture',
  'DATABASE_SCHEMA': 'data',
  'API_ROUTES': 'data',
  'DATA_MODELS': 'data',
  'SCORING_LOGIC': 'logic',
  'SEED_DATA': 'data',
  'FOLDER_STRUCTURE': 'implementation',
  'BUILD_ORDER': 'implementation',
  'FIRST_FILES': 'implementation',
  'UI_COMPONENTS': 'implementation',
  'DESIGN_DIRECTION': 'implementation',
  'ANTI_SPAM': 'quality',
  'EDGE_CASES': 'quality',
  'FUTURE_UPGRADES': 'quality',
}

function getAllDocs(): DocFile[] {
  if (!fs.existsSync(DOCS_DIR)) return []
  
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md'))
  
  return files.map(file => {
    const content = fs.readFileSync(path.join(DOCS_DIR, file), 'utf-8')
    const { data } = matter(content)
    const slug = file.replace('.md', '')
    
    return {
      slug,
      meta: {
        title: data.title || slug.replace(/_/g, ' '),
        description: data.description || '',
        category: DOC_CATEGORIES[slug] || 'other',
        startHere: data.startHere || false,
        order: data.order || 999,
      },
    }
  }).sort((a, b) => {
    if (a.meta.startHere && !b.meta.startHere) return -1
    if (!a.meta.startHere && b.meta.startHere) return 1
    return a.meta.order - b.meta.order
  })
}

export default function HomePage() {
  const docs = getAllDocs()
  const categorized = CATEGORIES.map(cat => ({
    ...cat,
    docs: docs.filter(d => d.meta.category === cat.key),
  })).filter(cat => cat.docs.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Beli MVP Docs</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Menu Item Price-Value Discovery Platform</p>
              </div>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ExternalLink className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                <Zap className="w-4 h-4" />
                Implementation-Ready Specification
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Complete MVP Specification for <span className="text-amber-200">Beli</span>
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                A menu item price-value discovery platform where users review specific dishes, 
                revealing whether each item is actually worth its listed price. 
                21 detailed specification documents covering product, architecture, data, algorithms, and implementation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/docs/EXECUTIVE_SUMMARY"
                  className="inline-flex items-center gap-2 bg-white text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Start Building →
                </Link>
                <Link 
                  href="/docs/PRODUCT_SUMMARY"
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Read Product Vision
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard value={docs.length} label="Spec Documents" icon={FileText} />
          <StatCard value="5" label="Weeks to MVP" icon={Zap} />
          <StatCard value="56h" label="Est. Build Time" icon={Settings} />
          <StatCard value="10" label="Seed Restaurants" icon={Database} />
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {categorized.map(category => (
            <CategorySection key={category.key} category={category} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Build?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Start with <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">EXECUTIVE_SUMMARY.md</code> — it has the stack, MLP definition, and first 10 concrete tasks with time estimates.
          </p>
          <Link 
            href="/docs/EXECUTIVE_SUMMARY"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Read Executive Summary
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Beli MVP Documentation — Know what&apos;s worth it.</p>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ value, label, icon: Icon }: { value: string | number; label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
        <Icon className="w-10 h-10 text-brand-500" />
      </div>
    </div>
  )
}

function CategorySection({ category }: { category: { key: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string; docs: DocFile[] } }) {
  const { label, icon: Icon, color, docs } = category
  
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Icon className={`w-6 h-6 ${color}`} />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{label}</h2>
        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
          {docs.length} docs
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map(doc => (
          <DocCard key={doc.slug} doc={doc} />
        ))}
      </div>
    </section>
  )
}

function DocCard({ doc }: { doc: DocFile }) {
  const { slug, meta } = doc
  
  return (
    <Link 
      href={`/docs/${slug}`}
      className="group bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transition-all duration-200 flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex-1 pr-4">
          {meta.title}
          {meta.startHere && (
            <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded">
              Start Here
            </span>
          )}
        </h3>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors flex-shrink-0" />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 flex-1">
        {meta.description || 'No description available.'}
      </p>
    </Link>
  )
}