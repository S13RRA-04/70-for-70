import { Activity, Briefcase, Dumbbell, HeartHandshake, Users, Wrench } from "lucide-react";
import { ResourceCategoryCard, type ResourceCategory } from "@/components/home/resource-category-card";

/**
 * The six entry points into the resource directory. Hrefs pass one or more
 * NEED_CATEGORIES ids (see resource-directory.tsx) as a comma-separated
 * `need` param — the directory's taxonomy doesn't have a 1:1 category for
 * every card (e.g. "Physical Health & Recovery" has no dedicated id and
 * shares "sports-fitness" with the fitness/recreation card), so a couple of
 * cards intentionally overlap rather than landing unfiltered.
 */
const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    title: "Mental & Emotional Health",
    description: "Counseling, crisis support, peer programs, and emotional wellness resources.",
    slug: "mental-emotional-health",
    href: "/resources?need=mental-health",
    icon: HeartHandshake,
  },
  {
    title: "Physical Health & Recovery",
    description: "Rehabilitation, recovery programs, adaptive health services, and wellness support.",
    slug: "physical-health-recovery",
    href: "/resources?need=sports-fitness",
    icon: Activity,
  },
  {
    title: "Sports, Fitness & Recreation",
    description: "Training, outdoor recreation, adaptive athletics, fitness, and community programs.",
    slug: "sports-fitness-recreation",
    href: "/resources?need=sports-fitness,outdoor-programs",
    icon: Dumbbell,
  },
  {
    title: "Financial & Career Support",
    description: "Employment, education, benefits, financial assistance, and career development.",
    slug: "financial-career-support",
    href: "/resources?need=career-education,financial-assistance",
    icon: Briefcase,
  },
  {
    title: "Equipment & Grants",
    description: "Adaptive equipment, gear assistance, grants, and funding programs.",
    slug: "equipment-grants",
    href: "/resources?need=equipment-grants",
    icon: Wrench,
  },
  {
    title: "Family & Community Support",
    description: "Family services, peer networks, community programs, and caregiver resources.",
    slug: "family-community-support",
    href: "/resources?need=family-support,purpose-community",
    icon: Users,
  },
];

export function ResourceCategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {RESOURCE_CATEGORIES.map((category) => (
        <ResourceCategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
