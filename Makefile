test:
	mkdir -p logs
	@NODE_ENV=development ./node_modules/.bin/mocha \
		--reporter spec \

clean:
	rm -rf logs

.PHONY: test
