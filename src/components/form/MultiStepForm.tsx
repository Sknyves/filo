"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { User, Building2, Briefcase, Calendar, ChevronRight, ChevronLeft, Send, Clock } from "lucide-react";
import Scene from "@/components/three/Scene";
import AssistantCharacter from "@/components/ui/AssistantCharacter";
import { useRouter } from "next/navigation";

interface FormField {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    options?: any[];
    icon?: any;
}

interface FormStep {
    title: string;
    fields: FormField[];
}

const steps: FormStep[] = [
    {
        title: "Vos informations",
        fields: [
            { name: "demandeur", label: "Nom et prénom", placeholder: "Ex: Jean Dupont", icon: User },
            { name: "email", label: "Adresse Email", type: "email", placeholder: "jean.dupont@exemple.com", icon: Send },
            { name: "service", label: "Votre Service", type: "select", options: ["Marketing", "RH", "Direction", "Commercial", "Technique"], icon: Building2 },
        ]
    },
    {
        title: "Détails de la demande",
        fields: [
            {
                name: "type",
                label: "Type de service",
                type: "cards",
                icon: Briefcase,
                options: [
                    { name: "Graphisme", icon: Briefcase, description: "Logos, affiches, supports" },
                    { name: "Sociaux", icon: Building2, description: "Posts, campagne, ads" },
                    { name: "Événement", icon: Calendar, description: "Salon, fête, séminaire" }
                ]
            },
            { name: "description", label: "Description du besoin", type: "textarea", placeholder: "Décrivez votre projet en quelques mots...", icon: Briefcase },
        ]
    }
];

export default function MultiStepForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});
    const [direction, setDirection] = useState(0);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            try {
                const response = await fetch("/api/requests", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    window.location.href = "/confirmation";
                }
            } catch (error) {
                console.error("Submission failed", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1] as any
            }
        },
        exit: (direction: number) => ({
            rotateY: direction > 0 ? -90 : 90,
            opacity: 0,
            scale: 0.8,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1] as any
            }
        })
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
            <Scene showParticles={false} />

            <AssistantCharacter
                message={
                    isSubmitting
                        ? "Excellent travail ! J'envoie ta demande tout de suite."
                        : currentStep === 0
                            ? "C'est un bon début ! Continuons avec tes informations."
                            : "Presque fini, encore un petit effort pour les détails !"
                }
            />

            <div className="w-full max-w-2xl relative z-10">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-brand-gray-500 mb-4"
                    >
                        Étape {currentStep + 1} sur {steps.length}
                    </motion.div>
                    <h2 className="text-4xl font-black text-foreground tracking-tight">{steps[currentStep].title}</h2>
                </div>

                <div className="perspective-1000 relative min-h-[450px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="relative inset-0 w-full h-full glass p-6 md:p-12 rounded-3xl"
                        >
                            <div className="space-y-8">
                                {steps[currentStep].fields.map((field: any) => (
                                    <div key={field.name} className="space-y-4">
                                        <label className="flex items-center gap-3 text-xs uppercase tracking-widest text-brand-gray-500 font-bold">
                                            {field.icon && <field.icon size={14} />}
                                            {field.label}
                                        </label>

                                        {field.type === "select" ? (
                                            <select
                                                className="w-full bg-stat-card border border-[var(--glass-border)] p-4 text-foreground outline-none focus:border-brand-violet transition-colors appearance-none"
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                value={formData[field.name] || ""}
                                            >
                                                <option value="">Sélectionnez un service</option>
                                                {field.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : field.type === "cards" ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {field.options.map((opt: any) => (
                                                    <button
                                                        key={opt.name}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, [field.name]: opt.name })}
                                                        className={`p-6 border transition-all duration-300 text-left group ${formData[field.name] === opt.name
                                                            ? "bg-brand-violet border-brand-violet text-white"
                                                            : "bg-foreground/5 border-[var(--glass-border)] text-foreground hover:border-brand-violet/40"
                                                            }`}
                                                    >
                                                        <opt.icon size={24} className="mb-4" />
                                                        <div className="font-bold text-sm uppercase tracking-tighter">{opt.name}</div>
                                                        <div className="text-[10px] opacity-60 mt-2">{opt.description}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : field.type === "textarea" ? (
                                            <textarea
                                                placeholder={field.placeholder}
                                                className="w-full bg-stat-card border border-[var(--glass-border)] p-4 text-foreground outline-none focus:border-brand-violet transition-colors h-32 resize-none"
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                value={formData[field.name] || ""}
                                            />
                                        ) : (
                                            <input
                                                type={field.type || "text"}
                                                placeholder={field.placeholder}
                                                className="w-full bg-stat-card border border-[var(--glass-border)] p-4 text-foreground outline-none focus:border-brand-violet transition-colors"
                                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                                value={formData[field.name] || ""}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex items-center justify-between">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-opacity ${currentStep === 0 ? "opacity-0" : "opacity-100 hover:text-foreground"}`}
                    >
                        <ChevronLeft size={16} /> Précédent
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="group flex items-center gap-4 bg-foreground text-background px-8 py-4 font-black uppercase tracking-widest hover:bg-brand-gray-500/20 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? "Envoi..." : (currentStep === steps.length - 1 ? "Envoyer" : "Suivant")}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
