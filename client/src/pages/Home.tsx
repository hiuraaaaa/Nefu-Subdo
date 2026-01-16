import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface DomainOption {
  name: string;
  description?: string;
}

interface DNSRecord {
  subdomain: string;
  recordType: string;
  target: string;
  fullName?: string;
}

const RECORD_TYPES = ["A", "CNAME", "TXT", "MX", "NS"];

export default function Home() {
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [subdomain, setSubdomain] = useState<string>("");
  const [recordType, setRecordType] = useState<string>("");
  const [target, setTarget] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastRecord, setLastRecord] = useState<DNSRecord | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch("/api/domains");
        if (!response.ok) throw new Error("Failed to fetch domains");
        const data = await response.json();
        setDomains(data.domains || []);
        if (data.domains && data.domains.length > 0) {
          setSelectedDomain(data.domains[0].name);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
        toast.error("Failed to load domains");
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    if (target && !recordType) {
      const isIP = /^\d+\.\d+\.\d+\.\d+$/.test(target);
      setRecordType(isIP ? "A" : "CNAME");
    }
  }, [target, recordType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDomain) {
      toast.error("Please select a domain");
      return;
    }

    if (!subdomain.trim()) {
      toast.error("Please enter a subdomain name");
      return;
    }

    if (!recordType) {
      toast.error("Please select a record type");
      return;
    }

    if (!target.trim()) {
      toast.error("Please enter a target (IP or hostname)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-dns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: selectedDomain,
          subdomain: subdomain.trim(),
          recordType,
          target: target.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create DNS record");
      }

      const fullName = `${subdomain.trim()}.${selectedDomain}`;
      setLastRecord({
        subdomain: subdomain.trim(),
        recordType,
        target: target.trim(),
        fullName,
      });

      toast.success(
        `DNS record created successfully: ${fullName} -> ${target.trim()}`
      );

      setSubdomain("");
      setRecordType("");
      setTarget("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRecord = () => {
    if (lastRecord?.fullName) {
      navigator.clipboard.writeText(lastRecord.fullName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-slate-800 backdrop-blur-md bg-slate-950/50">
          <div className="container py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Nefu Subdomain Creator</h1>
                <p className="text-slate-400 mt-1">Manage your DNS records with ease</p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm text-slate-300">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card-dark">
                <h2 className="text-2xl font-bold mb-6">Create DNS Record</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select Domain
                    </label>
                    <select
                      value={selectedDomain}
                      onChange={(e) => setSelectedDomain(e.target.value)}
                      className="select-field"
                    >
                      <option value="">Choose a domain...</option>
                      {domains.map((domain) => (
                        <option key={domain.name} value={domain.name}>
                          {domain.name}
                          {domain.description ? ` (${domain.description})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Subdomain Name
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value)}
                        placeholder="e.g., api, www, mail"
                        className="input-field flex-1"
                        disabled={loading}
                      />
                      {selectedDomain && (
                        <span className="text-slate-400 text-sm whitespace-nowrap">
                          .{selectedDomain}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Full domain: {subdomain ? `${subdomain}.${selectedDomain}` : "subdomain.domain"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Record Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {RECORD_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setRecordType(type)}
                          className={`pill-button ${recordType === type ? "active" : ""}`}
                          disabled={loading}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {recordType && (
                      <p className="text-xs text-cyan-400 mt-2">
                        {recordType === "A" && "IPv4 address record"}
                        {recordType === "CNAME" && "Canonical name (alias) record"}
                        {recordType === "TXT" && "Text record for verification"}
                        {recordType === "MX" && "Mail exchange record"}
                        {recordType === "NS" && "Nameserver record"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Target {recordType === "A" ? "(IP Address)" : "(Hostname)"}
                    </label>
                    <input
                      type="text"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder={
                        recordType === "A" ? "e.g., 192.168.1.1" : "e.g., example.com"
                      }
                      className="input-field"
                      disabled={loading}
                    />
                    {recordType && target && (
                      <p className="text-xs text-slate-400 mt-1">
                        Auto-detected: {recordType}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating DNS Record...
                      </>
                    ) : (
                      "Create DNS Record"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {lastRecord && (
                <div className="card-dark border-cyan-500/30 bg-cyan-500/5">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-100">Last Created</h3>
                      <p className="text-xs text-slate-400">Successfully created</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400">Domain</p>
                      <p className="font-mono text-cyan-400 flex items-center justify-between">
                        {lastRecord.fullName}
                        <button
                          onClick={handleCopyRecord}
                          className="text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400">Type</p>
                      <p className="font-mono text-blue-400">{lastRecord.recordType}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Target</p>
                      <p className="font-mono text-slate-300 break-all">{lastRecord.target}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="card-dark border-slate-700">
                <h3 className="font-semibold text-slate-100 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  Quick Tips
                </h3>

                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      <strong>A Record:</strong> Use for IPv4 addresses
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      <strong>CNAME:</strong> Use for domain aliases
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      <strong>Auto-detect:</strong> System detects type automatically
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>
                      <strong>TTL:</strong> Set to automatic (1 second)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
