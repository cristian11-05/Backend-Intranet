-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comunicados" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "contenido" TEXT NOT NULL,
    "imagen_url" TEXT,
    "autor_id" INTEGER,
    "activo" BOOLEAN DEFAULT true,
    "fecha_publicacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comunicados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_tokens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "device_id" VARCHAR(255) NOT NULL,
    "device_name" VARCHAR(255),
    "os_type" VARCHAR(20),
    "is_active" BOOLEAN DEFAULT true,
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "descripcion" TEXT,
    "estado" INTEGER DEFAULT 0,
    "monto" DECIMAL(10,2),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" INTEGER NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "device_id" VARCHAR(255),
    "device_name" VARCHAR(255),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "is_revoked" BOOLEAN DEFAULT false,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "last_used_at" TIMESTAMP(6),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "contrasena" TEXT NOT NULL,
    "area_id" INTEGER,
    "rol" VARCHAR(20) DEFAULT 'empleado',
    "estado" BOOLEAN DEFAULT true,
    "documento" VARCHAR(50),
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestions" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "area_id" INTEGER,
    "tipo" VARCHAR(100),
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "estado" INTEGER DEFAULT 0,
    "comentario_admin" TEXT,
    "revisado_por" INTEGER,
    "fecha_revision" TIMESTAMP(6),
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suggestion_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "suggestion_id" INTEGER NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "tipo_archivo" VARCHAR(50),
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suggestion_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "justifications" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "area_id" INTEGER,
    "titulo" VARCHAR(255) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_evento" TIMESTAMP(6) NOT NULL,
    "hora_inicio" VARCHAR(10),
    "hora_fin" VARCHAR(10),
    "estado" INTEGER DEFAULT 0,
    "razon_rechazo" TEXT,
    "aprobado_por" INTEGER,
    "fecha_creacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "justifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "justification_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "justification_id" INTEGER NOT NULL,
    "ruta_archivo" TEXT NOT NULL,
    "tipo_archivo" VARCHAR(50),
    "fecha_registro" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "justification_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_device" ON "device_tokens"("usuario_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_user_sessions_device" ON "user_sessions"("usuario_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "comunicados" ADD CONSTRAINT "fk_comunicados_autor" FOREIGN KEY ("autor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "device_tokens" ADD CONSTRAINT "fk_device_tokens_user" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "fk_orders_user" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "fk_user_sessions_user" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_area" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "fk_suggestions_user" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_revisado_por_fkey" FOREIGN KEY ("revisado_por") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "suggestion_attachments" ADD CONSTRAINT "suggestion_attachments_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "suggestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "fk_justifications_user" FOREIGN KEY ("usuario_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "justifications" ADD CONSTRAINT "fk_justifications_approver" FOREIGN KEY ("aprobado_por") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "justification_attachments" ADD CONSTRAINT "justification_attachments_justification_id_fkey" FOREIGN KEY ("justification_id") REFERENCES "justifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
