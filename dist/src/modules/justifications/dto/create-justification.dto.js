"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJustificationStatusDto = exports.CreateJustificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateJustificationDto {
}
exports.CreateJustificationDto = CreateJustificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cita Médica' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Asistencia a cita médica en ESSALUD' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-03-20' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "fecha_evento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "hora_inicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '10:00', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "hora_fin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://cdn.example.com/justificantes/doc123.pdf',
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateJustificationDto.prototype, "adjunto_url", void 0);
class UpdateJustificationStatusDto {
}
exports.UpdateJustificationStatusDto = UpdateJustificationStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'APROBADO' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJustificationStatusDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Falta adjunto legible', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateJustificationStatusDto.prototype, "razon_rechazo", void 0);
//# sourceMappingURL=create-justification.dto.js.map