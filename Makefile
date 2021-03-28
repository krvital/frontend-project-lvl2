install:
	npm install && npm link

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

test-watch:
	npm test -- --watch

lint:
	npx eslint .

.PHONY: test
