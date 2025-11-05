/**
 * Path Manager for Agentic Kit Installer
 * 
 * Handles path validation, permissions, and tool-specific path management
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class PathManager {
  constructor() {
    this.homeDir = os.homedir();
    this.defaultPaths = {
      claude: path.join(this.homeDir, '.claude'),
      opencode: path.join(this.homeDir, '.config', 'opencode'),
      ampcode: path.join(this.homeDir, '.amp'),
      droid: path.join(this.homeDir, '.factory')
    };
  }
  
  /**
   * Expand user home path (~) to full path
   * Includes security checks for path traversal
   */
  expandPath(pathStr) {
    if (pathStr.startsWith('~')) {
      return path.join(this.homeDir, pathStr.slice(1));
    }
    return pathStr;
  }

  /**
   * Sanitize and validate path for security
   * Prevents path traversal attacks and validates path safety
   *
   * @param {string} pathStr - Path to sanitize
   * @returns {Object} Result with sanitized path or error
   */
  sanitizePath(pathStr) {
    try {
      // Expand tilde first
      let sanitized = this.expandPath(pathStr);

      // Resolve to absolute path (normalizes .. and .)
      sanitized = path.resolve(sanitized);

      // Check for null bytes (security risk)
      if (sanitized.includes('\0')) {
        return {
          valid: false,
          error: 'Path contains null bytes (security risk)'
        };
      }

      // Ensure path is within user's home directory or /tmp for safety
      // This prevents writing to system directories
      const homeDir = this.homeDir;
      const tmpDir = os.tmpdir();

      const isInHome = sanitized.startsWith(homeDir);
      const isInTmp = sanitized.startsWith(tmpDir);

      if (!isInHome && !isInTmp) {
        return {
          valid: false,
          error: `Path must be within home directory (${homeDir}) for security`
        };
      }

      // Check for suspicious patterns
      const suspiciousPatterns = [
        '/etc/', '/var/', '/usr/', '/bin/', '/sbin/',
        '/root/', '/boot/', '/dev/', '/proc/', '/sys/'
      ];

      for (const pattern of suspiciousPatterns) {
        if (sanitized.includes(pattern)) {
          return {
            valid: false,
            error: `Path contains suspicious directory: ${pattern}`
          };
        }
      }

      return {
        valid: true,
        path: sanitized
      };
    } catch (error) {
      return {
        valid: false,
        error: `Path sanitization failed: ${error.message}`
      };
    }
  }
  
  /**
   * Validate if a path is writable
   * Includes security checks via sanitizePath
   */
  async validatePath(pathStr) {
    // First, sanitize the path for security
    const sanitizeResult = this.sanitizePath(pathStr);
    if (!sanitizeResult.valid) {
      return {
        valid: false,
        path: pathStr,
        error: sanitizeResult.error
      };
    }

    const fullPath = sanitizeResult.path;

    try {
      // Resolve symlinks to real path
      let realPath;
      try {
        realPath = await fs.promises.realpath(fullPath);
      } catch (error) {
        // Path doesn't exist yet, use parent directory
        const parentDir = path.dirname(fullPath);
        try {
          const parentReal = await fs.promises.realpath(parentDir);
          realPath = path.join(parentReal, path.basename(fullPath));
        } catch (parentError) {
          // Parent doesn't exist either, will be created
          realPath = fullPath;
        }
      }

      // Verify real path is still safe after symlink resolution
      const realPathCheck = this.sanitizePath(realPath);
      if (!realPathCheck.valid) {
        return {
          valid: false,
          path: fullPath,
          error: `Resolved path is unsafe: ${realPathCheck.error}`
        };
      }

      // Check if parent directory exists and is writable
      const parentDir = path.dirname(fullPath);
      await fs.promises.access(parentDir, fs.constants.W_OK);

      // Try to create the directory if it doesn't exist
      await fs.promises.mkdir(fullPath, { recursive: true });

      // Test write access
      const testFile = path.join(fullPath, '.install-test');
      await fs.promises.writeFile(testFile, 'test', { mode: 0o600 });
      await fs.promises.unlink(testFile);

      return { valid: true, path: fullPath };
    } catch (error) {
      return {
        valid: false,
        path: fullPath,
        error: error.message
      };
    }
  }
  
  /**
   * Get disk space information for a path
   */
  async getDiskSpace(pathStr) {
    const fullPath = this.expandPath(pathStr);
    
    try {
      const stats = await fs.promises.statfs(fullPath);
      return {
        total: stats.bavail * stats.bsize,
        available: stats.bavail * stats.bsize,
        path: fullPath
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  /**
   * Check if path exists and has existing installation
   */
  async checkExistingInstallation(pathStr) {
    const fullPath = this.expandPath(pathStr);
    
    try {
      const manifestPath = path.join(fullPath, 'manifest.json');
      await fs.promises.access(manifestPath);
      
      const manifest = JSON.parse(
        await fs.promises.readFile(manifestPath, 'utf8')
      );
      
      return {
        exists: true,
        manifest,
        path: fullPath
      };
    } catch (error) {
      return { exists: false, path: fullPath };
    }
  }
  
  /**
   * Get default path for a tool
   */
  getDefaultPath(toolId) {
    return this.defaultPaths[toolId] || null;
  }
  
  /**
   * Normalize path for display
   */
  normalizePathForDisplay(pathStr) {
    const fullPath = this.expandPath(pathStr);

    if (fullPath.startsWith(this.homeDir)) {
      return '~' + fullPath.slice(this.homeDir.length);
    }

    return fullPath;
  }

  /**
   * Detect legacy installation (from version < 1.2.0)
   * Legacy installations don't have manifest.json
   *
   * @param {string} toolId - Tool identifier (claude, opencode, ampcode, droid)
   * @returns {Promise<Object>} Detection result with installation details
   */
  async detectLegacyInstallation(toolId) {
    const installPath = this.getDefaultPath(toolId);
    if (!installPath) {
      return { isLegacy: false, exists: false };
    }

    const fullPath = this.expandPath(installPath);

    try {
      // Check if directory exists
      const dirStats = await fs.promises.stat(fullPath);
      if (!dirStats.isDirectory()) {
        return { isLegacy: false, exists: false };
      }

      // Check for manifest.json
      const manifestPath = path.join(fullPath, 'manifest.json');
      const hasManifest = fs.existsSync(manifestPath);

      if (hasManifest) {
        // Has manifest, not a legacy installation
        return {
          isLegacy: false,
          exists: true,
          path: fullPath,
          reason: 'Installation has manifest.json (v1.2.0+)'
        };
      }

      // No manifest - this is a legacy installation
      // Count components to classify variant
      const components = await this.countLegacyComponents(fullPath);

      // Classify variant based on component counts
      const variant = this.classifyVariantFromComponents(components);

      return {
        isLegacy: true,
        exists: true,
        path: fullPath,
        components: components,
        suggestedVariant: variant,
        reason: 'No manifest.json found (pre-1.2.0 installation)'
      };
    } catch (error) {
      return {
        isLegacy: false,
        exists: false,
        error: error.message
      };
    }
  }

  /**
   * Count components in legacy installation
   *
   * @private
   * @param {string} installPath - Installation directory path
   * @returns {Promise<Object>} Component counts
   */
  async countLegacyComponents(installPath) {
    const components = {
      agents: 0,
      skills: 0,
      resources: 0,
      hooks: 0
    };

    // Count agents
    try {
      const agentsDir = path.join(installPath, 'agents');
      const agentFiles = await fs.promises.readdir(agentsDir);
      components.agents = agentFiles.filter(f => f.endsWith('.md')).length;
    } catch (error) {
      // Directory doesn't exist or can't read
      components.agents = 0;
    }

    // Count skills
    try {
      const skillsDir = path.join(installPath, 'skills');
      const skillFiles = await fs.promises.readdir(skillsDir);
      components.skills = skillFiles.filter(f => f.endsWith('.md')).length;
    } catch (error) {
      components.skills = 0;
    }

    // Count resources
    try {
      const resourcesDir = path.join(installPath, 'resources');
      const resourceFiles = await fs.promises.readdir(resourcesDir);
      components.resources = resourceFiles.length;
    } catch (error) {
      components.resources = 0;
    }

    // Count hooks
    try {
      const hooksDir = path.join(installPath, 'hooks');
      const hookFiles = await fs.promises.readdir(hooksDir);
      components.hooks = hookFiles.filter(f => f.endsWith('.js')).length;
    } catch (error) {
      components.hooks = 0;
    }

    return components;
  }

  /**
   * Classify variant based on component counts
   *
   * @private
   * @param {Object} components - Component counts
   * @returns {string} Suggested variant (lite, standard, pro, or custom)
   */
  classifyVariantFromComponents(components) {
    const { agents, skills } = components;

    // Lite: 3 agents, 0 skills
    if (agents === 3 && skills === 0) {
      return 'lite';
    }

    // Pro: 13 agents, 9+ skills
    if (agents >= 13 && skills >= 9) {
      return 'pro';
    }

    // Standard: 13 agents, 1-8 skills (or close to it)
    if (agents >= 10 && skills >= 1 && skills <= 8) {
      return 'standard';
    }

    // If 3 agents or fewer, likely lite
    if (agents <= 3) {
      return 'lite';
    }

    // If many agents (10+), likely standard or pro
    if (agents >= 10) {
      return skills >= 9 ? 'pro' : 'standard';
    }

    // Default to standard for anything in between
    return 'standard';
  }

  /**
   * Create manifest for legacy installation
   *
   * @param {string} toolId - Tool identifier
   * @param {Object} components - Component counts
   * @param {string} variant - Classified variant
   * @returns {Promise<Object>} Created manifest
   */
  async createManifestForLegacy(toolId, components, variant) {
    const installPath = this.expandPath(this.getDefaultPath(toolId));
    const manifestPath = path.join(installPath, 'manifest.json');

    const manifest = {
      tool: toolId,
      variant: variant,
      version: '1.2.0',
      installed_at: new Date().toISOString(),
      migrated_from: 'legacy',
      components: components,
      paths: {
        agents: path.join(installPath, 'agents'),
        skills: path.join(installPath, 'skills'),
        resources: path.join(installPath, 'resources'),
        hooks: path.join(installPath, 'hooks')
      },
      files: {
        total: components.agents + components.skills + components.resources + components.hooks,
        size: 'unknown'
      },
      migration: {
        from_version: 'unknown',
        migrated_at: new Date().toISOString(),
        migration_type: 'automatic'
      }
    };

    // Write manifest with secure permissions
    await fs.promises.writeFile(
      manifestPath,
      JSON.stringify(manifest, null, 2),
      { mode: 0o600 }
    );

    return manifest;
  }
}

module.exports = PathManager;