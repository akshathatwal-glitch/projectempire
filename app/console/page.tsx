import ImperialConsole from "@/components/ImperialConsole";
import HunterCommendationsDemo from "@/components/hunter-commendations";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import Navbar from "@/components/navbar";
import HolonetMap from "@/components/Holonet";

export default function ConsolePage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <div className="pt-20">
                <ImperialConsole />
                <HolonetMap />
                <div className="relative w-full overflow-hidden border-y border-red-950/60 bg-[#050505] py-4 mt-8">
                    <ScrollBasedVelocity
                        text="IMPERIAL COMMAND CONSOLE • LIVE TELEMETRY • SECTOR CLEARANCE OMEGA • ORDER 66 ACTIVE • "
                        default_velocity={2}
                        className="font-mono text-2xl font-bold uppercase tracking-[0.2em] text-[#ff3b30]/85 drop-shadow-[0_0_15px_rgba(216,15,15,0.6)] sm:text-3xl"
                    />
                </div>

                <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-10">
                    <HunterCommendationsDemo />
                </div>
            </div>
        </main>
    );
}
