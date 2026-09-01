import { AlertCircle, Loader2, RefreshCw, SearchX } from "lucide-react";

export const PageLoading = ({ label = "Loading..." }) => (
  <div className="flex min-h-[320px] items-center justify-center px-6">
    <div className="flex flex-col items-center gap-3 text-center">
      <Loader2 size={30} className="animate-spin text-violet-400" />
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  </div>
);

export const PageError = ({
  title = "Something went wrong",
  message = "We could not load this page. Please try again.",
  actionLabel = "Retry",
  onAction,
}) => (
  <div className="flex min-h-[320px] items-center justify-center px-6">
    <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
        <AlertCircle size={22} className="text-red-300" />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-red-100">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-200/70">{message}</p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-300/20 bg-red-300/10 px-4 text-sm font-medium text-red-100 transition hover:bg-red-300/15"
        >
          <RefreshCw size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

export const EmptyState = ({
  title = "Nothing here yet",
  message = "There is no content to show right now.",
  children,
}) => (
  <div className="flex min-h-[260px] flex-col items-center justify-center px-6 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
      <SearchX size={21} className="text-zinc-600" />
    </div>

    <h3 className="mt-4 text-sm font-semibold text-zinc-300">{title}</h3>
    <p className="mt-1 max-w-sm text-sm leading-6 text-zinc-600">{message}</p>

    {children && <div className="mt-5">{children}</div>}
  </div>
);
