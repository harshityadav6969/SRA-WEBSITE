import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { createServer as createViteServer } from "vite";
import { verifyCouponCode, claimCoupon } from "./lib/rewards";
import { getSupabase } from "./lib/supabase";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper function to dispatch real email using Nodemailer or Resend
async function sendRealEmail(toEmail: string, subject: string, bodyText: string): Promise<{ sent: boolean; method: string; detail?: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || toEmail || "srashrijiagrigeneticsseeds@gmail.com";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const resendApiKey = process.env.RESEND_API_KEY;

  // Method A: Resend API if key is present
  if (resendApiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "SRA Rewards Portal <onboarding@resend.dev>",
          to: [adminEmail],
          subject: subject,
          text: bodyText
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log(`[RESEND EMAIL SUCCESS] Sent to ${adminEmail}`, data);
        return { sent: true, method: "Resend API" };
      }
    } catch (err) {
      console.error("[RESEND EMAIL ERROR]", err);
    }
  }

  // Method B: Nodemailer with SMTP credentials (e.g. Gmail App Password or custom SMTP)
  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"SRA Rewards Portal" <${smtpUser}>`,
        to: adminEmail,
        subject: subject,
        text: bodyText
      });

      console.log(`[SMTP EMAIL SUCCESS] Message ID: ${info.messageId} sent to ${adminEmail}`);
      return { sent: true, method: "SMTP Transporter" };
    } catch (err: any) {
      console.error("[SMTP EMAIL ERROR]", err);
      return { sent: false, method: "SMTP", detail: err?.message || String(err) };
    }
  }

  // Fallback: Log notice that SMTP credentials can be set up in Settings secrets
  console.log(`[EMAIL LOGGED TO DB] Receiver: ${adminEmail}. To receive physical inbox emails, add SMTP_USER & SMTP_PASS in Settings -> Environment Variables.`);
  return { sent: false, method: "DB Log Only", detail: "SMTP_USER and SMTP_PASS not set in environment secrets." };
}

// Persistent Data File Path
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "rewards_db.json");

interface Coupon {
  code: string;
  rewardAmount: number;
  status: "active" | "redeemed";
  createdAt: string;
  redeemedAt?: string;
  redeemedByRef?: string;
}

interface Redemption {
  referenceId: string;
  couponCode: string;
  rewardAmount: number;
  retailerName: string;
  shopName: string;
  distributor: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  phone: string;
  email?: string;
  gst?: string;
  shopPhoto?: string;
  submittedAt: string;
}

interface AdminEmailLog {
  id: string;
  subject: string;
  body: string;
  sentAt: string;
  to: string;
}

interface DBStructure {
  coupons: Record<string, Coupon>;
  redemptions: Redemption[];
  emailLogs: AdminEmailLog[];
}

// Initial Seed Data
const DEFAULT_COUPONS: Record<string, Coupon> = {
  SRA4589231: { code: "SRA4589231", rewardAmount: 500, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA1029384: { code: "SRA1029384", rewardAmount: 1000, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA7766554: { code: "SRA7766554", rewardAmount: 250, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA8899001: { code: "SRA8899001", rewardAmount: 1500, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA3322110: { code: "SRA3322110", rewardAmount: 500, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA9988776: { code: "SRA9988776", rewardAmount: 2000, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA5544332: { code: "SRA5544332", rewardAmount: 750, status: "active", createdAt: "2026-08-01T10:00:00.000Z" },
  SRA1122334: { 
    code: "SRA1122334", 
    rewardAmount: 500, 
    status: "redeemed", 
    createdAt: "2026-07-25T10:00:00.000Z",
    redeemedAt: "2026-08-02T14:30:00.000Z",
    redeemedByRef: "SRA-20260802-000088"
  }
};

const DEFAULT_REDEMPTIONS: Redemption[] = [
  {
    referenceId: "SRA-20260802-000088",
    couponCode: "SRA1122334",
    rewardAmount: 500,
    retailerName: "Vikram Singh",
    shopName: "Kisan Agro Kendra",
    distributor: "Gupta Traders Pvt Ltd",
    village: "Khedi",
    tehsil: "Karnal",
    district: "Karnal",
    state: "Haryana",
    phone: "9812044332",
    email: "vikram.kisan@gmail.com",
    gst: "06AAACK1234F1Z9",
    submittedAt: "2026-08-02T14:30:00.000Z"
  }
];

function loadDB(): DBStructure {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading db, resetting to default:", err);
  }
  const defaultDB: DBStructure = {
    coupons: DEFAULT_COUPONS,
    redemptions: DEFAULT_REDEMPTIONS,
    emailLogs: [
      {
        id: "EML-1001",
        to: "srashrijiagrigeneticsseeds@gmail.com",
        subject: "🎉 New SRA Reward Redemption",
        sentAt: "2026-08-02T14:30:05.000Z",
        body: `Reference ID: SRA-20260802-000088\nCoupon Code: SRA1122334\nReward: ₹500\nRetailer Name: Vikram Singh\nShop Name: Kisan Agro Kendra\nDistributor: Gupta Traders Pvt Ltd\nVillage: Khedi\nTehsil: Karnal\nDistrict: Karnal\nState: Haryana\nPhone: 9812044332\nEmail: vikram.kisan@gmail.com\nGST: 06AAACK1234F1Z9\nSubmitted On: 02 Aug 2026 02:30 PM`
      }
    ]
  };
  saveDB(defaultDB);
  return defaultDB;
}

function saveDB(db: DBStructure) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save DB:", err);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Verify Coupon Code (Backend Validation)
app.post("/api/rewards/verify-coupon", async (req, res) => {
  const rawCode = req.body?.code;
  if (!rawCode || typeof rawCode !== "string") {
    return res.status(400).json({
      success: false,
      status: "INVALID",
      message: "Please enter a valid coupon code."
    });
  }

  if (getSupabase()) {
    const result = await verifyCouponCode(rawCode);
    if (result.status === "ERROR") {
      return res.status(result.httpStatus || 500).json({
        success: false,
        message: result.message
      });
    }
    return res.json(result);
  }

  const code = rawCode.trim().toUpperCase();
  const db = loadDB();
  const coupon = db.coupons[code];

  if (!coupon) {
    return res.json({
      success: false,
      status: "INVALID",
      message: "Invalid Coupon Code"
    });
  }

  if (coupon.status === "redeemed") {
    return res.json({
      success: false,
      status: "REDEEMED",
      message: "This coupon has already been redeemed."
    });
  }

  // Valid Coupon - DO NOT reveal reward amount yet!
  return res.json({
    success: true,
    status: "VALID",
    message: "Coupon Verified Successfully. Please complete your details to reveal your reward."
  });
});

// 2. Submit Claim & Reveal Reward
app.post("/api/rewards/claim", async (req, res) => {
  const {
    code: rawCode,
    retailerName,
    shopName,
    distributor,
    village,
    tehsil,
    district,
    state,
    phone,
    email,
    gst,
    shopPhoto
  } = req.body || {};

  if (!rawCode || typeof rawCode !== "string") {
    return res.status(400).json({ success: false, message: "Coupon code is required." });
  }

  // Validate required fields
  if (!retailerName || !shopName || !distributor || !village || !district || !state || !phone) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required retailer information fields marked with *"
    });
  }

  if (getSupabase()) {
    const result = await claimCoupon({
      code: rawCode,
      retailerName,
      shopName,
      distributor,
      village,
      tehsil,
      district,
      state,
      phone,
      email,
      gst,
      shopPhoto
    });

    if (!result.success) {
      const status = 'httpStatus' in result ? result.httpStatus || 400 : 400;
      return res.status(status).json(result);
    }

    const now = new Date(result.submittedAt);
    const formattedDate = now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const emailBody = [
      `Reference ID: ${result.referenceId}`,
      `Coupon Code: ${rawCode.trim().toUpperCase()}`,
      `Reward: ₹${result.rewardAmount}`,
      `Retailer Name: ${String(retailerName).trim()}`,
      `Shop Name: ${String(shopName).trim()}`,
      `Distributor: ${String(distributor).trim()}`,
      `Village: ${String(village).trim()}`,
      `Tehsil: ${tehsil ? String(tehsil).trim() : "N/A"}`,
      `District: ${String(district).trim()}`,
      `State: ${String(state).trim()}`,
      `Phone: ${String(phone).trim()}`,
      `Email: ${email ? String(email).trim() : "N/A"}`,
      `GST: ${gst ? String(gst).trim() : "N/A"}`,
      `Submitted On: ${formattedDate}`,
      `Shop Photo: ${shopPhoto ? "[Photo Uploaded]" : "None"}`
    ].join("\n\n");

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "srashrijiagrigeneticsseeds@gmail.com";
    const subject = `🎉 New SRA Reward Redemption (${rawCode.trim().toUpperCase()} - ₹${result.rewardAmount})`;

    sendRealEmail(ADMIN_EMAIL, subject, emailBody).catch((err) => {
      console.error("[EMAIL DISPATCH FAILED]", err);
    });

    return res.json(result);
  }

  const code = rawCode.trim().toUpperCase();
  const db = loadDB();
  const coupon = db.coupons[code];

  if (!coupon) {
    return res.status(400).json({
      success: false,
      status: "INVALID",
      message: "Invalid Coupon Code"
    });
  }

  if (coupon.status === "redeemed") {
    return res.status(400).json({
      success: false,
      status: "REDEEMED",
      message: "This coupon has already been redeemed."
    });
  }

  // Generate Reference ID: SRA-YYYYMMDD-XXXXXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomSeq = Math.floor(100000 + Math.random() * 900000);
  const referenceId = `SRA-${dateStr}-${randomSeq}`;

  // Update Coupon status
  coupon.status = "redeemed";
  coupon.redeemedAt = now.toISOString();
  coupon.redeemedByRef = referenceId;

  // Save redemption details
  const redemption: Redemption = {
    referenceId,
    couponCode: code,
    rewardAmount: coupon.rewardAmount,
    retailerName: retailerName.trim(),
    shopName: shopName.trim(),
    distributor: distributor.trim(),
    village: village.trim(),
    tehsil: tehsil ? tehsil.trim() : "",
    district: district.trim(),
    state: state.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : "",
    gst: gst ? gst.trim() : "",
    shopPhoto: shopPhoto || "",
    submittedAt: now.toISOString()
  };

  db.redemptions.unshift(redemption);

  // Format Email Notification to Admin
  const formattedDate = now.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  const emailBody = [
    `Reference ID: ${referenceId}`,
    `Coupon Code: ${code}`,
    `Reward: ₹${coupon.rewardAmount}`,
    `Retailer Name: ${redemption.retailerName}`,
    `Shop Name: ${redemption.shopName}`,
    `Distributor: ${redemption.distributor}`,
    `Village: ${redemption.village}`,
    `Tehsil: ${redemption.tehsil || "N/A"}`,
    `District: ${redemption.district}`,
    `State: ${redemption.state}`,
    `Phone: ${redemption.phone}`,
    `Email: ${redemption.email || "N/A"}`,
    `GST: ${redemption.gst || "N/A"}`,
    `Submitted On: ${formattedDate}`,
    `Shop Photo: ${redemption.shopPhoto ? "[Photo Uploaded]" : "None"}`
  ].join("\n\n");

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "srashrijiagrigeneticsseeds@gmail.com";
  const subject = `🎉 New SRA Reward Redemption (${code} - ₹${coupon.rewardAmount})`;

  // Trigger real email dispatch via SMTP / Resend / Nodemailer
  sendRealEmail(ADMIN_EMAIL, subject, emailBody)
    .then((result) => {
      console.log(`[EMAIL DISPATCH STATUS] Result:`, result);
    })
    .catch((err) => {
      console.error(`[EMAIL DISPATCH FAILED]`, err);
    });

  const emailLog: AdminEmailLog = {
    id: `EML-${Date.now()}`,
    to: ADMIN_EMAIL,
    subject: subject,
    sentAt: now.toISOString(),
    body: emailBody
  };

  db.emailLogs.unshift(emailLog);
  saveDB(db);

  console.log(`[ADMIN EMAIL NOTIFICATION LOGGED] Receiver: ${ADMIN_EMAIL} | Ref: ${referenceId}`);

  return res.json({
    success: true,
    referenceId,
    rewardAmount: coupon.rewardAmount,
    submittedAt: now.toISOString(),
    message: "Your coupon has been redeemed successfully."
  });
});

// 3. Admin Get All Redemptions & Coupons
app.get("/api/rewards/admin/data", (req, res) => {
  const db = loadDB();
  const couponsList = Object.values(db.coupons);
  const totalRewardAmount = db.redemptions.reduce((sum, r) => sum + r.rewardAmount, 0);

  return res.json({
    success: true,
    metrics: {
      totalCoupons: couponsList.length,
      activeCoupons: couponsList.filter((c) => c.status === "active").length,
      redeemedCoupons: db.redemptions.length,
      totalRewardAmount
    },
    redemptions: db.redemptions,
    coupons: couponsList,
    emailLogs: db.emailLogs
  });
});

// 4. Admin Add New Coupon
app.post("/api/rewards/admin/create-coupon", (req, res) => {
  const { code: rawCode, rewardAmount } = req.body || {};
  if (!rawCode || !rewardAmount) {
    return res.status(400).json({ success: false, message: "Code and reward amount are required" });
  }

  const code = rawCode.trim().toUpperCase();
  const db = loadDB();
  if (db.coupons[code]) {
    return res.status(400).json({ success: false, message: "Coupon code already exists" });
  }

  db.coupons[code] = {
    code,
    rewardAmount: Number(rewardAmount),
    status: "active",
    createdAt: new Date().toISOString()
  };

  saveDB(db);
  return res.json({ success: true, message: `Coupon ${code} created successfully!` });
});

// 4b. Admin Bulk Add Coupons
app.post("/api/rewards/admin/bulk-create-coupons", (req, res) => {
  const { codes, rawText, rewardAmount } = req.body || {};
  const amount = Number(rewardAmount);

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "A valid positive reward amount is required" });
  }

  let codeList: string[] = [];
  if (Array.isArray(codes)) {
    codeList = codes.map((c: string) => String(c).trim().toUpperCase()).filter(Boolean);
  } else if (typeof rawText === "string") {
    // split by newlines, commas, spaces
    codeList = rawText
      .split(/[\r\n,;\s]+/)
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
  }

  if (codeList.length === 0) {
    return res.status(400).json({ success: false, message: "No coupon codes provided" });
  }

  const db = loadDB();
  let addedCount = 0;
  let skippedCount = 0;
  const now = new Date().toISOString();

  for (const code of codeList) {
    if (db.coupons[code]) {
      skippedCount++;
    } else {
      db.coupons[code] = {
        code,
        rewardAmount: amount,
        status: "active",
        createdAt: now
      };
      addedCount++;
    }
  }

  saveDB(db);
  return res.json({
    success: true,
    addedCount,
    skippedCount,
    message: `Successfully imported ${addedCount} coupon(s) for ₹${amount}! (${skippedCount} already existed).`
  });
});

// 5. Admin Dispatch Test Email
app.post("/api/rewards/admin/send-test-email", async (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL || "srashrijiagrigeneticsseeds@gmail.com";
  const subject = "🧪 Test Email Dispatch from SRA Rewards Portal";
  const bodyText = `Hello Admin,\n\nThis is a test notification email sent to ${adminEmail} from SRA Rewards Portal.\n\nTimestamp: ${new Date().toLocaleString()}\n\nAll email notifications for new coupon redemptions will be dispatched to this address.`;

  const result = await sendRealEmail(adminEmail, subject, bodyText);

  const db = loadDB();
  const emailLog: AdminEmailLog = {
    id: `EML-TEST-${Date.now()}`,
    to: adminEmail,
    subject: subject,
    sentAt: new Date().toISOString(),
    body: bodyText
  };
  db.emailLogs.unshift(emailLog);
  saveDB(db);

  return res.json({
    success: true,
    recipient: adminEmail,
    dispatchResult: result,
    message: result.sent
      ? `Test email sent successfully to ${adminEmail} via ${result.method}!`
      : `Email saved to Admin Logs for ${adminEmail}. (${result.detail || "Configure SMTP_USER/SMTP_PASS for external inbox delivery"})`
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / STATIC SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();