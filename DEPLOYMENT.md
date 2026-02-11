# Guía de Despliegue en Render

Este documento explica cómo desplegar el backend en Render para que el desarrollador móvil pueda acceder a la API.

## 📋 Requisitos Previos

- Cuenta en [Render.com](https://render.com) (gratis)
- Repositorio en GitHub con el código
- Cuenta en GitHub

## 🚀 Pasos de Despliegue

### 1. Preparar el Repositorio

El proyecto ya está configurado con los archivos necesarios:
- ✅ `render.yaml` - Configuración de Render
- ✅ `build.sh` - Script de construcción
- ✅ `.gitignore` - Archivos ignorados

**Subir cambios a GitHub:**

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Crear Cuenta en Render

1. Ve a https://render.com
2. Click en **"Get Started"**
3. Conecta con tu cuenta de GitHub
4. Autoriza a Render para acceder a tus repositorios

### 3. Crear Base de Datos PostgreSQL

1. En el dashboard de Render, click **"New +"** → **"PostgreSQL"**
2. Configuración:
   - **Name:** `back-almuerzo-db`
   - **Database:** `almuerzo`
   - **User:** `almuerzo_user`
   - **Region:** Oregon (o el más cercano)
   - **Plan:** **Free** (para desarrollo)
3. Click **"Create Database"**
4. **IMPORTANTE:** Copia la **Internal Database URL** (la necesitarás después)

### 4. Crear Web Service

1. En el dashboard, click **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub:
   - Busca `Backend_Intranet` o `back-almuerzo`
   - Click **"Connect"**
3. Configuración del servicio:
   - **Name:** `back-almuerzo`
   - **Region:** Oregon (mismo que la BD)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `chmod +x build.sh && ./build.sh`
   - **Start Command:** `npm run start:prod`
   - **Plan:** **Free**

### 5. Configurar Variables de Entorno

En la sección **"Environment"**, agrega estas variables:

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | (Pega la Internal Database URL del paso 3) |
| `JWT_SECRET` | (Genera una clave segura, ver abajo) |
| `PORT` | `3000` |

**Generar JWT_SECRET seguro:**
```bash
# En tu terminal local:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Desplegar

1. Click **"Create Web Service"**
2. Render comenzará a construir y desplegar automáticamente
3. Espera 5-10 minutos (primera vez es más lento)
4. Verifica los logs en tiempo real

### 7. Verificar Despliegue

Una vez completado, tu API estará disponible en:

```
https://back-almuerzo.onrender.com
```

**Endpoints principales:**
- 📚 Documentación Swagger: `https://back-almuerzo.onrender.com/api/docs`
- 🔐 Login: `POST https://back-almuerzo.onrender.com/auth/login`
- 👥 Usuarios: `GET https://back-almuerzo.onrender.com/users`
- 🍽️ Pedidos: `GET https://back-almuerzo.onrender.com/orders`

## 📱 Para el Desarrollador Móvil

Comparte esta información con el desarrollador móvil:

### URL Base de la API
```
https://back-almuerzo.onrender.com
```

### Documentación Interactiva
```
https://back-almuerzo.onrender.com/api/docs
```

Aquí puede ver todos los endpoints, probarlos y ver los modelos de datos.

### Ejemplo de Uso

**Login:**
```bash
POST https://back-almuerzo.onrender.com/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "contrasena": "password123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Usuario Test",
    "email": "usuario@example.com",
    "rol": "empleado"
  }
}
```

**Usar el token en requests:**
```bash
GET https://back-almuerzo.onrender.com/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚠️ Importante - Plan Gratuito

El plan gratuito de Render tiene estas limitaciones:

- **Sleep automático:** Después de 15 minutos de inactividad, el servicio se "duerme"
- **Primera request lenta:** Cuando está dormido, la primera request toma ~30 segundos
- **Recursos limitados:** 512 MB RAM, CPU compartida

**Solución para desarrollo:**
- Hacer una request cada 10-15 minutos para mantenerlo activo
- O usar un servicio de "ping" gratuito como [UptimeRobot](https://uptimerobot.com)

**Para producción:**
- Considerar plan de pago ($7/mes) que no tiene sleep

## 🔄 Despliegue Automático

Render está configurado para **auto-deploy**:
- Cada vez que hagas `git push` a la rama `main`
- Render detectará los cambios y desplegará automáticamente
- Verás el progreso en el dashboard

## 📊 Monitoreo

En el dashboard de Render puedes:
- Ver logs en tiempo real
- Monitorear uso de recursos
- Ver historial de deploys
- Configurar alertas

## 🐛 Troubleshooting

### Error: "Build failed"
- Revisa los logs de build
- Verifica que todas las dependencias estén en `package.json`
- Asegúrate que `build.sh` tenga permisos de ejecución

### Error: "Application failed to start"
- Revisa que `DATABASE_URL` esté configurada correctamente
- Verifica que `JWT_SECRET` esté configurado
- Revisa los logs de la aplicación

### Error: "Cannot connect to database"
- Usa la **Internal Database URL**, no la External
- Verifica que la base de datos esté en la misma región
- Espera unos minutos, la BD puede tardar en iniciar

### La API responde lento
- Normal en plan gratuito después de inactividad
- Primera request toma ~30 segundos (cold start)
- Considera hacer ping cada 10 minutos

## 💡 Alternativas a Render

Si Render no funciona bien, considera:

1. **Railway** (https://railway.app)
   - Similar a Render
   - $5 de crédito gratis mensual
   - Más rápido que Render

2. **Fly.io** (https://fly.io)
   - Más técnico
   - Muy rápido
   - Gratis hasta cierto uso

3. **Heroku**
   - Más conocido
   - Ya no tiene plan gratuito
   - $5/mes mínimo

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render dashboard
2. Consulta la [documentación de Render](https://render.com/docs)
3. Verifica que el proyecto compile localmente con `npm run build`
