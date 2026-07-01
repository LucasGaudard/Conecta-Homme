"use client";

import { useEffect, useRef, useState } from "react";
import type { Notification } from "@prisma/client";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import {
  getNotificationBellIcon,
  getNotificationBellLabel,
} from "@/lib/notifications/format";
import { cn } from "@/lib/utils";

type NotificationBellProps = {
  latest: Notification[];
  route: string;
  unreadCount: number;
};

export function NotificationBell({
  latest,
  route,
  unreadCount,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const BellIcon = getNotificationBellIcon(unreadCount);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={getNotificationBellLabel(unreadCount)}
        className={cn(
          "relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-navy-950 shadow-sm transition duration-200 hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          open && "border-slate-300 bg-slate-50 shadow-elevated",
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <BellIcon className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <NotificationDropdown
          latest={latest}
          route={route}
          unreadCount={unreadCount}
        />
      ) : null}
    </div>
  );
}
