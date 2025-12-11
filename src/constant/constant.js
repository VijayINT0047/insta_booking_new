// src/constants.js
// Central constants, RBAC helpers and API error/response utilities for Insta Manage (MVP)

const ROLES = {
  SUPER_ADMIN: "super_admin",      // Full platform access (manages orgs & admins)
  ORG_ADMIN: "org_admin",          // Org-level admin (billing, org settings)
  PROJECT_MANAGER: "project_manager", // Plans projects, manages sprints/tasks
  MEMBER: "member",                // Regular project member (can be assignee)
  ASSET_MANAGER: "asset_manager",  // Manages inventory, allocations
  VIEWER: "viewer",                // Read-only access
};

const ROLE_LIST = Object.values(ROLES);

// Modules (explicitly listed per the product user story)
const MODULES = {
  AUTH: "auth",
  USERS: "users",
  ORGANIZATIONS: "organizations",
  PROJECTS: "projects",
  TASKS: "tasks",
  SPRINTS: "sprints",
  ASSETS: "assets",
  ASSET_ALLOCATIONS: "asset_allocations",
  ATTACHMENTS: "attachments",
  NOTIFICATIONS: "notifications",
  REPORTS: "reports",
  AUDIT_LOGS: "audit_logs",
  ROLES_PERMISSIONS: "roles_permissions",
  HEALTH: "health",
};

const MODULE_LIST = Object.values(MODULES);

// Basic CRUD actions used for permissions
const ACTIONS = {
  READ: "read",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
  ALLOCATE: "allocate",    // asset-specific
  TRANSFER: "transfer",    // asset-specific
  EXPORT: "export",        // reporting/export-specific
  START: "start",          // sprint/task life-cycle
  CLOSE: "close",          // sprint life-cycle
};

// Helper: build permission string for module action e.g. "assets:create"
const buildPermission = (moduleName, action) => `${moduleName}:${action}`;

// Generate common module permissions (CRUD + export where applicable)
const MODULE_PERMISSIONS = {
  [MODULES.USERS]: [
    buildPermission(MODULES.USERS, ACTIONS.READ),
    buildPermission(MODULES.USERS, ACTIONS.CREATE),
    buildPermission(MODULES.USERS, ACTIONS.UPDATE),
    buildPermission(MODULES.USERS, ACTIONS.DELETE),
  ],
  [MODULES.PROJECTS]: [
    buildPermission(MODULES.PROJECTS, ACTIONS.READ),
    buildPermission(MODULES.PROJECTS, ACTIONS.CREATE),
    buildPermission(MODULES.PROJECTS, ACTIONS.UPDATE),
    buildPermission(MODULES.PROJECTS, ACTIONS.DELETE),
    buildPermission(MODULES.PROJECTS, ACTIONS.EXPORT),
  ],
  [MODULES.TASKS]: [
    buildPermission(MODULES.TASKS, ACTIONS.READ),
    buildPermission(MODULES.TASKS, ACTIONS.CREATE),
    buildPermission(MODULES.TASKS, ACTIONS.UPDATE),
    buildPermission(MODULES.TASKS, ACTIONS.DELETE),
  ],
  [MODULES.SPRINTS]: [
    buildPermission(MODULES.SPRINTS, ACTIONS.READ),
    buildPermission(MODULES.SPRINTS, ACTIONS.CREATE),
    buildPermission(MODULES.SPRINTS, ACTIONS.UPDATE),
    buildPermission(MODULES.SPRINTS, ACTIONS.DELETE),
    buildPermission(MODULES.SPRINTS, ACTIONS.START),
    buildPermission(MODULES.SPRINTS, ACTIONS.CLOSE),
  ],
  [MODULES.ASSETS]: [
    buildPermission(MODULES.ASSETS, ACTIONS.READ),
    buildPermission(MODULES.ASSETS, ACTIONS.CREATE),
    buildPermission(MODULES.ASSETS, ACTIONS.UPDATE),
    buildPermission(MODULES.ASSETS, ACTIONS.DELETE),
    buildPermission(MODULES.ASSETS, ACTIONS.ALLOCATE),
    buildPermission(MODULES.ASSETS, ACTIONS.TRANSFER),
    buildPermission(MODULES.ASSETS, ACTIONS.EXPORT),
  ],
  [MODULES.ASSET_ALLOCATIONS]: [
    buildPermission(MODULES.ASSET_ALLOCATIONS, ACTIONS.READ),
    buildPermission(MODULES.ASSET_ALLOCATIONS, ACTIONS.CREATE),
  ],
  [MODULES.NOTIFICATIONS]: [
    buildPermission(MODULES.NOTIFICATIONS, ACTIONS.READ),
    buildPermission(MODULES.NOTIFICATIONS, ACTIONS.CREATE),
  ],
  [MODULES.REPORTS]: [
    buildPermission(MODULES.REPORTS, ACTIONS.READ),
    buildPermission(MODULES.REPORTS, ACTIONS.EXPORT),
  ],
  [MODULES.ATTACHMENTS]: [
    buildPermission(MODULES.ATTACHMENTS, ACTIONS.READ),
    buildPermission(MODULES.ATTACHMENTS, ACTIONS.CREATE),
    buildPermission(MODULES.ATTACHMENTS, ACTIONS.DELETE),
  ],
  [MODULES.AUDIT_LOGS]: [
    buildPermission(MODULES.AUDIT_LOGS, ACTIONS.READ),
  ],
  [MODULES.ROLES_PERMISSIONS]: [
    buildPermission(MODULES.ROLES_PERMISSIONS, ACTIONS.READ),
    buildPermission(MODULES.ROLES_PERMISSIONS, ACTIONS.CREATE),
    buildPermission(MODULES.ROLES_PERMISSIONS, ACTIONS.UPDATE),
  ],
};

// Flatten helper to get all defined permissions
const ALL_PERMISSIONS = Object.values(MODULE_PERMISSIONS).flat();

// Default role → permissions mapping designed to match the user story
// - SUPER_ADMIN: full (all permissions)
// - ORG_ADMIN: org-level powerful (no cross-org destructive like platform-level)
// - PROJECT_MANAGER: projects/tasks/sprints heavy
// - ASSET_MANAGER: assets & allocations heavy
// - MEMBER: read + create/update own tasks, attachments, comments
// - VIEWER: read-only
const DEFAULT_ROLE_PERMISSIONS = (() => {
  const full = new Set(ALL_PERMISSIONS);

  const pmPermissions = new Set([
    // Projects, tasks and sprints
    ...MODULE_PERMISSIONS[MODULES.PROJECTS],
    ...MODULE_PERMISSIONS[MODULES.TASKS],
    ...MODULE_PERMISSIONS[MODULES.SPRINTS],
    // Read reports & attachments
    ...MODULE_PERMISSIONS[MODULES.REPORTS],
    ...MODULE_PERMISSIONS[MODULES.ATTACHMENTS],
  ]);

  const assetManagerPermissions = new Set([
    ...MODULE_PERMISSIONS[MODULES.ASSETS],
    ...MODULE_PERMISSIONS[MODULES.ASSET_ALLOCATIONS],
    ...MODULE_PERMISSIONS[MODULES.ATTACHMENTS],
    buildPermission(MODULES.ASSETS, ACTIONS.EXPORT),
  ]);

  const memberPermissions = new Set([
    buildPermission(MODULES.TASKS, ACTIONS.READ),
    buildPermission(MODULES.TASKS, ACTIONS.CREATE),
    buildPermission(MODULES.TASKS, ACTIONS.UPDATE),
    buildPermission(MODULES.ATTACHMENTS, ACTIONS.CREATE),
    buildPermission(MODULES.ATTACHMENTS, ACTIONS.READ),
    buildPermission(MODULES.NOTIFICATIONS, ACTIONS.READ),
  ]);

  const viewerPermissions = new Set([
    // read-only across key modules
    buildPermission(MODULES.PROJECTS, ACTIONS.READ),
    buildPermission(MODULES.TASKS, ACTIONS.READ),
    buildPermission(MODULES.SPRINTS, ACTIONS.READ),
    buildPermission(MODULES.ASSETS, ACTIONS.READ),
    buildPermission(MODULES.NOTIFICATIONS, ACTIONS.READ),
    buildPermission(MODULES.REPORTS, ACTIONS.READ),
  ]);

  return {
    [ROLES.SUPER_ADMIN]: [...full],
    [ROLES.ORG_ADMIN]: [
      ...MODULE_PERMISSIONS[MODULES.USERS],
      // ...MODULE_PERMISSIONS[MODULES.ORGANIZATIONS],
      ...MODULE_PERMISSIONS[MODULES.PROJECTS],
      ...MODULE_PERMISSIONS[MODULES.REPORTS],
      ...MODULE_PERMISSIONS[MODULES.ASSETS],
      ...MODULE_PERMISSIONS[MODULES.AUDIT_LOGS],
    ],
    [ROLES.PROJECT_MANAGER]: [...pmPermissions],
    [ROLES.ASSET_MANAGER]: [...assetManagerPermissions],
    [ROLES.MEMBER]: [...memberPermissions],
    [ROLES.VIEWER]: [...viewerPermissions],
  };
})();

// Message templates tuned to Insta manage modules and flows
const MESSAGE_TEMPLATES = {
  CREATE_SUCCESS: (module) => `${module} created successfully!`,

  LOGIN_SUCCESS: (module) => `${module} login successfully!`, // this is create for me , ma'am said to delete
  NOT_FOUND: (module) => `${module} not found`,         // this is create for me , ma'am said to delete
  PASSWORD_WRONG: (module) =>`${module} WRONG PASSWORD`,     // this is create for me , ma'am said to delete
  PASSWORD_SAME: `YOUR BOTH PASSWORD IS MATCHING`,     // this is create for me , ma'am said to delete


  UPDATE_SUCCESS: (module) => `${module} updated successfully!`,
  DELETE_SUCCESS: (module) => `${module} deleted successfully!`,
  FETCH_SUCCESS: (module) => `${module} fetched successfully!`,
  NOT_FOUND: (module) => `${module} not found`,
  CREATE_FAILURE: (module) => `Failed to create ${module}`,
  UPDATE_FAILURE: (module) => `Failed to update ${module}`,
  DELETE_FAILURE: (module) => `Failed to delete ${module}`,
  MISSING_FIELDS: (module) =>`Missing required fields for ${module} creation or update`,
  ALREADY_EXISTS: (module) => `${module} already exists`,
  UNAUTHORIZED: () => `Unauthorized`,
  FORBIDDEN: () => `Forbidden: insufficient permissions`,
  INVALID_PAYLOAD: () => `Invalid request payload`,
  EXPORT_READY: (module) => `${module} export ready`,
};

// ApiError, ApiResponse and asyncHandler — unchanged logic but moved here for single import
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // any HTTP status below 400 is considered success
  }
}

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

/**
 * RBAC helper utilities
 *
 * - isValidRole(role): boolean
 * - isValidModule(module): boolean
 * - getPermissionsForRole(role): array of permission strings
 * - roleHasPermission(role, permission): boolean
 *
 * These are small helpers intended to be used by RBAC middleware in your auth layer.
 */

const isValidRole = (role) => ROLE_LIST.includes(role);
const isValidModule = (moduleName) => MODULE_LIST.includes(moduleName);
const getPermissionsForRole = (role) => {
  return DEFAULT_ROLE_PERMISSIONS[role] || [];
};
const roleHasPermission = (role, permission) => {
  const perms = getPermissionsForRole(role);
  return perms.includes(permission);
};

// Middleware factory example used in controllers/routes like:
// router.post('/assets', checkPermission(buildPermission(MODULES.ASSETS, ACTIONS.CREATE)), controller.createAsset)
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Expect req.user to exist and contain role (set by auth middleware after JWT verification)
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: MESSAGE_TEMPLATES.UNAUTHORIZED() });
      }
      const role = user.role;
      if (!isValidRole(role)) {
        return res.status(403).json({ message: MESSAGE_TEMPLATES.FORBIDDEN() });
      }
      if (!roleHasPermission(role, requiredPermission)) {
        return res.status(403).json({ message: MESSAGE_TEMPLATES.FORBIDDEN() });
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = {
  ROLES,
  ROLE_LIST,
  MODULES,
  MODULE_LIST,
  ACTIONS,
  buildPermission,
  MODULE_PERMISSIONS,
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  MESSAGE_TEMPLATES,
  ApiError,
  ApiResponse,
  asyncHandler,
  // RBAC helpers
  isValidRole,
  isValidModule,
  getPermissionsForRole,
  roleHasPermission,
  checkPermission,
};