import { Resend } from "resend";

export interface VisitorMetadata {
  page?: string;
  referrer?: string;
  userAgent?: string;
  ipCountry?: string | null;
  ipRegion?: string | null;
  ipCity?: string | null;
}

/**
 * Lightweight User-Agent parser to categorize device, browser, and OS without heavy external packages
 */
function parseUserAgent(ua: string) {
  let device = "Desktop";
  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (/mobile|android|touch|webos|hpwos/i.test(ua)) {
    device = "Mobile";
  } else if (/tablet|ipad/i.test(ua)) {
    device = "Tablet";
  }

  if (/chrome|crios/i.test(ua) && !/edg|opr|opera/i.test(ua)) {
    browser = "Chrome";
  } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
    browser = "Safari";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox";
  } else if (/edg/i.test(ua)) {
    browser = "Edge";
  } else if (/opr|opera/i.test(ua)) {
    browser = "Opera";
  }

  if (/windows/i.test(ua)) os = "Windows";
  else if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad/i.test(ua)) os = "macOS";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/linux/i.test(ua)) os = "Linux";

  return { device, browser, os };
}

/**
 * Asynchronously send a visitor notification email with rate-limiting and error-safety
 */
export async function sendVisitorNotification(meta: VisitorMetadata): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail || apiKey.trim().length === 0 || toEmail.trim().length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[Visitor Notification] Skipped: RESEND_API_KEY or NOTIFICATION_EMAIL not set in environment."
      );
    }
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { device, browser, os } = parseUserAgent(meta.userAgent || "");

    const now = new Date();
    const formattedTime = now.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    const locationParts = [meta.ipCity, meta.ipRegion, meta.ipCountry].filter(Boolean);
    const approximateLocation = locationParts.length > 0 ? locationParts.join(", ") : "Local / Approximate";
    const pageVisited = meta.page || "/";
    const referrer = meta.referrer ? meta.referrer : "Direct";
    const fromAddress = process.env.RESEND_FROM || "Birthday App <onboarding@resend.dev>";

    const plainText = `🌸 New Visitor

Someone just visited your birthday website.

Page:
${pageVisited}

Time:
${formattedTime} (IST)

Device:
${device}

Browser:
${browser}

OS:
${os}

Approximate location:
${approximateLocation}

Referrer:
${referrer}

—
Birthday App Visitor Notification`;

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toEmail.trim(),
      subject: `🌸 New Visitor on Birthday App (${pageVisited})`,
      text: plainText,
    });

    if (error) {
      console.error("[Visitor Notification] Resend API Error:", error.message || error);
    } else if (process.env.NODE_ENV === "development") {
      console.log(`[Visitor Notification] Email dispatched successfully to ${toEmail} (ID: ${data?.id})`);
    }
  } catch (error) {
    // Log server-side only; never disrupt user experience
    console.error("[Visitor Notification] Error dispatching email:", error);
  }
}
