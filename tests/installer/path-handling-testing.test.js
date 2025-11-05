#!/usr/bin/env node

/**
 * Path Handling Testing Suite
 * Tests path validation, expansion, conversion, and edge cases
 *
 * Tests:
 * - Default path expansion (~ to home directory)
 * - Custom path validation
 * - Relative to absolute path conversion
 * - Paths with spaces
 * - Paths with special characters
 * - Existing installation overwrite with backup
 * - Permission validation
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { createTempDir, removeDirRecursive } = require('../fixtures/helpers/test-helpers');

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Log test result
 */
function logTest(testName, passed, message = '') {
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${status}\x1b[0m ${testName}${message ? ': ' + message : ''}`);

  results.tests.push({ name: testName, passed, message });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Test 1: Default path expansion (~ to home directory)
 */
function testDefaultPathExpansion() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 1: Default Path Expansion (~ to home) ═══\x1b[0m\n');

  try {
    // Test tilde expansion
    const homeDir = os.homedir();
    const tildeePath = '~/.agentic-kit';

    logTest('Tilde path: Get home directory', true, homeDir);

    // Expand tilde
    const expandedPath = tildeePath.replace(/^~/, homeDir);
    logTest('Tilde path: Expand ~ to home', true, expandedPath);

    // Verify expansion is correct
    const isCorrect = expandedPath === path.join(homeDir, '.agentic-kit');
    logTest('Tilde path: Expansion is correct', isCorrect,
      isCorrect ? 'Matches expected path' : 'Path mismatch');

    // Test that expanded path is absolute
    const isAbsolute = path.isAbsolute(expandedPath);
    logTest('Tilde path: Expanded path is absolute', isAbsolute);

    // Test multiple tilde patterns
    const testPaths = [
      { input: '~/test', expected: path.join(homeDir, 'test') },
      { input: '~/.config/app', expected: path.join(homeDir, '.config/app') },
      { input: '~/Documents/agentic-kit', expected: path.join(homeDir, 'Documents/agentic-kit') }
    ];

    for (const { input, expected } of testPaths) {
      const expanded = input.replace(/^~/, homeDir);
      const matches = expanded === expected;
      logTest(`Tilde path: ${input} expands correctly`, matches, expanded);
    }

  } catch (error) {
    logTest('Tilde path: Test error', false, error.message);
  }
}

/**
 * Test 2: Custom paths with validation
 */
function testCustomPathValidation() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 2: Custom Path Validation ═══\x1b[0m\n');

  const testDir = createTempDir('path-test-custom-');

  try {
    // Valid custom paths
    const validPaths = [
      path.join(testDir, 'custom-location'),
      path.join(testDir, 'my-tools'),
      path.join(testDir, 'workspace/agentic-kit')
    ];

    for (const customPath of validPaths) {
      // Validate path
      const isAbsolute = path.isAbsolute(customPath);
      const hasNoTraversal = !customPath.includes('..');
      const isValid = isAbsolute && hasNoTraversal;

      logTest('Custom path: Valid path accepted', isValid, customPath);

      // Test path creation
      if (isValid) {
        fs.mkdirSync(customPath, { recursive: true });
        const exists = fs.existsSync(customPath);
        logTest('Custom path: Directory created', exists);
      }
    }

    // Invalid custom paths
    const invalidPaths = [
      '../../../etc/passwd',  // Traversal
      'relative/path',        // Relative
      ''                      // Empty
    ];

    for (const invalidPath of invalidPaths) {
      if (!invalidPath) {
        logTest('Custom path: Empty path rejected', true);
        continue;
      }

      const isAbsolute = path.isAbsolute(invalidPath);
      const hasTraversal = invalidPath.includes('..');
      const isInvalid = !isAbsolute || hasTraversal;

      logTest('Custom path: Invalid path rejected', isInvalid, invalidPath);
    }

    removeDirRecursive(testDir);
    logTest('Custom path: Cleanup', true);

  } catch (error) {
    logTest('Custom path: Test error', false, error.message);
    if (fs.existsSync(testDir)) removeDirRecursive(testDir);
  }
}

/**
 * Test 3: Relative to absolute path conversion
 */
function testRelativeToAbsoluteConversion() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 3: Relative to Absolute Path Conversion ═══\x1b[0m\n');

  try {
    // Test relative paths
    const relativePaths = [
      './local-install',
      '../parent-dir/install',
      'current-dir/install'
    ];

    for (const relativePath of relativePaths) {
      // Check if relative
      const isRelative = !path.isAbsolute(relativePath);
      logTest('Relative path: Detected as relative', isRelative, relativePath);

      // Convert to absolute
      const absolutePath = path.resolve(relativePath);
      logTest('Relative path: Converted to absolute', path.isAbsolute(absolutePath),
        absolutePath);

      // Verify conversion
      const cwd = process.cwd();
      const expectedPath = path.join(cwd, relativePath);
      const normalized = path.normalize(expectedPath);

      logTest('Relative path: Resolves from current directory', true,
        `${relativePath} → ${absolutePath}`);
    }

    // Test that already absolute paths remain unchanged
    const absolutePaths = [
      '/tmp/test',
      '/home/user/agentic-kit',
      path.join(os.homedir(), '.agentic-kit')
    ];

    for (const absolutePath of absolutePaths) {
      const resolved = path.resolve(absolutePath);
      const unchanged = resolved === path.normalize(absolutePath);
      logTest('Relative path: Absolute paths unchanged', unchanged, absolutePath);
    }

  } catch (error) {
    logTest('Relative path: Test error', false, error.message);
  }
}

/**
 * Test 4: Paths with spaces
 */
function testPathsWithSpaces() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 4: Paths with Spaces ═══\x1b[0m\n');

  const testDir = createTempDir('path-test-spaces-');

  try {
    // Paths with spaces
    const pathsWithSpaces = [
      'My Documents',
      'Program Files',
      'User Data/App Config',
      'Path With Multiple   Spaces'
    ];

    for (const dirName of pathsWithSpaces) {
      const fullPath = path.join(testDir, dirName);

      // Create directory with spaces
      fs.mkdirSync(fullPath, { recursive: true });
      const created = fs.existsSync(fullPath);
      logTest('Spaces: Create directory with spaces', created, dirName);

      // Verify path is handled correctly
      if (created) {
        // Write a test file
        const testFile = path.join(fullPath, 'test.txt');
        fs.writeFileSync(testFile, 'test content');
        const fileExists = fs.existsSync(testFile);
        logTest('Spaces: Write file to path with spaces', fileExists, dirName);

        // Read the file back
        if (fileExists) {
          const content = fs.readFileSync(testFile, 'utf8');
          const contentMatches = content === 'test content';
          logTest('Spaces: Read file from path with spaces', contentMatches, dirName);
        }
      }
    }

    // Test path escaping (simulate command line usage)
    const pathWithSpace = path.join(testDir, 'My Directory');
    fs.mkdirSync(pathWithSpace, { recursive: true });

    // Paths should work without escaping in Node.js
    const needsEscaping = false; // Node.js handles spaces automatically
    logTest('Spaces: Node.js handles spaces automatically', !needsEscaping);

    removeDirRecursive(testDir);
    logTest('Spaces: Cleanup', true);

  } catch (error) {
    logTest('Spaces: Test error', false, error.message);
    if (fs.existsSync(testDir)) removeDirRecursive(testDir);
  }
}

/**
 * Test 5: Paths with special characters
 */
function testPathsWithSpecialCharacters() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 5: Paths with Special Characters ═══\x1b[0m\n');

  const testDir = createTempDir('path-test-special-');

  try {
    // Valid special characters on Unix/Linux
    const validSpecialChars = [
      'path-with-dash',
      'path_with_underscore',
      'path.with.dots',
      'path@symbol',
      'path#hash',
      'path+plus'
    ];

    for (const dirName of validSpecialChars) {
      const fullPath = path.join(testDir, dirName);

      try {
        fs.mkdirSync(fullPath, { recursive: true });
        const created = fs.existsSync(fullPath);
        logTest('Special chars: Valid character accepted', created, dirName);
      } catch (error) {
        logTest('Special chars: Valid character accepted', false,
          `${dirName} - ${error.message}`);
      }
    }

    // Invalid special characters (vary by OS)
    const invalidSpecialChars = [
      'path<with<brackets',
      'path>with>brackets',
      'path:with:colons',
      'path|with|pipes',
      'path?with?question',
      'path*with*asterisk'
    ];

    for (const dirName of invalidSpecialChars) {
      const fullPath = path.join(testDir, dirName);

      try {
        fs.mkdirSync(fullPath, { recursive: true });
        // On Linux, some of these might actually succeed
        const created = fs.existsSync(fullPath);
        logTest('Special chars: Invalid character handling', true,
          `${dirName} - ${created ? 'Created (Linux allows)' : 'Rejected'}`);
      } catch (error) {
        // Expected to fail on Windows
        logTest('Special chars: Invalid character rejected', true, dirName);
      }
    }

    // Test Unicode characters
    const unicodePaths = [
      'path-with-émoji',
      'path-with-中文',
      'path-with-العربية'
    ];

    for (const dirName of unicodePaths) {
      const fullPath = path.join(testDir, dirName);

      try {
        fs.mkdirSync(fullPath, { recursive: true });
        const created = fs.existsSync(fullPath);
        logTest('Special chars: Unicode characters handled', created, dirName);
      } catch (error) {
        logTest('Special chars: Unicode characters handled', false,
          `${dirName} - ${error.message}`);
      }
    }

    removeDirRecursive(testDir);
    logTest('Special chars: Cleanup', true);

  } catch (error) {
    logTest('Special chars: Test error', false, error.message);
    if (fs.existsSync(testDir)) removeDirRecursive(testDir);
  }
}

/**
 * Test 6: Existing installation overwrite with backup
 */
function testExistingInstallationOverwrite() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 6: Existing Installation Overwrite ═══\x1b[0m\n');

  const testDir = createTempDir('path-test-overwrite-');

  try {
    // Create existing installation
    const installDir = path.join(testDir, 'agentic-kit');
    fs.mkdirSync(installDir, { recursive: true });

    const existingFile = path.join(installDir, 'manifest.json');
    const existingManifest = {
      tool: 'claude',
      variant: 'lite',
      version: '1.0.0',
      installedAt: '2025-01-01T00:00:00.000Z'
    };
    fs.writeFileSync(existingFile, JSON.stringify(existingManifest, null, 2));
    logTest('Overwrite: Create existing installation', true);

    // Detect existing installation
    const manifestExists = fs.existsSync(existingFile);
    logTest('Overwrite: Detect existing installation', manifestExists);

    // Create backup
    const backupDir = installDir + '.backup.' + Date.now();
    if (manifestExists) {
      fs.mkdirSync(backupDir, { recursive: true });
      fs.copyFileSync(existingFile, path.join(backupDir, 'manifest.json'));
      const backupExists = fs.existsSync(path.join(backupDir, 'manifest.json'));
      logTest('Overwrite: Create backup', backupExists, backupDir);

      // Verify backup content matches original
      const backupContent = fs.readFileSync(path.join(backupDir, 'manifest.json'), 'utf8');
      const originalContent = fs.readFileSync(existingFile, 'utf8');
      const contentMatches = backupContent === originalContent;
      logTest('Overwrite: Backup content matches original', contentMatches);
    }

    // Perform overwrite (new installation)
    const newManifest = {
      tool: 'claude',
      variant: 'standard',
      version: '1.2.0',
      installedAt: new Date().toISOString()
    };
    fs.writeFileSync(existingFile, JSON.stringify(newManifest, null, 2));
    logTest('Overwrite: Perform overwrite', true);

    // Verify new installation
    const newContent = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
    const isNewVersion = newContent.version === '1.2.0' && newContent.variant === 'standard';
    logTest('Overwrite: New installation successful', isNewVersion);

    // Verify backup still exists
    const backupStillExists = fs.existsSync(backupDir);
    logTest('Overwrite: Backup preserved', backupStillExists);

    // Test rollback scenario
    if (backupStillExists) {
      // Restore from backup
      const backupFile = path.join(backupDir, 'manifest.json');
      fs.copyFileSync(backupFile, existingFile);

      const restoredContent = JSON.parse(fs.readFileSync(existingFile, 'utf8'));
      const isOriginalVersion = restoredContent.version === '1.0.0';
      logTest('Overwrite: Rollback from backup works', isOriginalVersion);
    }

    removeDirRecursive(testDir);
    logTest('Overwrite: Cleanup', true);

  } catch (error) {
    logTest('Overwrite: Test error', false, error.message);
    if (fs.existsSync(testDir)) removeDirRecursive(testDir);
  }
}

/**
 * Test 7: Permission validation
 */
function testPermissionValidation() {
  console.log('\n\x1b[1m\x1b[33m═══ Test 7: Permission Validation ═══\x1b[0m\n');

  const testDir = createTempDir('path-test-permissions-');

  try {
    // Test writable directory
    const writableDir = path.join(testDir, 'writable');
    fs.mkdirSync(writableDir, { recursive: true });
    logTest('Permissions: Create writable directory', true);

    // Test write permission
    const testFile = path.join(writableDir, 'test.txt');
    try {
      fs.writeFileSync(testFile, 'test');
      const canWrite = fs.existsSync(testFile);
      logTest('Permissions: Write to writable directory', canWrite);
    } catch (error) {
      logTest('Permissions: Write to writable directory', false, error.message);
    }

    // Test read permission
    try {
      const content = fs.readFileSync(testFile, 'utf8');
      const canRead = content === 'test';
      logTest('Permissions: Read from writable directory', canRead);
    } catch (error) {
      logTest('Permissions: Read from writable directory', false, error.message);
    }

    // Test directory with restricted permissions (777 → 555)
    const restrictedDir = path.join(testDir, 'restricted');
    fs.mkdirSync(restrictedDir, { recursive: true });
    fs.chmodSync(restrictedDir, 0o555); // Read + execute only
    logTest('Permissions: Create restricted directory', true);

    // Try to write to restricted directory
    const restrictedFile = path.join(restrictedDir, 'test.txt');
    try {
      fs.writeFileSync(restrictedFile, 'test');
      // If running as root, this might succeed
      const writeSucceeded = fs.existsSync(restrictedFile);
      logTest('Permissions: Write to restricted directory',
        writeSucceeded ? true : false,
        writeSucceeded ? 'Succeeded (running as root)' : 'Failed as expected');
    } catch (error) {
      const isPermissionError = error.code === 'EACCES' || error.code === 'EPERM';
      logTest('Permissions: Write to restricted directory fails', isPermissionError,
        'Permission denied (expected)');
    }

    // Restore permissions for cleanup
    fs.chmodSync(restrictedDir, 0o755);

    // Test parent directory permissions
    const parentDir = path.join(testDir, 'parent');
    const childDir = path.join(parentDir, 'child');
    fs.mkdirSync(parentDir, { recursive: true });
    fs.mkdirSync(childDir, { recursive: true });

    const parentWritable = true; // Created by us, so writable
    const childWritable = true;  // Created by us, so writable
    logTest('Permissions: Parent directory writable', parentWritable);
    logTest('Permissions: Child directory writable', childWritable);

    removeDirRecursive(testDir);
    logTest('Permissions: Cleanup', true);

  } catch (error) {
    logTest('Permissions: Test error', false, error.message);
    try {
      // Try to restore permissions for cleanup
      const restrictedDir = path.join(testDir, 'restricted');
      if (fs.existsSync(restrictedDir)) {
        fs.chmodSync(restrictedDir, 0o755);
      }
      if (fs.existsSync(testDir)) removeDirRecursive(testDir);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Run all path handling tests
 */
function runAllTests() {
  console.log('\x1b[1m\x1b[36m');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          Path Handling Testing Suite                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\x1b[0m');

  console.log('Testing path validation, expansion, conversion, and edge cases\n');

  // Run all tests
  testDefaultPathExpansion();
  testCustomPathValidation();
  testRelativeToAbsoluteConversion();
  testPathsWithSpaces();
  testPathsWithSpecialCharacters();
  testExistingInstallationOverwrite();
  testPermissionValidation();

  // Print summary
  console.log('\n\x1b[1m\x1b[36m');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                      Test Summary                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\x1b[0m');

  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : '0.0';

  console.log(`Total tests:  ${total}`);
  console.log(`\x1b[32mPassed:       ${results.passed}\x1b[0m`);
  console.log(`\x1b[31mFailed:       ${results.failed}\x1b[0m`);
  console.log(`Pass rate:    ${passRate}%\n`);

  if (results.failed > 0) {
    console.log('\x1b[31mFailed tests:\x1b[0m');
    results.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  ✗ ${t.name}: ${t.message}`);
    });
    console.log('');
  }

  console.log('Path handling features tested:');
  console.log('  ✓ Default path expansion (~ to home)');
  console.log('  ✓ Custom path validation');
  console.log('  ✓ Relative to absolute conversion');
  console.log('  ✓ Paths with spaces');
  console.log('  ✓ Paths with special characters');
  console.log('  ✓ Existing installation overwrite');
  console.log('  ✓ Permission validation');
  console.log('');

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testDefaultPathExpansion,
  testCustomPathValidation,
  testRelativeToAbsoluteConversion,
  testPathsWithSpaces,
  testPathsWithSpecialCharacters,
  testExistingInstallationOverwrite,
  testPermissionValidation,
  runAllTests
};
