import { PrismaClient, Role, PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@afgtech.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!Now2026";
  const adminName = process.env.SEED_ADMIN_NAME ?? "AFG Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "AFG Tech",
      tagline: "Software that drives outcomes.",
      email: "hello@afgtech.com",
      phone: "+1 (817) 555-0188",
      address: "Grapevine, TX 76051",
      socials: {
        linkedin: "https://www.linkedin.com/company/afgtech",
        github: "https://github.com/afgtech",
        twitter: "https://twitter.com/afgtech",
      },
    },
  });

  // ---- Industries ----
  const industries = [
    { slug: "automotive", name: "Automotive", icon: "Car", description: "Dealer platforms, inventory systems, and customer experience tooling for the automotive industry.", order: 1 },
    { slug: "healthcare", name: "Healthcare", icon: "HeartPulse", description: "HIPAA-aware patient platforms, scheduling, and revenue cycle integrations for clinics and providers.", order: 2 },
    { slug: "sports", name: "Sports", icon: "Trophy", description: "League management, fan engagement, and ticketing experiences for teams and venues.", order: 3 },
    { slug: "nonprofit", name: "Nonprofit", icon: "HandHeart", description: "Donor portals, volunteer management, and grant reporting tools that stretch every dollar.", order: 4 },
  ];
  for (const i of industries) {
    await prisma.industry.upsert({ where: { slug: i.slug }, update: i, create: i });
  }

  // ---- Services ----
  const services = [
    {
      slug: "web-applications",
      title: "Web Applications",
      icon: "Globe",
      shortDesc: "Production-grade Next.js, React, and Node platforms built for scale.",
      body: "<p>We design and ship web applications that hold up under load, traffic, and audit. From customer portals to internal operations tools, every project is delivered with TypeScript, automated tests, observability baked in, and a deployment pipeline you can trust on day one.</p>",
      features: ["Next.js & React", "Node / Go APIs", "PostgreSQL & Redis", "CI/CD & observability"],
      order: 1,
    },
    {
      slug: "mobile-apps",
      title: "Mobile Apps",
      icon: "Smartphone",
      shortDesc: "iOS, Android, and cross-platform apps that feel native.",
      body: "<p>Native and React Native applications engineered for performance, offline-first behavior, and store-day-one shipability. We handle the full lifecycle: discovery, design, build, app-store submission, and post-launch iteration.</p>",
      features: ["React Native & Swift", "Offline-first sync", "Push & deep links", "App Store / Play deployment"],
      order: 2,
    },
    {
      slug: "cloud-devops",
      title: "Cloud & DevOps",
      icon: "Cloud",
      shortDesc: "AWS, GCP, and Azure infrastructure as code with secure CI/CD.",
      body: "<p>Infrastructure as code, blue/green deploys, secrets management, observability stacks, and cost controls. We bring engineering rigor to your platform team — or become it.</p>",
      features: ["Terraform / CDK", "Kubernetes & ECS", "GitHub Actions / Argo", "SOC 2 readiness"],
      order: 3,
    },
    {
      slug: "data-ai",
      title: "Data & AI",
      icon: "Brain",
      shortDesc: "Pipelines, warehouses, and applied AI integrations that pay for themselves.",
      body: "<p>From dbt-driven warehouses to retrieval-augmented generation features, we help you turn data into product. Built with provenance, evaluation, and cost ceilings — not vibes.</p>",
      features: ["dbt + Snowflake / BigQuery", "LLM integrations", "Vector search", "Evaluation & guardrails"],
      order: 4,
    },
    {
      slug: "product-design",
      title: "Product Design",
      icon: "Pencil",
      shortDesc: "Design systems, UX research, and high-fidelity prototypes.",
      body: "<p>We pair engineers with product designers so what gets specced is what gets shipped. Design systems, accessibility audits, and prototypes that move the metric you care about.</p>",
      features: ["Design systems", "WCAG 2.2 AA audits", "Figma prototypes", "Usability research"],
      order: 5,
    },
    {
      slug: "managed-engineering",
      title: "Managed Engineering",
      icon: "Wrench",
      shortDesc: "Embedded squads that own outcomes, not just tickets.",
      body: "<p>Long-running pods of senior engineers, designers, and PMs that integrate with your team and ship against measurable outcomes. Quarterly roadmaps, weekly demos, no time-and-materials drift.</p>",
      features: ["Senior engineers", "Quarterly OKRs", "Weekly demos", "Knowledge transfer"],
      order: 6,
    },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }

  // ---- Testimonials ----
  const testimonials = [
    { quote: "AFG Tech rebuilt our dealer inventory platform in eight weeks and we saw a 34% lift in lead conversion the following quarter.", author: "Marcus Reilly", role: "VP of Digital", company: "Lonestar Auto Group", rating: 5, featured: true, order: 1 },
    { quote: "Their team understood HIPAA from day one. The patient portal they delivered passed our auditors with zero findings.", author: "Dr. Priya Anand", role: "CMO", company: "North Texas Health Partners", rating: 5, featured: true, order: 2 },
    { quote: "We've worked with three other agencies. AFG is the first one that genuinely owned the outcome instead of the contract.", author: "Janelle Brooks", role: "Executive Director", company: "DFW Youth Foundation", rating: 5, featured: true, order: 3 },
  ];
  for (const [idx, t] of testimonials.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { author: t.author, company: t.company } });
    if (existing) {
      await prisma.testimonial.update({ where: { id: existing.id }, data: t });
    } else {
      await prisma.testimonial.create({ data: { ...t, order: idx + 1 } });
    }
  }

  // ---- Sample projects ----
  const projects = [
    {
      slug: "lonestar-dealer-platform",
      title: "Lonestar Dealer Platform",
      industry: "Automotive",
      year: 2025,
      summary: "Multi-rooftop dealer platform with real-time inventory sync, lead routing, and finance integrations across 14 stores.",
      body: "<h2>The challenge</h2><p>A growing 14-rooftop dealer group was running on a stitched-together vendor stack with 6+ hour inventory lag and no central lead view. Sales managers were exporting CSVs daily.</p><h2>What we built</h2><p>A Next.js dealer platform backed by an event-driven inventory pipeline, a unified lead inbox with SLA timers, and finance-application integrations into Dealertrack and RouteOne. Single sign-on for 240+ users, role-based permissions, and audit logs end-to-end.</p><h2>Outcome</h2><p>Inventory lag dropped from 6 hours to under 90 seconds. Lead-to-appointment conversion improved 34% in the first full quarter post-launch.</p>",
      coverImage: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600",
      gallery: [],
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "AWS", "Kafka"],
      featured: true,
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "northtex-patient-portal",
      title: "North Texas Patient Portal",
      industry: "Healthcare",
      year: 2024,
      summary: "HIPAA-compliant patient portal with secure messaging, scheduling, and Epic integration.",
      body: "<h2>The challenge</h2><p>A regional clinic network needed to retire a vendor portal that patients hated and providers ignored. Audit risk was mounting and Net Promoter Score was negative.</p><h2>What we built</h2><p>A modern portal with secure messaging, online scheduling, prescription refills, and bidirectional FHIR integration with Epic. Designed in close partnership with the compliance team and tested with real patients across age cohorts.</p><h2>Outcome</h2><p>Portal NPS moved from -12 to +41 within six months. Phone-call volume to scheduling dropped 28%.</p>",
      coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600",
      gallery: [],
      technologies: ["Next.js", "FHIR", "AWS", "PostgreSQL"],
      featured: true,
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "metroplex-league-app",
      title: "Metroplex Youth League App",
      industry: "Sports",
      year: 2024,
      summary: "League management, scheduling, and fan engagement app for 9,000+ youth athletes.",
      body: "<h2>The challenge</h2><p>A regional youth sports league was running on spreadsheets and three different SaaS tools. Volunteers were burning out and parents couldn't find game times.</p><h2>What we built</h2><p>A unified mobile and web platform for registration, scheduling, results, and team communication. Coaches get a streamlined coaching view, parents get a clean schedule and live updates, and league admins finally have one source of truth.</p><h2>Outcome</h2><p>Volunteer admin time cut by an estimated 60%. Registration completion rate up from 71% to 94%.</p>",
      coverImage: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1600",
      gallery: [],
      technologies: ["React Native", "Next.js", "PostgreSQL", "AWS"],
      featured: false,
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "dfw-youth-foundation-portal",
      title: "DFW Youth Foundation Donor Portal",
      industry: "Nonprofit",
      year: 2023,
      summary: "Donor portal, recurring giving, and grant reporting platform for a regional nonprofit.",
      body: "<h2>The challenge</h2><p>A growing nonprofit was leaking donor relationships through a clunky third-party giving page and manual grant reports.</p><h2>What we built</h2><p>A branded donor portal with recurring giving, tax-receipt automation, and a grant reporting workspace that auto-pulls program metrics from their case management tools.</p><h2>Outcome</h2><p>Recurring giving revenue grew 2.3x year-over-year. Annual report production time dropped from six weeks to one.</p>",
      coverImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600",
      gallery: [],
      technologies: ["Next.js", "Stripe", "PostgreSQL"],
      featured: false,
      published: true,
      publishedAt: new Date(),
    },
  ];
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: { ...p, authorId: admin.id },
      create: { ...p, authorId: admin.id },
    });
  }

  // ---- Sample post ----
  await prisma.post.upsert({
    where: { slug: "shipping-software-that-survives-its-launch" },
    update: {},
    create: {
      slug: "shipping-software-that-survives-its-launch",
      title: "Shipping Software That Survives Its Launch",
      excerpt: "A practical playbook for the first 30 days after a custom platform goes live — and the engineering decisions that matter most.",
      body: "<p>Most platform launches don't fail at go-live — they fail in the four weeks after. Here's the playbook we use across automotive, healthcare, sports, and nonprofit clients to make sure month one is a launch ramp, not a fire drill.</p><h2>1. Production parity from day one</h2><p>Staging is not production. We make production-parity environments a non-negotiable line item.</p><h2>2. Observability before features</h2><p>Logs, metrics, traces, and alerting paths before the second sprint ends. You cannot fix what you cannot see.</p>",
      coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600",
      tags: ["engineering", "playbook"],
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  console.log("✅ Seed complete");
  console.log(`   Admin login: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
