# Demo: Polymarket P&L Calculator Extension

## What It Looks Like

When you visit your Polymarket betting history, you'll see a widget like this on the right side:

```
┌─────────────────────────┐
│      TOTAL P&L          │
│                         │
│      +$8.55             │ ← Green if profit
│                         │
├─────────────────────────┤
│ Wins: 13                │
│ Losses: 2               │
│ Total Bets: 15          │
└─────────────────────────┘
```

## Example Calculations

### Scenario 1: All Wins
If your betting history shows:
- Win: +$0.25
- Win: +$1.05
- Win: +$1.40

**Widget will show:**
- Total P&L: +$2.70 (in green)
- Wins: 3
- Losses: 0
- Total Bets: 3

### Scenario 2: Mixed Results
If your betting history shows:
- Win: +$0.25
- Win: +$1.05
- Loss: -$3.45
- Win: +$1.40

**Widget will show:**
- Total P&L: -$0.75 (in red)
- Wins: 3
- Losses: 1
- Total Bets: 4

### Scenario 3: Based on Your Image
From the screenshot provided, the visible bets show:
- $0.25 (5.26%)   ← Win
- $1.05 (26.58%)  ← Win
- $1.40 (38.89%)  ← Win
- $0.25 (5.26%)   ← Win
- $0.25 (5.26%)   ← Win
- $0.30 (6.38%)   ← Win
- $0.70 (16.28%)  ← Win
- $0.90 (21.95%)  ← Win
- $0.25 (5.26%)   ← Win
- $0.25 (5.26%)   ← Win
- $0.25 (5.26%)   ← Win
- -$3.45 (-100%)  ← Loss
- $1.15 (29.87%)  ← Win
- -$3.50 (-100%)  ← Loss
- $1.25 (33.33%)  ← Win
- ... more bets

**Widget would show:**
- Total P&L: (sum of all visible) 
- Wins: X
- Losses: Y
- Total Bets: X + Y

## Features in Action

### 1. Automatic Updates
- Load the page → Widget appears
- Click "Load more" → Widget updates with new bets
- No manual refresh needed!

### 2. Visual Feedback
- **Green numbers** = You're in profit! 📈
- **Red numbers** = You're in loss 📉
- **Color-coded stats** for easy reading

### 3. Always Visible
- Widget stays in the same spot as you scroll
- Non-intrusive design
- Matches Polymarket's dark theme

## Real-World Usage

### Morning Check
1. Open Polymarket
2. Go to your profile
3. Instantly see yesterday's performance
4. Plan today's strategy

### After a Betting Session
1. Place your bets
2. Wait for results
3. Refresh your history
4. See updated P&L immediately

### Monthly Review
1. Load all betting history (keep clicking "Load more")
2. Widget shows your month's total performance
3. Export data or take screenshots for records

## Widget Position

```
┌──────────────────────────────────────────────────┐
│  Polymarket                        [Profile] [×] │
│                                                   │
│  ┌────────────────────┐          ┌──────────┐   │
│  │                    │          │          │   │
│  │   Betting          │          │  Widget  │   │
│  │   History          │          │  Appears │   │
│  │                    │          │  Here!   │   │
│  │   • Bet 1          │          │          │   │
│  │   • Bet 2          │          └──────────┘   │
│  │   • Bet 3          │                          │
│  │   • ...            │                          │
│  │                    │                          │
│  └────────────────────┘                          │
│                                                   │
└──────────────────────────────────────────────────┘
```

The widget appears in the top-right area, so it doesn't interfere with your betting history view.

## Pro Tips

1. **Load All History**: Keep clicking "Load more" until all bets are visible for accurate totals
2. **Take Screenshots**: Use the widget for monthly performance reviews
3. **Track Progress**: Visit daily to monitor your betting performance
4. **Share Results**: Screenshot the widget to share your wins with friends!

## Privacy Note

🔒 All calculations happen locally in your browser
🔒 No data is sent to any server
🔒 No tracking or analytics
🔒 Your betting data stays private

---

Ready to see it in action? Install the extension and visit Polymarket! 🚀

