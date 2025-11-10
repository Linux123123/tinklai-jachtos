import { cn } from '@/lib/utils';
import { Ship } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return <Ship {...props} className={cn('fill-white text-blue-500', props.className)} />;
}
