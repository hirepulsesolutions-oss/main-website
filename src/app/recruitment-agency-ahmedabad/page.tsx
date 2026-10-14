import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/ContactCta";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Split } from "@/components/Split";
import { COMPANY, HIRING_SCOPE, KEY_STATS, SERVICES } from "@/lib/hirepulse";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Recruitment Agency in Ahmedabad, Gujarat – IT & Non-IT Staffing",
  description:
    "Hirepulse Solutions is a recruitment and staffing agency in Bodakdev, Ahmedabad. We hire IT and non-IT talent for businesses in Gujarat and across India: freshers, lateral hires and bulk hiring.",
  path: "/recruitment-agency-ahmedabad",
  keywords: ["recruitment agency in Ahmedabad", "staffing agency Ahmedabad", "placement consultancy Ahmedabad", "IT recruitment Gujarat", "fresher hiring Ahmedabad"],
});

export default function AhmedabadPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Recruitment Agency in Ahmedabad", path: "/recruitment-agency-ahmedabad" }])} />
      <PageHero
        title={"Recruitment agency in Ahmedabad."}
        text="Hirepulse Solutions is headquartered in Bodakdev, Ahmedabad, and recruits IT and non-IT talent for businesses in Gujarat and across India."
      />

      <section className="section">
        <div className="container">
          <span className="eyebrow">Hiring support from Ahmedabad</span>
          <Split as="h2" className="h2" text="Staffing Services for Gujarat Businesses" />
          <div className="scope-cards" style={{ marginTop: 40 }}>
            {SERVICES.map((s) => (
              <article className="scope-card" key={s.id} data-reveal="group">
                <h3 className="h4">
                  <Link href={`/service#${s.id}`}>{s.title}</Link>
                </h3>
                <p className="t-s">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <span className="eyebrow">Roles we recruit for</span>
          <h2 className="h2">IT and Non-IT Hiring in Ahmedabad</h2>
          <div className="scope-cards" style={{ marginTop: 40 }}>
            {[HIRING_SCOPE.it, HIRING_SCOPE.nonIt].map((g) => (
              <article className="scope-card" key={g.label} data-reveal="group">
                <span className="label">{g.label}</span>
                <h3 className="h4">{g.title}</h3>
                <ul>
                  {g.roles.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <ul className="t-r" style={{ marginTop: 32 }}>
            {KEY_STATS.map((s) => (
              <li key={s.label}>
                {s.value}
                {s.suffix} {s.label.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Visit us</span>
          <h2 className="h2">Our Ahmedabad Office</h2>
          <address className="t-r" style={{ marginTop: 16, fontStyle: "normal" }}>
            {COMPANY.office.map((line) => (
              <span key={line} style={{ display: "block" }}>
                {line}
              </span>
            ))}
          </address>
          <p className="t-r" style={{ marginTop: 16 }}>
            Email <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or <Link href="/contact">send us your hiring brief</Link>. We also have branch
            offices in {COMPANY.branches.join(", ")}.
          </p>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
