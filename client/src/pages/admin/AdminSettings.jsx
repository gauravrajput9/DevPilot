import { useEffect, useState } from "react";
import {
  Server,
  Database,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getAdminSettings, testPistonHealth } from "../../services/adminApi";
import { useToast } from "../../components/ui/ToastProvider";
import { PageLoading, PageError } from "../../components/ui/PageState";

const AdminSettings = () => {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Piston Health Test State
  const [testingPiston, setTestingPiston] = useState(false);
  const [pistonTestResult, setPistonTestResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    getAdminSettings()
      .then((res) => {
        if (!ignore && res.success) {
          setSettings(res.settings);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Failed to load settings:", err);
          const msg = err.response?.data?.message || err.message || "Failed to load settings";
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey, toast]);

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setReloadKey((k) => k + 1);
  };

  const handleTestPiston = async () => {
    setTestingPiston(true);
    setPistonTestResult(null);
    try {
      const res = await testPistonHealth();
      setPistonTestResult(res);
      if (res.success) {
        toast.success(`Piston engine is online! Ping: ${res.latencyMs}ms`, {
          title: "Execution Engine Healthy",
        });
      } else {
        toast.error(res.message || "Piston responded with errors", {
          title: "Execution Engine Degraded",
        });
      }
    } catch (err) {
      console.error("Piston health test failed:", err);
      const errorResult = {
        success: false,
        status: "offline",
        message: err.message || "Piston service connection failed",
      };
      setPistonTestResult(errorResult);
      toast.error("Piston engine health check failed");
    } finally {
      setTestingPiston(false);
    }
  };

  if (loading) {
    return <PageLoading label="Loading system settings..." />;
  }

  if (error) {
    return (
      <PageError
        title="Settings could not be loaded"
        message={error}
        onAction={handleRefresh}
      />
    );
  }

  const { platform, piston, defaults } = settings || {};

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
            System & Infrastructure
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            System Settings & Diagnostics
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Inspect backend services, test code execution engine availability, and review platform limits.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Info
        </button>
      </div>

      {/* Platform & Server Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Environment */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
              <Server size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Application Server</h3>
              <p className="text-xs text-zinc-500">Node.js API Service</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.05] text-xs">
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Platform:</span>
              <span className="font-semibold text-white">{platform?.name || "DevPilot"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Version:</span>
              <span className="font-mono text-zinc-300">{platform?.version || "1.0.0"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Environment:</span>
              <span className="font-mono text-violet-300 uppercase">{platform?.nodeEnv || "development"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Node Runtime:</span>
              <span className="font-mono text-zinc-300">{platform?.nodeVersion || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Database */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <Database size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Database Cluster</h3>
              <p className="text-xs text-zinc-500">MongoDB Atlas / Replica</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.05] text-xs">
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Status:</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Host:</span>
              <span className="font-mono text-zinc-300 truncate max-w-[170px]">{platform?.mongoHost || "Cluster Active"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Collections:</span>
              <span className="text-zinc-300">users, problems, codingsubmissions</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Auth Mechanism:</span>
              <span className="text-zinc-300">better-auth / sessions</span>
            </div>
          </div>
        </div>

        {/* Execution Engine Status */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
              <Terminal size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Piston Engine</h3>
              <p className="text-xs text-zinc-500">Sandboxed Execution</p>
            </div>
          </div>

          <div className="divide-y divide-white/[0.05] text-xs">
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Endpoint:</span>
              <span className="font-mono text-cyan-300 truncate max-w-[170px]">
                {piston?.url || "http://localhost:2000"}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Execution Timeout:</span>
              <span className="font-mono text-zinc-300">{defaults?.executionTimeoutMs || 10000} ms</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Memory Limit:</span>
              <span className="font-mono text-zinc-300">{defaults?.maxMemoryMb || 128} MB</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-zinc-500">Supported Compilers:</span>
              <span className="font-semibold text-zinc-300">4 Runtimes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Piston Diagnostics Tester */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <h2 className="text-base font-semibold text-white">Live Execution Engine Ping Test</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Sends an automated micro-payload to Piston (`console.log('piston-healthy')`) to measure container health and latency.
            </p>
          </div>

          <button
            disabled={testingPiston}
            onClick={handleTestPiston}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:scale-[1.01] disabled:opacity-50"
          >
            <RefreshCw size={14} className={testingPiston ? "animate-spin" : ""} />
            {testingPiston ? "Running Diagnostic..." : "Run Engine Ping Test"}
          </button>
        </div>

        {pistonTestResult && (
          <div
            className={`rounded-xl border p-4 transition-all ${
              pistonTestResult.success
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-rose-500/30 bg-rose-500/10"
            }`}
          >
            <div className="flex items-start gap-3">
              {pistonTestResult.success ? (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-3">
                  <span className={`font-semibold uppercase tracking-wider ${pistonTestResult.success ? "text-emerald-400" : "text-rose-400"}`}>
                    Status: {pistonTestResult.status}
                  </span>
                  {pistonTestResult.latencyMs !== undefined && (
                    <span className="font-mono text-zinc-400">
                      Roundtrip Latency: <strong className="text-white">{pistonTestResult.latencyMs} ms</strong>
                    </span>
                  )}
                </div>
                <p className="text-zinc-300">{pistonTestResult.message}</p>
                {pistonTestResult.error && (
                  <p className="font-mono text-rose-300 text-[11px] mt-2 bg-black/40 p-2 rounded">
                    {pistonTestResult.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Language Execution Configurations */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-white">Registered Language Environments</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Active execution runtimes configured in Piston for student code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {piston?.languages &&
            Object.entries(piston.languages).map(([key, lang]) => (
              <div
                key={key}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold uppercase text-violet-300">
                    {key === "cpp" ? "C++" : key}
                  </span>
                  <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                    .{lang.extension}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-zinc-500">
                  <p>
                    Engine: <span className="text-zinc-300 font-mono">{lang.language}</span>
                  </p>
                  <p>
                    Version: <span className="text-zinc-300 font-mono">{lang.version}</span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Security Policies */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-violet-400" />
          <h2 className="text-base font-semibold text-white">Platform Security & Access Policies</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-semibold text-white">Sandboxed Piston Docker</h4>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              Student code is executed in ephemeral unprivileged containers without network access or host volume mounts.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-semibold text-white">Role-Based Access Control</h4>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              All administrative endpoints require verified Better-Auth sessions and active Administrator database roles.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <h4 className="font-semibold text-white">Execution Safety Thresholds</h4>
            <p className="mt-1 text-zinc-400 leading-relaxed">
              CPU and memory consumption are hard-capped at 128MB and 10 seconds to prevent infinite loops and memory exhaustion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
