module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    protractor: {
      options: {
        keepAlive: false
      },
      basic: {
        options: {
          configFile: "test/client/conf.js",
          args: {} // Target-specific arguments
        }
      }
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 10
      },
      js: {
        src: ['dist/js/app.js'],
        dest: '.tmp/'
      }
    },
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('watch', ['useminPrepare', 'concat']);
  grunt.registerTask('build', ['jshint', 'useminPrepare', 'concat', 'uglify', 'filerev']);


};