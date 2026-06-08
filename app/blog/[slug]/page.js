import PageLayout from '../../components/PageLayout'
import Image from '@/src/router-shims/Image'
import FetchPostClient from '../FetchPostClient'
import blogPosts from '../../data/blog-posts'
import { toJalali } from '../../../lib/formatDate'

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  const posts = getSavedBlogPosts().filter(isPublishedPost)
  const slugs = posts.map((post) => ({
    slug: post.slug || String(post.id),
  }))
  return slugs.length ? slugs : [{ slug: '_empty' }]
}

export default function PostPage({ params }) {
  const posts = Array.isArray(blogPosts) ? blogPosts : []
  const post = posts.find((p) => p.slug === params.slug || String(p.id) === params.slug)
  if (!post) {
    const slug = params.slug
    return (
      <PageLayout title="مطلب یافت نشد">
        <FetchPostClient slug={slug} />
      </PageLayout>
    )
  }

  const imgSrc = post.image || '/capital-network-logo.svg'

  return (
    <PageLayout title={post.title} subtitle={post.excerpt} badge={post.category}>
      <div style={{color:'#6b7280', marginTop:8}}>{post.author} • {toJalali(post.date)} • {post.readTime}</div>

      <article style={{marginTop:18}}>
        <div style={{borderRadius:12, overflow:'hidden'}}>
          {String(imgSrc).startsWith('http') ? (
            <img src={imgSrc} alt={post.title} style={{width:'100%',height:'auto',objectFit:'cover'}} />
          ) : (
            <Image src={imgSrc} alt={post.title} width={1200} height={520} style={{width:'100%',height:'auto',objectFit:'cover'}} />
          )}
        </div>

        <div style={{marginTop:18, lineHeight:1.8}}>
          <p>{post.content}</p>
        </div>
      </article>
    </PageLayout>
  )
}
