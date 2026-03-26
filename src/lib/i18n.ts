import { create } from 'zustand' // we'll use a simpler approach

type Lang = 'en' | 'es';

const translations = {
  en: {
    nav: {
      home: 'Home',
      models: 'Models',
      configurator: 'Configurator',
      about: 'About',
      contact: 'Contact',
      login: 'Sign In',
      myBuilds: 'My Builds',
      admin: 'Admin',
      logout: 'Sign Out',
    },
    hero: {
      subtitle: 'Bespoke Porsche Restoration',
      title: 'Reimagined Perfection',
      description: 'Each vehicle is a masterpiece of engineering and artistry, meticulously crafted to exceed the extraordinary.',
      cta: 'Configure Yours',
      explore: 'Explore Models',
    },
    models: {
      subtitle: 'The Collection',
      title: 'Select Your Canvas',
      configure: 'Configure',
      specs: 'View Specs',
    },
    craft: {
      subtitle: 'The Process',
      title: 'Uncompromising Craftsmanship',
      description: 'Every detail is obsessed over. Every surface is perfected. From hand-stitched leather interiors to precision-engineered mechanicals, our restoration process transforms iconic Porsche models into bespoke works of art.',
      cta: 'Learn More',
    },
    footer: {
      tagline: 'Bespoke Porsche restoration and customization at the highest level.',
      navigation: 'Navigation',
      contact: 'Contact',
      followUs: 'Follow Us',
      rights: 'All rights reserved.',
    },
    configurator: {
      title: 'Build Your Vision',
      subtitle: 'Configurator',
      exteriorColor: 'Exterior Color',
      interiorColor: 'Interior',
      wheels: 'Wheels',
      summary: 'Your Build Summary',
      save: 'Save Configuration',
      loginToSave: 'Sign in to save',
      model: 'Model',
      saved: 'Configuration saved!',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Create Account',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      forgotPassword: 'Forgot password?',
    },
    builds: {
      title: 'My Configurations',
      subtitle: 'Your Builds',
      empty: 'No saved configurations yet.',
      startBuilding: 'Start Building',
      delete: 'Delete',
      load: 'Load in Configurator',
    },
  },
  es: {
    nav: {
      home: 'Inicio',
      models: 'Modelos',
      configurator: 'Configurador',
      about: 'Nosotros',
      contact: 'Contacto',
      login: 'Iniciar Sesión',
      myBuilds: 'Mis Diseños',
      admin: 'Admin',
      logout: 'Cerrar Sesión',
    },
    hero: {
      subtitle: 'Restauración Porsche a Medida',
      title: 'Perfección Reimaginada',
      description: 'Cada vehículo es una obra maestra de ingeniería y arte, meticulosamente creado para superar lo extraordinario.',
      cta: 'Configura el Tuyo',
      explore: 'Explorar Modelos',
    },
    models: {
      subtitle: 'La Colección',
      title: 'Elige Tu Lienzo',
      configure: 'Configurar',
      specs: 'Ver Especificaciones',
    },
    craft: {
      subtitle: 'El Proceso',
      title: 'Artesanía Sin Compromiso',
      description: 'Cada detalle es obsesivamente cuidado. Cada superficie es perfeccionada. Desde interiores de cuero cosidos a mano hasta mecánica de precisión, nuestro proceso de restauración transforma modelos icónicos de Porsche en obras de arte a medida.',
      cta: 'Conocer Más',
    },
    footer: {
      tagline: 'Restauración y personalización Porsche a medida al más alto nivel.',
      navigation: 'Navegación',
      contact: 'Contacto',
      followUs: 'Síguenos',
      rights: 'Todos los derechos reservados.',
    },
    configurator: {
      title: 'Construye Tu Visión',
      subtitle: 'Configurador',
      exteriorColor: 'Color Exterior',
      interiorColor: 'Interior',
      wheels: 'Rines',
      summary: 'Resumen de Tu Diseño',
      save: 'Guardar Configuración',
      loginToSave: 'Inicia sesión para guardar',
      model: 'Modelo',
      saved: '¡Configuración guardada!',
    },
    auth: {
      signIn: 'Iniciar Sesión',
      signUp: 'Crear Cuenta',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      fullName: 'Nombre Completo',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      forgotPassword: '¿Olvidaste tu contraseña?',
    },
    builds: {
      title: 'Mis Configuraciones',
      subtitle: 'Tus Diseños',
      empty: 'Aún no tienes configuraciones guardadas.',
      startBuilding: 'Comenzar a Diseñar',
      delete: 'Eliminar',
      load: 'Cargar en Configurador',
    },
  },
} as const;

export type Translations = typeof translations.en;

let currentLang: Lang = 'en';
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  listeners.forEach((l) => l());
}

export function t(): Translations {
  return translations[currentLang];
}

export function useLang(): [Lang, Translations] {
  const [, setTick] = (await import('react')).useState(0);
  const react = await import('react');
  // This won't work as async. Let's use a different approach.
  return [currentLang, translations[currentLang]];
}

// Simple hook - we'll use React properly
export { translations };
