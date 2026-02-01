import { useMemo } from 'react';

import { cn } from '../../../utils';

type MentionAvatarSize = 'inline' | 'sm' | 'md' | 'lg';

type MentionAvatarProps = {
  name: string;
  avatar?: string;
  size?: MentionAvatarSize;
  className?: string;
};

const sizeStyles: Record<MentionAvatarSize, { width: string; height: string; fontSize: string }> = {
  // Inline size uses em units to match parent text line height
  inline: { width: '1em', height: '1em', fontSize: '0.6em' },
  sm: { width: '20px', height: '20px', fontSize: '10px' },
  md: { width: '28px', height: '28px', fontSize: '11px' },
  lg: { width: '36px', height: '36px', fontSize: '12px' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }

  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];

  return colors[Math.abs(hash) % colors.length];
}

export const MentionAvatar = ({ name, avatar, size = 'inline', className }: MentionAvatarProps) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const bgColor = useMemo(() => stringToColor(name), [name]);
  const styles = sizeStyles[size];

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        style={{ width: styles.width, height: styles.height }}
        className={cn('rounded-full object-cover flex-shrink-0', className)}
      />
    );
  }

  return (
    <div
      style={{ width: styles.width, height: styles.height }}
      className={cn(
        'rounded-full flex items-center justify-center font-medium text-white flex-shrink-0',
        bgColor,
        className,
      )}>
      {initials}
    </div>
  );
};
