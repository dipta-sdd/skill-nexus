{% load static %}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Completion Certificate - {{ course_name }}</title>
    <link href="{% static 'css/bootstrap.min.css' %}" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">
    <style>
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .no-print {
                display: none !important;
            }
        }

        body {
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            font-family: 'Cormorant Garamond', serif;
        }

        .certificate-container {
            width: 210mm;  /* A4 width */
            height: 297mm; /* A4 height */
            margin: 0 auto;
            padding: 20mm;
            position: relative;
            background: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 0 30px rgba(0,0,0,0.1);
        }

        .certificate-border {
            position: absolute;
            top: 10mm;
            left: 10mm;
            right: 10mm;
            bottom: 10mm;
            border: 3px double #c4a35a;
            border-radius: 10px;
        }

        .certificate-content {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 40px;
        }

        .certificate-header {
            margin-bottom: 40px;
        }

        .certificate-title {
            font-family: 'Playfair Display', serif;
            font-size: 54px;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: bold;
            font-style: italic;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .certificate-subtitle {
            font-family: 'Cormorant Garamond', serif;
            font-size: 28px;
            color: #7f8c8d;
            margin-bottom: 40px;
            font-style: italic;
        }

        .recipient-name {
            font-family: 'Playfair Display', serif;
            font-size: 42px;
            color: #c4a35a;
            margin: 30px 0;
            font-weight: bold;
            font-style: italic;
            text-shadow: 1px 1px 2px rgba(196,163,90,0.2);
        }

        .certificate-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            color: #34495e;
            line-height: 1.6;
            margin: 30px 0;
            font-style: italic;
        }

        .course-name {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            color: #2c3e50;
            font-weight: bold;
            margin: 20px 0;
            font-style: italic;
        }

        .certificate-footer {
            margin-top: 80px;
            display: flex;
            justify-content: space-around;
        }

        .signature-block {
            text-align: center;
        }

        .signature-line {
            width: 200px;
            border-top: 2px solid #34495e;
            margin-top: 10px;
            padding-top: 10px;
            font-size: 20px;
            color: #7f8c8d;
            font-family: 'Playfair Display', serif;
            font-style: italic;
        }

        .signature-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 16px;
            color: #95a5a6;
            margin-top: 5px;
            font-style: italic;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-family: 'Playfair Display', serif;
            font-size: 150px;
            color: rgba(196,163,90,0.03);
            z-index: 0;
            white-space: nowrap;
            font-style: italic;
            font-weight: bold;
        }

        .print-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 10px 20px;
            background: linear-gradient(45deg, #c4a35a, #deb853);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Cormorant Garamond', serif;
            font-style: italic;
            font-size: 18px;
        }

        .print-button:hover {
            background: linear-gradient(45deg, #b3934d, #cda83e);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(196,163,90,0.3);
        }

        @media print {
            .certificate-container {
                box-shadow: none;
                margin: 0;
                padding: 20mm;
            }
        }

        .decorative-corner {
            position: absolute;
            width: 100px;
            height: 100px;
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M0,0 L100,0 L100,10 C50,10 10,50 10,100 L0,100 Z" fill="%23c4a35a" opacity="0.2"/></svg>');
            background-size: contain;
        }

        .top-left { top: 10mm; left: 10mm; }
        .top-right { top: 10mm; right: 10mm; transform: rotate(90deg); }
        .bottom-left { bottom: 10mm; left: 10mm; transform: rotate(-90deg); }
        .bottom-right { bottom: 10mm; right: 10mm; transform: rotate(180deg); }
    </style>
</head>
<body>
    <button onclick="window.print()" class="btn btn-primary print-button no-print">
        <i class="fas fa-print"></i> Print Certificate
    </button>

    <div class="certificate-container">
        <div class="certificate-border"></div>
        <div class="decorative-corner top-left"></div>
        <div class="decorative-corner top-right"></div>
        <div class="decorative-corner bottom-left"></div>
        <div class="decorative-corner bottom-right"></div>
        <div class="watermark">SKILL NEXUS</div>
        
        <div class="certificate-content">
            <div class="certificate-header">
                <h1 class="certificate-title">Certificate of Completion</h1>
                <div class="certificate-subtitle">This is to certify that</div>
            </div>

            <div class="recipient-name">{{ student_name }}</div>

            <div class="certificate-text">
                has successfully completed the course
            </div>
            
            <div class="course-name">{{ course_name }}</div>

            <div class="certificate-text">
                on {{ completion_date }}
            </div>

            <div class="certificate-footer">
                <div class="signature-block">
                    <div class="signature-line">{{ instructor_name }}</div>
                    <div class="signature-title">Course Instructor</div>
                </div>
                <div class="signature-block">
                    <div class="signature-line">Skill Nexus</div>
                    <div class="signature-title">Platform Authority</div>
                </div>
            </div>
        </div>
    </div>

    <script src="{% static 'js/bootstrap.bundle.min.js' %}"></script>
    <script src="{% static 'js/all.min.js' %}"></script>
</body>
</html> 