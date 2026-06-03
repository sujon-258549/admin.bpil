import { Helmet } from "react-helmet-async"

interface SEOProps {
  title: string
  description?: string
  keywords?: string
}

export function SEO({ title, description, keywords }: SEOProps) {
  const fullTitle = `${title} | Muster ERP & CRM`
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  )
}
