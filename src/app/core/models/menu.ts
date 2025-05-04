export interface MenuItem {
    label: string;
    icon: string;
    permission: string;
    route?: string;
    submenu?: MenuItem[];
  }