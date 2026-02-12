"use client";

import { Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useCollaboration, useConnectionStatus } from "@yoopta/collaboration";

const STATUS_CONFIG = {
  connected: {
    icon: Wifi,
    label: "Connected",
    variant: "success" as const,
    iconClass: "text-emerald-500",
  },
  connecting: {
    icon: Loader2,
    label: "Connecting...",
    variant: "warning" as const,
    iconClass: "text-amber-500 animate-spin",
  },
  disconnected: {
    icon: WifiOff,
    label: "Disconnected",
    variant: "secondary" as const,
    iconClass: "text-neutral-400",
  },
  error: {
    icon: AlertCircle,
    label: "Connection Error",
    variant: "warning" as const,
    iconClass: "text-red-500",
  },
};

export const CollaborationStatusBar = () => {
  const status = useConnectionStatus();
  const { connectedUsers, isSynced } = useCollaboration();

  const config = STATUS_CONFIG[status];
  const StatusIcon = config.icon;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      {/* Left: connection status */}
      <div className="flex items-center gap-3">
        <Badge variant={config.variant} className="gap-1.5 text-xs">
          <StatusIcon className={cn("w-3 h-3", config.iconClass)} />
          {config.label}
        </Badge>
        {status === "connected" && (
          <span className="text-xs text-muted-foreground">
            {isSynced ? "Synced" : "Syncing..."}
          </span>
        )}
      </div>

      {/* Right: connected users */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {connectedUsers.length} {connectedUsers.length === 1 ? "user" : "users"}
        </span>
        <div className="flex -space-x-2">
          {connectedUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white ring-2 ring-white dark:ring-neutral-900 transition-transform hover:scale-110 hover:z-10 cursor-default"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </TooltipTrigger>
              <TooltipContent>{user.name}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};
