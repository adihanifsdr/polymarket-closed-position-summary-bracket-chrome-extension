// Node.js script to generate extension icons
// Run with: node generate-icons.js

const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#10b981');
  gradient.addColorStop(1, '#059669');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // Draw $ symbol
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', size / 2, size / 2);

  // Add small chart line in background
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = size * 0.05;
  ctx.beginPath();
  ctx.moveTo(size * 0.2, size * 0.7);
  ctx.lineTo(size * 0.4, size * 0.5);
  ctx.lineTo(size * 0.6, size * 0.6);
  ctx.lineTo(size * 0.8, size * 0.3);
  ctx.stroke();

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`✓ Generated ${filename}`);
}

console.log('Generating extension icons...\n');

try {
  generateIcon(16, 'icon16.png');
  generateIcon(48, 'icon48.png');
  generateIcon(128, 'icon128.png');
  console.log('\n✓ All icons generated successfully!');
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nNote: This script requires the "canvas" package.');
  console.log('Install it with: npm install canvas');
  console.log('\nAlternatively, open create-icons.html in your browser to generate icons manually.');
}

