import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-400/20 bg-emerald-500/10 text-emerald-100",
    iconClassName: "text-emerald-300",
  },
  error: {
    icon: XCircle,
    className: "border-red-400/20 bg-red-500/10 text-red-100",
    iconClassName: "text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-400/20 bg-amber-500/10 text-amber-100",
    iconClassName: "text-amber-300",
  },
  info: {
    icon: Info,
    className: "border-blue-400/20 bg-blue-500/10 text-blue-100",
    iconClassName: "text-blue-300",
  },
  loading: {
    icon: Loader2,
    className: "border-violet-400/20 bg-violet-500/10 text-violet-100",
    iconClassName: "animate-spin text-violet-300",
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismissToast = useCallback((id) => {
    const timer = timers.current.get(id);

    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({ title, message, type = "info", duration = 4500 }) => {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts((currentToasts) => [
        ...currentToasts,
        { id, title, message, type },
      ]);

      if (duration > 0) {
        const timer = window.setTimeout(() => dismissToast(id), duration);
        timers.current.set(id, timer);
      }

      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      dismissToast,
      success: (message, options = {}) =>
        showToast({ ...options, message, type: "success" }),
      error: (message, options = {}) =>
        showToast({ ...options, message, type: "error" }),
      warning: (message, options = {}) =>
        showToast({ ...options, message, type: "warning" }),
      info: (message, options = {}) =>
        showToast({ ...options, message, type: "info" }),
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl ${style.className}`}
            >
              <Icon
                size={19}
                className={`mt-0.5 shrink-0 ${style.iconClassName}`}
              />

              <div className="min-w-0 flex-1">
                {toast.title && (
                  <p className="text-sm font-semibold">{toast.title}</p>
                )}

                <p className="text-sm leading-5 opacity-85">{toast.message}</p>
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="mt-0.5 rounded-md p-1 opacity-60 transition hover:bg-white/10 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
