import { Star } from "@/decorations/Shapes";

interface ServiceCardProps {
  title: string;
  description: string;
  iconColor: string;
}

export default function ServiceCard({
  title,
  description,
  iconColor,
}: ServiceCardProps) {
  return (
    <div className="flex gap-3">
      <Star className={`w-6 h-6 shrink-0 ${iconColor}`} />
      <div className="flex flex-col gap-3">
        <h3 className="style-headline-3">{title}</h3>
        <p className="style-body-1">{description}</p>
      </div>
    </div>
  );
}
