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

import { useAuth } from "../auth/AuthContext";
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
  severity:
    | "critical"
    | "warning"
    | "info";
  route: string;
};


const searchableModules = [
  {
    label: "Dashboard",
    description:
      "Enterprise identity overview",
    route: "/",
  },
  {
    label: "Identities",
    description:
      "Identity inventory and risk",
    route: "/identities",
  },
  {
    label: "Access Control",
    description:
      "Access assignments and governance",
    route: "/access-control",
  },
  {
    label: "Privileged Access",
    description:
      "Privileged identities and MFA risk",
    route: "/privileged-access",
  },
  {
    label: "Access Reviews",
    description:
      "Certification and governance reviews",
    route: "/access-reviews",
  },
  {
    label: "Roles",
    description:
      "Role and permission governance",
    route: "/roles",
  },
  {
    label: "Risk Intelligence",
    description:
      "Identity security risk analysis",
    route: "/risk-intelligence",
  },
  {
    label: "Permission Drift",
    description:
      "14-day entitlement usage and drift analysis",
    route: "/permission-drift",
  },
  {
    label: "Activity",
    description:
      "IAM security activity",
    route: "/activity",
  },
  {
    label: "AI Copilot",
    description:
      "Ask IdentityForge AI",
    route: "/copilot",
  },
  {
    label: "Analytics",
    description:
      "Identity and access analytics",
    route: "/analytics",
  },
  {
    label: "Settings",
    description:
      "Platform configuration",
    route: "/settings",
  },
];


export default function Header({
  title,
  subtitle,
  onMenuClick,
}: HeaderProps) {
  const navigate =
    useNavigate();

  const {
    session,
    logout,
    isDemo,
  } = useAuth();


  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    searchOpen,
    setSearchOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);

  const [
    readNotifications,
    setReadNotifications,
  ] = useState<Set<string>>(
    new Set()
  );

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(true);


  const profileRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const notificationRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const searchRef =
    useRef<HTMLDivElement | null>(
      null
    );


  useEffect(() => {
    async function loadNotifications() {
      const results =
        await Promise.allSettled([
          getAccessReview(),
          getHighRiskPrivilegedAccounts(),
          getMfaDisabledPrivilegedAccounts(),
        ]);


      const [
        accessReviewResult,
        highRiskResult,
        mfaDisabledResult,
      ] = results;


      const alerts:
        NotificationItem[] = [];


      if (
        accessReviewResult.status ===
        "fulfilled"
      ) {
        const review =
          accessReviewResult.value;


        if (
          review.overdueReviews > 0
        ) {
          alerts.push({
            id:
              "overdue-reviews",

            title:
              "Overdue Access Reviews",

            description:
              `${review.overdueReviews} reviews require immediate attention.`,

            severity:
              "critical",

            route:
              "/access-reviews",
          });
        }


        if (
          review.pendingReviews > 0
        ) {
          alerts.push({
            id:
              "pending-reviews",

            title:
              "Pending Certifications",

            description:
              `${review.pendingReviews} reviews are awaiting certification.`,

            severity:
              "warning",

            route:
              "/access-reviews",
          });
        }
      }


      if (
        highRiskResult.status ===
          "fulfilled" &&
        highRiskResult.value.length > 0
      ) {
        alerts.push({
          id:
            "high-risk-privileged",

          title:
            "High-Risk Privileged Accounts",

          description:
            `${highRiskResult.value.length} privileged accounts require investigation.`,

          severity:
            "critical",

          route:
            "/privileged-access",
        });
      }


      if (
        mfaDisabledResult.status ===
          "fulfilled" &&
        mfaDisabledResult.value.length > 0
      ) {
        alerts.push({
          id:
            "mfa-disabled",

          title:
            "Privileged MFA Exposure",

          description:
            `${mfaDisabledResult.value.length} privileged accounts have MFA disabled.`,

          severity:
            "critical",

          route:
            "/privileged-access",
        });
      }


      setNotifications(
        alerts
      );

      setNotificationsLoading(
        false
      );
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
        !profileRef.current.contains(
          target
        )
      ) {
        setProfileOpen(
          false
        );
      }


      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setNotificationsOpen(
          false
        );
      }


      if (
        searchRef.current &&
        !searchRef.current.contains(
          target
        )
      ) {
        setSearchOpen(
          false
        );
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
        !readNotifications.has(
          notification.id
        )
    ).length;


  const filteredModules =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();


      if (!query) {
        return searchableModules;
      }


      return searchableModules.filter(
        (module) =>
          module.label
            .toLowerCase()
            .includes(query) ||

          module.description
            .toLowerCase()
            .includes(query)
      );
    }, [
      searchQuery,
    ]);


  function openNotification(
    notification:
      NotificationItem
  ) {
    setReadNotifications(
      (current) =>
        new Set([
          ...current,
          notification.id,
        ])
    );


    setNotificationsOpen(
      false
    );

    navigate(
      notification.route
    );
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
    setSearchOpen(
      false
    );

    setSearchQuery(
      ""
    );

    navigate(
      route
    );
  }


  function handleSignOut() {
    setProfileOpen(
      false
    );

    setNotificationsOpen(
      false
    );

    setSearchOpen(
      false
    );

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  return (
    <header className="sticky top-0 z-30">

      {/* HEADER SURFACE */}
      <div className="relative flex min-h-[64px] shrink-0 items-center justify-between border-b border-[var(--if-border-soft)] bg-[rgba(7,11,17,0.82)] px-3 py-2 backdrop-blur-xl sm:px-4 lg:h-[72px] lg:px-6">

        {/* TRUST LINE */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-teal-300/15 to-violet-300/10" />


        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            aria-label="Open navigation"
            onClick={
              onMenuClick
            }
            className="rounded-xl border border-transparent p-2 text-[var(--if-text-muted)] transition hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-white lg:hidden"
          >
            <Menu size={22} />
          </button>


          {/* PAGE CONTEXT */}
          <div className="min-w-0">

            <div className="flex items-center gap-2">

              <span className="hidden h-1.5 w-1.5 rounded-full bg-teal-300/80 sm:block" />

              <p className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--if-text-faint)] sm:block">
                Identity Workspace
              </p>

            </div>


            <h1 className="mt-0.5 truncate text-base font-bold tracking-[-0.02em] text-[var(--if-text-primary)] sm:text-lg lg:text-xl">
              {title}
            </h1>


            <p className="hidden truncate text-xs text-[var(--if-text-muted)] sm:block">
              {subtitle}
            </p>

          </div>

        </div>


        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">

          {/* SYSTEM HEALTH */}
          <div className="hidden items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] px-3 py-2 xl:flex">

            <span className="relative flex h-2.5 w-2.5 items-center justify-center">

              <span className="absolute h-full w-full rounded-full bg-emerald-300/20" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300" />

            </span>

            <span className="text-[11px] font-medium text-emerald-200/80">
              System Healthy
            </span>

          </div>


          {/* DEMO INDICATOR */}
          {isDemo && (
            <div className="hidden items-center gap-2 rounded-xl border border-violet-300/15 bg-violet-300/[0.05] px-3 py-2 text-[11px] font-semibold text-violet-200 md:flex">

              <ShieldCheck
                size={14}
              />

              Demo · Read Only

            </div>
          )}


          {/* SEARCH */}
          <div
            ref={searchRef}
            className="relative"
          >

            <button
              type="button"
              aria-label="Search"
              aria-expanded={
                searchOpen
              }
              onClick={() => {
                setSearchOpen(
                  (current) =>
                    !current
                );

                setNotificationsOpen(
                  false
                );

                setProfileOpen(
                  false
                );
              }}
              className="rounded-xl border border-transparent p-2 text-[var(--if-text-muted)] transition hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-white"
            >
              <Search size={19} />
            </button>


            {searchOpen && (
              <div className="if-surface-elevated fixed left-3 right-3 top-[72px] z-50 overflow-hidden sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[380px]">

                <div className="border-b border-[var(--if-border-soft)] p-4">

                  <div className="flex items-center gap-3 rounded-xl border border-[var(--if-border)] bg-[rgba(5,8,13,0.78)] px-3 py-2.5">

                    <Search
                      size={17}
                      className="text-[var(--if-text-muted)]"
                    />

                    <input
                      autoFocus
                      value={
                        searchQuery
                      }
                      onChange={(
                        event
                      ) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search identity workspace..."
                      className="min-w-0 flex-1 bg-transparent text-sm text-[var(--if-text-primary)] outline-none placeholder:text-[var(--if-text-faint)]"
                    />


                    {searchQuery && (
                      <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() =>
                          setSearchQuery(
                            ""
                          )
                        }
                        className="text-[var(--if-text-muted)] transition hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    )}

                  </div>

                </div>


                <div className="max-h-80 overflow-y-auto p-2">

                  {filteredModules.length >
                  0 ? (

                    filteredModules.map(
                      (
                        module
                      ) => (

                        <button
                          type="button"
                          key={
                            module.route
                          }
                          onClick={() =>
                            openSearchResult(
                              module.route
                            )
                          }
                          className="group w-full rounded-xl px-4 py-3 text-left transition hover:bg-white/[0.035]"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <p className="text-sm font-semibold text-[var(--if-text-primary)]">
                              {module.label}
                            </p>

                            <span className="h-1.5 w-1.5 rounded-full bg-teal-300/0 transition group-hover:bg-teal-300/70" />

                          </div>

                          <p className="mt-1 text-xs text-[var(--if-text-muted)]">
                            {
                              module.description
                            }
                          </p>

                        </button>
                      )
                    )

                  ) : (

                    <div className="px-4 py-8 text-center text-sm text-[var(--if-text-muted)]">
                      No identity modules found.
                    </div>

                  )}

                </div>

              </div>
            )}

          </div>


          {/* NOTIFICATIONS */}
          <div
            ref={
              notificationRef
            }
            className="relative"
          >

            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={
                notificationsOpen
              }
              onClick={() => {
                setNotificationsOpen(
                  (current) =>
                    !current
                );

                setSearchOpen(
                  false
                );

                setProfileOpen(
                  false
                );
              }}
              className="relative rounded-xl border border-transparent p-2 text-[var(--if-text-muted)] transition hover:border-white/[0.04] hover:bg-white/[0.025] hover:text-white"
            >

              <Bell size={19} />


              {unreadCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-[rgba(239,114,130,0.25)] bg-[rgba(239,114,130,0.9)] px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}

            </button>


            {notificationsOpen && (
              <div className="if-surface-elevated fixed left-3 right-3 top-[72px] z-50 overflow-hidden sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-[390px]">

                <div className="flex items-center justify-between border-b border-[var(--if-border-soft)] px-4 py-4 sm:px-5">

                  <div className="min-w-0">

                    <p className="if-eyebrow">
                      Governance Signals
                    </p>

                    <h3 className="mt-1 truncate font-semibold text-[var(--if-text-primary)]">
                      Security Notifications
                    </h3>

                    <p className="mt-1 hidden text-xs text-[var(--if-text-muted)] sm:block">
                      Identity governance and privileged access events
                    </p>

                  </div>


                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={
                        markAllAsRead
                      }
                      title="Mark all as read"
                      className="rounded-lg p-2 text-teal-200 transition hover:bg-white/[0.04]"
                    >
                      <CheckCheck
                        size={18}
                      />
                    </button>
                  )}

                </div>


                <div className="max-h-[60vh] overflow-y-auto p-2 sm:max-h-[420px]">

                  {notificationsLoading ? (

                    <div className="px-4 py-8 text-center text-sm text-[var(--if-text-muted)]">
                      Loading identity signals...
                    </div>

                  ) : notifications.length ===
                    0 ? (

                    <div className="px-4 py-8 text-center">

                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04]">

                        <ShieldCheck
                          size={23}
                          className="text-emerald-300"
                        />

                      </div>

                      <p className="mt-3 text-sm font-medium text-[var(--if-text-primary)]">
                        No active IAM alerts
                      </p>

                      <p className="mt-1 text-xs text-[var(--if-text-muted)]">
                        Identity security posture is currently stable.
                      </p>

                    </div>

                  ) : (

                    notifications.map(
                      (
                        notification
                      ) => {
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


                        const severityClasses =
                          notification.severity ===
                          "critical"
                            ? "border-[rgba(239,114,130,0.12)] bg-[rgba(239,114,130,0.045)] text-[var(--if-deny)]"
                            : notification.severity ===
                              "warning"
                            ? "border-[rgba(230,179,92,0.12)] bg-[rgba(230,179,92,0.045)] text-[var(--if-step-up)]"
                            : "border-[rgba(72,215,198,0.12)] bg-[rgba(72,215,198,0.045)] text-[var(--if-teal)]";


                        return (
                          <button
                            type="button"
                            key={
                              notification.id
                            }
                            onClick={() =>
                              openNotification(
                                notification
                              )
                            }
                            className={[
                              "mb-1 flex w-full gap-3 rounded-xl px-4 py-4 text-left transition hover:bg-white/[0.035]",
                              isRead
                                ? "opacity-55"
                                : "bg-white/[0.015]",
                            ].join(
                              " "
                            )}
                          >

                            <div
                              className={`mt-0.5 rounded-lg border p-2 ${severityClasses}`}
                            >
                              <Icon
                                size={17}
                              />
                            </div>


                            <div className="min-w-0 flex-1">

                              <div className="flex items-center gap-2">

                                <p className="text-sm font-semibold text-[var(--if-text-primary)]">
                                  {
                                    notification.title
                                  }
                                </p>

                                {!isRead && (
                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300" />
                                )}

                              </div>


                              <p className="mt-1 text-xs leading-5 text-[var(--if-text-muted)]">
                                {
                                  notification.description
                                }
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
              aria-expanded={
                profileOpen
              }
              onClick={() => {
                setProfileOpen(
                  (current) =>
                    !current
                );

                setNotificationsOpen(
                  false
                );

                setSearchOpen(
                  false
                );
              }}
              className={[
                "rounded-xl border p-2 transition",
                isDemo
                  ? "border-violet-300/10 bg-violet-300/[0.035] text-violet-200 hover:bg-violet-300/[0.07]"
                  : "border-teal-300/10 bg-teal-300/[0.035] text-teal-200 hover:bg-teal-300/[0.07]",
              ].join(" ")}
            >

              <UserCircle
                size={24}
              />

            </button>


            {profileOpen && (
              <div className="if-surface-elevated fixed left-3 right-3 top-[72px] z-50 overflow-hidden sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:w-72">

                {/* IDENTITY */}
                <div className="border-b border-[var(--if-border-soft)] p-5">

                  <div className="flex items-center gap-3">

                    <div
                      className={[
                        "relative flex h-11 w-11 items-center justify-center rounded-xl border",
                        isDemo
                          ? "border-violet-300/15 bg-violet-300/[0.05] text-violet-200"
                          : "border-teal-300/15 bg-teal-300/[0.05] text-teal-200",
                      ].join(
                        " "
                      )}
                    >

                      <ShieldCheck
                        size={22}
                      />

                      <span
                        className={[
                          "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[var(--if-ink-2)]",
                          isDemo
                            ? "bg-violet-300"
                            : "bg-emerald-300",
                        ].join(
                          " "
                        )}
                      />

                    </div>


                    <div className="min-w-0">

                      <p className="truncate font-semibold text-[var(--if-text-primary)]">
                        {
                          session.displayName ||
                          (
                            isDemo
                              ? "Demo Viewer"
                              : "IAM Administrator"
                          )
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-[var(--if-text-muted)]">
                        {
                          isDemo
                            ? "IdentityForge Read-Only Environment"
                            : "IdentityForge Administrative Console"
                        }
                      </p>

                    </div>

                  </div>

                </div>


                {/* SESSION */}
                <div className="border-b border-[var(--if-border-soft)] px-5 py-4">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--if-text-faint)]">
                    Enterprise Role
                  </p>

                  <p className="mt-2 text-sm font-medium text-[var(--if-text-primary)]">

                    {(
                      session.role ||
                      (
                        isDemo
                          ? "DEMO_VIEWER"
                          : "IAM_ADMIN"
                      )
                    ).replaceAll(
                      "_",
                      " "
                    )}

                  </p>


                  <div className="mt-3 flex items-center gap-2">

                    <span
                      className={[
                        "h-2 w-2 rounded-full",
                        isDemo
                          ? "bg-violet-300"
                          : "bg-emerald-300",
                      ].join(
                        " "
                      )}
                    />

                    <span
                      className={[
                        "text-xs",
                        isDemo
                          ? "text-violet-200"
                          : "text-emerald-200",
                      ].join(
                        " "
                      )}
                    >

                      {isDemo
                        ? "Read-Only Demo Session"
                        : "Active Administrative Session"}

                    </span>

                  </div>


                  <div className="mt-4 rounded-lg border border-[var(--if-border-soft)] bg-black/10 px-3 py-2">

                    <p className="text-[10px] uppercase tracking-[0.12em] text-[var(--if-text-faint)]">
                      Access Scope
                    </p>

                    <p className="mt-1 text-xs font-medium text-[var(--if-text-secondary)]">

                      {(
                        session.accessScope ||
                        "READ_ONLY"
                      ).replaceAll(
                        "_",
                        " "
                      )}

                    </p>

                  </div>

                </div>


                {/* ACTIONS */}
                <div className="p-2">

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(
                        false
                      );

                      if (
                        !isDemo
                      ) {
                        navigate(
                          "/settings"
                        );
                      }
                    }}
                    disabled={
                      isDemo
                    }
                    title={
                      isDemo
                        ? "Settings changes require administrator authentication"
                        : "Open account and platform settings"
                    }
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition",
                      isDemo
                        ? "cursor-not-allowed text-[var(--if-text-faint)]"
                        : "text-[var(--if-text-secondary)] hover:bg-white/[0.035] hover:text-white",
                    ].join(
                      " "
                    )}
                  >

                    <Settings
                      size={17}
                    />

                    Account & Settings


                    {isDemo && (
                      <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.1em] text-violet-300/70">
                        Admin only
                      </span>
                    )}

                  </button>


                  <button
                    type="button"
                    onClick={
                      handleSignOut
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[var(--if-text-secondary)] transition hover:bg-[rgba(239,114,130,0.06)] hover:text-[var(--if-deny)]"
                  >

                    <LogOut
                      size={17}
                    />

                    Sign Out


                    <span className="ml-auto text-[9px] font-semibold uppercase tracking-[0.1em] text-[var(--if-text-faint)]">
                      {isDemo
                        ? "Demo"
                        : "Secure"}
                    </span>

                  </button>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </header>
  );
}