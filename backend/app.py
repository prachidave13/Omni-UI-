from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
import ollama
import asyncio
from PIL import Image
import io
import docx
import PyPDF2

app = FastAPI()

# Models for request/response
class UserInput(BaseModel):
    description: str
    requirements: str
    inspiration_text: Optional[str]
    integrations: List[str]

class Task(BaseModel):
    id: str
    title: str
    description: str
    order: int

# Function to process images using Llama 3.2 Vision
async def process_image(image: UploadFile) -> str:
    '''
    Process image using Llama 3.2 Vision model via Ollama
    Returns text description of the image
    '''
    try:
        # Read image file
        contents = await image.read()
        image = Image.open(io.BytesIO(contents))
        
        # Call Llama Vision model
        response = ollama.generate('llama2-vision',
                                 prompt='Describe this image in detail',
                                 images=[image])
        
        return response['response']
    except Exception as e:
        print(f"Error processing image: {e}")
        return ""

# Function to read document files
def read_document(file: UploadFile) -> str:
    '''
    Read content from various document formats
    Supports: txt, pdf, doc, docx
    '''
    content = ""
    try:
        if file.filename.endswith('.txt'):
            content = file.file.read().decode()
        elif file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(file.file)
            content = ' '.join([page.extract_text() for page in pdf_reader.pages])
        elif file.filename.endswith('.docx'):
            doc = docx.Document(file.file)
            content = ' '.join([paragraph.text for paragraph in doc.paragraphs])
        return content
    except Exception as e:
        print(f"Error reading document: {e}")
        return ""

# Function to generate tasks using Deepseek
def generate_tasks(user_input: UserInput) -> List[Task]:
    '''
    Generate tasks using Deepseek model via Ollama
    Returns list of tasks to complete the project
    '''
    try:
        # Construct prompt
        prompt = f"""
        Based on the following project requirements, create a detailed task list:
        
        Description: {user_input.description}
        
        Requirements: {user_input.requirements}
        
        Visual Inspiration: {user_input.inspiration_text}
        
        Integrations Needed: {', '.join(user_input.integrations)}
        
        Create a numbered list of specific, actionable tasks that need to be completed.
        Each task should be clear and self-contained.
        """

        # Call Deepseek model
        response = ollama.generate('deepseek:1.5b', prompt=prompt)
        
        # Parse response into tasks
        # This is a simple implementation - you might want to add more sophisticated parsing
        tasks = []
        for i, line in enumerate(response['response'].split('\n')):
            if line.strip():
                tasks.append(Task(
                    id=f"TASK-{i+1}",
                    title=line.strip(),
                    description=line.strip(),
                    order=i
                ))
        
        return tasks
    except Exception as e:
        print(f"Error generating tasks: {e}")
        return []

# API Endpoints
@app.post("/process-image")
async def process_image_endpoint(file: UploadFile = File(...)):
    text = await process_image(file)
    return {"text": text}

@app.post("/process-document")
async def process_document_endpoint(file: UploadFile = File(...)):
    text = read_document(file)
    return {"text": text}

@app.post("/generate-tasks")
async def generate_tasks_endpoint(user_input: UserInput):
    tasks = generate_tasks(user_input)
    return {"tasks": tasks}
