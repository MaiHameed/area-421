from tensorflow.keras.models import load_model
from tensorflow.keras import utils as keras_utils
from urllib.request import urlopen
import dill as dpickle
from utils import IssueLabeler
from tensorflow.keras.models import load_model


with open('./model/title_pp.dpkl', 'rb') as f:
    title_pp = dpickle.load(f)

with open('./model/body_pp.dpkl', 'rb') as f:
    body_pp = dpickle.load(f)

issue_label_model = load_model('./model/Issue_Label_v1_best_model.hdf5')

issue_labeler = IssueLabeler(body_text_preprocessor=body_pp,
                             title_text_preprocessor=title_pp,
                             model=issue_label_model)


def predict_issue_label(issue_body, issue_title):
    return issue_labeler.get_probabilities(body=issue_body,
                                           title=issue_title)
