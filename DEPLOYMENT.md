# Guía de Despliegue en Render (Optimizado)

Esta guía te permitirá desplegar el backend de forma profesional en Render usando el archivo `render.yaml` (Blueprints), lo cual automatiza la creación de la base de datos y el servicio web.

## 🚀 Pasos para el Despliegue

### 1. Preparar el Repositorio
Asegúrate de que los últimos cambios (con el endpoint `/health`) estén en GitHub:
```bash
git add .
git commit -m "Final improvements for deployment"
git push origin main
```

### 2. Despliegue Automático con Blueprints
1. Ve a tu [Dashboard de Render](https://dashboard.render.com/).
2. Haz clic en **"New +"** -> **"Blueprint"**.
3. Conecta tu repositorio: `https://github.com/cristian11-05/Backend-Intranet.git`.
4. Render leerá el archivo `render.yaml`.
5. **Variables de Entorno**:
   - `DATABASE_URL`: **IMPORTANTE**. Pega aquí tu URL de conexión de Supabase (la que tienes en tu `.env`).
   - `JWT_SECRET`: Ingresa una cadena larga y aleatoria.
6. Haz clic en **"Apply"**.

### 3. Configurar el "Keep-Alive" (Evitar que se duerma)
Como usas el plan gratuito, el backend se dormirá tras 15 minutos sin tráfico. Para evitarlo:
1. Crea una cuenta en [Cron-job.org](https://cron-job.org/) (Gratis).
2. Crea un nuevo **Cronjob**.
3. **URL**: `https://back-almuerzo.onrender.com/health` (Cambia la URL por la que te asigne Render).
4. **Frecuencia**: Cada **10 minutos**.
5. Esto mantendrá la instancia activa las 24/7 sin costo adicional.

## 🛠️ Verificación
- **Endpoint de Salud**: `https://tu-app.onrender.com/health`
- **Swagger Docs**: `https://tu-app.onrender.com/api/docs`

## ⚠️ Notas Importantes
- La primera vez el despliegue puede tardar ~5 minutos mientras se crea la base de datos y se instalan dependencias.
- No es necesario crear la base de datos manualmente; el Blueprint lo hace por ti siguiendo el archivo `render.yaml`.
