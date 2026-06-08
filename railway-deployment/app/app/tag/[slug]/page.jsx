import PageLayout from '../../components/PageLayout'
import BlogList from '../../components/blog/BlogList'
import blogPosts from '../../data/blog-posts'

export async function generateStaticParams() {
  const tags = new Set()
  getSavedBlogPosts().forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  const slugs = Array.from(tags).map((tag) => ({
    slug: encodeURIComponent(tag),
  }))
  // Static export requires at least one path when output: 'export'
  return slugs.length ? slugs : [{ slug: '_empty' }]
}

export default function TagPage({ params }) {
  const raw = params.slug
  const tag = decodeURIComponent(raw)
  const posts = (Array.isArray(blogPosts) ? blogPosts : []).filter((p) => (p.tags || []).includes(tag))

  return (
    <PageLayout title={`برچسب: ${tag}`} subtitle={`مقالات مرتبط با «${tag}»`}>
      <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 20px' }}>
        <BlogList posts={posts} />
      </div>
    </PageLayout>
  )
}
