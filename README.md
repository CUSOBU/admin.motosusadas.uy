
## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd admin-template
```

2. Instala las dependencias:
```bash
yarn install
# o
npm install
```

3. Inicia el servidor de desarrollo:
```bash
yarn serve
# o
npm run serve
```

4. Compila para producción:
```bash
yarn build
# o
npm run build
```

## 📝 Componentes Principales

### Drawer
Menú lateral de navegación con soporte para submenús y diseño responsivo.

### Datatable
Tabla de datos con paginación, ordenamiento y slots personalizables.

### ConfirmDialog
Diálogo de confirmación reutilizable para acciones críticas.

### Heading
Componente de encabezado para las páginas.


## 🎨 Personalización

### Colores y Temas
Los colores se pueden personalizar en `src/plugins/vuetify.ts`:

```typescript
const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        primary: '#1D3557',
        secondary: '#457B9D',
        // ... más colores
      },
    },
  },
})
```

### Estilos Globales
Los estilos globales están en `src/scss/layout.scss`.

## 🌐 Internacionalización (i18n)

Las traducciones se encuentran en `src/locales/`. Para agregar un nuevo idioma:

1. Crea un nuevo archivo JSON en `src/locales/` (ej: `en.json`)
2. Agrega las traducciones
3. Importa el archivo en `src/plugins/i18n.ts`

