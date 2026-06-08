'use client'

import { useEffect, useState } from 'react'

export default function FetchPostClient({ slug }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/blogs')
        const data = await res.json()
        const found = (data || []).find((p) => p.slug === slug || String(p.id) === slug)
        if (mounted) setPost(found || null)
      } catch (e) {
        if (mounted) setPost(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [slug])

  if (loading) return <p>در حال بارگذاری...</p>
  if (!post) return <p>مطلب مورد نظر یافت نشد.</p>

  const imgSrc = post.image || '/capital-network-logo.svg'

  return (
    <article style={{marginTop:18}}>
      <div style={{borderRadius:12, overflow:'hidden'}}>
        {String(imgSrc).startsWith('http') ? (
          <img src={imgSrc} alt={post.title} style={{width:'100%',height:'auto',objectFit:'cover'}} />
        ) : (
          <img src={imgSrc} alt={post.title} style={{width:'100%',height:'auto',objectFit:'cover'}} />
        )}
      </div>

      <div style={{marginTop:18, lineHeight:1.8}}>
        <p>{post.content}</p>
      </div>
    </article>
  )
}
