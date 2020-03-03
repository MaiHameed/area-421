from sklearn.utils.multiclass import unique_labels
from sklearn.metrics import confusion_matrix, precision_recall_curve
from sklearn.model_selection import train_test_split
from sklearn import svm, datasets
import numpy as np


class IssueLabeler:
    def __init__(self,
                 body_text_preprocessor,
                 title_text_preprocessor,
                 model,
                 class_names=['bug', 'feature_request', 'question']):
        """
        Parameters
        ----------
        body_text_preprocessor: ktext.preprocess.processor
            the text preprocessor trained on issue bodies
        title_text_preprocessor: ktext.preprocess.processor
            text preprocessor trained on issue titles
        model: tensorflow.keras.models
            a keras model that takes as input two tensors: vectorized 
            issue body and issue title.
        class_names: list
            class names as they correspond to the integer indices supplied to the model. 
        """
        self.body_pp = body_text_preprocessor
        self.title_pp = title_text_preprocessor
        self.model = model
        self.class_names = class_names

    def get_probabilities(self, body: str, title: str):
        """
        Get probabilities for the each class. 

        Parameters
        ----------
        body: str
           the issue body
        title: str
            the issue title

        Returns
        ------
        Dict[str:float]

        Example
        -------
        >>> issue_labeler = IssueLabeler(body_pp, title_pp, model)
        >>> issue_labeler.get_probabilities('hello world', 'hello world')
        {'bug': 0.08372017741203308,
         'feature': 0.6401631832122803,
         'question': 0.2761166989803314}
        """
        # transform raw text into array of ints
        vec_body = self.body_pp.transform([body])
        vec_title = self.title_pp.transform([title])

        # get predictions
        probs = self.model.predict(x=[vec_body, vec_title]).tolist()[0]

        return {k: v for k, v in zip(self.class_names, probs)}
