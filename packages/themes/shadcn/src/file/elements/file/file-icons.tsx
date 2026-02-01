import type { FileType } from '@yoopta/file';
import {
  Archive,
  Code,
  File,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  type LucideIcon,
  Presentation,
} from 'lucide-react';

// Map file types to icons and colors
const FILE_TYPE_ICONS: Record<FileType, { icon: LucideIcon; color: string; bgColor: string }> = {
  pdf: {
    icon: FileText,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  document: {
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  presentation: {
    icon: Presentation,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  image: {
    icon: FileImage,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  video: {
    icon: FileVideo,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  audio: {
    icon: FileAudio,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  archive: {
    icon: Archive,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  code: {
    icon: Code,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  text: {
    icon: FileText,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50',
  },
  unknown: {
    icon: File,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

type FileIconProps = {
  fileType: FileType;
  className?: string;
};

export const FileIcon = ({ fileType, className }: FileIconProps) => {
  const config = FILE_TYPE_ICONS[fileType] ?? FILE_TYPE_ICONS.unknown;
  const Icon = config.icon;

  return <Icon className={className} />;
};

export const getFileTypeStyles = (fileType: FileType) => FILE_TYPE_ICONS[fileType] ?? FILE_TYPE_ICONS.unknown;
