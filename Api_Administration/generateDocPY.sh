#!/bin/sh

# Fichiers python documentés #
pydoc -w api_administration
pydoc -w test_api_administration

mv ./api_administration.html ../Documentation/pyDoc/
mv ./test_api_administration.html ../Documentation/pyDoc/
