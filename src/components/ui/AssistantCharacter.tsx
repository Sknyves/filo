"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

interface AssistantCharacterProps {
    message: string;
    visible?: boolean;
}

type AnimationStage = "hidden" | "entering" | "typing" | "waiting" | "exiting";

export default function AssistantCharacter({ message, visible = true }: AssistantCharacterProps) {
    const [stage, setStage] = useState<AnimationStage>("hidden");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Reset and start sequence whenever the message changes
    useEffect(() => {
        if (!visible) {
            setStage("hidden");
            return;
        }

        let timeout: NodeJS.Timeout;

        const startSequence = () => {
            setStage("hidden");
            setDisplayedText("");

            // Wait a bit after load or message change
            timeout = setTimeout(() => {
                setStage("entering");
            }, 800);
        };

        startSequence();

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [message, visible]);

    // Handle stage transitions and typing logic
    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (stage === "entering") {
            // Wait for entrance animation to finish + small pause
            timeout = setTimeout(() => {
                setStage("typing");
            }, 1200);
        } else if (stage === "typing") {
            setIsTyping(true);
            let charIndex = 0;
            const textToType = message;

            const typeText = () => {
                if (charIndex < textToType.length) {
                    setDisplayedText(textToType.substring(0, charIndex + 1));
                    charIndex++;
                    timeout = setTimeout(typeText, 35); // Typing speed
                } else {
                    setIsTyping(false);
                    setStage("waiting");
                }
            };

            // Start typing after a tiny delay
            timeout = setTimeout(typeText, 300);
        } else if (stage === "waiting") {
            // Stay visible for a few seconds to let user read
            timeout = setTimeout(() => {
                setStage("exiting");
            }, 5000);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [stage, message]);

    // Character container variants for the overall movement
    const containerVariants = {
        hidden: {
            x: 400,
            y: 400,
            opacity: 0
        },
        entering: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: [0.23, 1, 0.32, 1]
            }
        },
        typing: {
            x: -20,
            y: -20,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeOut"
            }
        },
        waiting: {
            x: -20,
            y: -20,
            opacity: 1
        },
        exiting: {
            x: 400,
            y: 400,
            opacity: 0,
            transition: {
                duration: 1.2,
                ease: "easeIn"
            }
        }
    };

    if (stage === "hidden" && !visible) return null;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={stage}
            className="fixed bottom-0 right-0 z-[60] flex flex-col items-end p-4 md:p-8 pointer-events-none"
        >
            {/* Speech Bubble */}
            <AnimatePresence>
                {(stage === "typing" || stage === "waiting") && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 30, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 30, x: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }}
                        className="bg-white/95 dark:bg-brand-gray-900/95 backdrop-blur-md border border-brand-violet/20 p-4 md:p-6 rounded-[20px] md:rounded-[24px] rounded-br-none shadow-2xl max-w-[200px] md:max-w-[320px] mb-2 md:mb-4 relative overflow-hidden group md:pointer-events-auto pointer-events-none"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-violet transition-all duration-500 group-hover:w-full group-hover:opacity-5" />

                        <p className="text-xs md:text-base font-medium text-brand-gray-900 dark:text-brand-gray-100 relative z-10 leading-relaxed italic">
                            "{displayedText}"
                            {isTyping && (
                                <span className="inline-block ml-1 w-1.5 h-4 bg-brand-violet animate-pulse align-middle" />
                            )}
                        </p>

                        <div className="absolute right-0 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white/95 dark:border-t-brand-gray-900/95" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Character Image container */}
            <div className="relative w-28 h-28 md:w-64 md:h-64 md:pointer-events-auto pointer-events-none">
                {/* Floating animation */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, -1, 1, 0],
                        scale: [1, 1.01, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-full h-full"
                >
                    <motion.div
                        animate={{
                            rotateX: [0, 3, 0],
                            rotateY: [0, 5, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full"
                    >
                        <Image
                            src="/10-58-05-213_256.gif"
                            alt="Assistant"
                            fill
                            className="object-contain drop-shadow-[0_10px_30px_rgba(139,92,246,0.3)] opacity-90 md:opacity-100"
                            priority
                        />
                    </motion.div>
                </motion.div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-brand-violet/5 md:bg-brand-violet/10 blur-[40px] md:blur-[100px] -z-10 rounded-full animate-pulse" />
            </div>
        </motion.div>
    );
}
