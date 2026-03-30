import type { ServiceIconId } from '../content/siteCopy.ts';
import {
  FaPersonDigging,
  FaPumpSoap,
  FaWater,
  FaWrench,
  FaWaveSquare,
  FaWindowRestore,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';

type ServiceIconProps = {
  icon: ServiceIconId;
  className?: string;
};

export function ServiceIcon({ icon, className }: ServiceIconProps) {
  const iconById: Record<ServiceIconId, IconType> = {
    waterproofing: FaWater,
    'crack-repair': FaWrench,
    'weeping-tile': FaWaveSquare,
    'sump-pump': FaPumpSoap,
    'window-well': FaWindowRestore,
    excavation: FaPersonDigging,
  };

  const Icon = iconById[icon];
  return <Icon className={className} aria-hidden />;
}

