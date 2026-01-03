// Polymarket P&L Calculator Content Script - Streak Version with Caching

const DEBUG = true; // Set to false to reduce console logs

function log(...args) {
  if (DEBUG) {
    console.log('[Polymarket P&L]', ...args);
  }
}

log('Extension loaded - Streak Version with Caching');

// Cache management
const CACHE_KEY_PREFIX = 'polymarket_pl_cache_';
let plCache = {}; // { index: value }
let currentAddress = null;

// Extract address from URL
function getAddressFromURL() {
  const match = window.location.pathname.match(/\/@(0x[a-fA-F0-9-]+)/);
  return match ? match[1] : null;
}

// Get cache key for current address
function getCacheKey() {
  currentAddress = getAddressFromURL();
  if (!currentAddress) {
    log('No address found in URL');
    return null;
  }
  return `${CACHE_KEY_PREFIX}${currentAddress}`;
}

// Load cache from localStorage
function loadCache() {
  const cacheKey = getCacheKey();
  if (!cacheKey) {
    plCache = {};
    return;
  }

  try {
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
      plCache = JSON.parse(stored);
      log('Cache loaded for', currentAddress, ':', Object.keys(plCache).length, 'entries');
    } else {
      plCache = {};
      log('No existing cache for', currentAddress);
    }
  } catch (e) {
    log('Error loading cache:', e);
    plCache = {};
  }
}

// Save cache to localStorage
function saveCache() {
  const cacheKey = getCacheKey();
  if (!cacheKey) return;

  try {
    localStorage.setItem(cacheKey, JSON.stringify(plCache));
    log('Cache saved for', currentAddress, ':', Object.keys(plCache).length, 'entries');
  } catch (e) {
    log('Error saving cache:', e);
  }
}

// Clear cache (useful for testing or if data gets stale)
function clearCache() {
  const cacheKey = getCacheKey();
  if (!cacheKey) return;

  plCache = {};
  localStorage.removeItem(cacheKey);
  log('Cache cleared for', currentAddress);
}

// Clear all caches for all addresses
function clearAllCaches() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  plCache = {};
  log('All caches cleared:', keysToRemove.length, 'addresses');
}

// Initialize cache on load
loadCache();

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

// Update cache with visible rows
function updateCache() {
  const rows = Array.from(document.querySelectorAll('[data-item-index]'));
  let cacheUpdated = false;

  rows.forEach(row => {
    const index = row.getAttribute('data-item-index');
    if (!index) return;

    const value = getRowValue(row);

    // Only cache valid non-zero values
    if (!isNaN(value) && value !== 0) {
      // Update cache if value changed or is new
      if (plCache[index] !== value) {
        plCache[index] = value;
        cacheUpdated = true;
      }
    }
  });

  if (cacheUpdated) {
    saveCache();
  }

  return rows;
}

// Function to visualize streaks using cached data
function updateStreakVisuals() {
  const rows = updateCache(); // Update cache first and get visible rows
  if (rows.length === 0) return;

  // Clear existing indicators
  document.querySelectorAll('.streak-connector, .streak-label-container').forEach(el => el.remove());

  // Get all cached indices sorted numerically (chronological order)
  const cachedIndices = Object.keys(plCache)
    .map(k => parseInt(k))
    .sort((a, b) => a - b);

  if (cachedIndices.length === 0) return;

  // Build streak data from cache
  let currentStreak = {
    type: null, // 'win' or 'loss'
    sum: 0,
    indices: []
  };

  const streaks = [];

  cachedIndices.forEach(index => {
    const value = plCache[index];
    const type = value > 0 ? 'win' : 'loss';

    // Start new streak if type changes
    if (currentStreak.type !== type) {
      if (currentStreak.indices.length > 0) {
        streaks.push({...currentStreak});
      }
      currentStreak = {
        type: type,
        sum: value,
        indices: [index]
      };
    } else {
      // Continue streak
      currentStreak.sum += value;
      currentStreak.indices.push(index);
    }
  });

  // Push final streak
  if (currentStreak.indices.length > 0) {
    streaks.push({...currentStreak});
  }

  // Map visible rows by index for quick lookup
  const rowsByIndex = {};
  rows.forEach(row => {
    const index = parseInt(row.getAttribute('data-item-index'));
    if (!isNaN(index)) {
      rowsByIndex[index] = row;
    }
  });

  // Render streaks (only if they have visible rows)
  streaks.forEach(streak => {
    renderStreak(streak, rowsByIndex);
  });

  log('Streaks calculated:', streaks.length, 'from', cachedIndices.length, 'cached entries');
}

function renderStreak(streak, rowsByIndex) {
  if (streak.indices.length === 0) return;

  // Find visible rows for this streak
  const visibleRows = streak.indices
    .map(index => rowsByIndex[index])
    .filter(row => row !== undefined);

  if (visibleRows.length === 0) return; // Skip if no visible rows

  const isWin = streak.type === 'win';
  const colorClass = isWin ? 'positive' : 'negative';
  const colorHex = isWin ? '#10b981' : '#ef4444';

  // We'll attach the visual elements to the first visible row
  // but calculate height based on all visible rows
  const firstRow = visibleRows[0];
  const lastRow = visibleRows[visibleRows.length - 1];

  // Calculate positioning relative to the first row
  const firstRect = firstRow.getBoundingClientRect();
  const lastRect = lastRow.getBoundingClientRect();

  // Total height of the visible streak
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
    // Show total streak sum from cache (not just visible)
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
    loadCache(); // Reload cache for new address
    setTimeout(init, 1000);
  }
}).observe(document, { subtree: true, childList: true });

// Expose cache utilities to console for debugging
window.polymarketPL = {
  clearCache: () => {
    clearCache();
    updateStreakVisuals();
    console.log('Cache cleared for current address and streaks refreshed');
  },
  clearAllCaches: () => {
    clearAllCaches();
    updateStreakVisuals();
    console.log('All caches cleared for all addresses');
  },
  viewCache: () => {
    console.log('Current address:', currentAddress);
    console.log('Current cache:', plCache);
    console.log('Total entries:', Object.keys(plCache).length);
    return plCache;
  },
  viewAllCaches: () => {
    const allCaches = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        const address = key.replace(CACHE_KEY_PREFIX, '');
        try {
          allCaches[address] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          allCaches[address] = 'Error parsing';
        }
      }
    }
    console.log('All caches:', allCaches);
    return allCaches;
  },
  refreshStreaks: () => {
    updateStreakVisuals();
    console.log('Streaks refreshed');
  }
};

log('Cache utilities available:');
log('  - window.polymarketPL.clearCache() - Clear cache for current address');
log('  - window.polymarketPL.clearAllCaches() - Clear all caches');
log('  - window.polymarketPL.viewCache() - View current cache');
log('  - window.polymarketPL.viewAllCaches() - View all cached addresses');
log('  - window.polymarketPL.refreshStreaks() - Refresh streak visuals');
