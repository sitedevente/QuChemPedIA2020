import requests
from flask import request, json, jsonify, Flask
import os
import flask
import pytest

app = Flask(__name__)
app.config.from_pyfile(os.path.join(".", "config/app.conf"), silent=False)
base_url = app.config.get("BASE_URL")


def pretty_print_request(request):
    """Function for formatting API request."""
    print('\n{}\n{}\n\n{}\n\n{}\n'.format(
        '-----------Request----------->',
        request.method + ' ' + request.url,
        '\n'.join('{}: {}'.format(k, v) for k, v in request.headers.items()),
        request.body)
    )


def pretty_print_response(response):
    """Function for formatting API response."""
    print('\n{}\n{}\n\n{}\n\n{}\n'.format(
        '<-----------Response-----------',
        'Status code:' + str(response.status_code),
        '\n'.join('{}: {}'.format(k, v) for k, v in response.headers.items()),
        response.text)
    )

# Test a research of molecules with a test type and name
# verify that the response code is 200.
# And the number of existing molecules is greater than 0


def test_search_molecule():

    # Make a list of possible type
    list = {}
    list["formula"] = "co2"
    list["inchi"] = "InChI=1S/CHBrClF/c2-1(3)4/h1H/t1-/m1/s1"
    list["smi"] = "[CH](Cl)F.[Br]"

    # Loop through all the possibilities to check if it's working or not
    for l in list:
        type = l
        name = list[l]
        page = "1"
        showresult = "5"
    # Define url for the API call.
        url = base_url + 'search?type=' + type + '&q=' + \
            name + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
        resp = requests.get(url)

    # Validate response headers and body contents and status code.
        assert resp.status_code == 200
        resp_body = resp.json()
        assert resp_body['total'] > 0

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)

# Test a research of molecules with a test type and name
# verify that the response code is 200.
# And the number of existing molecules is greater than 0


def test_search_molecule_using_special_characters():

    # Make a list of possible names
    list = {"H*","CH_","H*_","H_*"}

    # Loop through all the possibilities to check if it's working or not
    for l in list:
        name = l
        page = "1"
        showresult = "5"
    # Define url for the API call.
        url = base_url + 'search?type=formula&q=' + \
            name + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
        resp = requests.get(url)

    # Validate response headers and body contents and status code.
        assert resp.status_code == 200
        resp_body = resp.json()
        assert resp_body['total'] > 0

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test a research of molecules with a wrong query,
# verify that the response code is 404 and the
# response body contains the right error message.


def test_search_molecule_wrong_query_error():

    # Make a list of inexisting type
    list = {}
    list["formula"] = "fake_formula"
    list["inchi"] = "fake_inchi"
    list["smi"] = "fake_smile"

    # Loop through all the possibilities to check if it's working or not
    for l in list:
        type = l
        name = list[l]
        page = "1"
        showresult = "5"
    # Define url for the API call.
        url = base_url + 'search?type=' + type + '&q=' + \
            name + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
        resp = requests.get(url)

    # Validate response headers and body contents and status code.
        assert resp.status_code == 404
        resp_body = resp.json()
        assert resp_body['Error'] == 'Molecule does not exist'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)

# Test a research of molecules with a wrong type,
# verify that the response code is 404 and the
# response body contains the right error message.


def test_search_molecule_wrong_type_error():

    type = "fake_type"
    name = "co2"
    page = "1"
    showresult = "5"
    # Define url for the API call.
    url = base_url + 'search?type=' + type + '&q=' + \
        name + '&page=' + page + '&showresult=' + showresult
    # url_inchi = base_url + 'search?type=' + type_inchi + '&q=' + name_inchi + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Molecule does not exist'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)

# Test a research of molecules with a wrong page and/or wrong showresult,
# verify that the response code is 404 and the
# response body contains the right error message.


def test_search_molecule_wrong_page_showresult_error():

    type = "formula"
    name = "co2"
    page = "dd"
    showresult = "s"
    # Define url for the API call.
    url = base_url + 'search?type=' + type + '&q=' + \
        name + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Something is wrong please check your URL'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test a research of molecules with empty parameter(s),
# verify that the response code is 404 and the
# response body contains the right error message.
def test_search_molecule_empty_param_error():

    type = " "
    name = "co2"
    page = ""
    showresult = "3"
    # Define url for the API call.
    url = base_url + 'search?type=' + type + '&q=' + \
        name + '&page=' + page + '&showresult=' + showresult

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Something is missing please check your URL'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the consultation of molecule's details with an existing IDs,
# verify that the response code is 200 and the
# response body contains the right body and the right ID.
def test_details_molecule():

    # Make a list of possible IDs
    list_id = [
        "NPFO7HUBkjVcihM6asbw",
        "M_FO7HUBkjVcihM6acbJ",
        "5ktO7HUBOSF22BvMbII8",
        "NvFO7HUBkjVcihM6bcbg",
        "6EtO7HUBOSF22BvMbYIQ",
        "N_FO7HUBkjVcihM6bsZJ"]

    for id in list_id:
        # Define url for the API call.
        url = base_url + 'details/' + id

        # Call the API with GET method.
        resp = requests.get(url)

        # Validate response headers and body contents and status code.
        assert resp.status_code == 200
        resp_body = resp.json()
        assert resp_body['id'] == id
        # assert resp_body['found']

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the consultation of molecule's details with an inexisting ID,
# verify that the response code is 404 and the
# response body contains the right error message.
def test_details_molecule_wrong_id_error():

    # Define url for the API call.
    id_mol = 'fake_id_mol'
    url = base_url + 'details/' + id_mol

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Molecule with id = \'' + \
        id_mol + '\' does not exists!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)

# Test the consultation of molecule's details with an empty ID,
# verify that the response code is 404 and the
# response body contains the right error message.
def test_details_molecule_empty_id_error():

    # Define url for the API call.
    id_mol = ""
    url = base_url + 'details/' + id_mol

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == "Please specify an id" or resp_body['Error'] == "Resource not found please check your url!"

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test to call an inexisting route for the API,
# verify that the response code is 404 and the
# response body contains the right error message.
def test_wrong_route():

    # Define url for the API call.
    url = base_url + 'wrong_route'

    # Call the API with GET method
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Resource not found please check your url!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)
