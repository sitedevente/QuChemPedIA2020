#!/bin/sh

# Fichiers python documentés #
pydoc -w api_consultation
pydoc -w test_api_consultation

mv ./api_consultation.html ../Documentation/pyDoc/
mv ./test_api_consultation.html ../Documentation/pyDoc/
