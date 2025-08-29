install: 
	npm ci

develop:
	npm run dev

lint: 
	npx eslint .

lint-fix:
	npx eslint . --fix