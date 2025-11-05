const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Telemetry Module
 *
 * Collects anonymous usage statistics to help improve agentic-kit.
 * All data collection is OPT-IN and respects user privacy.
 *
 * Collected data:
 * - Variant selected (lite/standard/pro)
 * - Tools selected (count only, not specific tools)
 * - Installation time
 * - Success/failure status
 * - OS type (e.g., linux, darwin, win32)
 * - Node.js version
 *
 * NOT collected:
 * - File paths
 * - User information
 * - System details beyond OS type
 * - Specific tool names
 */
class Telemetry {
  constructor() {
    this.configPath = path.join(os.homedir(), '.agentic-kit-config.json');
    this.telemetryLogPath = path.join(os.homedir(), '.agentic-kit-telemetry.log');
  }

  /**
   * Check if user has consented to telemetry
   *
   * @returns {Promise<boolean>} True if user has consented
   */
  async hasConsent() {
    try {
      const configData = await fs.promises.readFile(this.configPath, 'utf8');
      const config = JSON.parse(configData);
      return config.telemetry === true;
    } catch (error) {
      // Config file doesn't exist or is invalid, user hasn't consented
      return false;
    }
  }

  /**
   * Set user's telemetry consent
   *
   * @param {boolean} consent - True to enable telemetry, false to disable
   * @returns {Promise<void>}
   */
  async setConsent(consent) {
    let config = {};

    // Try to read existing config
    try {
      const configData = await fs.promises.readFile(this.configPath, 'utf8');
      config = JSON.parse(configData);
    } catch (error) {
      // Config doesn't exist, will create new one
    }

    // Update telemetry setting
    config.telemetry = consent;
    config.telemetryConsentDate = new Date().toISOString();

    // Write config file
    await fs.promises.writeFile(
      this.configPath,
      JSON.stringify(config, null, 2),
      'utf8'
    );
  }

  /**
   * Collect installation statistics
   *
   * @param {Object} data - Installation data
   * @param {string} data.variant - Selected variant (lite/standard/pro)
   * @param {number} data.toolCount - Number of tools installed
   * @param {number} data.installationTime - Installation time in milliseconds
   * @param {boolean} data.success - Installation success status
   * @param {number} data.errorCount - Number of errors encountered
   * @param {number} data.warningCount - Number of warnings encountered
   * @returns {Promise<void>}
   */
  async collectInstallationStats(data) {
    // Check if user has consented
    const hasConsent = await this.hasConsent();
    if (!hasConsent) {
      return; // Don't collect if user hasn't consented
    }

    // Build anonymous statistics object
    const stats = {
      timestamp: new Date().toISOString(),
      event: 'installation',
      variant: data.variant,
      toolCount: data.toolCount,
      installationTimeMs: data.installationTime,
      success: data.success,
      errorCount: data.errorCount || 0,
      warningCount: data.warningCount || 0,
      osType: process.platform,
      nodeVersion: process.version,
      agenticKitVersion: this._getPackageVersion()
    };

    // Log locally (in production, this would send to analytics endpoint)
    await this._logTelemetry(stats);
  }

  /**
   * Collect uninstallation statistics
   *
   * @param {Object} data - Uninstallation data
   * @param {string} data.toolId - Tool being uninstalled
   * @param {boolean} data.success - Uninstallation success status
   * @returns {Promise<void>}
   */
  async collectUninstallStats(data) {
    const hasConsent = await this.hasConsent();
    if (!hasConsent) {
      return;
    }

    const stats = {
      timestamp: new Date().toISOString(),
      event: 'uninstallation',
      success: data.success,
      osType: process.platform,
      nodeVersion: process.version,
      agenticKitVersion: this._getPackageVersion()
    };

    await this._logTelemetry(stats);
  }

  /**
   * Collect upgrade statistics
   *
   * @param {Object} data - Upgrade data
   * @param {string} data.fromVariant - Original variant
   * @param {string} data.toVariant - Target variant
   * @param {boolean} data.success - Upgrade success status
   * @returns {Promise<void>}
   */
  async collectUpgradeStats(data) {
    const hasConsent = await this.hasConsent();
    if (!hasConsent) {
      return;
    }

    const stats = {
      timestamp: new Date().toISOString(),
      event: 'upgrade',
      fromVariant: data.fromVariant,
      toVariant: data.toVariant,
      success: data.success,
      osType: process.platform,
      nodeVersion: process.version,
      agenticKitVersion: this._getPackageVersion()
    };

    await this._logTelemetry(stats);
  }

  /**
   * Get opt-out status (check for explicit no-telemetry setting)
   *
   * @returns {Promise<boolean>} True if user has opted out
   */
  async hasOptedOut() {
    try {
      const configData = await fs.promises.readFile(this.configPath, 'utf8');
      const config = JSON.parse(configData);
      return config.telemetry === false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove all telemetry data
   *
   * @returns {Promise<void>}
   */
  async clearTelemetryData() {
    try {
      // Remove telemetry log
      if (fs.existsSync(this.telemetryLogPath)) {
        await fs.promises.unlink(this.telemetryLogPath);
      }

      // Update config to disable telemetry
      await this.setConsent(false);
    } catch (error) {
      throw new Error(`Failed to clear telemetry data: ${error.message}`);
    }
  }

  // Private helper methods

  /**
   * Log telemetry data locally
   * In production, this would send data to an analytics endpoint
   *
   * @private
   * @param {Object} stats - Statistics object
   * @returns {Promise<void>}
   */
  async _logTelemetry(stats) {
    try {
      const logEntry = JSON.stringify(stats) + '\n';
      await fs.promises.appendFile(this.telemetryLogPath, logEntry, 'utf8');
    } catch (error) {
      // Silently fail if we can't log telemetry
      // Don't interrupt user experience for telemetry issues
    }
  }

  /**
   * Get agentic-kit package version
   *
   * @private
   * @returns {string} Package version or 'unknown'
   */
  _getPackageVersion() {
    try {
      const packageJsonPath = path.join(__dirname, '..', 'package.json');
      const packageData = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageData);
      return packageJson.version || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}

module.exports = Telemetry;
