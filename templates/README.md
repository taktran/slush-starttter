# <%= appName %>

A website built using [slush-starttter](https://github.com/taktran/slush-starttter).

## Development

Install pre-requisites

    npm install

Start the server

    gulp

Extra options for the default `gulp` task:

* `--port [port]` [default=7770] Port that the server is run on
* `--lp [livereload port]` [default=35729] Port that livereload runs on
* `--debug` Enable debug mode:
    * Tests are run with Chrome (so you can use web inspector)

## Testing

Uses [karma](http://karma-runner.github.io/) and [jasmine](http://pivotal.github.io/jasmine/).

Karma is run automatically when `gulp` is called. To run it manually

    karma start config/karma.conf.js

For continuous integration, run

    gulp ci:test

    # Or,

    npm test
