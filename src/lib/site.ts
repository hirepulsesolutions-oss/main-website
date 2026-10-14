import { COMPANY } from "./hirepulse";

export const SITE = {
  name: COMPANY.name,
  // The www address the live site is served from (the bare domain redirects to it). Fixed in code, not read
  // from env, so canonical URLs, the sitemap and structured data always point at the real pages.
  url: COMPANY.websiteUrl,
  description:
    "Hirepulse Solutions Pvt. Ltd. is a recruitment and staffing partner connecting fresh talent and experienced professionals with opportunities across IT and non-IT sectors in India.",
};

/** Search engines may index every build except Vercel preview deployments; no env setup needed. */
export const ALLOW_INDEXING = process.env.VERCEL_ENV !== "preview";

export const MAIN_NAV = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/service", label: "Services" },
  { href: "/hiring-scope", label: "Hiring Scope" },
  { href: "/contact", label: "Contact" },
];

export const FOOTER = [
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/service", label: "Services" },
      { href: "/hiring-scope", label: "Hiring Scope" },
      { href: "/recruitment-agency-ahmedabad", label: "Recruitment in Ahmedabad" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/service#lateral-recruitment", label: "Lateral recruitment" },
      { href: "/service#campus-fresher-hiring", label: "Campus & fresher hiring" },
      { href: "/service#hire-train-deploy", label: "Hire, Train, Deploy" },
      { href: "/service#bulk-location-hiring", label: "Bulk & location hiring" },
    ],
  },
  {
    title: "Contact",
    links: [
      { href: `mailto:${COMPANY.email}`, label: COMPANY.email },
      { href: COMPANY.websiteUrl, label: COMPANY.website },
      { href: "/contact", label: "Ahmedabad, Gujarat" },
    ],
  },
];

export const svg = (name: string) => `/svg/${name}.svg`;
export const ICON = {
  logo: "/brand/hirepulse-logo-280.webp",
  logo2x: "/brand/hirepulse-logo-560.webp",
  logoFull: "/brand/hirepulse-logo-full-320.webp",
  logoFull2x: "/brand/hirepulse-logo-full-640.webp",
  arrowWhite: svg("blxaxb60cg3s5kho0x1jqdwln28"),
  arrowInk: svg("utpvu16e41e7mhbu13cpkv6pagm"),
  chevron: svg("leigkdsk9e8drw8vty0tbzsnxr4"),
  wave: svg("v8pnh4dkyr06flh8hgqrdy6v0w"),
};
