export const SERVICES = [
    { name: "Comptabilité", slug: "comptabilite", description: "Gestion financière et comptable" },
    { name: "Direction Executive", slug: "direction-executive", description: "Pilotage stratégique et coordination" },
    { name: "Chargée de Programme", slug: "chargee-de-programme", description: "Gestion des projets et programmes" },
    { name: "Plaidoyer", slug: "plaidoyer", description: "Influence et relations publiques" },
    { name: "Direction Administrative et Financière", slug: "direction-administrative-et-financiere", description: "Gestion des ressources humaines et financières" },
];

export function getServiceBySlug(slug: string) {
    return SERVICES.find(s => s.slug === slug);
}
