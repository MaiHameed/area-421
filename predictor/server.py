from labeler import predict_issue_label
from flask import Flask, request, jsonify
import os
import json


app = Flask(__name__)


@app.route('/')
def hello():
    return 'Issue label microservice is live!'


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    # Parses through each issue and assigns the proper label(s) as well as
    # the probability value(s)
    for i, value in enumerate(data['issues']):
        # Gets the label list through the AI model
        labels = predict_issue_label(issue_body=value["body"],
                                     issue_title=value["title"])

        # If no label to assign, delete issue entry
        if not labels:
            del data['issues'][i]
        else:
            value["labels"].append(labels)

    # Return new JSON object with added labels
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
