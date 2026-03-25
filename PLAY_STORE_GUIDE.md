# 🚀 Guía: Play Store con Capacitor

## 1. Instalar dependencias (desde tu máquina)

```bash
cd life-os
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/haptics @capacitor/share @capacitor/status-bar @capacitor/splash-screen
```

## 2. Inicializar Capacitor

```bash
npx cap init "Lista Compartida" com.listacompartida.app --web-dir dist
```

## 3. Compilar la web

```bash
npm run build
```

## 4. Agregar la plataforma Android

```bash
npx cap add android
npx cap sync android
```

## 5. Abrir en Android Studio

```bash
npx cap open android
```

---

## 6. Íconos y Splash Screen

### Opción rápida: usar `@capacitor/assets`
```bash
npm install @capacitor/assets --save-dev
```

Creá la carpeta `assets/` con:
- `assets/icon.png` → PNG cuadrado 1024×1024px
- `assets/splash.png` → PNG 2732×2732px (centrado)

```bash
npx capacitor-assets generate --android
```

### Colores recomendados para tu app
- Fondo: `#0b0f19` (dark navy)
- Ícono: 🛒 sobre fondo azul `#3b82f6`
- Splash: logo centrado en `#0b0f19`

---

## 7. Configurar Google Sign-In en Android

En `android/app/build.gradle` verificá el `applicationId`:
```gradle
applicationId "com.listacompartida.app"
```

En **Firebase Console**:
1. Ir a Project Settings → Add App → Android
2. Package name: `com.listacompartida.app`
3. Descargar `google-services.json`
4. Copiar a `android/app/google-services.json`

En `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

En `android/build.gradle`:
```gradle
classpath 'com.google.gms:google-services:4.3.15'
```

> ⚠️ Google Sign-In con popup no funciona en Capacitor. Usar `signInWithRedirect` como fallback (ya está implementado en el código).

---

## 8. Generar el APK / AAB firmado

En Android Studio:
1. **Build → Generate Signed Bundle/APK**
2. Elegir **Android App Bundle (.aab)** (requerido por Play Store)
3. Crear o usar un keystore existente
4. Guardar la contraseña del keystore en un lugar seguro

O por línea de comandos:
```bash
cd android
./gradlew bundleRelease
```
El .aab queda en: `android/app/build/outputs/bundle/release/`

---

## 9. Subir a Play Store

### Google Play Console (play.google.com/console)
1. Crear cuenta de desarrollador ($25 USD, único pago)
2. **Crear app** → nombre: "Lista Compartida"
3. Completar el listing:
   - **Título**: Lista Compartida - Compras en grupo
   - **Descripción corta** (80 chars): Organizá tus compras con familia o pareja en tiempo real
   - **Descripción larga**: (ver sección ASO más abajo)
4. Subir el `.aab` en **Production → Releases**
5. Subir screenshots (mínimo 2, recomendado 8)
6. Ícono de 512×512px
7. Feature graphic: 1024×500px

---

## 10. ASO (App Store Optimization)

### Título optimizado (30 chars máx)
```
Lista Compartida - Compras
```

### Descripción corta (80 chars)
```
Listas de compras en tiempo real con tu familia o pareja. Sin fricción.
```

### Descripción larga (4000 chars disponibles)
```
¿Cansado de que en el super falte algo porque nadie avisó?

Lista Compartida sincroniza tu lista de compras con todas las personas de tu grupo en tiempo real. Cuando alguien agrega un producto, todos lo ven al instante. Cuando alguien lo tacha de comprado, desaparece de la lista pendiente de todos.

✅ FUNCIONES PRINCIPALES
• Creá grupos para diferentes contextos: hogar, trabajo, amigos
• Compartí el acceso con un código simple de 6 letras
• Agregá productos con nombre, cantidad y precio
• Marcá productos como comprados con un solo toque
• Calculá el total estimado de tus compras antes de ir al super
• Deslizá para borrar productos rápidamente
• Modo offline: la app funciona sin internet en el super

🔄 SINCRONIZACIÓN EN TIEMPO REAL
Los cambios de un miembro del grupo se ven al instante en los dispositivos de los demás. No más llamadas a mitad del super preguntando qué falta.

💰 SEGUIMIENTO DE PRECIOS
Guardá el precio de cada producto para saber cuánto vas a gastar antes de llegar a la caja. La app calcula automáticamente el total.

🔒 SEGURO Y PRIVADO
Solo los miembros con el código del grupo pueden ver la lista. Iniciá sesión con tu cuenta de Google de forma segura.

📴 FUNCIONA SIN INTERNET
Gracias al modo offline, podés seguir usando la app incluso sin señal dentro del supermercado.

IDEAL PARA:
• Parejas que comparten gastos del hogar
• Familias que van de compras juntas
• Roommates que comparten alimentos
• Cualquier grupo que necesite coordinarse

Descargala gratis y organizá tus compras sin fricción.
```

### Palabras clave (tags relevantes)
lista de compras, supermercado, compras compartidas, shopping list, lista compartida, organizador hogar, compras familia, mercado

### Categoría recomendada
**Productividad** o **Casa y Hogar**

---

## 11. Screenshots recomendados

Pantallas a capturar (1080×1920px o 1440×2560px):
1. **Pantalla de inicio** — headline "Compras en equipo, sin fricción"
2. **Lista activa** — items con checkbox, precios, contador de pendientes
3. **Total del carrito** — tarjeta de total estimado y comprado
4. **Compartir código** — modal nativo de share
5. **Swipe to delete** — animación de borrado
6. **Grupo con múltiples miembros** — mostrando "Agregado por..."
7. **Filtro comprados** — items tachados

### Herramientas para crear screenshots atractivos
- [Previewed.app](https://previewed.app) — mockups con marco de teléfono
- [DaVinci](https://davinci.graphics) — diseños para Play Store
- Figma — para diseño personalizado

---

## 12. Pricing y modelo de negocio

### Opciones para monetizar en el futuro:
- **Freemium**: gratis hasta 3 grupos, $X/mes para ilimitados
- **Ads**: banner no intrusivo en la lista de grupos
- **Premium**: historial de compras, estadísticas de gastos, listas de recetas

### Recomendación inicial
Lanzar **completamente gratis** para conseguir reseñas y tracción. Después de 1000+ descargas evaluar modelo freemium.

---

## 13. Comandos de desarrollo rápido

```bash
# Reconstruir después de cambios en el código
npm run build && npx cap sync android

# Correr en dispositivo Android conectado (USB debugging activado)
npx cap run android

# Ver logs en tiempo real
npx cap run android --livereload

# Inspeccionar WebView en Chrome
# Ir a chrome://inspect en Chrome desktop
```

---

## 14. Checklist antes de publicar

- [ ] `npm run build` sin errores de TypeScript
- [ ] `npx cap sync android` exitoso
- [ ] App probada en dispositivo físico Android
- [ ] Google Sign-In funciona en el APK release (no solo en dev)
- [ ] `google-services.json` copiado en `android/app/`
- [ ] Ícono y splash screen configurados
- [ ] Título, descripción y screenshots subidos a Play Console
- [ ] Privacy Policy publicada (requerida por Google)
- [ ] Clasificación de contenido completada en Play Console
- [ ] Versión de lanzamiento: versionCode=1, versionName="1.0.0"
