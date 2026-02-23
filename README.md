# AI Document Chat: Full-Stack RAG System

A high-performance, Retrieval-Augmented Generation (RAG) platform. This project allows users to upload documents, index them into a vector database, and chat with them using Google Gemini.

## 🏗 System Architecture

The project follows a decoupled, event-driven architecture:

1.  **Frontend (React/TS)**: A streaming chat interface that handles real-time AI responses.
2.  **Backend (NestJS)**: An orchestration layer managing business logic and external APIs.
3.  **Processing (AWS Step Functions)**: Asynchronous document processing (S3 → Chunking → Gemini Embedding → Pinecone).
4.  **Vector DB (Pinecone)**: Semantic storage for document embeddings.
5.  **Database (DynamoDB)**: Persistent storage for chat history and document metadata.

## Steps to Run

Follow instructions given in **server** and **client** directories to run this full-stack application
