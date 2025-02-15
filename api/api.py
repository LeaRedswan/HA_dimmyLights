from flask import Flask, request, jsonify
from flask_cors import CORS
from dimmy import Dimmy

app = Flask(__name__)
CORS(app)
dimmy = Dimmy(1, 0x55, 300)

@app.route('/set', methods=['POST'])
def set_channel():
    data = request.json
    channel = data.get('channel')
    value = data.get('value')
    if channel is None or value is None:
        return jsonify({'error': 'Missing channel or value'}), 400
    dimmy.set(channel, value)
    return jsonify({'message': f'Set channel {channel} to value {value}'}), 200

@app.route('/set_all', methods=['POST'])
def set_all_channels():
    data = request.json
    value = data.get('value')
    if value is None:
        return jsonify({'error': 'Missing value'}), 400
    dimmy.set_all(value)
    return jsonify({'message': f'Set all channels to value {value}'}), 200

@app.route('/get_all', methods=['GET'])
def get_channel_states():
    return jsonify({'channel_states': dimmy.channel_states}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)