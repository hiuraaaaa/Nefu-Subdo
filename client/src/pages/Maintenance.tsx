import { AlertTriangle, Clock } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-6">
          <AlertTriangle className="w-10 h-10 text-yellow-400" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Under Maintenance</h1>
        <p className="text-xl text-slate-400 mb-8 max-w-md">
          We are currently performing scheduled maintenance to improve your experience.
        </p>

        <div className="flex items-center justify-center gap-2 text-slate-300 mb-12">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>We will be back soon</span>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-sm text-slate-400">
            Thank you for your patience. We are working hard to bring you a better service.
          </p>
        </div>
      </div>
    </div>
  );
}
