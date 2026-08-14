"use client";

import {
    useState,
    useRef,
    useEffect,
    useId,
    useMemo,
    useCallback,
    type ChangeEvent,
} from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";

/* cn() fallback — swap for "@/lib/utils" if you already have it */
function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function GooeyFilter({ filterId, blur }: { filterId: string; blur: number }) {
    return (
        <svg className="absolute hidden h-0 w-0" aria-hidden>
            <defs>
                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
                    <feColorMatrix
                        in="blur"
                        type="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                        result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </defs>
        </svg>
    );
}

function SearchIcon({ layoutId }: { layoutId: string }) {
    return (
        <motion.span layoutId={layoutId} className="flex shrink-0 items-center justify-center">
            <Search size={15} strokeWidth={2} />
        </motion.span>
    );
}

const transition = { duration: 0.4, type: "spring" as const, bounce: 0.2 };

const bubbleVariants = {
    collapsed: { scale: 0, opacity: 0 },
    expanded: { scale: 1, opacity: 1 },
};

export interface ImperialSearchProps {
    placeholder?: string;
    className?: string;
    collapsedWidth?: number;
    expandedWidth?: number;
    expandedOffset?: number;
    gooeyBlur?: number;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
}

export function ImperialSearch({
    placeholder = "SEARCH TARGETS...",
    className,
    collapsedWidth = 138,
    expandedWidth = 260,
    expandedOffset = 50,
    gooeyBlur = 5,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    onOpenChange,
    disabled = false,
}: ImperialSearchProps) {
    const reactId = useId();
    const safeId = reactId.replace(/:/g, "");
    const filterId = `imp-search-${safeId}`;
    const iconLayoutId = `imp-search-icon-${safeId}`;
    const inputLayoutId = `imp-search-field-${safeId}`;

    const inputRef = useRef<HTMLInputElement>(null);
    const prevExpandedRef = useRef(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

    const isControlled = valueProp !== undefined;
    const searchText = isControlled ? valueProp : uncontrolledValue;

    const setSearchText = useCallback(
        (next: string) => {
            if (!isControlled) setUncontrolledValue(next);
            onValueChange?.(next);
        },
        [isControlled, onValueChange]
    );

    const setExpanded = useCallback(
        (next: boolean) => {
            setIsExpanded(next);
            onOpenChange?.(next);
        },
        [onOpenChange]
    );

    useEffect(() => {
        if (isExpanded) {
            inputRef.current?.focus();
        } else if (prevExpandedRef.current) {
            setSearchText("");
        }
        prevExpandedRef.current = isExpanded;
    }, [isExpanded, setSearchText]);

    const buttonVariants = useMemo(
        () => ({
            collapsed: { width: collapsedWidth, marginLeft: 0 },
            expanded: { width: expandedWidth, marginLeft: expandedOffset },
        }),
        [collapsedWidth, expandedWidth, expandedOffset]
    );

    const handleExpand = useCallback(() => {
        if (!disabled) setExpanded(true);
    }, [disabled, setExpanded]);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value),
        [setSearchText]
    );

    const handleBlur = useCallback(() => {
        if (!searchText) setExpanded(false);
    }, [searchText, setExpanded]);

    // sharp corners, black surface, red ring — matches the console panels
    const surfaceClass = "bg-[#0a0a0a] text-white ring-1 ring-[#d80f0f]/40";

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <GooeyFilter filterId={filterId} blur={gooeyBlur} />

            <div
                className="relative flex h-10 items-center justify-center"
                style={{ filter: `url(#${filterId})` }}
            >
                <motion.div
                    className="flex h-10 items-center justify-center"
                    variants={buttonVariants}
                    initial="collapsed"
                    animate={isExpanded ? "expanded" : "collapsed"}
                    transition={transition}
                >
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={handleExpand}
                        className={cn(
                            "flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-sm px-4 font-mono text-[11px] tracking-[0.12em] outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-[#d80f0f] disabled:pointer-events-none disabled:opacity-50",
                            surfaceClass
                        )}
                        style={{ boxShadow: isExpanded ? "0 0 24px -6px rgba(216,15,15,0.55)" : "none" }}
                    >
                        {!isExpanded ? <SearchIcon layoutId={iconLayoutId} /> : null}
                        <motion.input
                            layoutId={inputLayoutId}
                            ref={inputRef}
                            type="search"
                            enterKeyHint="search"
                            autoComplete="off"
                            value={searchText}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={disabled || !isExpanded}
                            placeholder={placeholder}
                            className={cn(
                                "h-full min-w-0 flex-1 bg-transparent font-mono text-[11px] tracking-[0.12em] text-white outline-none",
                                isExpanded
                                    ? "placeholder:text-white/35"
                                    : "pointer-events-none placeholder:text-white/70"
                            )}
                        />
                    </button>
                </motion.div>

                <motion.div
                    className="absolute left-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center"
                    variants={bubbleVariants}
                    initial="collapsed"
                    animate={isExpanded ? "expanded" : "collapsed"}
                    transition={transition}
                >
                    <div
                        className={cn("flex size-10 items-center justify-center rounded-sm", surfaceClass)}
                        style={{ boxShadow: "0 0 24px -6px rgba(216,15,15,0.55)" }}
                    >
                        <SearchIcon layoutId={iconLayoutId} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ImperialSearchDemo() {
    return (
        <div className="flex h-32 w-full items-center justify-center bg-[#050505]">
            <ImperialSearch placeholder="SEARCH TARGETS..." />
        </div>
    );
}