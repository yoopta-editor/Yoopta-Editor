# Theme System

Система управления темами для Yoopta UI компонентов.

## 🎨 Возможности

- ✅ **Light / Dark / System режимы**
- ✅ **Автоматическое сохранение** в localStorage
- ✅ **Синхронизация с системной темой**
- ✅ **CSS переменные** для кастомизации
- ✅ **React Context** для глобального доступа
- ✅ **Готовый компонент** ThemeToggle

## 🚀 Использование

### Вариант 1: useTheme hook (рекомендуется)

```tsx
import { useTheme } from '@yoopta/ui';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>

      <button onClick={toggleTheme}>Toggle Theme</button>

      <button onClick={() => setTheme('light')}>Light</button>

      <button onClick={() => setTheme('dark')}>Dark</button>

      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

### Вариант 2: ThemeProvider (опционально)

```tsx
import { ThemeProvider, useThemeContext } from '@yoopta/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  );
}

function YourApp() {
  const { toggleTheme } = useThemeContext();

  return <button onClick={toggleTheme}>Toggle</button>;
}
```

### Вариант 3: ThemeToggle компонент

```tsx
import { ThemeToggle } from '@yoopta/ui';

function Toolbar() {
  return (
    <div>
      {/* Готовая кнопка с иконками */}
      <ThemeToggle />

      {/* Или с кастомным className */}
      <ThemeToggle className="my-custom-button" />
    </div>
  );
}
```

## 🎨 CSS Переменные

Все UI компоненты используют CSS переменные, которые автоматически меняются при смене темы:

```css
:root {
  /* Light theme */
  --yoopta-ui-background: 0 0% 100%;
  --yoopta-ui-foreground: 222.2 84% 4.9%;
  --yoopta-ui-muted: 210 40% 96.1%;
  --yoopta-ui-muted-foreground: 215.4 16.3% 46.9%;
  --yoopta-ui-border: 214.3 31.8% 91.4%;
  --yoopta-ui-accent: 210 40% 96.1%;
  --yoopta-ui-ring: 222.2 84% 4.9%;
}

.dark {
  /* Dark theme */
  --yoopta-ui-background: 222.2 84% 4.9%;
  --yoopta-ui-foreground: 210 40% 98%;
  --yoopta-ui-muted: 217.2 32.6% 17.5%;
  --yoopta-ui-muted-foreground: 215 20.2% 65.1%;
  --yoopta-ui-border: 217.2 32.6% 17.5%;
  --yoopta-ui-accent: 217.2 32.6% 17.5%;
  --yoopta-ui-ring: 212.7 26.8% 83.9%;
}
```

## 🔧 Кастомизация

### Переопределение переменных

```css
:root {
  /* Кастомные цвета для светлой темы */
  --yoopta-ui-background: 210 40% 98%;
  --yoopta-ui-accent: 220 100% 50%;
}

.dark {
  /* Кастомные цвета для темной темы */
  --yoopta-ui-background: 220 13% 9%;
  --yoopta-ui-accent: 220 100% 60%;
}
```

### Кастомная кнопка переключения

```tsx
import { useTheme } from '@yoopta/ui';

function MyThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="px-4 py-2 rounded bg-blue-500 text-white">
      {resolvedTheme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

## 📚 API

### `useTheme()`

```typescript
type UseTheme = () => {
  theme: 'light' | 'dark' | 'system'; // Выбранная тема
  resolvedTheme: 'light' | 'dark'; // Фактически применённая тема
  setTheme: (theme: Theme) => void; // Установить тему
  toggleTheme: () => void; // Переключить light ↔ dark
};
```

### `ThemeProvider`

```typescript
type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system'; // По умолчанию 'system'
};
```

### `ThemeToggle`

```typescript
type ThemeToggleProps = {
  className?: string; // Кастомный CSS класс
};
```

## 🎯 Как это работает

1. **Инициализация**: При монтировании читает тему из localStorage или использует системную
2. **Применение**: Добавляет класс `.light` или `.dark` на `<html>` элемент
3. **Сохранение**: Автоматически сохраняет выбор в localStorage
4. **Синхронизация**: Слушает изменения системной темы (если выбран режим 'system')
5. **CSS**: Все компоненты используют CSS переменные, которые меняются в зависимости от класса

## 💡 Примеры

### Интеграция с YooptaEditor

```tsx
import YooptaEditor from '@yoopta/editor';
import { useTheme } from '@yoopta/ui';

function MyEditor() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      <YooptaEditor
        editor={editor}
        // ... other props
      />

      {/* Все UI компоненты автоматически поддерживают тему */}
      <FloatingBlockActions />
      <Toolbar />
      <SlashActionMenuList />
    </div>
  );
}
```

### Программное управление

```tsx
import { useTheme } from '@yoopta/ui';

function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

## 🌟 Best Practices

1. **Используйте `useTheme`** напрямую - не нужен Provider в большинстве случаев
2. **Используйте `resolvedTheme`** для отображения UI - это фактическая применённая тема
3. **Используйте `theme`** для сохранения выбора пользователя
4. **Не забудьте** добавить CSS переменные в свои кастомные компоненты

## 🎨 Поддержка Tailwind CSS

Если используете Tailwind, добавьте в `tailwind.config.js`:

```js
module.exports = {
  darkMode: 'class', // Важно!
  // ... rest of config
};
```

Теперь можно использовать `dark:` модификатор:

```tsx
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">Hello, World!</p>
</div>
```
