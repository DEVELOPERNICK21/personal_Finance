#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT = "6852499108308747024";
const QUOTA = "personalfinance-11440";
const OUT = path.join(__dirname, "..", ".stitch");

const SCREENS = [
  ["onboarding-step-1-mobile", "caeada0d2d6241af9ac11fd3a99dcff8"],
  ["onboarding-step-2-mobile", "234173833555451aaad97e43db455f20"],
  ["onboarding-step-3-mobile", "3ad827a596034c59a2d71a60a65a6119"],
  ["dashboard-level-0-mobile", "64c5212264fa43abb09c6c9697f782db"],
  ["dashboard-level-1-mobile", "8b89feccc56a4ac69fc457e9771294f7"],
  ["onboarding-step-1-desktop", "0b9223b944bd4f86acceefe9c342b762"],
  ["onboarding-step-2-desktop", "517fdee00e1a42cbb8527ee0d00753f9"],
  ["onboarding-step-3-desktop", "a2ba0c418c58422687f818a2427c09a4"],
  ["dashboard-level-0-desktop", "bd9a2c3e61ea4643a30c002afcda92df"],
  ["dashboard-level-1-desktop", "8015e93c6027424aa14f3df3e903d748"],
  ["dashboard-level-2-desktop", "cd930ab1f43d42cd90b1f9c68a81e001"],
];

async function main() {
  const token = execSync("gcloud auth application-default print-access-token", {
    encoding: "utf8",
  }).trim();

  fs.mkdirSync(path.join(OUT, "html"), { recursive: true });
  fs.mkdirSync(path.join(OUT, "images"), { recursive: true });

  const manifest = [];

  for (const [name, screenId] of SCREENS) {
    console.log(`Fetching ${name}...`);
    const res = await fetch("https://stitch.googleapis.com/mcp", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Goog-User-Project": QUOTA,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "get_screen",
          arguments: { projectId: PROJECT, screenId },
        },
      }),
    });

    const json = await res.json();
    const sc = json.result?.structuredContent;
    if (!sc) {
      console.error("Failed:", name, JSON.stringify(json));
      continue;
    }

    const htmlRes = await fetch(sc.htmlCode.downloadUrl);
    const imgRes = await fetch(sc.screenshot.downloadUrl);
    const html = await htmlRes.text();
    const imgBuf = Buffer.from(await imgRes.arrayBuffer());

    fs.writeFileSync(path.join(OUT, "html", `${name}.html`), html);
    fs.writeFileSync(path.join(OUT, "images", `${name}.png`), imgBuf);

    const meta = {
      name,
      screenId,
      title: sc.title,
      deviceType: sc.deviceType,
      width: sc.width,
      height: sc.height,
    };
    fs.writeFileSync(path.join(OUT, `${name}.meta.json`), JSON.stringify(meta, null, 2));
    manifest.push(meta);
    console.log(`  ✓ ${sc.title} (${sc.deviceType})`);
  }

  fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
