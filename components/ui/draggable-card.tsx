"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
    useVelocity,
    useAnimationControls,
} from "motion/react";

export const DraggableCardBody = ({
    className,
    style,
    children,
}: {
    className?: string;
    // Positioning (top/left/rotate/etc) should be passed here, not via
    // className. The base classes below hardcode `relative` and `w-80`,
    // and depending on how `cn()` is implemented in this project, a
    // conflicting `absolute`/`w-56`/`top-*` class passed via `className`
    // is not guaranteed to win the cascade over those base classes —
    // inline style always does, regardless of class merge behavior.
    style?: React.CSSProperties;
    children?: React.ReactNode;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();

    // Cards drag-constrain to the page itself (document.body), not an
    // arbitrary +/- half-viewport range. Framer Motion clamps dragging to
    // stay inside this element's box, and with dragElastic set low it
    // springs back on release if you try to fling a card past the edge —
    // so a card can never actually leave the page.
    const boundaryRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        boundaryRef.current = document.body;
    }, []);

    const velocityX = useVelocity(mouseX);
    const velocityY = useVelocity(mouseY);

    const springConfig = {
        stiffness: 100,
        damping: 20,
        mass: 0.5,
    };

    const rotateX = useSpring(
        useTransform(mouseY, [-300, 300], [25, -25]),
        springConfig,
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-300, 300], [-25, 25]),
        springConfig,
    );

    const opacity = useSpring(
        useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
        springConfig,
    );

    const glareOpacity = useSpring(
        useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
        springConfig,
    );


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } =
            cardRef.current?.getBoundingClientRect() ?? {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
            };
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        mouseX.set(deltaX);
        mouseY.set(deltaY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            drag
            dragConstraints={boundaryRef}
            dragElastic={0.12}
            dragMomentum={true}
            onDragStart={() => {
                document.body.style.cursor = "grabbing";
            }}
            onDragEnd={() => {
                document.body.style.cursor = "default";

                // Position snap-back within the page boundary is handled
                // automatically by dragConstraints + dragElastic above.
                // We just reset the hover-tilt so it doesn't stay skewed.
                controls.start({
                    rotateX: 0,
                    rotateY: 0,
                    transition: {
                        type: "spring",
                        ...springConfig,
                    },
                });
            }}
            style={{
                // Caller-provided position (top/left/rotate/width/etc) is
                // spread first so it always applies; the motion-managed
                // values below are appended on top for the tilt/hover FX.
                ...style,
                rotateX,
                rotateY,
                opacity,
                willChange: "transform",
            }}
            animate={controls}
            whileHover={{ scale: 1.02 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative min-h-96 w-80 overflow-hidden rounded-md bg-neutral-100 p-6 shadow-2xl transform-3d dark:bg-neutral-900",
                className,
            )}
        >
            {children}
            <motion.div
                style={{
                    opacity: glareOpacity,
                }}
                className="pointer-events-none absolute inset-0 bg-white select-none"
            />
        </motion.div>
    );
};

export const DraggableCardContainer = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn("relative [perspective:3000px]", className)}>
            {children}
        </div>
    );
};