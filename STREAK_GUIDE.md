# Streak Visualization Update

The extension now visualizes **Profit/Loss streaks** directly beside your betting history list.

## 🎨 New Visualization Features

1. **Streak Brackets**: A colored vertical line connects consecutive Wins or Losses.
   - 🟢 Green line for consecutive profits
   - 🔴 Red line for consecutive losses

2. **Subtotal Bubbles**: A floating label appears next to each streak showing the sum for that specific group.
   - Shows like: `+$3.50` or `-$5.00`
   - Positioned vertically centered relative to the streak

3. **Arrows**: Visual indicators pointing from the streak to the subtotal.

## 🎯 How It Works

- The script detects consecutive rows with the same P&L sign (positive vs negative).
- It groups them together visually.
- It calculates the sum for just those rows.
- It draws a connector and label on the right side.

## 🛠️ Usage

1. Reload the extension in Chrome.
2. Go to your Polymarket betting history.
3. You will see colored bars and totals appearing on the right side of the list.
4. Scroll up/down - the visuals update automatically.

## 📝 Note on Virtual Scrolling

Polymarket uses a "virtual list" (recycling DOM elements as you scroll). This extension uses absolute positioning relative to the first row of a streak to ensure visual elements move correctly with the scroll.

If visuals seem to lag slightly during fast scrolling, this is normal due to the DOM recycling speed. The extension uses debouncing to keep performance high.

