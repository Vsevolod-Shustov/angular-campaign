module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    clean: ["dist", '.tmp'],
    
    copy: {
      main:{
        expand: true,
        cwd: 'app/',
        src: ['**'],
        dest: 'dist/'
      }
    },
    
    'gh-pages': {
      options: {
        base: 'dist',
        branch: 'gh-pages',
        repo: 'https://github.com/Vsevolod-Shustov/angular-campaign.git'
      },
      src: '**/*'
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gh-pages');
  
  grunt.registerTask('default', [
    'clean',
    'copy'
  ]);
  
  grunt.registerTask('deploy', [
    'gh-pages'
  ]);
};