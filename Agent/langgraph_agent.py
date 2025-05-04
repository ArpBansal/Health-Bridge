from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Any
from agent import LLMChain, PromptTemplate, llm, DOCUMENT_DIR, load_documents, split_documents, CHROMA_PATH, load_vectordb, create_and_store_embeddings
import os

# state schema
class AgentState(TypedDict):
    query: str
    previous_conversation: str
    user_data: Dict[str, Any]
    requires_rag: bool
    context: List[str]
    response: str
    
def query_classifier(state: AgentState) -> AgentState:
    """Updated classifier to use LLM for intent classification."""
    
    query = state["query"]
    
    # Then classify intent
    classification_prompt = f"""
    Answer with only 'Yes' or 'No'.
    Classify if this query is asking about government schemes, policies, or benefits.
    The language may not be English, So first detect the language. and understand the query.:
    Query: {query}
    Remember Answer with only 'Yes' or 'No'."""
    
    result = llm.predict(classification_prompt)
    state["requires_rag"] = "yes" in result.lower()
    return state

def enhance_query(state:AgentState) -> AgentState:
    """Enhance the query with user data and context."""
    previous_conversation = state.get("previous_conversation", "")
    user_data = state.get("user_data", {})
    query = state.get("query", "")
    
    query_enhancement_prompt = f"""
    Enhance the following query with user data and previous conversation context so it uses the previous conversation and user data.
    To be used for generating a more relevant and personalized response.
    Previous Conversation: {previous_conversation}
    User Data: {user_data}
    Current Query: {query}
    Only write the enhanced query. No other text."""
    result = llm.predict(query_enhancement_prompt)
    print("Enhanced query: ", result)
    state["query"] = result

    return state

def retrieve_documents(state: AgentState) -> AgentState:
    """Retrieve documents from vector store if needed."""
    if state["requires_rag"]:
        # Get the global vector_store variable
        # This assumes vector_store is accessible in this scope
        docs = vector_store.as_retriever(search_kwargs={"k": 5}).get_relevant_documents(state["query"])
        state["context"] = [doc.page_content for doc in docs]
    else:
        state["context"] = []
    return state

def generate_response(state: AgentState) -> AgentState:
    """Generate response with or without context."""
    # style = state["user_data"].get("style", "normal") if isinstance(state["user_data"], dict) else "normal"
    
    base_prompt = """You are a helpful health assistant. Who will talk to the user as human and resolve their queries.

Use Previous_Conversation to maintain consistency in the conversation.
These are Previous_Conversation between you and user.
Previous_Conversation: {previous_conversation}

These are info about the person.
User_Data: {user_data}

Points to Adhere:
1. Only tell the schemes if user specifically asked, otherwise don't share schemes information.
2. If the user asks about schemes, Ask about what state they belong to first.
3. You can act as a mental-health counselor if needed. 
4. Give precautions and natural-remedies for the diseases, if user asked or it's needed, only for Common diseases include the common cold, flu etc.
5. Ask the preferred language of the user, In the starting of the conversation.
6. Give the answer in a friendly and conversational tone.
7. Style to answer in {style} way.
Question: {question}
"""
    
    if state["requires_rag"] and state["context"]:
        # Add context to prompt if we're using RAG
        context = "\n".join(state["context"])
        prompt_template = base_prompt + "\nContext from knowledge base:\n{context}\n\nAnswer:"
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question", "previous_conversation", "user_data", "style"]
        )
        
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        result = llm_chain({
            'context': context,
            'question': state["query"],
            'previous_conversation': state["previous_conversation"],
            'user_data': state["user_data"],
            'style': state["user_data"].get("style", "normal")
        })
    else:
        # Answer directly without context
        prompt_template = base_prompt + "\nAnswer:"
        prompt = PromptTemplate(
            template=prompt_template,
            input_variables=["question", "previous_conversation", "user_data", "style"]
        )
        
        llm_chain = LLMChain(llm=llm, prompt=prompt)
        result = llm_chain({
            'question': state["query"],
            'previous_conversation': state["previous_conversation"],
            'user_data': state["user_data"],
            'style': state["user_data"].get("style", "normal")
        })
    
    state["response"] = result["text"]
    return state

def create_agent_workflow():
    """Create the LangGraph workflow for the health agent."""
    # Initialize the state graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("enhance_query", enhance_query)
    workflow.add_node("classifier", query_classifier)
    workflow.add_node("retriever", retrieve_documents)
    workflow.add_node("responder", generate_response)
    
    # Create edges
    workflow.add_edge("enhance_query", "classifier")
    workflow.add_edge("classifier", "retriever")
    workflow.add_edge("retriever", "responder")
    workflow.add_edge("responder", END)
    
    # Set the entry point
    workflow.set_entry_point("enhance_query")
    
    # Compile the graph
    return workflow.compile()

def agent_with_db():
    # Load or create vector store
    global vector_store
    vector_store = None
    try:
        vector_store = load_vectordb(CHROMA_PATH)
    except ValueError:
        pass
    
    UPDATE_DB = os.getenv("UPDATE_DB", "false")
    if UPDATE_DB.lower() == "true" or vector_store is None:
        print("Loading and processing documents...")
        documents = load_documents(DOCUMENT_DIR)
        chunks = split_documents(documents)
        
        try:
            vector_store = create_and_store_embeddings(chunks)
        except Exception as e:
            print(f"Error creating embeddings: {e}")
            return None

    print("Creating the LangGraph health agent workflow...")
    agent_workflow = create_agent_workflow()
    
    class HealthAgent:
        def __init__(self, workflow):
            self.workflow = workflow
            self.conversation_history = ""
        
        def __call__(self, input_data):
            # Handle both dictionary input and direct arguments
            if isinstance(input_data, dict):
                query = input_data.get("query", "")
                previous_conversation = input_data.get("previous_conversation", "")
                user_data = input_data.get("user_data", {})
                style = input_data.get("style", "normal")
            else:
                # Assume it's a direct query string
                query = input_data
                previous_conversation = ""
                user_data = {}
                style = "normal"
            
            # Store previous conversation if provided
            if previous_conversation:
                self.conversation_history = previous_conversation
            
            # Update conversation history
            if self.conversation_history:
                self.conversation_history += f"\nUser: {query}\n"
            else:
                self.conversation_history = f"User: {query}\n"
            
            if "style" not in user_data:
                user_data["style"] = style
            # Prepare initial state
            initial_state = {
                "query": query,
                "previous_conversation": self.conversation_history,
                "user_data": user_data,
                "requires_rag": False,
                "context": [],
                "response": "",
            }
            
            final_state = self.workflow.invoke(initial_state)
            
            self.conversation_history += f"Assistant: {final_state['response']}\n"
            
            return {"result": final_state["response"]}
        
    return HealthAgent(agent_workflow)