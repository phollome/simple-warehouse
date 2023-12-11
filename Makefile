all: basics generate-envs migrate-databases unit-tests e2e-tests

generate-envs:
	@npm run scripts:generate-env -- -e development -i
	@npm run scripts:generate-env -- -e test -i

migrate-databases:
	@npm run migrate:development
	@npm run migrate:test

unit-tests:
	@npm test

e2e-tests:
	@npm run test:e2e

basics:
	@npm i
	@npx playwright install --with-deps chromium