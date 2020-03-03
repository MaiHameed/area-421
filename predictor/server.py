from labeler import predict_issue_label

from flask import request

import os

from flask import Flask

app = Flask(__name__)


@app.route('/')
def hello():
    return 'Issue label microservice is live!'


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    return predict_issue_label(issue_body=data["body"],
                               issue_title=data["title"])


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
