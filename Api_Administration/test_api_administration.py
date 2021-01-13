import requests
import json
import os

import api_administration as api


base_url = 'http://127.0.0.1:5000/api/'
root_path = 'data_dir/'


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


# Test the creation of a new molecule with a right body,
# verify that the response code is 201 and the
# response body contains the new molecule ID.
def test_add_molecule_with_log_file():

    # Define url for the API call.
    url = base_url + 'add'

    # Define the body
    body = {'molecule': {'formula': 'test'}}

    # Define the Json and Log file.
    files = {'mol_json': open('test_files/freq.json'),
             'mol_log': open('test_files/OPT_1559031618483.log')}

    # Call the API with POST method
    resp = requests.post(url, files=files)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 201
    resp_body = resp.json()
    assert resp_body['_id'] is not None
    assert resp_body['result'] == 'created'

    # Define the log file path.
    log_path = ''
    for char in resp_body['_id']:
        log_path += char
        log_path += '/'

    # Validate if the log file has been created.
    path = root_path + log_path + 'OPT_1559031618483.log'

    assert os.path.isfile(path)

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the creation of a new molecule with a right body,
# verify that the response code is 201 and the
# response body contains the new molecule ID.
def test_add_molecule_without_log_file():

    # Define url for the API call.
    url = base_url + 'add'

    # Define the body
    body = {'molecule': {'formula': 'test'}}

    # Define the Json and Log file.
    files = {'mol_json': open('test_files/freq.json')}

    # Call the API with POST method
    resp = requests.post(url, files=files)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 201
    resp_body = resp.json()
    assert resp_body['_id'] is not None
    assert resp_body['result'] == 'created'

    # Define the log file path.
    log_path = ''
    for char in resp_body['_id']:
        log_path += char
        log_path += '/'

    # Validate if the log file has been created.
    path = root_path + log_path + 'OPT_1559031618483.log'

    assert os.path.isfile(path)

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the creation of a new molecule without body,
# verify that the response code is 400 and the
# response body correspond to the right error message.
def test_add_molecule_error_without_json():

    # Define url for the API call.
    url = base_url + 'add'

    # Call the API with POST method
    resp = requests.post(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 400
    resp_body = resp.json()
    assert resp_body['error'] == 'You must provide a body for the molecule!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the suppression of a molecule with an existing ID,
# verify that the response code is 200 and the
# response body contains the right body.
def test_delete_molecule():

    # Create and get a new molecule id
    new_mol = requests.post(
        base_url + 'add',
        files={'mol_json': open('test_files/freq.json')})
    id_mol = new_mol.json()['_id']

    # Define url for the API call.
    url = base_url + 'delete/' + id_mol

    # Call the API with DELETE method.
    resp = requests.delete(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 200
    resp_body = resp.json()
    assert resp_body['_id'] == id_mol
    assert resp_body['result'] == 'deleted'

    # Define the log file path.
    log_path = ''
    for char in resp_body['_id']:
        log_path += char
        log_path += '/'

    path = root_path + log_path + 'OPT_1559031618483.log'

    # Validate if the log file has been removed.
    assert not os.path.isfile(path)

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the suppression of a molecule with an inexisting ID,
# verify that the response code is 404 and the
# response body contains the right error message.
def test_delete_molecule_error():

    # Define url for the API call.
    id_mol = 'fake_id_mol'
    url = base_url + 'delete/' + id_mol

    # Call the API with DELETE method.
    resp = requests.delete(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['error'] == 'Molecule with id = \'' + \
        id_mol + '\' does not exists!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the consultation of molecule's details with an existing ID,
# verify that the response code is 200 and the
# response body contains the right body and the right ID.
def test_details_molecule():

    # Create and get a new molecule id
    new_mol = requests.post(
        base_url + 'add',
        files={'mol_json': open('test_files/freq.json')})
    id_mol = new_mol.json()['_id']

    # Define url for the API call.
    url = base_url + 'details/' + id_mol

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 200
    resp_body = resp.json()
    assert resp_body['_id'] == id_mol
    assert resp_body['found']

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test the consultation of molecule's details with an inexisting ID,
# verify that the response code is 404 and the
# response body contains the right error message.
def test_details_molecule_error():

    # Define url for the API call.
    id_mol = 'fake_id_mol'
    url = base_url + 'details/' + id_mol

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['error'] == 'Molecule with id = \'' + \
        id_mol + '\' does not exists!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# Test a research of molecules with a test formula and
# verify that the response code is 200.
def test_search_molecule():

    # Define url for the API call.
    formula = 'test_formula'
    url = base_url + 'search/' + formula

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 200

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
    assert resp_body['error'] == 'Wrong url, resource not found!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)


# # Old tests

# # Test the creation of a log file with the add_log_file function
# # and check is a file has been created in the right directory.
# def test_add_log_file():

#     # Define a fake molecule id and its associate path.
#     fake_id_mol = 'thisIsAFakeIdMol'
#     path_to_fake_file = root_path + 't/h/i/s/I/s/A/F/a/k/e/I/d/M/o/l/data.log'

#     # Run the function for create the log file.
#     api.add_log_file(fake_id_mol)

#     # Validate the log file creation.
#     assert os.path.isfile(path_to_fake_file)


# # Test the suppression of a log file with the delete_log_file function
# # and check if the path to the ancient file doesn't exists anymore.
# def test_delete_log_file():

#     # Define a fake molecule id and its associate path.
#     fake_id_mol = 'thisIsAFakeIdMol'
#     path_to_fake_file = root_path + 't/h/i/s/I/s/A/F/a/k/e/I/d/M/o/l/data.log'

#     # Verify the log file exists before deletion.
#     assert os.path.isfile(path_to_fake_file)

#     # Run the function for delete the log file.
#     api.delete_log_file(fake_id_mol)

#     assert os.path.isfile(path_to_fake_file) == False
