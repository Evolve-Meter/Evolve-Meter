const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("==========================================");
console.log("⚡ EVOLVE METER - STARTING DEMO SYSTEM");
console.log("==========================================");

// Ensure public folder exists
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Start Next.js Server
console.log("🚀 Starting Local Server...");
const nextServer = spawn('npm.cmd', ['run', 'dev'], { shell: true });

nextServer.stdout.on('data', (data) => {
  // Silent server logs unless there is an error
  if (data.toString().includes('ready')) {
    console.log("✅ Local Server is READY on port 3000");
  }
});

nextServer.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data}`);
});

// 2. Start Cloudflare Tunnel
console.log("🌍 Opening Global Public Tunnel...");
const tunnel = spawn('npx.cmd', ['-y', 'cloudflared', 'tunnel', '--url', 'http://localhost:3000'], { shell: true });

tunnel.stderr.on('data', (data) => {
  const output = data.toString();
  
  // Look for the URL in the output
  const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
  if (match) {
    const url = match[0];
    console.log("\n✨ SUCCESS! YOUR PUBLIC LINK IS ACTIVE:");
    console.log(`🔗 ${url}\n`);
    
    // Save to tunnel.txt so the QR code updates
    try {
      fs.writeFileSync(path.join(publicDir, 'tunnel.txt'), url);
      console.log("✅ QR Code updated automatically!");
      console.log("👉 SCAN THE QR ON YOUR LAPTOP SCREEN NOW\n");
    } catch (e) {
      console.error("❌ Failed to update QR code file:", e.message);
    }
  }

  if (output.includes("error")) {
    console.error(`[Tunnel Log]: ${output}`);
  }
});

tunnel.on('close', (code) => {
  console.log("\n❌ Tunnel closed. Restart the script.");
});

// Keep process alive
process.on('SIGINT', () => {
  nextServer.kill();
  tunnel.kill();
  process.exit();
});
