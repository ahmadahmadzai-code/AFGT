export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "AFG Tech",
  description:
    "AFG Tech is a software development agency in Grapevine, TX building production-grade platforms for automotive, healthcare, sports, and nonprofit teams since 2009.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og.svg",
  founded: 2009,
  location: "Grapevine, TX",
  region: "DFW Metroplex",
  industries: ["Automotive", "Healthcare", "Sports", "Nonprofit"],
};

export type SiteConfig = typeof siteConfig;
