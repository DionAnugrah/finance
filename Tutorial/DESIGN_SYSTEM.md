# Finance App - Design System

## 🎨 Design Overview

Aplikasi ini menggunakan modern glassmorphism design dengan gradient backgrounds dan smooth animations.

## Color Palette

### Primary Colors
- **Purple Gradient**: `#667eea` → `#764ba2`
- **Blue Gradient**: `#4facfe` → `#00f2fe`
- **Pink Gradient**: `#f093fb` → `#f5576c`
- **Gold Gradient**: `#f6d365` → `#fda085`

### Background
- **Main Background**: Linear gradient `#0f0c29` → `#302b63` → `#24243e`
- **Card Background**: `rgba(30, 30, 40, 0.7)` with backdrop blur
- **Modal Background**: `rgba(30, 30, 40, 0.95)` with backdrop blur

### Text Colors
- **Primary Text**: `#eee` (light gray)
- **Secondary Text**: `rgba(255, 255, 255, 0.8)`
- **Muted Text**: `rgba(255, 255, 255, 0.6)`

### Status Colors
- **Success/Positive**: `#66ff66` (bright green)
- **Error/Negative**: `#ff6666` (bright red)
- **Warning**: `#fda085` (orange)
- **Info**: `#4facfe` (blue)

## Typography

### Font Family
- Primary: `Inter`, `Segoe UI`, `Poppins`, sans-serif

### Font Sizes
- **H1**: `2rem` - `2.5rem`
- **H2**: `1.5rem`
- **H3**: `1.1rem`
- **Body**: `0.95rem`
- **Small**: `0.85rem`

### Font Weights
- Regular: `400`
- Medium: `500`
- Semibold: `600`
- Bold: `700`

## Components

### Buttons

#### Primary Button
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
padding: 12px 24px;
border-radius: 12px;
box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
```

#### Danger Button
```css
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
```

#### Secondary Button
```css
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
```

#### Warning Button
```css
background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
box-shadow: 0 4px 15px rgba(253, 160, 133, 0.4);
```

### Cards

```css
background: rgba(30, 30, 40, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
padding: 2.5rem;
box-shadow: 
  0 8px 32px rgba(0, 0, 0, 0.3),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

### Inputs & Selects

```css
background: rgba(40, 40, 50, 0.6);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
padding: 12px 16px;
```

**Focus State:**
```css
border-color: #667eea;
background: rgba(40, 40, 50, 0.8);
box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
transform: translateY(-2px);
```

### Tables

```css
border-radius: 12px;
overflow: hidden;
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
```

**Header:**
```css
background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
```

**Row Hover:**
```css
background: rgba(102, 126, 234, 0.1);
transform: scale(1.01);
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
```

### Modals

```css
background: rgba(30, 30, 40, 0.95);
backdrop-filter: blur(20px);
border-radius: 20px;
padding: 2.5rem;
box-shadow: 
  0 20px 60px rgba(0, 0, 0, 0.5),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.1);
```

## Animations

### Fade In
```css
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide In
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Spin (Loading)
```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

### Shake (Error)
```css
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
```

## Spacing

- **Extra Small**: `0.5rem` (8px)
- **Small**: `1rem` (16px)
- **Medium**: `1.5rem` (24px)
- **Large**: `2rem` (32px)
- **Extra Large**: `2.5rem` (40px)

## Border Radius

- **Small**: `8px`
- **Medium**: `12px`
- **Large**: `16px`
- **Extra Large**: `20px`
- **Pill**: `25px` - `30px`
- **Circle**: `50%`

## Shadows

### Small
```css
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
```

### Medium
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

### Large
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
```

### Colored (Primary)
```css
box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
```

### Inset Highlight
```css
box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

## Effects

### Glassmorphism
```css
background: rgba(30, 30, 40, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Gradient Text
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Hover Lift
```css
transition: transform 0.3s ease, box-shadow 0.3s ease;

&:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}
```

## Responsive Breakpoints

- **Mobile**: `max-width: 480px`
- **Tablet**: `max-width: 768px`
- **Desktop**: `max-width: 1200px`

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA standards
- Keyboard navigation supported
- Screen reader friendly labels

## Best Practices

1. **Use consistent spacing** - Stick to the spacing scale
2. **Maintain hierarchy** - Use font sizes and weights appropriately
3. **Smooth transitions** - All animations should be 0.3s ease
4. **Glassmorphism** - Use backdrop-filter for modern look
5. **Gradient accents** - Use gradients for important elements
6. **Hover feedback** - Always provide visual feedback on hover
7. **Loading states** - Show loading indicators for async operations
8. **Error handling** - Display clear error messages with shake animation

## Icons

Using emoji icons for simplicity:
- 💰 Finance/Money
- 📊 Charts/Analytics
- 📈 Stocks/Growth
- 💱 Exchange/Currency
- 📝 Description/Notes
- 💵 Amount/Cash
- ⚙️ Settings/Actions
- 🚪 Logout/Exit
- ✨ Add/Create
- 🔒 Security/Password
- 📧 Email/Contact

## Future Enhancements

- Dark/Light mode toggle
- Custom theme colors
- More animation options
- Advanced chart visualizations
- Mobile app version
