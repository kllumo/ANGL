from flask import Flask, render_template, request, send_file, jsonify, send_from_directory
from anonymizer import anonymize_file
import os

#openai.api_key = 'YOURsk-proj-xnoXhbVPmT0_TsueReJImvFiDxQ8EBVUNHCv3H32v6OUV7rymvcZ1lRcYurqkgWBjdJGcqebKjT3BlbkFJpCrRurkvngbEf0m9uJIoQR6is6qZyic7cnnCjTWjPo0yRjOzP3L1N8Cw6UGU_mdDoffX_Xw0UA'

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

chat_history = []  # Для хранения сообщений

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chatbot')
def chat():
    return render_template('chat.html', chat_history=chat_history)

@app.route('/chatbot/message', methods=['POST'])
def handle_message():
    user_message = request.form.get('message')
    response = ""

    if user_message.lower() == "загрузка":
        response = "Пожалуйста, загрузите файл ниже."
    elif user_message.lower() == "очистить":
        chat_history.clear()
        response = "Чат очищен."
    else:
        response = "Неизвестная команда. Доступные команды: 'Загрузка', 'Очистить'."

    chat_history.append(("Вы", user_message))
    chat_history.append(("Бот", response))

    return jsonify({'response': response})

@app.route('/chatbot/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file:
        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(input_path)

        output_path = anonymize_file(input_path)
        filename = os.path.basename(output_path)
        response = f"Файл обработан. <a href='/download/{filename}'>Скачать файл</a>"

        chat_history.append(("Бот", response))
        return jsonify({'response': response})
    return jsonify({'response': 'Ошибка загрузки файла.'})

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


if __name__ == '__main__':
    app.run(debug=True)
