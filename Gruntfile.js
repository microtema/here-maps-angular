module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },
        express: {
            options: {
                background: true,
                port: 8000
            },
            test: {
                options: {
                    script: 'scripts/server.js'
                }
            }
        },
        execute: {
            target: {
                src: ['scripts/server.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-execute');


    grunt.registerTask('test', ["express:test", "karma", "express:test:stop"]);
    grunt.registerTask('server', ["execute"]);

};
