# 🧠 MindOps Web

MindOps es una plataforma de **Ingeniería Mental** diseñada para optimizar tu rendimiento biológico y cognitivo. No es solo un gestor de tareas; es un sistema de monitoreo que traduce tus desahogos y patrones mentales en acciones accionables, ayudándote a mantener el "impulso" (Momentum) sin saturar tu "RAM" (capacidad cognitiva).

## 🚀 Características Principales

- **Ancla de Impulso (Momentum Anchor):** Identifica tu "Acción Atómica" prioritaria para evitar la parálisis por análisis.
- **Sincronización con Telegram:** Conecta tu mente en tiempo real mediante un bot. Envía tus pensamientos y el sistema los procesará.
- **Ritmo de Calma:** Visualización de tu carga mental a lo largo del día para identificar picos de saturación.
- **Perspectiva de IA:** Recibe interpretaciones profundas sobre tus propios patrones para ver con claridad a través del ruido.
- **Protocolo de Pausa:** Detección automática de fatiga crítica para forzar un reset biológico cuando sea necesario.

## 🛠 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Turbopack)
- **Base de Datos & Auth:** [Supabase](https://supabase.com/) (SSR, Google OAuth)
- **UI & Animaciones:** [Framer Motion](https://www.framer.com/motion/), [Tailwind CSS](https://tailwindcss.com/) & [Tremor](https://www.tremor.so/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Infraestructura:** [Google Cloud Run](https://cloud.google.com/run) & [Docker](https://www.docker.com/)
- **CI/CD:** GitHub Actions

## ⚙️ Configuración (Variables de Entorno)

Crea un archivo `.env` en la raíz del proyecto con las siguientes llaves:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

## 📦 Despliegue (En Google Cloud Run)

Este proyecto **no utiliza Vercel**. Se despliega en infraestructura escalable de Google Cloud.

### Despliegue Manual
Si tienes configurado el SDK de Google Cloud (`gcloud`), puedes desplegar directamente con:

```bash
npm run deploy
```

### Despliegue Automático (GitHub Actions)
El proyecto incluye un pipeline completo configurado en `.github/workflows/`:
1. **CI:** Verifica errores de linter y compilación en cada Push/PR.
2. **CD:** Despliega automáticamente a Google Cloud Run al hacer merge en `main`.

> *Nota: Requiere configurar los Secrets `GCP_SA_KEY`, `GCP_PROJECT_ID`, `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` en el repositorio de GitHub.*

## 💻 Desarrollo Local

1. Instala las dependencias (usando legacy-peer-deps por compatibilidad con React 19):
   ```bash
   npm install --legacy-peer-deps
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Limpia el código antes de subir cambios:
   ```bash
   npm run lint
   ```

---
Diseñado para la eficiencia. Construido para la mente. ⚡
