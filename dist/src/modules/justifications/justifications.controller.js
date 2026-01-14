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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustificationsController = void 0;
const common_1 = require("@nestjs/common");
const justifications_service_1 = require("./justifications.service");
const create_justification_dto_1 = require("./dto/create-justification.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
let JustificationsController = class JustificationsController {
    constructor(justificationsService) {
        this.justificationsService = justificationsService;
    }
    create(user, createDto) {
        return this.justificationsService.create(user.userId, createDto);
    }
    findAll(user) {
        return this.justificationsService.findAll(user.rol, user.userId);
    }
    updateStatus(id, user, statusDto) {
        return this.justificationsService.updateStatus(id, user.userId, statusDto);
    }
};
exports.JustificationsController = JustificationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Trabajador sube una justificación' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_justification_dto_1.CreateJustificationDto]),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ver lista de justificantes' }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.GESTOR),
    (0, swagger_1.ApiOperation)({ summary: 'Admin aprueba o rechaza justificante' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_justification_dto_1.UpdateJustificationStatusDto]),
    __metadata("design:returntype", void 0)
], JustificationsController.prototype, "updateStatus", null);
exports.JustificationsController = JustificationsController = __decorate([
    (0, swagger_1.ApiTags)('justifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('justifications'),
    __metadata("design:paramtypes", [justifications_service_1.JustificationsService])
], JustificationsController);
//# sourceMappingURL=justifications.controller.js.map