# Design Guidelines - Revision App

## Design Philosophy
**"Library Feel" - Quiet, Soft, Easy to Understand**

The revision app should embody the calm, focused atmosphere of a library. It should be a digital sanctuary for learning, free from distractions, with gentle visual cues that guide users naturally through their study sessions.

## Visual Identity

### Color Palette

#### Primary Colors
- **Warm Gray**: `#F8F6F3` - Main background, creates soft, paper-like feel
- **Soft Beige**: `#F5F2ED` - Secondary backgrounds, subtle contrast
- **Charcoal**: `#2C2C2C` - Primary text, readable but not harsh
- **Muted Blue**: `#6B7C93` - Accent color for interactive elements
- **Forest Green**: `#5A7C65` - Success states, completion indicators

#### Secondary Colors
- **Light Gray**: `#E8E5E0` - Borders, subtle dividers
- **Warm White**: `#FEFCF9` - Card backgrounds, elevated surfaces
- **Soft Orange**: `#D4A574` - Gentle highlights, progress indicators
- **Muted Red**: `#B85C57` - Error states, gentle warnings

#### Text Colors
- **Primary Text**: `#2C2C2C` (Charcoal)
- **Secondary Text**: `#6B7C93` (Muted Blue)
- **Muted Text**: `#9CA3AF` (Light Gray)
- **Placeholder Text**: `#D1D5DB`

### Typography

#### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

#### Font Weights
- **Light**: 300 - For subtle text, captions
- **Regular**: 400 - Body text, default
- **Medium**: 500 - Emphasis, subheadings
- **Semibold**: 600 - Headings, important labels
- **Bold**: 700 - Primary headings, call-to-actions

#### Typography Scale (Mobile-First)
- **Display**: 2rem (32px) - Page titles
- **H1**: 1.75rem (28px) - Section headers
- **H2**: 1.5rem (24px) - Subsection headers
- **H3**: 1.25rem (20px) - Card titles
- **Body Large**: 1.125rem (18px) - Important body text
- **Body**: 1rem (16px) - Default body text
- **Body Small**: 0.875rem (14px) - Secondary text
- **Caption**: 0.75rem (12px) - Labels, timestamps

### Spacing System

#### Base Unit: 0.25rem (4px)

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Component Standards

#### Cards
- **Background**: Warm White (`#FEFCF9`)
- **Border**: Light Gray (`#E8E5E0`)
- **Border Radius**: 0.75rem (12px)
- **Padding**: 1.5rem (24px)
- **Shadow**: Subtle, soft shadow for elevation
- **Hover State**: Gentle lift with slightly stronger shadow

#### Buttons
- **Primary Button**:
  - Background: Muted Blue (`#6B7C93`)
  - Text: Warm White (`#FEFCF9`)
  - Border Radius: 0.5rem (8px)
  - Padding: 0.75rem 1.5rem (12px 24px)
  - Font Weight: Medium (500)

- **Secondary Button**:
  - Background: Transparent
  - Border: Light Gray (`#E8E5E0`)
  - Text: Charcoal (`#2C2C2C`)
  - Border Radius: 0.5rem (8px)
  - Padding: 0.75rem 1.5rem (12px 24px)

#### Input Fields
- **Background**: Warm White (`#FEFCF9`)
- **Border**: Light Gray (`#E8E5E0`)
- **Border Radius**: 0.5rem (8px)
- **Padding**: 0.75rem 1rem (12px 16px)
- **Focus State**: Border color changes to Muted Blue (`#6B7C93`)
- **Placeholder**: Muted Gray (`#9CA3AF`)

### Layout Principles

#### Mobile-First Approach
- Design for mobile screens (320px+) first
- Progressive enhancement for larger screens
- Touch-friendly interface elements (minimum 44px touch targets)
- Single-column layouts on mobile
- Comfortable thumb navigation zones

#### Grid System
- **Mobile**: Single column, full width
- **Tablet**: 2-column layout where appropriate
- **Desktop**: Maximum content width of 1200px, centered

#### Content Hierarchy
- Clear visual hierarchy with consistent spacing
- Generous white space for breathing room
- Logical flow from top to bottom
- Important actions prominently placed but not overwhelming

### Interaction Design

#### Micro-interactions
- Subtle animations (200-300ms duration)
- Gentle easing curves (`ease-out`)
- Hover states with soft transitions
- Loading states with calm, non-distracting animations

#### Accessibility
- High contrast ratios (minimum 4.5:1 for normal text)
- Keyboard navigation support
- Screen reader friendly
- Focus indicators clearly visible
- Touch targets minimum 44px

### Iconography
- **Style**: Outline icons with rounded corners
- **Weight**: 1.5px stroke width
- **Size**: 20px for standard icons, 24px for primary actions
- **Color**: Inherit from text color or use Muted Blue for accents

### Imagery
- **Style**: Soft, muted photography
- **Treatment**: Slightly desaturated, warm tones
- **Placeholder**: Gentle geometric patterns or soft gradients
- **Aspect Ratios**: Consistent ratios for visual harmony

## Implementation Notes

### CSS Custom Properties
```css
:root {
  --color-warm-gray: #F8F6F3;
  --color-soft-beige: #F5F2ED;
  --color-charcoal: #2C2C2C;
  --color-muted-blue: #6B7C93;
  --color-forest-green: #5A7C65;
  --color-light-gray: #E8E5E0;
  --color-warm-white: #FEFCF9;
  --color-soft-orange: #D4A574;
  --color-muted-red: #B85C57;
}
```

### Tailwind Configuration
The design system should be implemented using Tailwind CSS utilities, with custom colors and spacing defined in the Tailwind config for consistency across the application.

## Brand Voice
- **Tone**: Calm, supportive, encouraging
- **Language**: Clear, concise, friendly
- **Messaging**: Focus on progress, not perfection
- **Feedback**: Gentle, constructive, motivating

---

*This design system ensures the revision app feels like a peaceful study environment, promoting focus and learning without distractions.*
