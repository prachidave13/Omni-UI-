from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import ollama
from ollama import chat, ChatResponse
from PIL import Image
import io
import docx
import PyPDF2
import base64
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
import re


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    description: str
    requirements: str
    inspiration_text: Optional[str] = None
    integrations: List[str] = []

class Task(BaseModel):
    id: str
    title: str
    description: str
    order: int

async def process_image(image: UploadFile) -> str:
    '''
    Process image using Llama 3.2 Vision model via Ollama
    Returns text description of the image
    '''
    try:
        contents = await image.read()
        # Convert image to base64
        base64_image = base64.b64encode(contents).decode('utf-8')
        
        # Create chat message with image
        messages = [
            {
                'role': 'user',
                'content': 'Describe this image in detail',
                'images': [base64_image]
            }
        ]
        
        # Call Llama Vision model using chat API
        response: ChatResponse = chat(
            model='llama2-vision',
            messages=messages
        )
        
        return response['message']['content']
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

async def read_document(file: UploadFile) -> str:
    '''
    Read content from various document formats
    '''
    try:
        contents = await file.read()
        file_obj = io.BytesIO(contents)
        
        if file.filename.endswith('.txt'):
            return contents.decode()
        elif file.filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(file_obj)
            return ' '.join([page.extract_text() for page in pdf_reader.pages])
        elif file.filename.endswith('.docx'):
            doc = docx.Document(file_obj)
            return ' '.join([paragraph.text for paragraph in doc.paragraphs])
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
    except Exception as e:
        print(f"Error reading document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error reading document: {str(e)}")

async def generate_tasks(user_input: UserInput) -> List[Task]:
    try:
        prompt = f"""
Based on the project details below, generate exactly 8 distinct, independent tasks. Format each task as shown:

1. **[Specific Task Title]**: [Clear, actionable description in 1-2 sentences]

Tasks should be:
- Independent of each other (can be worked on in parallel)
- Clear and actionable
- Specific to the project needs
- Properly formatted with task title in bold

Project Details:
Description: {user_input.description}
Requirements: {user_input.requirements}

Example format:
1. **Configure API Authentication**: Implement secure JWT-based authentication system for all API endpoints.
2. **Design User Dashboard**: Create responsive UI mockups for the main user dashboard interface.

Remember strictly: 
- Generate exactly 8 tasks
- Each task should be independent
- Follow the exact format: number, bold title, then description
- No introductions or explanations needed
"""
        
        response: ChatResponse = chat(
            model='deepseek-r1:1.5b',
            messages=[{
                'role': 'user',
                'content': prompt
            }]
        )
        
        response_text = response['message']['content']
        
        # Extract tasks using regex (handles numbered lists)
        task_pattern = re.findall(r"\d+\.\s+\*\*(.*?)\*\*\:\s*(.*)", response_text)

        tasks = [
            Task(
                id=f"TASK-{i+1}",
                title=title.strip(),
                description=desc.strip(),
                order=i
            ) 
            for i, (title, desc) in enumerate(task_pattern)
        ]
        
        return tasks
    except Exception as e:
        print(f"Error generating tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating tasks: {str(e)}")
        
@app.post("/process-image")
async def process_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    text = await process_image(file)
    return {"text": text}

@app.post("/process-document")
async def process_document_endpoint(file: UploadFile = File(...)):
    if not any(file.filename.endswith(ext) for ext in ['.txt', '.pdf', '.docx']):
        raise HTTPException(status_code=400, detail="Unsupported file format")
    text = await read_document(file)
    return {"text": text}

@app.post("/generate-tasks")
async def generate_tasks_endpoint(user_input: UserInput):
    logger.debug(f"Received user input: {user_input.dict()}")
    tasks = await generate_tasks(user_input)
    # Log the generated tasks
    logger.debug(f"Generated tasks: {tasks}")
    # print(tasks)
    return {"tasks": tasks}

