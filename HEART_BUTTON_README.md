# Heart Button Component 🩸

## Overview
A beautiful, interactive heart button component that matches the blood bank website's crimson and dark red color theme. Features particle effects, animations, and a heartbeat animation.

## Component Details

### Location
`src/components/HeartButton.tsx`

### Features
- ❤️ Heart icon from lucide-react
- ✨ Particle effects on hover (crimson-themed)
- 💓 Heartbeat animation
- 🎨 Matches blood bank color scheme:
  - Primary: Crimson Red (#DC143C)
  - Secondary: Dark Blood Red (#8B0000)
  - Accents: Various crimson shades
- 📱 Responsive and mobile-friendly
- 🎯 Smooth hover and active states

### Color Palette Used
- `#DC143C` - Crimson (Primary)
- `#8B0000` - Dark Blood Red (Secondary)
- `#ff1a4a` - Bright Crimson
- `#f5a3a3` - Light Crimson
- `#a81414` - Dark variant
- `#ff6b6b` - Medium Red
- `#cc1f1f` - Dark Crimson

## Usage

### Basic Implementation

```typescript
import { HeartButton } from "@/components/HeartButton";

export default function MyPage() {
  return (
    <div>
      <HeartButton />
    </div>
  );
}
```

### With Handler Function

```typescript
import { HeartButton } from "@/components/HeartButton";
import { useRef } from "react";

export default function MyPage() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    console.log("Heart button clicked!");
    // Add your logic here
  };

  return (
    <button ref={buttonRef} onClick={handleClick}>
      <HeartButton />
    </button>
  );
}
```

### Styling Customization

The button uses Tailwind CSS classes for styling. To customize:

1. **Size**: Modify the `size` property on Heart icons
   ```tsx
   <Heart className="size-8" /> // Larger
   <Heart className="size-4" /> // Smaller
   ```

2. **Colors**: Update gradient classes in the gradient div
   ```tsx
   className="bg-gradient-to-r from-crimson-500 via-crimson-600 to-crimson-700"
   ```

3. **Padding**: Adjust the `p-3` class
   ```tsx
   className="p-4" // More padding
   className="p-2" // Less padding
   ```

## Required Dependencies

- `react` - Core React library
- `lucide-react` - Heart icon
- `@tsparticles/react` - Particle effects
- `@tsparticles/engine` - Particle engine
- `tailwindcss` - Styling

## Installation of Dependencies

If not already installed:

```bash
npm install lucide-react
npm install @tsparticles/react @tsparticles/engine
```

## Animation Details

### Heartbeat Animation
- Duration: 2s (customizable via `animationDuration` style)
- Timing: `ease-in-out`
- Uses the `@keyframes heartbeat` defined in `globals.css`

### Particle Effects
- 20 particles by default
- Crimson-themed colors
- Absorber effect centered on the button
- Smooth movement and rotation

### Hover Effects
- Scale: 110% (1.1x)
- Active scale: 105% (1.05x)
- Smooth transition with cubic-bezier easing

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (cursor hidden, touch-optimized)

## Accessibility

- Semantic HTML button element
- Proper focus states (via tailwindcss)
- Icon-only button (consider adding aria-label for screen readers)

### Recommended: Add ARIA Labels

```tsx
<button
  aria-label="Donate blood"
  className="group relative my-8 rounded-full..."
>
```

## Performance Notes

- Particles are lazy-loaded via tsparticles
- Only initialized on component mount
- Particle state managed efficiently with React hooks
- Uses `useMemo` to optimize particle options

## Integration Examples

### In Hero Section
```typescript
import HeartButton from "@/components/HeartButton";

export default function Hero() {
  return (
    <section className="hero">
      <h1>Save Lives</h1>
      <HeartButton />
      <p>Donate blood today</p>
    </section>
  );
}
```

### In Call-to-Action
```typescript
<div className="cta-section">
  <h2>Ready to Make a Difference?</h2>
  <HeartButton />
</div>
```

### Multiple Buttons
```typescript
<div className="button-group">
  <HeartButton />
  <HeartButton />
  <HeartButton />
</div>
```

## Troubleshooting

### Particles Not Showing
1. Ensure `@tsparticles/engine` is installed
2. Check browser console for errors
3. Verify `fullScreen` is set to `false` in options

### Color Looks Different
1. Verify tailwindcss is configured with custom color variables
2. Check theme colors in `globals.css`
3. Ensure color classes are available in your Tailwind config

### Animation Choppy
1. Check `fpsLimit` setting (default: 120)
2. Reduce number of particles if needed
3. Disable particle effects on lower-end devices

## Customization Examples

### More Particles
```typescript
particles: {
  number: {
    value: 40, // Increased from 20
  },
}
```

### Slower Heartbeat
```typescript
style={{
  animationDuration: "3s", // Instead of 2s
}}
```

### Different Gradient
```typescript
className="bg-gradient-to-r from-blood via-crimson-600 to-blood-light"
```

## Future Enhancements

- Add click animation variants
- Support for custom colors prop
- Size variants (small, medium, large)
- Sound effects option
- Analytics tracking
- Custom callback functions

## Support

For issues or questions:
1. Check the component code in `src/components/HeartButton.tsx`
2. Review the tsparticles documentation
3. Check Tailwind CSS documentation for styling

---

Made with ❤️ for the blood bank project
