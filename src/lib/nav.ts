/** Main navigation, shared by Header (desktop) and Sidebar (mobile). */
export const MAIN_MENU = [
  { label: 'Home', href: '/' },
  { label: 'Servizi', href: '/customer_service' },
  { label: 'Pubblicazioni', href: '/publications' },
  { label: 'Perché questo sito', href: '/why' },
  { label: 'CV', href: '/cv' },
  { label: 'Contatti', href: '/contacts' },
] as const;
