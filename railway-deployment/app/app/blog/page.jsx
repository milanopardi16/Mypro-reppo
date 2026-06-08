import PageLayout from '../components/PageLayout'
import BlogHero from '../components/blog/BlogHero'
import BlogApp from '../components/blog/BlogApp'
import blogPosts, { categories, allTags } from '../data/blog-posts'

export default function Page() {
  const posts = Array.isArray(blogPosts) ? blogPosts : []

  return (
    <>
      <div className="cn-site-background" aria-hidden="true">
        <span className="cn-gradient-orb cn-orb-1"></span>
        <span className="cn-gradient-orb cn-orb-2"></span>
        <span className="cn-grid-pattern"></span>
      </div>
      <PageLayout>
        <BlogHero total={posts.length} />

        <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px' }}>
          <BlogApp initialPosts={posts} categories={categories} tags={allTags} />
        </div>
      </PageLayout>
    </>
  )
}
