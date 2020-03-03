from flask import Flask, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/', methods=['POST'])
def labeller():
    
    return getIssues()

def getIssues():
    GH_TOKEN = os.getenv('GH_TOKEN')
    url = 'https://api.github.com/repos/openliberty/open-liberty/issues'
    headers = {
        'Authorization': 'token '+str(GH_TOKEN)
    }
    payload = {
        'labels': 'bug'
    }

    response = requests.get(url, headers=headers, params=payload)
    
    return jsonify(response.json())

if __name__ == "__main__":
    port = 5000
    app.run(port=port, debug=True)