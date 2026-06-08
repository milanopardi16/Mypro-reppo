const { prisma } = require('../prisma/client')
const { toAssessmentDto } = require('../utils/helpers')

async function findAll() {
  const rows = await prisma.assessment.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toAssessmentDto)
}

async function findById(id) {
  const row = await prisma.assessment.findUnique({ where: { id } })
  return row ? toAssessmentDto(row) : null
}

async function create(data) {
  const row = await prisma.assessment.create({ data })
  return toAssessmentDto(row)
}

async function update(id, { reviewed, notes }) {
  const current = await prisma.assessment.findUnique({ where: { id } })
  if (!current) return null
  const row = await prisma.assessment.update({
    where: { id },
    data: {
      reviewed: typeof reviewed === 'boolean' ? reviewed : current.reviewed,
      notes: notes !== undefined ? String(notes || '') : current.notes,
    },
  })
  return toAssessmentDto(row)
}

async function bulkUpdate(ids, { reviewed, notes }) {
  let updatedCount = 0
  const results = []
  for (const id of ids) {
    const updated = await update(id, { reviewed, notes })
    if (updated) {
      updatedCount += 1
      results.push(updated)
    }
  }
  const all = await findAll()
  return { updatedCount, evaluations: all }
}

async function pendingCount() {
  return prisma.assessment.count({ where: { reviewed: false } })
}

module.exports = { findAll, findById, create, update, bulkUpdate, pendingCount }
