module.exports = {
  apps : [{
    name: 'ddaeng',
    script: 'index.js',
    watch: '.',
    instances: 'max',
    exec_mode: 'cluster',
    ignore_watch:["log/*", "node_modules", ".env"],
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
