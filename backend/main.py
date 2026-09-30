
from fastapi import FastAPI
from pydantic import BaseModel
from database import get_connection

app = FastAPI()


# -----------------------------
# Student Model
# -----------------------------
class Student(BaseModel):
    name: str
    branch: str
    cgpa: float
    projects: int
    internships: int


# -----------------------------
# Home
# -----------------------------
@app.get("/")
def home():
    return {
        "message": "Placement Prediction & Skill Gap Analyzer API is running!"
    }


# -----------------------------
# Register Student
# -----------------------------
@app.post("/students")
def create_student(student: Student):

    connection = get_connection()
    cursor = connection.cursor()

    query = """
        INSERT INTO students (name, branch, cgpa, projects, internships)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """

    cursor.execute(
        query,
        (
            student.name,
            student.branch,
            student.cgpa,
            student.projects,
            student.internships
        )
    )

    student_id = cursor.fetchone()[0]

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Student registered successfully",
        "student_id": student_id
    }


# -----------------------------
# Get Questions
# -----------------------------
@app.get("/questions")
def get_questions():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, skill, question,
               option_a, option_b, option_c, option_d,
               difficulty
        FROM questions
        ORDER BY id;
    """)

    questions = cursor.fetchall()

    cursor.close()
    connection.close()

    result = []

    for q in questions:
        result.append({
            "id": q[0],
            "skill": q[1],
            "question": q[2],
            "options": {
                "A": q[3],
                "B": q[4],
                "C": q[5],
                "D": q[6]
            },
            "difficulty": q[7]
        })

    return {
        "questions": result
    }


# -----------------------------
# Assessment Model
# -----------------------------
class Assessment(BaseModel):
    student_id: int
    skill: str
    answers: dict


# -----------------------------
# Submit Assessment
# -----------------------------
@app.post("/assessments")
def submit_assessment(assessment: Assessment):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, correct_option
        FROM questions
        WHERE skill = %s
    """, (assessment.skill,))

    questions = cursor.fetchall()

    score = 0

    for question in questions:

        question_id = question[0]
        correct_option = question[1]

        student_answer = assessment.answers.get(str(question_id))

        if student_answer == correct_option:
            score += 1

    total_questions = len(questions)

    if total_questions > 0:
        percentage = (score / total_questions) * 100
    else:
        percentage = 0

    if percentage >= 80:
        level = "Advanced"
    elif percentage >= 50:
        level = "Intermediate"
    else:
        level = "Beginner"

    cursor.execute("""
        INSERT INTO assessments
        (student_id, skill, score, total_questions, percentage, level)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        assessment.student_id,
        assessment.skill,
        score,
        total_questions,
        percentage,
        level
    ))

    assessment_id = cursor.fetchone()[0]

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Assessment submitted successfully",
        "assessment_id": assessment_id,
        "skill": assessment.skill,
        "score": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "level": level
    }
# -----------------------------
# Get Student Assessment Results
# -----------------------------
@app.get("/students/{student_id}/assessments")
def get_student_assessments(student_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT skill, score, total_questions, percentage, level
        FROM assessments
        WHERE student_id = %s
        ORDER BY skill;
    """, (student_id,))

    assessments = cursor.fetchall()

    cursor.close()
    connection.close()

    result = []

    for assessment in assessments:
        result.append({
            "skill": assessment[0],
            "score": assessment[1],
            "total_questions": assessment[2],
            "percentage": float(assessment[3]),
            "level": assessment[4]
        })

    return {
        "student_id": student_id,
        "assessments": result
    }
# -----------------------------
# Skill Gap Analysis
# -----------------------------
@app.get("/students/{student_id}/skill-gaps")
def get_skill_gaps(student_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT skill, percentage, level
        FROM assessments
        WHERE student_id = %s
        ORDER BY skill;
    """, (student_id,))

    assessments = cursor.fetchall()

    cursor.close()
    connection.close()

    skill_gaps = []

    for assessment in assessments:

        skill = assessment[0]
        percentage = float(assessment[1])
        level = assessment[2]

        if percentage >= 80:
            status = "Strong"
            recommendation = "Keep improving this skill."

        elif percentage >= 50:
            status = "Needs Improvement"
            recommendation = "Practice more questions and work on projects."

        else:
            status = "Major Gap"
            recommendation = "Focus on learning the fundamentals and practice regularly."

        skill_gaps.append({
            "skill": skill,
            "percentage": percentage,
            "level": level,
            "status": status,
            "recommendation": recommendation
        })

    return {
        "student_id": student_id,
        "skill_gaps": skill_gaps
    }
# -----------------------------
# Complete Assessment
# -----------------------------
# -----------------------------
# Complete Assessment
# -----------------------------
class CompleteAssessment(BaseModel):
    student_id: int
    answers: dict


@app.post("/complete-assessment")
def complete_assessment(assessment: CompleteAssessment):

    connection = get_connection()
    cursor = connection.cursor()

    # Get only the questions answered by the student
    question_ids = [int(id) for id in assessment.answers.keys()]

    if not question_ids:
        return {
            "message": "No answers submitted"
        }

    cursor.execute("""
        SELECT id, skill, correct_option
        FROM questions
        WHERE id = ANY(%s);
    """, (question_ids,))

    questions = cursor.fetchall()

    skill_results = {}

    # Check each submitted question
    for question in questions:

        question_id = question[0]
        skill = question[1]
        correct_option = question[2]

        student_answer = assessment.answers.get(str(question_id))

        if skill not in skill_results:
            skill_results[skill] = {
                "score": 0,
                "total": 0
            }

        skill_results[skill]["total"] += 1

        if student_answer == correct_option:
            skill_results[skill]["score"] += 1

    results = []

    # Calculate result for each skill
    for skill, data in skill_results.items():

        score = data["score"]
        total = data["total"]

        percentage = (score / total) * 100

        if percentage >= 80:
            level = "Advanced"
        elif percentage >= 50:
            level = "Intermediate"
        else:
            level = "Beginner"

        cursor.execute("""
            INSERT INTO assessments
            (student_id, skill, score, total_questions, percentage, level)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (
            assessment.student_id,
            skill,
            score,
            total,
            percentage,
            level
        ))

        assessment_id = cursor.fetchone()[0]

        results.append({
            "assessment_id": assessment_id,
            "skill": skill,
            "score": score,
            "total_questions": total,
            "percentage": percentage,
            "level": level
        })

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Complete assessment submitted successfully",
        "student_id": assessment.student_id,
        "results": results
    }
# -----------------------------
# Get Assessment Questions
# -----------------------------
@app.get("/assessment-questions")
# -----------------------------
# Get Assessment Questions
# -----------------------------
@app.get("/assessment-questions")
def get_assessment_questions():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT id, skill, question,
               option_a, option_b, option_c, option_d,
               difficulty
        FROM (
            SELECT *,
                   ROW_NUMBER() OVER (
                       PARTITION BY skill
                       ORDER BY id
                   ) AS row_num
            FROM questions
        ) q
        WHERE row_num <= 5
        ORDER BY skill, id;
    """)

    questions = cursor.fetchall()

    cursor.close()
    connection.close()

    result = []

    for q in questions:

        result.append({
            "id": q[0],
            "skill": q[1],
            "question": q[2],
            "options": {
                "A": q[3],
                "B": q[4],
                "C": q[5],
                "D": q[6]
            },
            "difficulty": q[7]
        })

    return {
        "total_questions": len(result),
        "questions": result
    }