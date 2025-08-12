import localFont from 'next/font/local'; 


export const Campton = localFont({
  src: [
    {
      path: '../../public/fonts/CamptonLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CamptonMedium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CamptonSemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/CamptonExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  display: 'swap',
  adjustFontFallback: false,
});