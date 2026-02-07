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
                    className="fixed bottom-0 right-0 z-50 flex flex-col items-end p-4 md:p-8 pointer-events-none"
                >
                    {/* Speech Bubble */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white dark:bg-brand-gray-900 border border-brand-violet/20 p-6 rounded-[24px] rounded-br-none shadow-2xl max-w-[280px] mb-4 relative overflow-hidden group pointer-events-auto"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-brand-violet transition-all duration-500 group-hover:w-full group-hover:opacity-5" />
                        <p className="text-sm md:text-base font-medium text-foreground relative z-10 leading-relaxed italic">
                            "{message}"
                        </p>

                        {/* Tip indicator */}
                        <div className="absolute right-0 bottom-[-10px] w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-white dark:border-t-brand-gray-900" />
                    </motion.div>

                    {/* Character Image */}
                    <div className="relative w-48 h-48 md:w-64 md:h-64 pointer-events-auto">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/assistant-placeholder.png" // User will need to provide this or I'll use a generic SVG if possible
                                alt="Assistant"
                                fill
                                className="object-contain drop-shadow-[0_20px_50px_rgba(139,92,246,0.3)]"
                            />
                        </motion.div>

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-brand-violet/20 blur-[100px] -z-10 rounded-full" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
