const { prisma } = require('../prisma/client')
const { toBlogPostDto, normalizeString, generateId } = require('../utils/helpers')

async function findPublished() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return rows
    .map(toBlogPostDto)
    .filter((post) => {
      const status = String(post.status || '').toLowerCase()
      return !status || status === 'published' || status.includes('منتشر') || status.includes('publish')
    })
}

async function findAll() {
  const rows = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toBlogPostDto)
}

async function create(body) {
  const row = await prisma.blogPost.create({
    data: {
      id: normalizeString(body.id) || generateId(),
      slug: normalizeString(body.slug) || null,
      title: normalizeString(body.title) || 'بدون عنوان',
      excerpt: normalizeString(body.excerpt) || '',
      content: normalizeString(body.content) || '',
      coverImage: normalizeString(body.coverImage) || null,
      tags: Array.isArray(body.tags) ? body.tags.map((t) => normalizeString(t)).filter(Boolean) : [],
      category: normalizeString(body.category) || null,
      status: normalizeString(body.status) || 'draft',
    },
  })
  return toBlogPostDto(row)
}

async function update(id, body) {
  const current = await prisma.blogPost.findUnique({ where: { id } })
  if (!current) return null
  const row = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: body.slug !== undefined ? normalizeString(body.slug) || null : current.slug,
      title: body.title !== undefined ? normalizeString(body.title) : current.title,
      excerpt: body.excerpt !== undefined ? normalizeString(body.excerpt) : current.excerpt,
      content: body.content !== undefined ? normalizeString(body.content) : current.content,
      coverImage: body.coverImage !== undefined ? normalizeString(body.coverImage) || null : current.coverImage,
      tags: Array.isArray(body.tags) ? body.tags.map((t) => normalizeString(t)).filter(Boolean) : current.tags,
      category: body.category !== undefined ? normalizeString(body.category) || null : current.category,
      status: body.status !== undefined ? normalizeString(body.status) : current.status,
    },
  })
  return toBlogPostDto(row)
}

async function remove(id) {
  await prisma.blogPost.delete({ where: { id } })
}

module.exports = { findPublished, findAll, create, update, remove }
