const founderRepository = require('../repositories/founder.repository')
const assessmentRepository = require('../repositories/assessment.repository')
const { pushAdminNotification } = require('./notification.service')

function mapFounderData(body, deckFileName) {
  return {
    profileType: body.profile_type || null,
    fullName: body.full_name || null,
    email: body.email || null,
    phone: body.phone || null,
    linkedin: body.linkedin || null,
    companyName: body.company_name || null,
    sector: body.sector || null,
    stage: body.stage || null,
    capitalRequired: body.capital_required || null,
    oneLiner: body.one_liner || null,
    orgName: body.org_name || null,
    ticketSize: body.ticket_size || null,
    stagePref: body.stage_pref || null,
    geoPref: body.geo_pref || null,
    confidence: body.confidence || null,
    message: body.message || null,
    confirmAccuracy: body.confirm_accuracy === '1' || body.confirm_accuracy === true,
    deckFile: deckFileName,
  }
}

async function submitFounder(body, deckFileName, emitToAdmins) {
  const data = mapFounderData(body, deckFileName)

  await founderRepository.create({ ...data, reviewed: false })
  const evaluation = await assessmentRepository.create({
    ...data,
    reviewed: false,
    notes: '',
  })

  const notif = await pushAdminNotification({
    type: 'evaluation',
    title: 'فرم ارزیابی جدید',
    message: data.fullName
      ? `یک فرم ارزیابی جدید توسط ${data.fullName} ارسال شد و نیاز به بررسی دارد.`
      : 'یک فرم ارزیابی جدید ارسال شد و نیاز به بررسی دارد.',
    userId: data.email || null,
  })

  if (emitToAdmins) emitToAdmins('evaluation_submitted', { evaluation, notification: notif })
  return evaluation
}

module.exports = { submitFounder, mapFounderData }
