import { COMPANY, FAQ, SERVICES } from "./hirepulse";
import { SITE } from "./site";

// Structured data (schema.org JSON-LD) for search engines. Facts come from src/lib/hirepulse.ts only.

const ORG_ID = `${SITE.url}/#organization`;
const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

export const PAGES = [
  { path: "/", name: "Home", priority: 1 },
  { path: "/service", name: "Services", priority: 0.9 },
  { path: "/hiring-scope", name: "Hiring Scope", priority: 0.8 },
  { path: "/recruitment-agency-ahmedabad", name: "Recruitment Agency in Ahmedabad", priority: 0.8 },
  { path: "/about-us", name: "About Us", priority: 0.7 },
  { path: "/contact", name: "Contact", priority: 0.7 },
] as const;

/** The company as a local business: an employment agency with its Ahmedabad registered office. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    "@id": ORG_ID,
    name: COMPANY.name,
    alternateName: "Hirepulse Solutions",
    slogan: COMPANY.tagline,
    description: SITE.description,
    url: SITE.url,
    logo: abs("/brand/hirepulse-logo-full-640.webp"),
    image: abs("/brand/og-image.jpg"),
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "501, Sapath Complex, Sarkhej - Gandhinagar Hwy, opp. Rajpath Club, Bodakdev",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      postalCode: "380015",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    department: COMPANY.branches.map((city) => ({
      "@type": "EmploymentAgency",
      name: `${COMPANY.name} – ${city}`,
      address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "IN" },
      parentOrganization: { "@id": ORG_ID },
    })),
    knowsAbout: ["IT recruitment", "Non-IT recruitment", "Campus hiring", "Fresher hiring", "Lateral hiring", "Bulk hiring", "Staffing"],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: "Hirepulse Solutions",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-IN",
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function faqLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.flatMap((t) => t.items).map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a.join(" ") },
    })),
  };
}

export function servicesLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SERVICES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.title,
        description: s.text,
        url: abs(`/service#${s.id}`),
        serviceType: "Recruitment and staffing",
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "India" },
      },
    })),
  };
}

const OG_IMAGE = { url: "/brand/og-image.jpg", width: 1200, height: 630, alt: "Hirepulse Solutions – Apki Job Hmari Zimmedari" };

/** Per-page metadata: keyword title, description, canonical URL and matching Open Graph / Twitter cards. */
export function pageMeta({ title, description, path, keywords }: { title: string; description: string; path: string; keywords?: string[] }) {
  const fullTitle = path === "/" ? title : `${title} – Hirepulse Solutions`;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { type: "website" as const, siteName: "Hirepulse Solutions", locale: "en_IN", url: path, title: fullTitle, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image" as const, title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
