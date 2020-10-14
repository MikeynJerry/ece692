#import pandas as pd
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pickle

# load model
model = pickle.load(open('model.pkl','rb'))

# app
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADER'] = 'Content-Type'

# routes
@app.route('/wakeup', methods=['GET'])
@cross_origin()
def wake_up():
  return {
    'awake': True
  }

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
  data = request.get_json()
  probabilities = model.predict_proba([[1, 1]])[0]
  predictions = np.argmax(probabilities)
  return {
    'probabilities': probabilities.tolist(),
    'prediction': predictions.tolist()
  }

#def predict():
#    # get data
#    data = request.get_json(force=True)
#
#    # convert data into dataframe
#    data.update((x, [y]) for x, y in data.items())
#    data_df = pd.DataFrame.from_dict(data)
#
#    # predictions
#    result = model.predict(data_df)
#
#    # send back to browser
#    output = {'results': int(result[0])}
#
#    # return data
#    return jsonify(results=output)

if __name__ == '__main__':
    app.run(port = 5000, debug=True)