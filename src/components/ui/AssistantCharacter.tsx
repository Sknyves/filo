"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AssistantCharacterProps {
    message: string;
    visible?: boolean;
}

export default function AssistantCharacter({ message, visible = true }: AssistantCharacterProps) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="fixed bottom-0 right-0 z-[60] flex flex-col items-end p-2 md:p-8 pointer-events-none"
                >
                    {/* Speech Bubble */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.5
                        }}
                        className="bg-white/95 dark:bg-brand-gray-900/95 backdrop-blur-md border border-brand-violet/20 p-3 md:p-6 rounded-[20px] md:rounded-[24px] rounded-br-none shadow-2xl max-w-[180px] md:max-w-[280px] mb-1 md:mb-4 relative overflow-hidden group md:pointer-events-auto pointer-events-none"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-violet transition-all duration-500 group-hover:w-full group-hover:opacity-5" />

                        <p className="text-[10px] md:text-base font-medium text-brand-gray-900 dark:text-brand-gray-100 relative z-10 leading-relaxed italic">
                            "{message}"
                        </p>

                        {/* Tip indicator */}
                        <div className="absolute right-0 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white/95 dark:border-t-brand-gray-900/95" />
                    </motion.div>

                    {/* Character Image */}
                    <div className="relative w-24 h-24 md:w-64 md:h-64 md:pointer-events-auto pointer-events-none">
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
                                    src="/assistant-placeholder.png"
                                    alt="Assistant"
                                    fill
                                    className="object-contain drop-shadow-[0_10px_30px_rgba(139,92,246,0.3)] opacity-80 md:opacity-100"
                                    priority
                                />
                            </motion.div>
                        </motion.div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-brand-violet/5 md:bg-brand-violet/10 blur-[40px] md:blur-[100px] -z-10 rounded-full animate-pulse" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
