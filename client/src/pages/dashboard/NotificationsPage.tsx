import { useEffect, useMemo, useState } from "react";

import {
  getNotifications,
  markNotificationAsRead,
  type Notification,
} from "../../services/notificationService";

const NotificationsPage = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [filter, setFilter] =
    useState<"all" | "unread">("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [markingId, setMarkingId] =
    useState<string | null>(null);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotifications();

      setNotifications(data.notifications);
    } catch (error: any) {
      console.error(
        "Notifications loading error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const readCount =
    notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter(
        (notification) => !notification.isRead
      );
    }

    return notifications;
  }, [notifications, filter]);

  const handleMarkAsRead = async (
    notification: Notification
  ) => {
    if (notification.isRead) {
      return;
    }

    try {
      setMarkingId(notification._id);
      setError("");

      await markNotificationAsRead(
        notification._id
      );

      setNotifications((current) =>
        current.map((item) =>
          item._id === notification._id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error: any) {
      console.error(
        "Mark notification error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to mark notification as read."
      );
    } finally {
      setMarkingId(null);
    }
  };

  const getTypeClass = (
    type: Notification["type"]
  ) => {
    switch (type) {
      case "Outbreak Alert":
        return "notification-type outbreak";

      case "System Alert":
        return "notification-type system";

      default:
        return "notification-type information";
    }
  };

  const getNotificationIcon = (
    type: Notification["type"]
  ) => {
    switch (type) {
      case "Outbreak Alert":
        return "!";

      case "System Alert":
        return "⚙";

      default:
        return "i";
    }
  };

  const formatDate = (date: string) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleString();
  };

  if (loading) {
    return (
      <section>
        <header className="page-header">
          <div>
            <h1>Notifications</h1>

            <p>
              Stay informed about surveillance
              alerts and system activity.
            </p>
          </div>
        </header>

        <div className="card">
          <p>
            Loading notifications...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* =========================
          HEADER
      ========================= */}

      <header className="page-header">
        <div>
          <h1>Notifications</h1>

          <p>
            Stay informed about surveillance
            alerts and system activity.
          </p>
        </div>

        <span className="status-badge status-success">
          {unreadCount} unread
        </span>
      </header>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* =========================
          SUMMARY
      ========================= */}

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card-label">
            Total Notifications
          </span>

          <strong className="stat-card-value">
            {notifications.length}
          </strong>

          <p>
            All received notifications
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Unread
          </span>

          <strong className="stat-card-value">
            {unreadCount}
          </strong>

          <p>
            Notifications requiring attention
          </p>
        </div>

        <div className="stat-card">
          <span className="stat-card-label">
            Read
          </span>

          <strong className="stat-card-value">
            {readCount}
          </strong>

          <p>
            Previously viewed notifications
          </p>
        </div>
      </div>

      {/* =========================
          NOTIFICATION CENTER
      ========================= */}

      <section className="card">
        <div className="notification-toolbar">
          <div>
            <h2>
              Notification Center
            </h2>

            <p>
              {filteredNotifications.length}{" "}
              notification
              {filteredNotifications.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          <div className="notification-filters">
            <button
              type="button"
              className={
                filter === "all"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={
                filter === "unread"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() =>
                setFilter("unread")
              }
            >
              Unread
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">
              ✓
            </div>

            <h3>
              {filter === "unread"
                ? "You're all caught up"
                : "No notifications"}
            </h3>

            <p>
              {filter === "unread"
                ? "There are no unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="notification-list">
            {filteredNotifications.map(
              (notification) => (
                <article
                  key={notification._id}
                  className={
                    notification.isRead
                      ? "notification-item read"
                      : "notification-item unread"
                  }
                >
                  <div
                    className={`notification-icon ${
                      notification.type ===
                      "Outbreak Alert"
                        ? "outbreak"
                        : notification.type ===
                          "System Alert"
                        ? "system"
                        : "information"
                    }`}
                  >
                    {getNotificationIcon(
                      notification.type
                    )}
                  </div>

                  <div className="notification-content">
                    <div className="notification-top">
                      <div>
                        <span
                          className={getTypeClass(
                            notification.type
                          )}
                        >
                          {notification.type}
                        </span>

                        <h3>
                          {notification.title}
                        </h3>
                      </div>

                      {!notification.isRead && (
                        <span className="unread-dot" />
                      )}
                    </div>

                    <p className="notification-message">
                      {notification.message}
                    </p>

                    <div className="notification-bottom">
                      <span className="notification-date">
                        {formatDate(
                          notification.createdAt
                        )}
                      </span>

                      {!notification.isRead && (
                        <button
                          type="button"
                          className="mark-read-button"
                          onClick={() =>
                            handleMarkAsRead(
                              notification
                            )
                          }
                          disabled={
                            markingId ===
                            notification._id
                          }
                        >
                          {markingId ===
                          notification._id
                            ? "Marking..."
                            : "Mark as read"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </section>
  );
};

export default NotificationsPage;