export interface RetentionPolicy {
  category: string;
  duration: string;
  details: string;
}

export const RETENTION_POLICIES: RetentionPolicy[] = [
  {
    category: "Raw uploads",
    duration: "1 hour (free) / 1 day (paid)",
    details:
      "Cloud copy removed as soon as processing starts; local working files cleared within about one hour for free accounts, or within about one day for paid accounts if you leave a project open in the editor.",
  },
  {
    category: "Exports",
    duration: "1 to 3 hours",
    details:
      "Available for download for a limited time (about one hour on the free plan, or a few hours on paid plans) unless you save them sooner.",
  },
  {
    category: "Account data",
    duration: "Account lifetime + 90 days",
    details:
      "Kept while your account is active. If you delete your account or ask us to, we delete or anonymize your personal information within 90 days, except records we must keep longer for legal, billing, or security reasons.",
  },
  {
    category: "Purchase and billing records",
    duration: "Statutory tax period",
    details:
      "Payment confirmations, export pack grants, subscription status, and minutes usage are kept as long as needed to provide the service, enforce plan limits, handle billing disputes, and meet legal or tax obligations.",
  },
  {
    category: "Phone verification records",
    duration: "Temporary rate limit window",
    details:
      "One-time code records (phone number, hashed code, IP address, and timestamps) are kept for a limited period for security and rate limiting, then deleted.",
  },
  {
    category: "Support messages",
    duration: "Ticket resolution + history",
    details:
      "Kept as long as needed to handle your request and maintain a reasonable support history. Screenshot attachments are deleted when the support ticket is resolved.",
  },
];
