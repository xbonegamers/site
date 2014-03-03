module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-modal/modal.js',
          'bower_components/he/he.js',
          'bower_components/momentjs/moment.js',
          'src/app.js'
        ],
        dest: 'public/js/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'public/js/app.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
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
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'concat']
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
    rev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 8
      },
      assets: {
        files: [{
          src: ['public/css/app.css', 'public/js/app.min.js']
        }]
      }
    },
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist/'
      }
    },
    usemin: {
      html: 'dist/ndex.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('build', ['jshint', 'useminPrepare', 'concat', 'uglify', 'rev', 'usemin']);


};