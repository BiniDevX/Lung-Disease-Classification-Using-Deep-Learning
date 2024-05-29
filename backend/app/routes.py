#app/routes
from datetime import datetime
from flask import jsonify
from flask import Blueprint, current_app, request, jsonify, send_file
from psycopg2 import IntegrityError
from sqlalchemy.exc import SQLAlchemyError
from .models import User, Patient, Test
from .helpers import allowed_file, preprocess_image, generate_pdf_report,create_se_block
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from werkzeug.security import check_password_hash
import numpy as np
import os
from .extensions import db
from flask import send_file


main = Blueprint('main', __name__)

# Load TensorFlow model
model = load_model('app/DenseNet121_SE_best_model.h5', custom_objects={'create_se_block': create_se_block})
class_indices = {0: 'COVID19', 1: 'Normal', 2: 'Pneumonia', 3: 'Tuberculosis'}

@main.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
    
@main.route('/api/patients/new', methods=['POST'])
@jwt_required()
def register_patient():
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    name = data.get('name')
    dateOfBirth = data.get('dateOfBirth')
    gender = data.get('gender')
    phone = data.get('phone')
    address = data.get('address')

    # Check if all required fields are present
    if not all([name, dateOfBirth, gender]):
        return jsonify({"msg": "Missing data"}), 400

    # Check if phone number already exists
    existing_patient = Patient.query.filter_by(phone=phone).first()
    if existing_patient:
        return jsonify({"msg": "Phone number already registered"}), 409

    # If phone number does not exist, create new patient
    new_patient = Patient(name=name, date_of_birth=dateOfBirth, gender=gender, phone=phone, address=address)
    db.session.add(new_patient)
    db.session.commit()

    return jsonify({"msg": "Patient created successfully", "patient_id": new_patient.id}), 201

@main.route('/api/test/new', methods=['POST'])
@jwt_required()
def new_test():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_file(image.filename):
        return jsonify({'error': 'Invalid file type'}), 400

    patient_id = request.form.get('patientId')
    if not patient_id:
        return jsonify({'error': 'Missing patient ID'}), 400

    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404

        filename = secure_filename(image.filename)
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")  # Generate a timestamp
        filename = f"{timestamp}_{filename}"  # Prepend the timestamp to the filename to avoid conflicts

        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'])
        image_path = os.path.join(upload_folder, filename)
        os.makedirs(upload_folder, exist_ok=True)
        
        # Check if file already exists
        if os.path.exists(image_path):
            return jsonify({'error': 'File already exists'}), 409

        image.save(image_path)

        processed_image = preprocess_image(image_path)
        prediction = model.predict(processed_image)
        predicted_class_idx = np.argmax(prediction[0])
        confidence = np.max(prediction[0]).item()
        predicted_class = class_indices[predicted_class_idx]

        test = Test(patient_id=patient.id, image_path=image_path, result=predicted_class, confidence=confidence, date_conducted=datetime.utcnow())
        db.session.add(test)
        db.session.commit()

        return jsonify({
            'patient_id': patient.id,
            'test_id': test.id,
            'result': predicted_class,
            'confidence': confidence
        }), 201

    except KeyError as e:
        db.session.rollback()
        return jsonify({'error': 'Missing data in request', 'details': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Unexpected error: {e}')
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500
#test result
@main.route('/api/test/results/<int:test_id>', methods=['GET'])
def get_test_results(test_id):
    try:
        # Query the database for the test results
        test = Test.query.get(test_id)

        if not test:
            return jsonify({'message': 'Test not found'}), 404

        # Format the data to send back
        test_data = {
            'patient_id': test.patient_id,
            'result': test.result,
            'confidence': test.confidence,
            # include other relevant fields
        }

        return jsonify(test_data), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@main.route('/api/tests/patient/<int:patient_id>', methods=['GET'])
def get_tests_for_patient(patient_id):
    try:
        # Query the database for all tests for a specific patient
        tests = Test.query.filter_by(patient_id=patient_id).all()

        # Serialize the test data for JSON response
        tests_data = [test.to_dict() for test in tests]

        return jsonify(tests_data), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': 'Database retrieval error: ' + str(e)}), 500

@main.route('/api/patients', methods=['GET'])
def get_patients():
    try:
        patients = Patient.query.all()
        return jsonify([patient.to_dict() for patient in patients]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# display patients
@main.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if patient:
            return jsonify(patient.to_dict()), 200
        return jsonify({'error': 'Patient not found: No patient exists with the provided ID'}), 404
    except SQLAlchemyError as e:
        return jsonify({'error': f'Database retrieval error: {str(e)}'}), 500

@main.route('/api/patients/<int:patient_id>', methods=['PUT'])
def update_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Update failed: Patient not found with the provided ID'}), 404

        data = request.json
        for key, value in data.items():
            setattr(patient, key, value)
        
        db.session.commit()
        return jsonify(patient.to_dict()), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'Update failed: Duplicate phone number detected'}), 409
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database update error: {str(e)}'}), 500
    

#delete patient and related tests
@main.route('/api/patients/<int:patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    try:
        patient = Patient.query.get(patient_id)
        if patient:
            # Delete all tests related to the patient first
            Test.query.filter_by(patient_id=patient_id).delete()
            # Now delete the patient
            db.session.delete(patient)
            db.session.commit()
            return jsonify({'message': 'Patient and related tests successfully deleted'}), 200
        return jsonify({'error': 'Deletion failed: Patient not found with the provided ID'}), 404
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': f'Database deletion error: {str(e)}'}), 500

#search patient
@main.route('/api/patients/search', methods=['GET'])
def search_patients():
    search_query = request.args.get('query', '')
    patients = Patient.query.filter(Patient.name.ilike(f'%{search_query}%')).all()
    return jsonify([patient.to_dict() for patient in patients])

# downlaod report
@main.route('/api/report/download/<int:test_id>', methods=['GET'])
def download_report(test_id):
    test = Test.query.get(test_id)
    if test:
        pdf_buffer = generate_pdf_report(test)
        pdf_buffer.seek(0)
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name=f'report_{test_id}.pdf',
            mimetype='application/pdf'
        )
    else:
        return jsonify({"message": "Test not found"}), 404