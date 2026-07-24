import {
  Gauge, ShieldCheck, Scale, ClipboardCheck, Lock, BookOpen, Siren,
  Handshake, LifeBuoy, FileBarChart, BarChart3, Layers, type LucideIcon,
} from 'lucide-react';
import type { ModuleManifest } from '../../lib/moduleCatalog';

const iconMap: Record<ModuleManifest['icon'], LucideIcon> = {
  gauge: Gauge,
  'shield-check': ShieldCheck,
  scale: Scale,
  'clipboard-check': ClipboardCheck,
  lock: Lock,
  'book-open': BookOpen,
  siren: Siren,
  handshake: Handshake,
  'life-buoy': LifeBuoy,
  'file-bar-chart': FileBarChart,
  'bar-chart-3': BarChart3,
};

export function moduleIcon(icon: ModuleManifest['icon'] | undefined): LucideIcon {
  return (icon && iconMap[icon]) || Layers;
}
