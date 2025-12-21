// Polymarket P&L Calculator Content Script - Streak Version

const DEBUG = true; // Set to false to reduce console logs

function log(...args) {
  if (DEBUG) {
    console.log('[Polymarket P&L]', ...args);
  }
}

log('Extension loaded - Streak Version');

// Helper to extract value from a row
function getRowValue(row) {
  const amountColumn = row.querySelector('[style*="flex: 4 1 0%"]');
  if (!amountColumn) return 0;
  
  const profitElement = amountColumn.querySelector('.text-green-600 .font-medium, .text-red-500 .font-medium');
  if (!profitElement) return 0;
  
  const text = profitElement.textContent.trim();
  const match = text.match(/(-?\$[\d,]+\.?\d*)/);
  
  if (match) {
    return parseFloat(match[1].replace('$', '').replace(',', ''));
  }
  return 0;
}

// Function to visualize streaks
function updateStreakVisuals() {
  const rows = Array.from(document.querySelectorAll('[data-item-index]'));
  if (rows.length === 0) return;
  
  // Clear existing indicators
  document.querySelectorAll('.streak-connector, .streak-label-container').forEach(el => el.remove());
  
  // Sort rows by vertical position to ensure correct order
  rows.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return rectA.top - rectB.top;
  });
  
  let currentStreak = {
    type: null, // 'win' or 'loss'
    sum: 0,
    rows: []
  };
  
  const streaks = [];
  
  rows.forEach((row, index) => {
    const value = getRowValue(row);
    if (isNaN(value) || value === 0) return; // Skip invalid/zero rows
    
    const type = value > 0 ? 'win' : 'loss';
    
    // Start new streak if type changes
    if (currentStreak.type !== type) {
      if (currentStreak.rows.length > 0) {
        streaks.push({...currentStreak});
      }
      currentStreak = {
        type: type,
        sum: value,
        rows: [row]
      };
    } else {
      // Continue streak
      currentStreak.sum += value;
      currentStreak.rows.push(row);
    }
  });
  
  // Push final streak
  if (currentStreak.rows.length > 0) {
    streaks.push({...currentStreak});
  }
  
  // Render streaks
  streaks.forEach(streak => {
    renderStreak(streak);
  });
}

function renderStreak(streak) {
  if (streak.rows.length === 0) return;
  
  const isWin = streak.type === 'win';
  const colorClass = isWin ? 'positive' : 'negative';
  const colorHex = isWin ? '#10b981' : '#ef4444';
  
  // We'll attach the visual elements to the first row of the streak
  // but calculate height based on all rows
  const firstRow = streak.rows[0];
  const lastRow = streak.rows[streak.rows.length - 1];
  
  // Calculate positioning relative to the first row
  const firstRect = firstRow.getBoundingClientRect();
  const lastRect = lastRow.getBoundingClientRect();
  
  // Total height of the streak
  const totalHeight = lastRect.bottom - firstRect.top;
  
  // Create connector line
  const connector = document.createElement('div');
  connector.className = `streak-connector ${colorClass}`;
  connector.style.height = `${totalHeight - 16}px`; // Subtract some padding
  connector.style.top = '8px';
  connector.style.position = 'absolute';
  
  // Only append if it fits reasonably
  if (totalHeight > 0) {
    firstRow.appendChild(connector);
    
    // Create label (Sum) - Position it in the middle of the streak
    const labelContainer = document.createElement('div');
    labelContainer.className = 'streak-label-container';
    labelContainer.style.position = 'absolute';
    labelContainer.style.right = '-80px'; // Position to the right
    labelContainer.style.top = `${totalHeight / 2 - 14}px`; // Center vertically
    labelContainer.style.zIndex = '20';
    
    const label = document.createElement('div');
    label.className = `streak-label ${isWin ? 'streak-positive' : 'streak-negative'}`;
    const sign = isWin ? '+' : '';
    label.textContent = `${sign}$${streak.sum.toFixed(2)}`;
    label.style.color = colorHex;
    label.style.background = '#1a1d29';
    label.style.padding = '4px 8px';
    label.style.borderRadius = '4px';
    label.style.border = `1px solid ${colorHex}40`;
    label.style.fontWeight = 'bold';
    label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    
    // Add arrow pointing to streak
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.left = '-6px';
    arrow.style.top = '50%';
    arrow.style.transform = 'translateY(-50%)';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderTop = '6px solid transparent';
    arrow.style.borderBottom = '6px solid transparent';
    arrow.style.borderRight = `6px solid ${colorHex}40`; // Match border color
    
    // Inner arrow for background match
    const arrowInner = document.createElement('div');
    arrowInner.style.position = 'absolute';
    arrowInner.style.left = '-4px';
    arrowInner.style.top = '50%';
    arrowInner.style.transform = 'translateY(-50%)';
    arrowInner.style.width = '0';
    arrowInner.style.height = '0';
    arrowInner.style.borderTop = '5px solid transparent';
    arrowInner.style.borderBottom = '5px solid transparent';
    arrowInner.style.borderRight = `5px solid #1a1d29`;
    
    labelContainer.appendChild(arrow);
    labelContainer.appendChild(arrowInner);
    labelContainer.appendChild(label);
    firstRow.appendChild(labelContainer);
  }
}

// Debounce function
let updateTimeout = null;
function debouncedUpdate(delay = 300) {
  if (updateTimeout) clearTimeout(updateTimeout);
  updateTimeout = setTimeout(updateStreakVisuals, delay);
}

// Initialize
function init() {
  log('Initializing Streak View...');
  
  // Watch for changes
  const observer = new MutationObserver(() => {
    debouncedUpdate(200);
  });
  
  const container = document.querySelector('[data-virtuoso-scroller]') || document.body;
  observer.observe(container, { childList: true, subtree: true });
  
  // Initial run
  setTimeout(updateStreakVisuals, 1000);
  
  // Update on scroll since rows recycle
  window.addEventListener('scroll', () => debouncedUpdate(100), { passive: true });
  
  // Handle Load More
  document.addEventListener('click', (e) => {
    const text = e.target.textContent || '';
    if (text.includes('Load more')) {
      debouncedUpdate(1500);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-init on URL change
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    setTimeout(init, 1000);
  }
}).observe(document, { subtree: true, childList: true });
