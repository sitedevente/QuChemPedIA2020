import requests
import json


base_url = 'http://127.0.0.1:5000/api/'


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


def test_details_molecule_200():

    # Define url for the API call.
    id_mol = 'L-IN1HQBkjVcihM6lgKA'
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


def test_details_molecule_404():

    # Define url for the API call.
    id_mol = 'fake_id_mol'
    url = base_url + 'details/' + id_mol

    # Call the API with GET method.
    resp = requests.get(url)

    # Validate response headers and body contents and status code.
    assert resp.status_code == 404
    resp_body = resp.json()
    assert resp_body['Error'] == 'Molecule with id = \'fake_id_mol\' does not exists!'

    # Print full request and response
    pretty_print_request(resp.request)
    pretty_print_response(resp)
