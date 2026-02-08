"use client";

import { useParams } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import ServiceDashboard from "@/components/ui/ServiceDashboard";
import { use } from "react";

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const service = getServiceBySlug(resolvedParams.slug);

    if (!service) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-brand-gray-500 uppercase tracking-widest text-xs">
                Service non trouvé
            </div>
        );
    }

    return <ServiceDashboard serviceName={service.name} />;
}
