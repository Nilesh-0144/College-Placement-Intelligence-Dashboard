"""
Dataset Generator for College Placement Intelligence Project
Generates realistic 400 student records for placement prediction.
"""

import random
import csv

random.seed(42)

branches = [
    "Computer Science", 
    "Information Technology", 
    "Electronics & Comm.", 
    "Mechanical", 
    "Civil"
]

skills_pool = {
    "Computer Science": ["Python & DSA", "Full Stack Web", "Cloud & DevOps", "Machine Learning", "Java & Spring"],
    "Information Technology": ["Full Stack Web", "Python & DSA", "Data Analytics", "Java & Spring", "Cloud & DevOps"],
    "Electronics & Comm.": ["Embedded Systems", "IoT & Python", "C++ & VLSI", "Java Core", "Data Analytics"],
    "Mechanical": ["CAD & SolidWorks", "Python Basics", "Core Mechanical", "Data Analytics", "Automation"],
    "Civil": ["AutoCAD & Revit", "Structural Analysis", "Project Planning", "Python Basics", "Core Civil"]
}

companies = {
    "High": ["Amazon", "Microsoft", "Google", "Adobe"],
    "Mid": ["TCS Digital", "Infosys (Specialist)", "Cognizant GenC", "Accenture", "L&T Infotech", "Capgemini"],
    "Core": ["L&T Construction", "Tata Motors", "Bosch", "Schneider Electric"],
    "Mass": ["TCS Ninja", "Infosys", "Wipro", "Tech Mahindra"]
}

students = []

for i in range(1, 401):
    student_id = f"STU{1000 + i}"
    branch = random.choices(branches, weights=[0.32, 0.25, 0.20, 0.13, 0.10])[0]
    
    # Realistic Academic Scores with correlation
    cgpa_base = random.gauss(7.4, 1.1)
    cgpa = round(max(5.2, min(9.9, cgpa_base)), 2)
    
    tenth = round(max(55.0, min(98.5, cgpa * 9.5 + random.uniform(-6, 6))), 1)
    twelfth = round(max(52.0, min(97.5, cgpa * 9.2 + random.uniform(-7, 7))), 1)
    
    # Internship probability higher for high CGPA and CS/IT
    internship_prob = 0.25
    if branch in ["Computer Science", "Information Technology"]:
        internship_prob += 0.25
    if cgpa >= 7.5:
        internship_prob += 0.30
    internship = "Yes" if random.random() < internship_prob else "No"
    
    skill = random.choice(skills_pool[branch])
    
    # Placement probability calculation (Logistic function logic)
    # Z = w1*CGPA + w2*Internship + w3*10th + w4*12th + Branch_bias + noise
    z = (
        (cgpa - 7.0) * 1.8 +
        (1.4 if internship == "Yes" else -0.8) +
        ((tenth - 70) / 10.0) * 0.4 +
        ((twelfth - 70) / 10.0) * 0.5 +
        (0.6 if branch in ["Computer Science", "Information Technology"] else -0.3) +
        random.gauss(0, 0.6)
    )
    
    placed_prob = 1.0 / (1.0 + pow(2.71828, -z))
    is_placed = placed_prob >= 0.50
    
    if is_placed:
        placed = "Yes"
        # Package in LPA
        if cgpa >= 8.5 and internship == "Yes" and random.random() < 0.35:
            company = random.choice(companies["High"])
            package = round(random.uniform(12.0, 24.0), 2)
        elif branch in ["Mechanical", "Civil"] and random.random() < 0.4:
            company = random.choice(companies["Core"])
            package = round(random.uniform(4.5, 8.5), 2)
        elif cgpa >= 7.5 or internship == "Yes":
            company = random.choice(companies["Mid"])
            package = round(random.uniform(6.0, 11.5), 2)
        else:
            company = random.choice(companies["Mass"])
            package = round(random.uniform(3.5, 5.0), 2)
    else:
        placed = "No"
        company = "Not Placed"
        package = 0.0

    students.append({
        "Student_ID": student_id,
        "Branch": branch,
        "CGPA": cgpa,
        "10th_Percentage": tenth,
        "12th_Percentage": twelfth,
        "Internship": internship,
        "Skills": skill,
        "Company": company,
        "Package": package,
        "Placed": placed
    })

fieldnames = [
    "Student_ID", "Branch", "CGPA", "10th_Percentage", 
    "12th_Percentage", "Internship", "Skills", "Company", "Package", "Placed"
]

with open("placement_data.csv", mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(students)

print(f"Successfully generated placement_data.csv with {len(students)} student records.")
