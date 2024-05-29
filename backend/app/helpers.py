#helpers
from io import BytesIO
import tensorflow as tf
from tensorflow.keras.layers import (Layer, GlobalAveragePooling2D, GlobalMaxPooling2D, Dense, Reshape, Add, Multiply, Conv2D, Concatenate)
from tensorflow.keras.preprocessing import image
import tensorflow as tf
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from io import BytesIO


# Preprocess the image
def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = tf.keras.applications.inception_v3.preprocess_input(img_array)
    return img_array

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# PDF report generator
def generate_pdf_report(test):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()

    # Define colors for the document
    header_color = colors.HexColor("#4E5D6C")
    body_color = colors.HexColor("#F5F5F5")
    body_text_color = colors.HexColor("#424242")
    line_color = colors.HexColor("#E0E0E0")

    # Title Style
    title_style = styles['Title']
    title_style.textColor = header_color
    title_style.fontSize = 20
    title_style.alignment = 1  # Center alignment

    # Heading2 Style for Sections
    heading2_style = styles['Heading2']
    heading2_style.textColor = header_color
    heading2_style.fontSize = 14

    # Story container for elements
    story = [Paragraph("Lung Disease Diagnostic Report", title_style), Spacer(1, 20)]

    # Patient Details Section
    patient_details = [
        ["Patient Name", test.patient.name],
        ["Date of Birth", test.patient.date_of_birth.strftime('%Y-%m-%d')],
        ["Gender", test.patient.gender],
        ["Address", test.patient.address or "N/A"],
        ["Phone", test.patient.phone or "N/A"]
    ]

    # Table style
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('TEXTCOLOR', (0, 0), (-1, -1), body_text_color),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BACKGROUND', (0, 1), (-1, -1), body_color),
        ('BOX', (0, 0), (-1, -1), 2, line_color),
        ('GRID', (0, 0), (-1, -1), 1, line_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ])

    # Adding Patient Details to Story
    patient_details_table = Table(patient_details, colWidths=[200, 350], style=table_style)
    story.append(Paragraph("Patient Details", heading2_style))
    story.append(Spacer(1, 12))
    story.append(patient_details_table)
    story.append(Spacer(1, 20))

    # Test Results Section
    test_details = [
        ["Test ID", str(test.id)],
        ["Conducted on", test.date_conducted.strftime('%Y-%m-%d')],
        ["Result", test.result],
        ["Confidence Level", f"{test.confidence * 100:.2f}%"]
    ]

    # Adding Test Details to Story
    test_details_table = Table(test_details, colWidths=[200, 350], style=table_style)
    story.append(Paragraph("Test Details", heading2_style))
    story.append(Spacer(1, 12))
    story.append(test_details_table)

    # Build and return the PDF
    doc.build(story)
    buffer.seek(0)
    return buffer

# SE block
def create_se_block(input_tensor, ratio=16):
    init = input_tensor
    channel_axis = -1
    filters = init.shape[channel_axis]
    se_shape = (1, 1, filters)
    se = GlobalAveragePooling2D()(init)
    se = Reshape(se_shape)(se)
    se = Dense(filters // ratio, activation='relu')(se)
    se = Dense(filters, activation='sigmoid')(se)
    x = Multiply()([init, se])
    return x