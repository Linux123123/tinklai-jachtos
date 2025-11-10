<?php

namespace Deployer;

require 'recipe/laravel.php';

// General settings
set('application', 'yachts');
set('repository', 'git@github.com:Linux123123/tinklai-jachtos.git');
set('default_timeout', 480); // 8 minutes
set('update_code_strategy', 'clone'); // No git bare, as we want .git to be available in the release directory

// Future use?
add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts
host('yacht.linux123123.com')
    ->set('hostname', '45.43.163.102')
    ->set('remote_user', 'yacht')
    ->set('deploy_path', '/home/yacht/yacht')
    ->set('forward_agent', true)
    ->setLabels([
        'type' => 'production',
    ]);

// Check Node.js >= 18
desc('Check if Node.js >= 18 is installed');
task('deploy:ensure_node', function () {
    $output = run('if command -v node >/dev/null 2>&1; then node -v; else echo "not found"; fi');
    if ($output === 'not found') {
        writeln('<error>Node.js is not installed! Please install Node.js version 18 or higher.</error>');
        exit(1);
    }
    $ver = preg_replace('/^v/', '', trim($output));
    $parts = explode('.', $ver);
    if ((int) $parts[0] < 18) {
        writeln('<error>Node.js version 18 or higher is required. Detected: ' . $output . '</error>');
        exit(1);
    }
});

// Check pnpm
desc('Check if pnpm is installed');
task('deploy:ensure_pnpm', function () {
    $output = run('if command -v pnpm >/dev/null 2>&1; then echo "found"; else echo "not found"; fi');
    if ($output !== 'found') {
        writeln('<error>pnpm is not installed! Please install pnpm globally.</error>');
        exit(1);
    }
});

// Install Node.js dependencies using pnpm
desc('Install frontend dependencies with pnpm');
task('deploy:pnpm_install', function () {
    run('cd {{release_path}} && pnpm install --frozen-lockfile');
});

// Build frontend assets
desc('Build frontend assets');
task('deploy:pnpm_build', function () {
    run('cd {{release_path}} && pnpm run build');
});

// Deployment task
desc('Deploys your project');
task('deploy', [
    // Prepare deployment
    'deploy:prepare',

    // Deps
    'deploy:ensure_node',
    'deploy:ensure_pnpm',
    'deploy:vendors',
    'deploy:pnpm_install',
    'deploy:pnpm_build',

    // Public folder symlink
    'artisan:storage:link',

    // Optimizations
    'artisan:cache:clear',
    'artisan:config:cache',
    'artisan:route:cache',
    'artisan:view:cache',
    'artisan:event:cache',
    'artisan:optimize',

    // Migration
    'artisan:migrate',

    // Restart queue and reverb
    'artisan:queue:restart',
    'artisan:reverb:restart',

    // Finalize deployment
    'deploy:publish',
]);

after('deploy:failed', 'deploy:unlock');
