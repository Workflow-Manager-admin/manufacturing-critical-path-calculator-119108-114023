import 'vuetify/styles';
import { createVuetify } from 'vuetify';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#0d0d0d',
          secondary: '#f95801',
          accent: '#756c6c',
          background: '#fff'
        }
      }
    }
  }
});
