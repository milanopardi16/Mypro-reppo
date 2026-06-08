const { prisma } = require('../prisma/client')
const { toFounderDto } = require('../utils/helpers')

async function findAll() {
  const rows = await prisma.founderSubmission.findMany({ orderBy: { createdAt: 'desc' } })
  return rows.map(toFounderDto)
}

async function create(data) {
  const row = await prisma.founderSubmission.create({ data })
  return toFounderDto(row)
}

module.exports = { findAll, create }
