import { config } from "dotenv";
import cron from "node-cron";

config();

const PIPELINE_URL = process.env.PIPELINE_URL || "http://localhost:3000/api/pipeline/process";
const INTERVAL = process.env.CRON_INTERVAL || "* * * * *"; // every minute

console.log(`[cron] Starting pipeline worker`);
console.log(`[cron] Target: ${PIPELINE_URL}`);
console.log(`[cron] Schedule: ${INTERVAL}`);

cron.schedule(INTERVAL, async () => {
  const now = new Date().toISOString();
  try {
    const res = await fetch(PIPELINE_URL);
    const data = await res.json();
    console.log(`[${now}] processed=${data.processed} sent=${data.sent} skipped=${data.skipped}`);
  } catch (err) {
    console.error(`[${now}] ERROR:`, err.message);
  }
});

console.log(`[cron] Worker running. Press Ctrl+C to stop.\n`);
