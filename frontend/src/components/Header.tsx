import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ClipboardCheck,
  KeyRound,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { getAccessReview } from "../services/accessReview";

import {
  getHighRiskPrivilegedAccounts,
  getMfaDisabledPrivilegedAccounts,
} from "../services/privilegedAccess";

interface HeaderProps {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
}

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  route: string;
};

const searchableModules = [
  {
    label: "Dashboard",
    description: "Enterprise identity overview",
    route: "/",
  },
  {
    label: "Identities",
    description: "Identity inventory and risk",
    route: "/identities",
  },
  {
    label: "Access Control",
    description: "Access assignments and governance",
    route: "/access-control",
  },
  {
    label: "Privileged Access",
    description: "Privileged identities and MFA risk",
    route: "/privileged-access",
  },
  {
    label: "Access Reviews",
    description: "Certification and governance reviews",
    route: "/access-reviews",
  },
  {
    label: "Roles",
    description: "Role and permission governance",
    route: "/roles",
  },
  {
    label: "Risk Intelligence",
    description: "Identity security risk analysis",
    route: "/risk-intelligence",
  },
  {
    label: "Activity",
    description: "IAM security activity",
    route: "/activity",
  },
  {
    label: "AI Copilot",
    description: "Ask IdentityForge AI",
    route: "/copilot",
  },
  {
    label: "Analytics",
    description: "Identity and access analytics",
    route: "/analytics",
  },
  {
    label: "Settings",
    description: "Platform configuration",
    route: "/settings",
  },
];

export default function Header({
  title,
  subtitle,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [readNotifications, setReadNotifications] =
    useState<Set<string>>(new Set());

  const [notificationsLoading, setNotificationsLoading] =
    useState(true);

  const profileRef =
    useRef<HTMLDivElement | null>(null);

  const notificationRef =
    useRef<HTMLDivElement | null>(null);

  const searchRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      const results = await Promise.allSettled([
        getAccessReview(),
        getHighRiskPrivilegedAccounts(),
        getMfaDisabledPrivilegedAccounts(),
      ]);

      const [
        accessReviewResult,
        highRiskResult,
        mfaDisabledResult,
      ] = results;

      const alerts: NotificationItem[] = [];

      if (
        accessReviewResult.status === "fulfilled"
      ) {
        const review =
          accessReviewResult.value;

        if (review.overdueReviews > 0) {
          alerts.push({
            id: "overdue-reviews",
            title: "Overdue Access Reviews",
            description:
              `${review.overdueReviews} reviews require immediate attention.`,
            severity: "critical",
            route: "/access-reviews",
          });
        }

        if (review.pendingReviews > 0) {
          alerts.push({
            id: "pending-reviews",
            title: "Pending Certifications",
            description:
              `${review.pendingReviews} reviews are awaiting certification.`,
            severity: "warning",
            route: "/access-reviews",
          });
        }
      }

      if (
        highRiskResult.status === "fulfilled" &&
        highRiskResult.value.length > 0
      ) {
        alerts.push({
          id: "high-risk-privileged",
          title: "High-Risk Privileged Accounts",
          description:
            `${highRiskResult.value.length} privileged accounts require investigation.`,
          severity: "critical",
          route: "/privileged-access",
        });
      }

      if (
        mfaDisabledResult.status === "fulfilled" &&
        mfaDisabledResult.value.length > 0
      ) {
        alerts.push({
          id: "mfa-disabled",
          title: "Privileged MFA Exposure",
          description:
            `${mfaDisabledResult.value.length} privileged accounts have MFA disabled.`,
          severity: "critical",
          route: "/privileged-access",
        });
      }

      setNotifications(alerts);
      setNotificationsLoading(false);
    }

    loadNotifications();
  }, []);

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      const target =
        event.target as Node;

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !readNotifications.has(notification.id)
    ).length;

  const filteredModules = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) {
      return searchableModules;
    }

    return searchableModules.filter(
      (module) =>
        module.label.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  function openNotification(
    notification: NotificationItem
  ) {
    setReadNotifications(
      (current) =>
        new Set([
          ...current,
          notification.id,
        ])
    );

    setNotificationsOpen(false);

    navigate(notification.route);
  }

  function markAllAsRead() {
    setReadNotifications(
      new Set(
        notifications.map(
          (notification) =>
            notification.id
        )
      )
    );
  }

  function openSearchResult(
    route: string
  ) {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(route);
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0b1224]/95 px-3 py-2 backdrop-blur sm:px-4 lg:h-[72px] lg:px-6">

      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile menu */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-white lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Page identity */}
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold tracking-tight text-white sm:text-lg lg:text-xl">
            {title}
          </h1>

          <p className="hidden truncate text-xs text-slate-400 sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">

        {/* System status */}
        <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 xl:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          System Healthy
        </div>

        {/* SEARCH */}
        <div
          ref={searchRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => {
              setSearchOpen(
                (current) => !current
              );

              setNotificationsOpen(false);
              setProfileOpen(false);
            }}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
          >
            <Search size={20} />
          </button>

          {searchOpen && (
            <div className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl shadow-black/40 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[360px]">

              <div className="border-b border-slate-800 p-4">
                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
                  <Search
                    size={18}
                    className="text-slate-500"
                  />

                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(
                        event.target.value
                      )
                    }
                    placeholder="Search IAM modules..."
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() =>
                        setSearchQuery("")
                      }
                      className="text-slate-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {filteredModules.length > 0 ? (
                  filteredModules.map(
                    (module) => (
                      <button
                        type="button"
                        key={module.route}
                        onClick={() =>
                          openSearchResult(
                            module.route
                          )
                        }
                        className="w-full rounded-xl px-4 py-3 text-left transition hover:bg-slate-800"
                      >
                        <p className="text-sm font-semibold text-white">
                          {module.label}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {module.description}
                        </p>
                      </button>
                    )
                  )
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">
                    No IAM modules found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen(
                (current) => !current
              );

              setSearchOpen(false);
              setProfileOpen(false);
            }}
            className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-800/70 hover:text-white"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl shadow-black/40 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">

              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    Security Notifications
                  </h3>

                  <p className="mt-1 hidden text-xs text-slate-400 sm:block">
                    IAM governance and privileged access alerts
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    title="Mark all as read"
                    className="rounded-lg p-2 text-cyan-400 transition hover:bg-slate-800"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2 sm:max-h-[420px]">

                {notificationsLoading ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    Loading security alerts...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <ShieldCheck
                      size={30}
                      className="mx-auto text-emerald-400"
                    />

                    <p className="mt-3 text-sm font-medium text-white">
                      No active IAM alerts
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Identity security posture is currently stable.
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => {
                      const isRead =
                        readNotifications.has(
                          notification.id
                        );

                      const Icon =
                        notification.id ===
                        "overdue-reviews"
                          ? ClipboardCheck
                          : notification.id ===
                            "pending-reviews"
                          ? AlertTriangle
                          : notification.id ===
                            "mfa-disabled"
                          ? KeyRound
                          : ShieldAlert;

                      return (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() =>
                            openNotification(
                              notification
                            )
                          }
                          className={`mb-1 flex w-full gap-3 rounded-xl px-4 py-4 text-left transition hover:bg-slate-800 ${
                            isRead
                              ? "opacity-60"
                              : "bg-slate-900/70"
                          }`}
                        >
                          <div
                            className={`mt-0.5 rounded-lg p-2 ${
                              notification.severity ===
                              "critical"
                                ? "bg-red-500/10 text-red-400"
                                : notification.severity ===
                                  "warning"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-cyan-500/10 text-cyan-400"
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                {notification.title}
                              </p>

                              {!isRead && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-400">
                              {notification.description}
                            </p>
                          </div>
                        </button>
                      );
                    }
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            aria-label="Profile"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen(
                (current) => !current
              );

              setNotificationsOpen(false);
              setSearchOpen(false);
            }}
            className="rounded-xl p-2 text-cyan-400 transition hover:bg-slate-800/70"
          >
            <UserCircle size={26} />
          </button>

          {profileOpen && (
            <div className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl shadow-black/40 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-72">

              <div className="border-b border-slate-800 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <ShieldCheck size={24} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-white">
                      IAM Administrator
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      IdentityForge Admin Console
                    </p>
                  </div>

                </div>
              </div>

              <div className="border-b border-slate-800 px-5 py-4">

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Current Role
                </p>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  Identity Security Administrator
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs text-emerald-400">
                    Active Admin Session
                  </span>
                </div>

              </div>

              <div className="p-2">

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Settings size={18} />
                  Account & Settings
                </button>

                <button
                  type="button"
                  disabled
                  title="Authentication will be added in a future release"
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-500"
                >
                  <LogOut size={18} />

                  Sign Out

                  <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-600">
                    Demo
                  </span>
                </button>

              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}