# Frequently Asked Questions (FAQ)

## Installation Questions

### Q: Do I need to install anything else to use this extension?
**A:** No! Just Chrome browser and the extension itself. No additional software required.

### Q: Can I use this on other browsers like Firefox or Brave?
**A:** This extension is designed for Chrome. It may work on Chromium-based browsers (Edge, Brave) but hasn't been tested.

### Q: Why do I need to enable "Developer mode"?
**A:** This extension is not published on the Chrome Web Store, so it needs to be loaded as an "unpacked" extension, which requires Developer mode.

## Usage Questions

### Q: The widget isn't showing up. What should I do?
**A:** Check these things:
1. Are you on polymarket.com with your betting history visible?
2. Is the extension enabled in `chrome://extensions/`?
3. Try refreshing the page (Ctrl+R or Cmd+R)
4. Open the console (F12) and look for "[Polymarket P&L]" messages
5. Make sure you have at least some betting history on the page

### Q: The numbers don't match my expectations. Why?
**A:** The extension only counts visible bets on the page. Make sure to:
- Click "Load more" until all your bets are loaded
- Wait a moment for the widget to update after loading more bets
- Check that Polymarket hasn't changed their page design

### Q: Can I move the widget to a different position?
**A:** Not currently, but you can edit `styles.css` to change the position:
```css
.pnl-widget {
  position: fixed;
  top: 100px;    /* Change this */
  right: 20px;   /* Or this */
  /* ... */
}
```

### Q: Does it work on mobile?
**A:** No, this is a Chrome desktop extension. Mobile browsers don't support Chrome extensions the same way.

## Data & Privacy Questions

### Q: Is my betting data sent anywhere?
**A:** No! All calculations happen locally in your browser. The extension:
- ✅ Does NOT send any data to external servers
- ✅ Does NOT track your activity
- ✅ Does NOT store your betting history
- ✅ Only reads what's visible on your screen

### Q: Can the extension access my Polymarket account?
**A:** No. The extension can only read what's displayed on the page. It cannot:
- ❌ Access your account credentials
- ❌ Make bets on your behalf
- ❌ Access your wallet
- ❌ Modify any data on Polymarket

### Q: What permissions does it need?
**A:** None! The extension doesn't request any special permissions. It only needs access to polymarket.com pages.

## Technical Questions

### Q: Why isn't this on the Chrome Web Store?
**A:** This is a personal/community tool. Publishing to the Web Store requires:
- Registration fees
- Compliance reviews
- Ongoing maintenance for store policies

Loading it manually is free and gives you full control.

### Q: Can I modify the extension?
**A:** Yes! All the code is open and editable:
- `content.js` - Main logic
- `styles.css` - Appearance
- `manifest.json` - Configuration

Feel free to customize it to your needs!

### Q: How do I update the extension?
**A:** Since it's not from the Web Store:
1. Download/get the new version files
2. Replace the old files in your `chrome-extension` folder
3. Go to `chrome://extensions/`
4. Click the reload icon on the extension card

### Q: Why does it need "Developer mode"?
**A:** Chrome only allows unpacked extensions when Developer mode is enabled. This is a security feature to prevent malicious extensions from being installed without user knowledge.

## Feature Questions

### Q: Can it export my P&L data to CSV/Excel?
**A:** Not currently, but this could be added! The current version focuses on display only.

### Q: Can it show historical trends or charts?
**A:** Not yet, but this would be a great feature for a future version.

### Q: Can it filter by date or cryptocurrency?
**A:** Not in the current version. It shows totals for all visible bets.

### Q: Can it calculate win rate percentage?
**A:** You can add this! Win rate = (winCount / totalBets) × 100. Edit `content.js` to add this calculation and display.

## Troubleshooting

### Q: I see an error in the console. What should I do?
**A:** Common errors and solutions:

**"Cannot read property..."**
- Polymarket may have changed their HTML structure
- Try refreshing the page
- Check if you're on the betting history page

**"Extension context invalidated"**
- Reload the extension in `chrome://extensions/`
- Refresh the Polymarket page

**No errors but no widget**
- Make sure you have betting history visible
- Try scrolling down to load your bets
- Check that you're logged in to Polymarket

### Q: The widget overlaps with other page elements. How do I fix it?
**A:** Edit `styles.css` and adjust:
```css
.pnl-widget {
  top: 100px;    /* Increase to move down */
  right: 20px;   /* Decrease to move left */
}
```

### Q: Can I hide the widget temporarily?
**A:** Currently no, but you can:
1. Disable the extension in `chrome://extensions/`
2. Or add a close button by editing the code

## Performance Questions

### Q: Does it slow down Polymarket?
**A:** No. The extension is very lightweight and only runs calculations when the page loads or updates.

### Q: How many bets can it handle?
**A:** It should handle hundreds or thousands of bets without issues. If you notice slowness with many bets, let us know!

## Support Questions

### Q: I found a bug. Where do I report it?
**A:** Check the main README.md for contact information, or:
1. Describe the issue
2. Include browser console logs (F12 → Console)
3. Mention what page you were on
4. Include a screenshot if possible

### Q: Can I request a feature?
**A:** Absolutely! Common requests might include:
- Export to CSV
- Date range filtering
- Charts and graphs
- Custom color themes
- Different positions for the widget

### Q: Is there a way to contribute?
**A:** Yes! This is open source. You can:
- Report bugs
- Suggest features
- Submit code improvements
- Help with documentation

---

## Still Have Questions?

Check the other documentation files:
- `INSTALLATION.md` - Setup instructions
- `README.md` - Full documentation
- `DEMO.md` - See what it looks like
- `START_HERE.txt` - Quick start guide

Or open the browser console (F12) and look for "[Polymarket P&L]" messages for debugging info!

