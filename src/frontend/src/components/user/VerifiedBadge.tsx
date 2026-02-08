import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  className?: string;
}

export default function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <Badge variant="secondary" className={`gap-1 ${className || ''}`}>
      <CheckCircle2 className="h-3 w-3 text-primary" />
      Verified
    </Badge>
  );
}
