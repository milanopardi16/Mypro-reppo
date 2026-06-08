import PageLayout from '../../components/PageLayout'
import BlogList from '../../components/blog/BlogList'
import blogPosts, { categories } from '../../data/blog-posts'

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: encodeURIComponent(category),
  }))
}

export default function CategoryPage({ params }) {
  const raw = params.slug
  const decoded = decodeURIComponent(raw)
  const category = categories.find(c => encodeURIComponent(c) === raw || c === raw || c === decoded) || decoded
  const posts = (Array.isArray(blogPosts) ? blogPosts : []).filter((p) => p.category === category)

  return (
    <PageLayout title={`دسته‌بندی: ${category}`} subtitle={`مقالات مرتبط با ${category}`}>
      <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 20px' }}>
        <BlogList posts={posts} />
      </div>
    </PageLayout>
  )
}
