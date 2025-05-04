import { MenuItem } from '../models/menu';

export const APP_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Tableau de bord',
    icon: 'assets/svg/bord.svg',
    permission: 'VIEW_DASHBOARD',
    route: '/home/dashboard',
  },
  {
    label: 'Bilan de santé',
    icon: 'assets/svg/bord.svg',
    permission: 'VIEW_HEALTH_TABLE',
    route: '/home/bilan-sante',
  },
  {
    label: 'Personnels',
    icon: 'assets/svg/personnels.svg',
    permission: 'MANAGE_STAFF',
    route: '/home/personnels',
  },
  {
    label: 'Agenda',
    icon: 'assets/svg/agenda.svg',
    permission: 'VIEW_AGENDA',
    route: '/home/agenda',
    submenu: [
      {
        label: 'Agenda',
        icon: '',
        permission: 'VIEW_AGENDA',
        route: '/home/agenda',
      },
      {
        label: 'Rendez-vous',
        icon: '',
        permission: 'MANAGE_APPOINTMENTS',
        route: '/home/agenda/rendez-vous',
      },
      {
        label: "Salle d'attente",
        icon: '',
        permission: 'VIEW_WAITING_ROOM',
        route: '/home/agenda/salle-attente',
      },
    ],
  },
  {
    label: 'Patients',
    icon: 'assets/svg/patients.svg',
    permission: 'VIEW_PATIENTS',
    route: '/home/patients',
  },

  {
    label: 'Dossier Électronique',
    icon: 'assets/svg/dossier.svg',
    permission: 'VIEW_DOSSIER',
    route: '/home/dossier',
    submenu: [
      {
        label: 'Imagerie',
        icon: '',
        permission: 'VIEW_IMAGERIE',
        route: '/home/dossier/imagerie',
      },
      {
        label: 'Ordonnances',
        icon: '',
        permission: 'VIEW_ORDONNANCES',
        route: '/home/dossier/ordonnances',
      },
      {
        label: 'Analyses',
        icon: '',
        permission: 'VIEW_ANALYSES',
        route: '/home/dossier/analyses',
      },
      {
        label: 'Rapport',
        icon: '',
        permission: 'VIEW_RAPPORT',
        route: '/home/dossier/rapport',
      },
    ],
  },
  {
    label: 'Cabinets',
    icon: 'assets/svg/cabinet.svg',
    permission: 'VIEW_VISITED_CABINETS',
    route: '/home/cabinet',
  },
  {
    label: 'Vidéo consultation',
    icon: 'assets/svg/vedio.svg',
    permission: 'VIDEO_CONSULTATION',
    route: '/home/video-consultation',
  },
  {
    label: 'Cabinet',
    icon: 'assets/svg/cabinet.svg',
    permission: 'VIEW_CABINET',
    route: '/home/cabinet',
    submenu: [
      {
        label: 'Médicaments',
        icon: '',
        permission: 'VIEW_MEDICAMENTS',
        route: '/home/cabinet/medicaments',
      },
      {
        label: 'Actes',
        icon: '',
        permission: 'VIEW_ACTES',
        route: '/home/cabinet/actes',
      },
      {
        label: 'Factures',
        icon: '',
        permission: 'VIEW_FACTURES',
        route: '/home/cabinet/factures',
      },
      {
        label: 'Archive',
        icon: '',
        permission: 'VIEW_ARCHIVE',
        route: '/home/cabinet/archive',
      },
    ],
  },
];

export function getPermissionsForRoute(route: string): string[] {
  const menuItem = APP_MENU_ITEMS.find((item) => item.route === route);
  if (menuItem && menuItem.permission) {
    return [menuItem.permission];
  }

  for (const item of APP_MENU_ITEMS) {
    if (item.submenu) {
      const subItem = item.submenu.find((sub) => sub.route === route);
      if (subItem && subItem.permission) {
        return [subItem.permission];
      }
    }
  }

  return [];
}
