from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import numpy as np
import base64
from PIL import Image
import io
import numpy as np
from ultralytics import YOLO
model = YOLO("yolov8m.pt")

products=np.load('products.npy',allow_pickle=True)

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def predict(imgstring):
    base64_string = imgstring.split(',')[1]
    # Convert base64 string to bytes
    image_bytes = base64.b64decode(base64_string)
    # Convert bytes to PIL Image object
    image = Image.open(io.BytesIO(image_bytes))
    # Convert PIL Image object to Numpy array
    results = model.predict(image)
    return results




@app.route('/detect', methods=['POST'])
@cross_origin()
def detect():
    imageString=request.form.get('image')

    result=predict(imageString)[0]
    data={}
    first=None
    for box in result.boxes:
        class_id = result.names[box.cls[0].item()]
        conf = round(box.conf[0].item(), 2)
        data[class_id]=conf
        if first is None:
            first=class_id
    print("Image Prediction")
    print(data)
    print(first, data[first])
    
    prediction=first
    return jsonify(item=prediction)

@app.route('/detectOld', methods=['POST'])
@cross_origin()
def detectOld():
    image=request.form.get('image')
    
    prediction=np.random.choice(products)
    print(prediction)
    return jsonify(item=prediction)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)