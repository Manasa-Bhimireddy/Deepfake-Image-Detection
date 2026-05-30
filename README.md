# 🛡️ DeepFake Image Detection System

A web-based DeepFake Image Detection System that uses a Convolutional Neural Network (CNN) to classify images as **Real** or **Fake (AI-Generated/DeepFake)**. The application provides prediction confidence scores and supports real-time image verification through a user-friendly interface.

---

## 📖 Overview

With the rapid growth of AI-generated content, identifying manipulated images has become increasingly important. This project leverages Deep Learning techniques to detect DeepFake images and help users verify image authenticity.

The system accepts an image as input, preprocesses it, and passes it through a trained CNN model to determine whether the image is real or fake.

---

## ✨ Features

- Upload and analyze images
- DeepFake image detection using CNN
- Real/Fake classification
- Confidence score display
- Fast and responsive user interface
- Chrome Extension Support (Manifest V3)
- PDF report generation (optional)
- REST API integration

---

## 🏗️ System Workflow

1. Start the application.
2. User uploads or selects an image.
3. Image is sent to the prediction server.
4. Image preprocessing:
   - Resize to **224 × 224**
   - Convert to **RGB**
   - Normalize pixel values to **0–1**
5. Convert image to tensor format.
6. Load trained CNN model.
7. Pass image to CNN model.
8. Generate prediction probability **p**.
9. Classification:
   - **p > 0.5 → Real Image**
   - **p ≤ 0.5 → Fake Image**
10. Display prediction result and confidence score.
11. Allow PDF report download (optional).

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- HTML5
- CSS3
- JavaScript

### Backend
- Flask
- REST API
- Chrome Extension (Manifest V3)

### Machine Learning
- TensorFlow
- Keras
- NumPy
- Pillow (PIL)

### Database
- SQLite
- MySQL

---

## 📂 Project Structure

```bash
DeepFake-Image-Detection/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── model/
│   ├── routes/
│   └── requirements.txt
│
├── extension/
│   ├── manifest.json
│   └── popup/
│
├── dataset/
│
├── reports/
│
└── README.md
```

---

## 📊 Dataset

The model was trained using a customized dataset created from multiple sources:

- CelebDF Dataset
- GAN Generated Images (Self Generated)
- Kaggle DeepFake Datasets

### Classes

- Real Images
- Fake Images
- AI Generated Images

---

## 💻 Hardware Requirements

### Minimum

- Intel Core i5 Processor
- 8 GB RAM
- 5 GB Free Storage

### Recommended

- Intel Core i7 Processor
- 16 GB RAM
- NVIDIA GPU (for training)

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Manasa-Bhimireddy/deepfake-image-detection.git

cd deepfake-image-detection
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

python app.py
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🚀 Usage

1. Launch the frontend application.
2. Upload an image.
3. Wait for model prediction.
4. View:
   - Detection Result (Real/Fake)
   - Confidence Score
5. Download PDF report (optional).

---

## 🧠 Model Information

### CNN-Based DeepFake Detector

The model is trained to identify visual artifacts and inconsistencies introduced during image manipulation and AI image generation.

### Preprocessing Steps

```python
Resize → RGB Conversion → Normalization → Tensor Conversion
```

### Prediction Logic

```python
if probability > 0.5:
    prediction = "Real Image"
else:
    prediction = "Fake Image"
```

---

## 📈 Future Enhancements

- Video DeepFake Detection
- Mobile Application
- Explainable AI (XAI)
- Cloud Deployment
- Transformer-Based Models (ViT)
- Real-Time Browser Verification
- Multi-Class Fake Detection

---

## 🎯 Applications

- Social Media Verification
- Fake News Detection
- Digital Forensics
- Cyber Security
- Content Authentication
- Research and Education

---

## 📸 Screenshots

Add screenshots of your application here.

```markdown
![Home Page](screenshots/home.png)

![Prediction Result](screenshots/result.png)
```

---


---

## 📄 License

This project is developed for educational and research purposes.

---

## 🙏 Acknowledgements

- TensorFlow
- Keras
- CelebDF Dataset
- Kaggle Community
- Open Source AI Research Community

---

### ⭐ If you found this project useful, please give it a star on GitHub!
