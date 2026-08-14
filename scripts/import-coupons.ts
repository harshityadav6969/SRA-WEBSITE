// One-time import script.
// Run locally with: npx tsx scripts/import-coupons.ts
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

async function main() {
  const dataPath = path.join(process.cwd(), 'data', 'rewards_db.json');
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const parsed = JSON.parse(raw);

  // Your real file wraps codes as { coupons: { "CODE": {...} } }.
  // This handles that shape (and falls back to a plain array, just in case).
  const couponsSource = Array.isArray(parsed) ? parsed : Object.values(parsed.coupons || {});

  const coupons = (couponsSource as any[]).map((c) => ({
    code: String(c.code).toUpperCase(),
    rewardAmount: Number(c.rewardAmount),
    status: c.status === 'redeemed' || c.status === 'used' ? 'used' : 'active',
  }));

  console.log(`Importing ${coupons.length} coupons...`);

  const batchSize = 500;
  for (let i = 0; i < coupons.length; i += batchSize) {
    const batch = coupons.slice(i, i + batchSize).map((c) => ({
      code: c.code,
      reward_amount: c.rewardAmount,
      status: c.status,
    }));

    const { error } = await supabase.from('coupons').upsert(batch, { onConflict: 'code' });

    if (error) {
      console.error(`Batch ${i / batchSize + 1} failed:`, error.message);
      process.exit(1);
    }
    console.log(`Imported batch ${i / batchSize + 1} (${batch.length} codes)`);
  }

  console.log('Done. All codes imported.');
}

main();