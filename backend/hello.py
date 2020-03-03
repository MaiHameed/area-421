from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/')
def pull_data():
    GH_TOKEN = os.getenv('GH_TOKEN')
    url = 'https://api.github.com/repos/openliberty/open-liberty/issues'
    headers = {'Authorization': 'token '+str(GH_TOKEN)}

    response = requests.get(url, headers)
    
    return jsonify(response.json())