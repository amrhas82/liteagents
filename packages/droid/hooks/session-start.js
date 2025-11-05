/**
 * session-start.js
 *
 * This hook runs at the start of every Droid session.
 * It ensures all skills defined in the active variant are loaded and available.
 *
 * Purpose:
 * - Load variant-specific skills automatically
 * - Register agents for auto-invocation
 * - Initialize any session-specific resources
 * - Provide mobile/Android development session startup feedback
 * - Optimize for mobile-first workflows and Android patterns
 */

const fs = require('fs');
const path = require('path');

/**
 * Load and activate skills for the current variant
 * Droid uses same structure as Claude for installer compatibility
 */
function loadSkills(skillsDir, skillsList) {
  const loadedSkills = [];

  if (!skillsList || skillsList.length === 0) {
    console.log('ℹ️  No skills to load for this variant');
    return loadedSkills;
  }

  skillsList.forEach(skill => {
    try {
      const skillPath = path.join(skillsDir, skill.path);

      if (fs.existsSync(skillPath)) {
        loadedSkills.push({
          id: skill.id,
          name: skill.name,
          path: skill.path,
          status: 'loaded'
        });
        console.log(`✅ Loaded skill: ${skill.name}`);
      } else {
        console.warn(`⚠️  Skill not found: ${skill.name} at ${skillPath}`);
      }
    } catch (error) {
      console.error(`❌ Failed to load skill ${skill.name}:`, error.message);
    }
  });

  return loadedSkills;
}

/**
 * Initialize agents for the session
 * Droid uses same structure as Claude for installer compatibility
 */
function initializeAgents(agentsDir, agentsList) {
  const activeAgents = [];

  agentsList.forEach(agent => {
    try {
      const agentPath = path.join(agentsDir, agent.path);

      if (fs.existsSync(agentPath)) {
        activeAgents.push({
          id: agent.id,
          name: agent.name,
          status: 'ready'
        });
      }
    } catch (error) {
      console.error(`❌ Failed to initialize agent ${agent.name}:`, error.message);
    }
  });

  return activeAgents;
}

/**
 * Display mobile/Android development session start banner
 */
function displayBanner(variant, agentCount, skillCount) {
  const variantColors = {
    lite: '\x1b[32m',      // Green
    standard: '\x1b[34m',   // Blue
    pro: '\x1b[35m'        // Magenta
  };

  const color = variantColors[variant] || '\x1b[36m'; // Default cyan
  const reset = '\x1b[0m';
  const bold = '\x1b[1m';

  console.log(`
${bold}${color}╔═══════════════════════════════════════════════╗${reset}
${bold}${color}║       Droid - ${variant.charAt(0).toUpperCase() + variant.slice(1)} Variant${' '.repeat(Math.max(0, 21 - variant.length))}║${reset}
${bold}${color}║       Mobile AI Code Generation              ║${reset}
${bold}${color}╚═══════════════════════════════════════════════╝${reset}

✨ Session started successfully!

📊 Active Components:
   • Agents: ${agentCount}
   • Skills: ${skillCount}

💡 Quick Start (Mobile Mode):
   • Invoke agents: ${color}@Master:${reset} help
   • Execute skills: ${color}droid <skill> <args>${reset}
   • Android Studio integration ready

🚀 Optimization: ${bold}${color}mobile-codegen${reset}
   Android-first workflows, mobile patterns

📱 ${bold}Mobile development mode active!${reset}
`);
}

/**
 * Main session start handler
 */
function onSessionStart(context) {
  try {
    // Get variant from context or default to standard
    const variant = context.variant || 'standard';
    const manifest = context.manifest || {};

    const agentsList = manifest.agents || [];
    const skillsList = manifest.skills || [];

    // Load skills (same structure as Claude for installer compatibility)
    const loadedSkills = loadSkills(context.skillsPath || './skills', skillsList);

    // Initialize agents (same structure as Claude for installer compatibility)
    const activeAgents = initializeAgents(context.agentsPath || './agents', agentsList);

    // Display mobile/Android development banner
    displayBanner(variant, activeAgents.length, loadedSkills.length);

    // Return session context with mobile optimization metadata
    return {
      variant,
      agents: activeAgents,
      skills: loadedSkills,
      timestamp: new Date().toISOString(),
      status: 'ready',
      optimization: 'mobile-codegen',
      tool: 'droid'
    };

  } catch (error) {
    console.error('❌ Session start failed:', error.message);
    console.log('⚠️  Plugin may not function correctly. Please restart or reinstall.');

    return {
      status: 'error',
      error: error.message
    };
  }
}

/**
 * Module exports
 */
module.exports = {
  onSessionStart,
  loadSkills,
  initializeAgents,
  displayBanner
};
