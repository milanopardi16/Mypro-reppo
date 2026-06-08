'use client'

import PageLayout from '../components/PageLayout'
import { useSiteContent } from '../hooks/useSiteContent'

export default function ServicesPage() {
  const siteContent = useSiteContent()

  const services = siteContent.services || []

  return (
    <PageLayout title={siteContent.servicesPage.title} subtitle={siteContent.servicesPage.subtitle} badge={siteContent.servicesPage.badge}>
      <div className="cn-services-page-grid">
        {services.map((service) => (
          <div id={`service-${service.id}`} key={service.id} className="cn-service-page-card">
            <div className="cn-service-page-icon">
              <span style={{ fontSize: '28px' }}>{service.icon}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            {Array.isArray(service.items) && (
              <ul className="cn-service-items">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}