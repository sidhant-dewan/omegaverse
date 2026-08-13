import { SkeletonHero, SkeletonTitleCard } from "@/components/ui/skeletons";
export default function Loading() { return <div><SkeletonHero /><div className="page-shell loading-grid">{Array.from({ length: 7 }, (_, index) => <SkeletonTitleCard key={index} />)}</div></div>; }
