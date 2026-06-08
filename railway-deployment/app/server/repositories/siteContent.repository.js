const { prisma } = require('../prisma/client')

const MAIN_ID = 'main'

async function getContent() {
  const row = await prisma.siteContent.findUnique({ where: { id: MAIN_ID } })
  return row?.content || {}
}

async function setContent(content) {
  const row = await prisma.siteContent.upsert({
    where: { id: MAIN_ID },
    update: { content },
    create: { id: MAIN_ID, content },
  })
  return row.content
}

async function updateSection(section, data) {
  const current = await getContent()
  const updated = { ...(current || {}), [section]: data }
  return setContent(updated)
}

module.exports = { getContent, setContent, updateSection }
