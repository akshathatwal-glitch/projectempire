"use client";

import { useState } from "react";
import { Crosshair, Lock, Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface DirectiveAction {
  id: string;
  label: string;
  icon: React.ElementType;
  primary?: boolean;
  onClick?: () => void;
}

export function DirectivePanel({
  onDeployHunter,
  onLockdownSector,
  onIssueDirective,
}: {
  onDeployHunter?: () => void;
  onLockdownSector?: () => void;
  onIssueDirective?: () => void;
}) {
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const actions: DirectiveAction[] = [
    { id: "deploy", label: "DEPLOY HUNTER", icon: Crosshair, primary: true, onClick: onDeployHunter },
    { id: "lockdown", label: "LOCK DOWN SECTOR", icon: Lock, onClick: onLockdownSector },
    { id: "directive", label: "ISSUE DIRECTIVE", icon: Send, onClick: onIssueDirective },
  ];

  const handleActionClick = (action: DirectiveAction) => {
    setExecutingId(action.id);
    action.onClick?.();

    setTimeout(() => {
      setExecutingId(null);
      setSuccessId(action.id);

      setTimeout(() => {
        setSuccessId(null);
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-3 font-mono">
      {actions.map((action) => {
        const { id, label, icon: Icon, primary } = action;
        const isExecuting = executingId === id;
        const isSuccess = successId === id;

        return (
          <motion.button
            key={id}
            type="button"
            onClick={() => handleActionClick(action)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97, y: 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className={`group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-sm px-5 py-3.5 font-imperial text-sm tracking-[0.08em] cursor-pointer select-none transition-all duration-300 ${
              primary
                ? "bg-[#d80f0f] text-white shadow-[0_0_25px_rgba(216,15,15,0.75)] hover:bg-[#ff3b30] hover:shadow-[0_0_35px_rgba(255,59,48,0.95)]"
                : "border border-white/20 bg-black/60 text-white/90 backdrop-blur-md hover:border-red-500/60 hover:bg-red-950/30 hover:text-white hover:shadow-[0_0_25px_rgba(216,15,15,0.4)]"
            }`}
          >
            {/* HUD Corner Brackets on Hover */}
            <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/60 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Laser Shimmer Sweep Effect */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

            {/* Icon Render with Animation */}
            {isExecuting ? (
              <Loader2 size={17} className="animate-spin text-white shrink-0" />
            ) : isSuccess ? (
              <CheckCircle2 size={17} className="text-emerald-400 shrink-0 animate-bounce" />
            ) : (
              <Icon
                size={17}
                strokeWidth={1.8}
                className={`shrink-0 transition-transform duration-300 ${
                  id === "deploy"
                    ? "group-hover:rotate-90 group-hover:scale-110"
                    : id === "lockdown"
                    ? "group-hover:scale-110 group-hover:text-red-400"
                    : "group-hover:translate-x-1 group-hover:-translate-y-0.5"
                }`}
              />
            )}

            {/* Text Label */}
            <span className="relative z-10 font-bold uppercase tracking-widest">
              {isExecuting ? "EXECUTING..." : isSuccess ? "COMMAND CONFIRMED" : label}
            </span>

            {/* Micro Ping Dot for Primary */}
            {primary && !isExecuting && !isSuccess && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
