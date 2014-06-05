/*
 * slush-starttter
 * https://github.com/taktran/slush-starttter
 *
 * Copyright (c) 2014, Tak Tran
 * Licensed under the MIT license.
 */

'use strict';

var gulp = require('gulp');
var install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var rename = require('gulp-rename');
var _str = require('underscore.string');
var inquirer = require('inquirer');

gulp.task('default', function (done) {
  var prompts = [
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of your generator?',
      default: gulp.args.join(' ')
    },
    {
      type: 'input',
      name: 'appDescription',
      message: 'What is the description for your generator?'
    },
    {
      type: 'confirm',
      name: 'moveon',
      message: 'Continue?'
    }
  ];

  //Ask
  inquirer.prompt(prompts,
    function (answers) {
      if (!answers.moveon) {
        return done();
      }
      answers.appNameSlug = _str.slugify(answers.appName);
      gulp.src(__dirname + '/templates/**')
        .pipe(template(answers))
        .pipe(rename(function (file) {
          if (file.basename[0] === '_') {
            file.basename = '.' + file.basename.slice(1);
          }
        }))
        .pipe(conflict('./'))
        .pipe(gulp.dest('./'))
        .pipe(install())
        .on('end', function () {
          done();
        });
    });
});
