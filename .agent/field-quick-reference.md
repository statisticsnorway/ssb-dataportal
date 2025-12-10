# Quick Reference: Field Component

## 📦 Import
```typescript
import { Field } from '@/components/field/field';
import { FieldConfig } from '@/types/field-config';
```

## 🎨 Field Types

### 1. Text
```typescript
{ type: 'text', label: 'Name', value: 'John Doe' }
```

### 2. Long Text
```typescript
{ type: 'longtext', label: 'Description', value: 'Long paragraph...' }
```

### 3. Link
```typescript
{ 
  type: 'link', 
  label: 'Website', 
  value: 'https://example.com',
  href: 'https://example.com',
  linkText: 'Visit',        // Optional, defaults to 'Lenke'
  openInNewTab: true        // Optional, defaults to true
}
```

### 4. Date
```typescript
{ 
  type: 'date', 
  label: 'Created', 
  value: new Date(),
  format: 'iso'  // 'iso' | 'short' | 'long'
}
```

### 5. List
```typescript
{ 
  type: 'list', 
  label: 'Tags', 
  values: ['React', 'TypeScript'],
  separator: ', ',    // Optional, defaults to ', '
  maxItems: 5        // Optional, shows "+X mer" if exceeded
}
```

### 6. Boolean
```typescript
{ 
  type: 'boolean', 
  label: 'Active', 
  value: true,
  labels: { true: 'Yes', false: 'No' }  // Optional, defaults to 'Ja'/'Nei'
}
```

### 7. Custom
```typescript
{ 
  type: 'custom', 
  label: 'Special', 
  render: () => <YourCustomComponent />
}
```

## 🎛️ Common Options

All field types support:
- `label: string` - Field label (required)
- `hideIfEmpty?: boolean` - Hide field if value is empty
- `className?: string` - Additional CSS classes
- `id?: string` - For testing/accessibility

## 💡 Usage in Components

```typescript
const fields: FieldConfig[] = [
  { type: 'text', label: 'Name', value: data.name },
  { type: 'date', label: 'Created', value: data.createdAt, format: 'iso' },
  { type: 'list', label: 'Tags', values: data.tags, hideIfEmpty: true },
];

return (
  <dl>
    {fields.map((config, i) => (
      <Field key={i} config={config} />
    ))}
  </dl>
);
```

## 📍 File Locations

- **Component**: `/src/components/field/field.tsx`
- **Types**: `/src/types/field-config.ts`
- **Styles**: `/src/components/field/field.module.css`
